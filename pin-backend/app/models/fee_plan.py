"""Server-controlled charges a student may pay."""

from datetime import date, datetime, timezone
from uuid import uuid4

from sqlalchemy import Boolean, Date, DateTime, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class FeePlan(Base):
    __tablename__ = "fee_plans"
    __table_args__ = (Index("ix_fee_plans_exam_body", "exam_body"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    code: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    # Null is retained only for legacy plans that an administrator has not classified yet.
    exam_body: Mapped[str | None] = mapped_column(String(20))
    # A fee plan is the priced enrollment offer for one course in one cohort.
    cohort_name: Mapped[str | None] = mapped_column(String(120))
    cohort_starts_on: Mapped[date | None] = mapped_column(Date)
    cohort_ends_on: Mapped[date | None] = mapped_column(Date)
    description: Mapped[str | None] = mapped_column(Text)
    amount_minor: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="NGN", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
