from app.db.database import SessionLocal
from app.models.models import User
db = SessionLocal()
user = db.query(User).order_by(User.id.desc()).first()
if user:
    print(f"User: {user.email}, Wallet: {user.wallet_address}")
else:
    print("No users found")
