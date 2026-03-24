from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.models import RewardLog, User
from app.services.blockchain import blockchain_service

router = APIRouter(prefix="/wallet", tags=["wallet"])


@router.get("/balance")
def wallet_balance(user: User = Depends(get_current_user)):
    if not user.wallet_address:
        raise HTTPException(status_code=400, detail="Wallet not synced")
    return {"wallet_address": user.wallet_address, "token_balance": blockchain_service.get_token_balance(user.wallet_address)}


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
