from fastapi import FastAPI
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api import admin, attendance, auth, cashout, events, rewards, wallet
from app.core.config import settings
from app.core.limiter import limiter
from app.db.database import Base, engine
from app.models import models  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(attendance.router)
app.include_router(wallet.router)
app.include_router(rewards.router)
app.include_router(cashout.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"service": settings.app_name, "status": "ok"}
