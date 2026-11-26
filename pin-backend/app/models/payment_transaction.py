"""Incoming student payment attempts and their verified outcomes."""

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"
    __table_args__ = (UniqueConstraint("student_id", "idempotency_key", name="uq_payment_student_idempotency"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    student_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), index=True, nullable=False)
    fee_plan_id: Mapped[str] = mapped_column(ForeignKey("fee_plans.id", ondelete="RESTRICT"), nullable=False)
    reference: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    idempotency_key: Mapped[str] = mapped_column(String(100), nullable=False)
    payment_option: Mapped[str] = mapped_column(String(20), default="FULL", nullable=False)
    installment_number: Mapped[int | None] = mapped_column(Integer)
    amount_minor: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="PENDING", index=True, nullable=False)
    provider: Mapped[str] = mapped_column(String(30), default="PAYSTACK", nullable=False)
    authorization_url: Mapped[str | None] = mapped_column(Text)
    provider_transaction_id: Mapped[str | None] = mapped_column(String(80))
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
