from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin
from app.core.config import settings
from app.db.database import get_db
from app.models.models import CashoutRequest, CashoutStatus, User
from app.schemas.schemas import CashoutCreate, CashoutOut
from app.services.blockchain import blockchain_service

router = APIRouter(prefix="/cashout", tags=["cashout"])


@router.post("/request", response_model=CashoutOut)
def request_cashout(payload: CashoutCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not user.wallet_address:
        raise HTTPException(status_code=400, detail="Wallet not synced")
    shm_amount = payload.tokens_requested * settings.cashout_rate_shm_per_token
    request = CashoutRequest(
        user_id=user.id,
        tokens_requested=payload.tokens_requested,
        shm_amount=shm_amount,
        status=CashoutStatus.pending,
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request


@router.get("/requests", response_model=list[CashoutOut])
def list_requests(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(CashoutRequest).order_by(CashoutRequest.created_at.desc()).all()


@router.post("/approve/{request_id}", response_model=CashoutOut)
def approve_cashout(request_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    request = db.query(CashoutRequest).filter(CashoutRequest.id == request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    if request.status != CashoutStatus.pending:
        raise HTTPException(status_code=400, detail="Request already processed")

    user = db.query(User).filter(User.id == request.user_id).first()
    burn_tx = blockchain_service.burn_tokens(user.wallet_address, request.tokens_requested)
    payout_tx = blockchain_service.payout_shm(user.wallet_address, request.shm_amount)

    request.status = CashoutStatus.approved
    request.burn_tx_hash = burn_tx
    request.payout_tx_hash = payout_tx
    db.add(request)
    db.commit()
    db.refresh(request)
    return request
