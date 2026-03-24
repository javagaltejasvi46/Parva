from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.models import RewardLog, User

router = APIRouter(prefix="/rewards", tags=["rewards"])


@router.get("/logs")
def reward_logs(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    logs = db.query(RewardLog).filter(RewardLog.user_id == user.id).order_by(RewardLog.created_at.desc()).all()
    return logs
