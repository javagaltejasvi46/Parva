import hashlib
from datetime import datetime


class BlockchainService:
    """
    Placeholder blockchain adapter.
    Replace mock tx hashes with web3 contract calls for Shardeum.
    """

    def mint_tokens(self, user_wallet: str, amount: int) -> str:
        return self._fake_tx(f"mint:{user_wallet}:{amount}")

    def burn_tokens(self, user_wallet: str, amount: int) -> str:
        return self._fake_tx(f"burn:{user_wallet}:{amount}")

    def payout_shm(self, user_wallet: str, shm_amount: float) -> str:
        return self._fake_tx(f"payout:{user_wallet}:{shm_amount}")

    def get_token_balance(self, user_wallet: str) -> int:
        # Replace with ERC20 balanceOf call
        return 0

    def _fake_tx(self, seed: str) -> str:
        payload = f"{seed}:{datetime.utcnow().isoformat()}".encode()
        return "0x" + hashlib.sha256(payload).hexdigest()


blockchain_service = BlockchainService()
