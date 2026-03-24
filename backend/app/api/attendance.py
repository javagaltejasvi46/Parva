import base64
import math

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.limiter import limiter
from app.db.database import get_db
from app.models.models import Attendance, Event, RewardLog, User
from app.schemas.schemas import AttendanceScan
from app.services.blockchain import blockchain_service

router = APIRouter(prefix="/attendance", tags=["attendance"])


def _distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


@router.post("/scan")
@limiter.limit("10/minute")
def scan(request: Request, payload: AttendanceScan, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    event = db.query(Event).filter(Event.id == payload.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if db.query(Attendance).filter(Attendance.user_id == user.id, Attendance.event_id == event.id).first():
        raise HTTPException(status_code=400, detail="Attendance already marked")

    decoded = base64.b64decode(payload.qr_payload.encode()).decode()
    if decoded != f"event:{event.id}":
        raise HTTPException(status_code=400, detail="Invalid QR payload")

    if event.geo_latitude is not None and event.geo_longitude is not None:
        if payload.latitude is None or payload.longitude is None:
            raise HTTPException(status_code=400, detail="Geo coordinates required")
        distance = _distance_meters(event.geo_latitude, event.geo_longitude, payload.latitude, payload.longitude)
        if distance > 300:
            raise HTTPException(status_code=400, detail="Outside event geo-fence")

    attendance = Attendance(user_id=user.id, event_id=event.id)
    db.add(attendance)

    tx_hash = None
    if event.reward_tokens > 0:
        if not user.wallet_address:
            raise HTTPException(status_code=400, detail="Wallet not synced")
        tx_hash = blockchain_service.mint_tokens(user.wallet_address, event.reward_tokens)
        db.add(RewardLog(user_id=user.id, event_id=event.id, tokens_awarded=event.reward_tokens, tx_hash=tx_hash))

    db.commit()
    return {"message": "Attendance marked", "reward_tx_hash": tx_hash}
