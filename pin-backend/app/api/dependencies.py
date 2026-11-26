"""Authentication and role dependencies shared by protected endpoints."""

from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.auth import csrf_matches, decode_session
from app.core.config import get_settings
from app.db.session import get_db
from app.models import PaymentTransaction, User


def get_current_user(request: Request, db: Annotated[Session, Depends(get_db)]) -> User:
    settings = get_settings()
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    try:
        claims = decode_session(token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required") from None
    user = db.get(User, claims["sub"])
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    return user


def require_csrf(request: Request, user: Annotated[User, Depends(get_current_user)]) -> User:
    settings = get_settings()
    token = request.cookies.get(settings.session_cookie_name)
    try:
        claims = decode_session(token or "")
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required") from None
    if not csrf_matches(
        request.cookies.get(settings.csrf_cookie_name),
        request.headers.get("X-CSRF-Token"),
        claims["jti"],
    ):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="CSRF validation failed")
    return user


def require_admin(user: Annotated[User, Depends(get_current_user)]) -> User:
    if user.role != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Administrator access required")
    return user


def require_student(user: Annotated[User, Depends(get_current_user)]) -> User:
    if user.role != "STUDENT":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student access required")
    return user


def require_student_csrf(user: Annotated[User, Depends(require_csrf)]) -> User:
    if user.role != "STUDENT":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student access required")
    return user


def require_admin_csrf(user: Annotated[User, Depends(require_csrf)]) -> User:
    if user.role != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Administrator access required")
    return user


def require_paid_student(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
) -> User:
    if user.role != "STUDENT":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Student access required")
    paid_minor = db.scalar(
        select(func.coalesce(func.sum(PaymentTransaction.amount_minor), 0)).where(
            PaymentTransaction.student_id == user.id,
            PaymentTransaction.status == "CONFIRMED",
        )
    ) or 0
    if paid_minor <= 0:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="A confirmed student payment is required")
    return user
