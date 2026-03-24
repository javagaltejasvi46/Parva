from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Student Token Launchpad API"
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 120

    shardeum_rpc_url: str
    token_contract_address: str
    platform_private_key: str
    platform_wallet_address: str
    cashout_rate_shm_per_token: float = 0.001


settings = Settings()
