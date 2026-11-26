"""Paystack network integration and authoritative payment reconciliation."""

import hashlib
import hmac
import time
from datetime import datetime, timezone

import httpx
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models import PaymentTransaction

PAYSTACK_API = "https://api.paystack.co"


def _secret() -> str:
    value = get_settings().paystack_secret_key
    if value is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Payment provider is not configured")
    return value.get_secret_value()


async def initialize_with_paystack(*, email: str, amount_minor: int, currency: str, reference: str) -> str:
    settings = get_settings()
    payload = {
        "email": email,
        "amount": str(amount_minor),
        "currency": currency,
        "reference": reference,
        "callback_url": f"{settings.public_api_url.rstrip('/')}{settings.api_v1_prefix}/payments/callback",
        "channels": ["card", "bank", "ussd", "bank_transfer"],
    }
    try:
        async with httpx.AsyncClient(timeout=12.0, follow_redirects=False) as client:
            response = await client.post(
                f"{PAYSTACK_API}/transaction/initialize",
                headers={"Authorization": f"Bearer {_secret()}", "Content-Type": "application/json"},
                json=payload,
            )
            response.raise_for_status()
            body = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="Payment provider could not initialize this payment") from exc
    data = body.get("data") or {}
    if body.get("status") is not True or not data.get("authorization_url") or data.get("reference") != reference:
        raise HTTPException(status_code=502, detail="Payment provider returned an invalid initialization response")
    return data["authorization_url"]


async def verify_with_paystack(reference: str) -> dict:
    try:
        async with httpx.AsyncClient(timeout=12.0, follow_redirects=False) as client:
            response = await client.get(
                f"{PAYSTACK_API}/transaction/verify/{reference}",
                headers={"Authorization": f"Bearer {_secret()}"},
            )
            response.raise_for_status()
            body = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="Payment provider verification is temporarily unavailable") from exc
    if body.get("status") is not True or not isinstance(body.get("data"), dict):
        raise HTTPException(status_code=502, detail="Payment provider returned an invalid verification response")
    data = body["data"]
    if data.get("reference") != reference:
        raise HTTPException(status_code=409, detail="Payment reference did not match")
    return data


def confirm_verified_payment(db: Session, transaction: PaymentTransaction, provider_data: dict) -> bool:
    """Apply verified success once. Returns whether this call changed the record."""
    if provider_data.get("status") != "success":
        if transaction.status == "PENDING":
            transaction.status = "FAILED"
            db.commit()
        return False
    if (
        provider_data.get("reference") != transaction.reference
        or int(provider_data.get("amount", -1)) != transaction.amount_minor
        or provider_data.get("currency") != transaction.currency
    ):
        raise HTTPException(status_code=409, detail="Verified payment details do not match the recorded transaction")
    if transaction.status == "CONFIRMED":
        return False
    if transaction.status not in {"PENDING", "FAILED"}:
        raise HTTPException(status_code=409, detail="Payment is not eligible for confirmation")
    transaction.status = "CONFIRMED"
    transaction.provider_transaction_id = str(provider_data.get("id") or "") or None
    paid_at = provider_data.get("paid_at")
    transaction.paid_at = datetime.fromisoformat(paid_at.replace("Z", "+00:00")) if paid_at else datetime.now(timezone.utc)
    db.commit()
    return True


def verify_webhook_signature(raw_body: bytes, legacy_signature: str | None, modern_signature: str | None) -> bool:
    settings = get_settings()
    valid = False
    if legacy_signature and settings.paystack_secret_key:
        expected = hmac.new(
            settings.paystack_secret_key.get_secret_value().encode(), raw_body, hashlib.sha512
        ).hexdigest()
        if len(legacy_signature) == 128:
            valid = hmac.compare_digest(expected, legacy_signature.lower())
    webhook_secret = settings.paystack_webhook_secret
    if modern_signature and webhook_secret:
        parts = [item.strip() for item in modern_signature.split(",")]
        timestamp = next((part[2:] for part in parts if part.startswith("t=")), None)
        signatures = [part[3:].split(":", 1)[-1] for part in parts if part.startswith("v1=")]
        try:
            timestamp_int = int(timestamp or "")
        except ValueError:
            timestamp_int = 0
        if timestamp_int and abs(int(time.time()) - timestamp_int) <= 300:
            signed = str(timestamp_int).encode() + b"." + raw_body
            expected = hmac.new(webhook_secret.get_secret_value().encode(), signed, hashlib.sha512).hexdigest()
            valid = valid or any(hmac.compare_digest(expected, candidate.lower()) for candidate in signatures)
    return valid
