"""Scheduled teaching sessions tied to a paid student fee plan."""

from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Index, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ClassSession(Base):
    __tablename__ = "class_sessions"
    __table_args__ = (Index("ix_class_sessions_fee_plan_scheduled", "fee_plan_id", "scheduled_at"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    fee_plan_id: Mapped[str] = mapped_column(ForeignKey("fee_plans.id", ondelete="RESTRICT"), nullable=False)
    subject: Mapped[str] = mapped_column(String(180), nullable=False)
    topic: Mapped[str] = mapped_column(String(240), nullable=False)
    instructor_name: Mapped[str] = mapped_column(String(180), nullable=False)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    meeting_url: Mapped[str | None] = mapped_column(String(2048))
    recording_url: Mapped[str | None] = mapped_column(String(2048))
    materials: Mapped[list[dict[str, str]]] = mapped_column(JSON, default=list, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(20), default="SCHEDULED", index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
