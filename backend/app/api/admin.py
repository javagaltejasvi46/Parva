from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import require_admin
from app.db.database import get_db
from app.models.models import Attendance, Event, RewardLog, User

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/analytics")
def analytics(db: Session = Depends(get_db), _=Depends(require_admin)):
    total_users = db.query(func.count(User.id)).scalar()
    total_events = db.query(func.count(Event.id)).scalar()
    total_attendance = db.query(func.count(Attendance.id)).scalar()
    tokens_distributed = db.query(func.coalesce(func.sum(RewardLog.tokens_awarded), 0)).scalar()
    return {
        "total_users": total_users,
        "total_events": total_events,
        "total_attendance": total_attendance,
        "tokens_distributed": tokens_distributed,
    }
