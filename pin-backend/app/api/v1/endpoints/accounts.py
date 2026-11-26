"""Student registration and cookie-based account sessions."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_csrf
from app.core.auth import DUMMY_PASSWORD_HASH, create_csrf_token, create_session, decode_session, hash_password, verify_password
from app.core.config import get_settings
from app.db.session import get_db
from app.models import User
from app.schemas.accounts import LoginRequest, PublicUser, StudentRegistration

router = APIRouter()


def _set_session_cookies(response: Response, user: User) -> None:
    settings = get_settings()
    token, csrf_token = create_session(user.id, user.role)
    common = {"max_age": settings.session_ttl_minutes * 60, "path": "/", "secure": settings.is_production, "samesite": "strict"}
    response.set_cookie(settings.session_cookie_name, token, httponly=True, **common)
    response.set_cookie(settings.csrf_cookie_name, csrf_token, httponly=False, **common)


@router.post("/register", response_model=PublicUser, status_code=status.HTTP_201_CREATED)
def register_student(payload: StudentRegistration, db: Annotated[Session, Depends(get_db)]) -> User:
    user = User(
        email=str(payload.email).lower(),
        password_hash=hash_password(payload.password),
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        phone_number=payload.phone_number,
        role="STUDENT",
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Unable to create an account with those details") from None
    db.refresh(user)
    return user


@router.post("/login", response_model=PublicUser)
def login(payload: LoginRequest, response: Response, db: Annotated[Session, Depends(get_db)]) -> User:
    email = str(payload.email).lower()
    user = db.scalar(select(User).where(User.email == email))
    password_ok = verify_password(payload.password, user.password_hash if user else DUMMY_PASSWORD_HASH)
    if user is None or not user.is_active or not password_ok:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    _set_session_cookies(response, user)
    return user


@router.get("/me", response_model=PublicUser)
def current_account(user: Annotated[User, Depends(get_current_user)]) -> User:
    return user


@router.get("/csrf")
def csrf_token(
    request: Request,
    response: Response,
    user: Annotated[User, Depends(get_current_user)],
) -> dict[str, str]:
    settings = get_settings()
    claims = decode_session(request.cookies.get(settings.session_cookie_name, ""))
    token = create_csrf_token(claims["jti"])
    response.set_cookie(
        settings.csrf_cookie_name,
        token,
        max_age=settings.session_ttl_minutes * 60,
        path="/",
        secure=settings.is_production,
        httponly=False,
        samesite="strict",
    )
    return {"csrf_token": token}


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    user: Annotated[User, Depends(require_csrf)],
) -> Response:
    settings = get_settings()
    response.delete_cookie(settings.session_cookie_name, path="/", secure=settings.is_production, httponly=True, samesite="strict")
    response.delete_cookie(settings.csrf_cookie_name, path="/", secure=settings.is_production, httponly=False, samesite="strict")
    response.status_code = status.HTTP_204_NO_CONTENT
    return response
