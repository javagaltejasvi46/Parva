# Student Token Launchpad

Blockchain-powered engagement and rewards platform for campus ecosystems.

## Tech Stack

- Frontend: React + Tailwind CSS + ethers.js
- Backend: FastAPI
- Database: PostgreSQL (SQLAlchemy ORM)
- Blockchain: EVM-compatible Shardeum testnet hooks
- Auth: JWT

## Implemented Modules

- `auth`: register/login, Google stub login, wallet sync
- `events`: create/edit/delete/list events, RSVP, event QR payload generation
- `attendance`: QR scan check-in, geo-fence validation, duplicate prevention, rate-limited scan API
- `rewards`: reward logs
- `wallet`: token balance endpoint + reward history
- `cashout`: user request, admin approval, burn + SHM payout orchestration hooks
- `admin`: analytics (users, events, attendance, tokens distributed)

## Architecture

- On-chain: token mint/burn/payout actions (hooked via `backend/app/services/blockchain.py`)
- Off-chain: users, events, attendance, reward rules, logs, cashout workflow
- Backend orchestrates all business logic and blockchain interactions

## Project Structure

- `backend/`: FastAPI app
- `frontend/`: React app

## Backend Setup

1. Create PostgreSQL database:
   - `student_launchpad`
2. Configure env:
   - copy `backend/.env.example` to `backend/.env` and fill values
3. Install deps:
   - `cd backend`
   - `python -m venv .venv`
   - `.venv\\Scripts\\activate` (Windows)
   - `pip install -r requirements.txt`
4. Run API:
   - `uvicorn app.main:app --reload`

## Frontend Setup

1. Configure env:
   - copy `frontend/.env.example` to `frontend/.env`
2. Install deps and run:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Shardeum Integration Notes

- Backend blockchain adapter is in `backend/app/services/blockchain.py`.
- Replace mock tx hash functions with actual contract calls using your signer and ERC20 ABI:
  - `mint_tokens(wallet, amount)`
  - `burn_tokens(wallet, amount)`
  - `payout_shm(wallet, amount)`
  - `get_token_balance(wallet)`
- Frontend MetaMask + contract read helper is in `frontend/src/api/blockchain.js`.

## Suggested Next Steps

- Add Alembic migrations
- Replace Google login stub with token verification flow
- Replace mock blockchain service with real ethers/web3 contract interactions
- Add leaderboard, token-gated events, and governance voting
- Add tests (API + UI)
