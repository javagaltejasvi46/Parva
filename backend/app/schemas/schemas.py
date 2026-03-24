from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.models import CashoutStatus, UserRole


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str
    college_id: str
    role: UserRole = UserRole.student


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    name: str
    college_id: str
    wallet_address: Optional[str] = None
    role: UserRole


class WalletSync(BaseModel):
    wallet_address: str


class EventBase(BaseModel):
    title: str
    description: str
    event_date: datetime
    participant_reward: int = Field(ge=0)
    volunteer_reward: int = Field(ge=0)
    max_participants: int = Field(ge=0, default=0)
    max_volunteers: int = Field(ge=0, default=0)
    geo_latitude: Optional[float] = None
    geo_longitude: Optional[float] = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    participant_reward: Optional[int] = Field(default=None, ge=0)
    volunteer_reward: Optional[int] = Field(default=None, ge=0)
    max_participants: Optional[int] = Field(default=None, ge=0)
    max_volunteers: Optional[int] = Field(default=None, ge=0)
    geo_latitude: Optional[float] = None
    geo_longitude: Optional[float] = None


class EventOut(EventBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_by: int


class AttendanceScan(BaseModel):
    event_id: int
    qr_payload: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class CashoutCreate(BaseModel):
    tokens_requested: int = Field(gt=0)


class CashoutOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    user_id: int
    tokens_requested: int
    shm_amount: float
    status: CashoutStatus
    burn_tx_hash: Optional[str] = None
    payout_tx_hash: Optional[str] = None
