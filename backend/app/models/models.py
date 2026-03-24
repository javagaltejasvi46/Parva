import enum
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class UserRole(str, enum.Enum):
    student = "student"
    club = "club"
    admin = "admin"


class CashoutStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    college_id: Mapped[str] = mapped_column(String(60), unique=True, nullable=False)
    wallet_address: Mapped[str | None] = mapped_column(String(100), nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.student, nullable=False)
    google_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    events = relationship("Event", back_populates="creator")


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    event_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    reward_tokens: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    geo_latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    geo_longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    creator = relationship("User", back_populates="events")


class RSVP(Base):
    __tablename__ = "rsvps"
    __table_args__ = (UniqueConstraint("user_id", "event_id", name="uq_rsvp_user_event"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class Attendance(Base):
    __tablename__ = "attendance"
    __table_args__ = (UniqueConstraint("user_id", "event_id", name="uq_attendance_user_event"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)
    checked_in_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    checkin_hash: Mapped[str | None] = mapped_column(String(120), nullable=True)


class RewardLog(Base):
    __tablename__ = "reward_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    event_id: Mapped[int] = mapped_column(ForeignKey("events.id"), nullable=False)
    tokens_awarded: Mapped[int] = mapped_column(Integer, nullable=False)
    tx_hash: Mapped[str | None] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class CashoutRequest(Base):
    __tablename__ = "cashout_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    tokens_requested: Mapped[int] = mapped_column(Integer, nullable=False)
    shm_amount: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[CashoutStatus] = mapped_column(Enum(CashoutStatus), default=CashoutStatus.pending, nullable=False)
    burn_tx_hash: Mapped[str | None] = mapped_column(String(120), nullable=True)
    payout_tx_hash: Mapped[str | None] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
