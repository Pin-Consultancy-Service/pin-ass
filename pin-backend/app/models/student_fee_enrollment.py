"""A student's enrollment in an admin-managed fee plan."""

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class StudentFeeEnrollment(Base):
    __tablename__ = "student_fee_enrollments"
    __table_args__ = (
        UniqueConstraint("student_id", "fee_plan_id", name="uq_student_fee_enrollment"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    student_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"), index=True, nullable=False)
    fee_plan_id: Mapped[str] = mapped_column(ForeignKey("fee_plans.id", ondelete="RESTRICT"), index=True, nullable=False)
    enrolled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
