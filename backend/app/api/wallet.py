from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.models import RewardLog, CashoutRequest, CashoutStatus, User

router = APIRouter(prefix="/wallet", tags=["wallet"])

def calculate_offchain_balance(user_id: int, db: Session) -> int:
    earned_result = db.query(func.sum(RewardLog.tokens_awarded)).filter(RewardLog.user_id == user_id).scalar()
    earned = earned_result or 0

    used_result = db.query(func.sum(CashoutRequest.tokens_requested)).filter(
        CashoutRequest.user_id == user_id,
        CashoutRequest.status != CashoutStatus.rejected
    ).scalar()
    used = used_result or 0

    return earned - used

@router.get("/balance")
def wallet_balance(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    balance = calculate_offchain_balance(user.id, db)
    return {
        "wallet_address": user.wallet_address or "Not mapped", 
        "token_balance": balance
    }

@router.get("/history")
def wallet_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rewards = db.query(RewardLog).filter(RewardLog.user_id == user.id).order_by(RewardLog.created_at.desc()).all()
    return [
        {
            "event_id": r.event_id,
            "tokens_awarded": r.tokens_awarded,
            "tx_hash": r.tx_hash,
            "created_at": r.created_at,
        }
        for r in rewards
    ]
