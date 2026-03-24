from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.database import get_db
from app.models.models import User
from app.schemas.schemas import TokenResponse, UserCreate, UserLogin, UserOut, WalletSync

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.college_id == payload.college_id).first():
        raise HTTPException(status_code=400, detail="College ID already registered")
    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        name=payload.name,
        college_id=payload.college_id,
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)


@router.post("/google", response_model=TokenResponse)
def google_login(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email")
    name = payload.get("name", "Google User")
    google_id = payload.get("google_id")
    if not email or not google_id:
        raise HTTPException(status_code=400, detail="email and google_id are required")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            password_hash=hash_password("google-oauth"),
            name=name,
            college_id=f"google-{google_id}",
            google_id=google_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return TokenResponse(access_token=create_access_token(str(user.id)))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.post("/wallet-sync", response_model=UserOut)
def wallet_sync(payload: WalletSync, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user.wallet_address = payload.wallet_address
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
