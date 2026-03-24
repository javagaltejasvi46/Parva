import base64

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin_or_club
from app.db.database import get_db
from app.models.models import Event, RSVP, User, UserRole
from app.schemas.schemas import EventCreate, EventOut, EventUpdate

router = APIRouter(prefix="/events", tags=["events"])


@router.get("/", response_model=list[EventOut])
def list_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.event_date.desc()).all()


@router.post("/", response_model=EventOut)
def create_event(payload: EventCreate, db: Session = Depends(get_db), user: User = Depends(require_admin_or_club)):
    event = Event(**payload.model_dump(), created_by=user.id)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.patch("/{event_id}", response_model=EventOut)
def update_event(event_id: int, payload: EventUpdate, db: Session = Depends(get_db), user: User = Depends(require_admin_or_club)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if user.role != UserRole.admin and event.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    for key, val in payload.model_dump(exclude_unset=True).items():
        setattr(event, key, val)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db), user: User = Depends(require_admin_or_club)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if user.role != UserRole.admin and event.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(event)
    db.commit()
    return {"message": "Event deleted"}


@router.post("/{event_id}/rsvp")
def rsvp(event_id: int, role: str = "participant", db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if role not in ("participant", "volunteer"):
        raise HTTPException(status_code=400, detail="Role must be 'participant' or 'volunteer'")
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    current_count = db.query(RSVP).filter(RSVP.event_id == event_id, RSVP.role == role).count()
    if role == "participant" and event.max_participants > 0 and current_count >= event.max_participants:
        raise HTTPException(status_code=400, detail="Participant capacity reached")
    if role == "volunteer" and event.max_volunteers > 0 and current_count >= event.max_volunteers:
        raise HTTPException(status_code=400, detail="Volunteer capacity reached")

    if db.query(RSVP).filter(RSVP.user_id == user.id, RSVP.event_id == event_id).first():
        raise HTTPException(status_code=400, detail="Already registered")
    record = RSVP(user_id=user.id, event_id=event_id, role=role)
    db.add(record)
    db.commit()
    return {"message": f"RSVP successful as {role}"}


@router.get("/{event_id}/qr")
def event_qr(event_id: int, db: Session = Depends(get_db), user: User = Depends(require_admin_or_club)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    payload = f"event:{event.id}"
    encoded = base64.b64encode(payload.encode()).decode()
    return {"event_id": event.id, "qr_payload": encoded}
