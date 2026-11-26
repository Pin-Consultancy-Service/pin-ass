"""Password hashing, signed sessions, and CSRF token helpers."""

import secrets
from datetime import datetime, timedelta, timezone

import jwt
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from pwdlib import PasswordHash

from app.core.config import get_settings

password_hash = PasswordHash.recommended()
DUMMY_PASSWORD_HASH = password_hash.hash("not-a-real-user-password-value")


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_session(user_id: str, role: str) -> tuple[str, str]:
    settings = get_settings()
    now = datetime.now(timezone.utc)
    session_id = secrets.token_urlsafe(24)
    token = jwt.encode(
        {
            "sub": user_id,
            "role": role,
            "jti": session_id,
            "iat": now,
            "exp": now + timedelta(minutes=settings.session_ttl_minutes),
        },
        settings.secret_key.get_secret_value(),
        algorithm="HS256",
    )
    return token, create_csrf_token(session_id)


def create_csrf_token(session_id: str) -> str:
    settings = get_settings()
    return URLSafeTimedSerializer(settings.secret_key.get_secret_value(), salt="pin-csrf-v1").dumps(
        {"jti": session_id, "nonce": secrets.token_urlsafe(32)}
    )


def decode_session(token: str) -> dict:
    settings = get_settings()
    return jwt.decode(
        token,
        settings.secret_key.get_secret_value(),
        algorithms=["HS256"],
        options={"require": ["sub", "jti", "iat", "exp"]},
    )


def csrf_matches(cookie_token: str | None, header_token: str | None, session_id: str) -> bool:
    if not cookie_token or not header_token or not secrets.compare_digest(cookie_token, header_token):
        return False
    settings = get_settings()
    serializer = URLSafeTimedSerializer(settings.secret_key.get_secret_value(), salt="pin-csrf-v1")
    try:
        payload = serializer.loads(cookie_token, max_age=settings.session_ttl_minutes * 60)
    except (BadSignature, SignatureExpired):
        return False
    return secrets.compare_digest(payload.get("jti", ""), session_id)
