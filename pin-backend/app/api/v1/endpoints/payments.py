"""Student payment initialization and trusted payment reconciliation."""

import json
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies import require_student_csrf
from app.core.config import get_settings
from app.db.session import get_db
from app.models import FeePlan, PaymentTransaction, StudentFeeEnrollment, User
from app.schemas.payments import PaymentInitialize, PaymentInitialized, PaymentRead
from app.services.payments import (
    confirm_verified_payment,
    initialize_with_paystack,
    verify_webhook_signature,
    verify_with_paystack,
)

router = APIRouter()


@router.post("/initialize", response_model=PaymentInitialized, status_code=status.HTTP_201_CREATED)
async def initialize_payment(
    payload: PaymentInitialize,
    user: Annotated[User, Depends(require_student_csrf)],
    db: Annotated[Session, Depends(get_db)],
) -> PaymentInitialized:
    existing = db.scalar(
        select(PaymentTransaction).where(
            PaymentTransaction.student_id == user.id,
            PaymentTransaction.idempotency_key == payload.idempotency_key,
        )
    )
    if existing:
        if existing.fee_plan_id != payload.fee_plan_id or existing.payment_option != payload.payment_option:
            raise HTTPException(status_code=409, detail="Idempotency key was already used for a different payment")
        if existing.authorization_url:
            return PaymentInitialized(
                reference=existing.reference,
                authorization_url=existing.authorization_url,
                amount_minor=existing.amount_minor,
                currency=existing.currency,
                status=existing.status,
            )
        raise HTTPException(status_code=409, detail="This payment request is already being processed")

    plan = db.scalar(select(FeePlan).where(FeePlan.id == payload.fee_plan_id, FeePlan.is_active.is_(True)).with_for_update())
    if plan is None:
        raise HTTPException(status_code=404, detail="Fee plan not found")
    enrollment = db.scalar(select(StudentFeeEnrollment).where(
        StudentFeeEnrollment.student_id == user.id,
        StudentFeeEnrollment.fee_plan_id == plan.id,
    ))
    if enrollment is None:
        # Selecting a fee plan to start checkout enrolls the student in it.
        db.add(StudentFeeEnrollment(student_id=user.id, fee_plan_id=plan.id))
    confirmed = list(db.scalars(select(PaymentTransaction).where(
        PaymentTransaction.student_id == user.id,
        PaymentTransaction.fee_plan_id == plan.id,
        PaymentTransaction.status == "CONFIRMED",
    ).order_by(PaymentTransaction.created_at.asc())))
    pending = db.scalar(select(PaymentTransaction).where(
        PaymentTransaction.student_id == user.id,
        PaymentTransaction.fee_plan_id == plan.id,
        PaymentTransaction.status == "PENDING",
    ).order_by(PaymentTransaction.created_at.desc()))
    if pending:
        if pending.payment_option != payload.payment_option or not pending.authorization_url:
            raise HTTPException(status_code=409, detail="A payment attempt is already in progress for this fee")
        return PaymentInitialized(
            reference=pending.reference,
            authorization_url=pending.authorization_url,
            amount_minor=pending.amount_minor,
            currency=pending.currency,
            status=pending.status,
        )

    paid = sum(transaction.amount_minor for transaction in confirmed)
    balance = max(0, plan.amount_minor - paid)
    if balance == 0:
        raise HTTPException(status_code=409, detail="This fee plan is already fully paid")
    if len(confirmed) >= 2:
        raise HTTPException(status_code=409, detail="Only two payments are allowed for this fee plan")
    installment_number = None
    if not confirmed:
        if payload.payment_option == "FULL":
            amount_minor = plan.amount_minor
        else:
            amount_minor = (plan.amount_minor + 1) // 2
            installment_number = 1
    else:
        if payload.payment_option != "INSTALLMENT":
            raise HTTPException(status_code=409, detail="Only the second installment remains due")
        amount_minor = balance
        installment_number = 2
    reference = f"PIN-{uuid4().hex}"
    transaction = PaymentTransaction(
        student_id=user.id,
        fee_plan_id=plan.id,
        reference=reference,
        idempotency_key=payload.idempotency_key,
        payment_option=payload.payment_option,
        installment_number=installment_number,
        amount_minor=amount_minor,
        currency=plan.currency,
    )
    db.add(transaction)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="This payment request has already been submitted") from None
    db.refresh(transaction)
    try:
        authorization_url = await initialize_with_paystack(
            email=user.email,
            amount_minor=transaction.amount_minor,
            currency=transaction.currency,
            reference=transaction.reference,
        )
    except HTTPException:
        transaction.status = "FAILED"
        db.commit()
        raise
    transaction.authorization_url = authorization_url
    db.commit()
    return PaymentInitialized(
        reference=transaction.reference,
        authorization_url=authorization_url,
        amount_minor=transaction.amount_minor,
        currency=transaction.currency,
        status=transaction.status,
    )


@router.post("/verify/{reference}", response_model=PaymentRead)
async def verify_student_payment(
    reference: str,
    user: Annotated[User, Depends(require_student_csrf)],
    db: Annotated[Session, Depends(get_db)],
) -> PaymentTransaction:
    transaction = db.scalar(
        select(PaymentTransaction).where(
            PaymentTransaction.reference == reference,
            PaymentTransaction.student_id == user.id,
        )
    )
    if transaction is None:
        raise HTTPException(status_code=404, detail="Payment not found")
    if transaction.status == "PENDING":
        provider_data = await verify_with_paystack(transaction.reference)
        confirm_verified_payment(db, transaction, provider_data)
        db.refresh(transaction)
    return transaction


@router.get("/callback")
async def payment_callback(
    reference: str | None,
    db: Annotated[Session, Depends(get_db)],
) -> RedirectResponse:
    settings = get_settings()
    target = f"{settings.frontend_origins[0].rstrip('/')}/portal/student/fees"
    if not reference or len(reference) > 100:
        return RedirectResponse(f"{target}?payment=invalid", status_code=303)
    transaction = db.scalar(select(PaymentTransaction).where(PaymentTransaction.reference == reference))
    if transaction is None:
        return RedirectResponse(f"{target}?payment=unrecognized", status_code=303)
    try:
        provider_data = await verify_with_paystack(reference)
        confirm_verified_payment(db, transaction, provider_data)
    except HTTPException:
        return RedirectResponse(f"{target}?payment=pending", status_code=303)
    result = "success" if transaction.status == "CONFIRMED" else "failed"
    return RedirectResponse(f"{target}?payment={result}", status_code=303)


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def paystack_webhook(
    request: Request,
    db: Annotated[Session, Depends(get_db)],
    legacy_signature: Annotated[str | None, Header(alias="x-paystack-signature")] = None,
    modern_signature: Annotated[str | None, Header(alias="paystack-signature")] = None,
) -> dict[str, str]:
    raw_body = await request.body()
    if len(raw_body) > 1_000_000 or not verify_webhook_signature(raw_body, legacy_signature, modern_signature):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")
    try:
        event = json.loads(raw_body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise HTTPException(status_code=400, detail="Invalid webhook body") from None
    event_name = event.get("event")
    if event_name != "charge.success":
        return {"status": "ignored"}
    data = event.get("data") or {}
    reference = data.get("reference")
    transaction = db.scalar(select(PaymentTransaction).where(PaymentTransaction.reference == reference))
    if transaction is None:
        # Acknowledge valid but unknown events; they cannot create payments by themselves.
        return {"status": "ignored"}
    confirm_verified_payment(db, transaction, data)
    return {"status": "accepted"}
