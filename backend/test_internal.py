from app.db.database import SessionLocal
from app.api.cashout import request_cashout
from app.schemas.schemas import CashoutCreate
from app.models.models import User
from app.api.wallet import calculate_offchain_balance
import traceback

db = SessionLocal()
user = db.query(User).order_by(User.id.desc()).first()

print("Wallet module balance func returns:", calculate_offchain_balance(user.id, db))

payload = CashoutCreate(tokens_requested=20)
try:
    res = request_cashout(payload=payload, db=db, user=user)
    print("SUCCESS:", res)
except Exception as e:
    print("EXCEPTION:", e.status_code if hasattr(e, "status_code") else type(e), e.detail if hasattr(e, "detail") else str(e))
