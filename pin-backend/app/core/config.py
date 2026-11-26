"""Application settings loaded from environment variables."""

from functools import lru_cache
from typing import Literal

from pydantic import Field, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "PIN Associate API"
    app_version: str = "0.1.0"
    environment: Literal["development", "test", "production"] = "development"
    api_v1_prefix: str = "/api/v1"
    secret_key: SecretStr = Field(..., min_length=32)
    frontend_origins: list[str] = ["http://localhost:3000"]
    allowed_hosts: list[str] = ["localhost", "127.0.0.1"]
    database_url: SecretStr = SecretStr("sqlite:///./pin_associate.db")
    public_api_url: str = "http://localhost:8000"
    paystack_secret_key: SecretStr | None = None
    paystack_webhook_secret: SecretStr | None = None
    google_oauth_client_id: str | None = None
    session_cookie_name: str = "pin_session"
    csrf_cookie_name: str = "pin_csrf"
    session_ttl_minutes: int = Field(default=30, ge=5, le=480)

    @field_validator("paystack_secret_key", "paystack_webhook_secret", mode="before")
    @classmethod
    def blank_secrets_are_unset(cls, value):
        return value or None

    @field_validator("secret_key", mode="before")
    @classmethod
    def reject_example_secret(cls, value):
        if isinstance(value, str) and value.startswith("replace-with-"):
            raise ValueError("Replace the example SECRET_KEY with a generated secret")
        return value

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @model_validator(mode="after")
    def enforce_production_origins(self) -> "Settings":
        if self.paystack_secret_key is not None:
            paystack_key = self.paystack_secret_key.get_secret_value()
            if self.is_production and paystack_key.startswith(("sk_test_", "rk_test_")):
                raise ValueError("Production must use a live Paystack key")
            if not self.is_production and paystack_key.startswith(("sk_live_", "rk_live_")):
                raise ValueError("Development and test environments must not use a live Paystack key")
        if self.is_production:
            if not self.public_api_url.startswith("https://"):
                raise ValueError("PUBLIC_API_URL must use HTTPS in production")
            if not self.frontend_origins or any(not origin.startswith("https://") for origin in self.frontend_origins):
                raise ValueError("Production FRONTEND_ORIGINS must contain explicit HTTPS origins")
            if any(host in {"*", "localhost", "127.0.0.1"} for host in self.allowed_hosts):
                raise ValueError("Production ALLOWED_HOSTS must contain explicit public hostnames")
            if not self.database_url.get_secret_value().startswith(("postgresql://", "postgresql+")):
                raise ValueError("Production DATABASE_URL must use PostgreSQL")
            if self.paystack_secret_key is None:
                raise ValueError("PAYSTACK_SECRET_KEY is required in production")
            if self.paystack_webhook_secret is None:
                raise ValueError("PAYSTACK_WEBHOOK_SECRET is required in production")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
