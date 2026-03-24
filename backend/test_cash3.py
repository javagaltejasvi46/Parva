from app.db.database import SessionLocal
from app.models.models import User
from jose import jwt
from app.core.config import settings
import urllib.request, json, ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

db = SessionLocal()
user = db.query(User).order_by(User.id.desc()).first()

token = jwt.encode({"sub": str(user.id)}, settings.jwt_secret, algorithm=settings.jwt_algorithm)

try:
    req = urllib.request.Request(
        "http://127.0.0.1:8000/cashout/request", 
        data=b'{"tokens_requested": 20}', 
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req, context=ctx)
    print("Cashout 20 ->", res.getcode(), res.read().decode())
except Exception as e:
    print("Cashout 20 ERROR ->", e.read().decode() if hasattr(e, "read") else e)
