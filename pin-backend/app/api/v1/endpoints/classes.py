"""Admin scheduling and paid-student class access."""

from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import exists, select
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin, require_admin_csrf, require_student
from app.db.session import get_db
from app.models import ClassSession, FeePlan, PaymentTransaction, User
from app.schemas.payments import ClassRecordingUpdate, ClassSessionCreate, ClassSessionRead, ClassSessionUpdate

student_router = APIRouter()
admin_router = APIRouter()


def _status(session: ClassSession, now: datetime) -> str:
    if session.status == "CANCELLED":
        return "CANCELLED"
    starts_at = session.scheduled_at
    if starts_at.tzinfo is None:
        starts_at = starts_at.replace(tzinfo=timezone.utc)
    ends_at = starts_at + timedelta(minutes=session.duration_minutes)
    if starts_at - timedelta(minutes=15) <= now <= ends_at:
        return "LIVE"
    if now > ends_at:
        return "COMPLETED"
    return "SCHEDULED"


def _read(
    session: ClassSession,
    course_name: str,
    cohort_name: str | None,
    exam_body: str | None,
    now: datetime,
    *,
    admin: bool,
) -> ClassSessionRead:
    current_status = _status(session, now)
    return ClassSessionRead(
        id=session.id,
        fee_plan_id=session.fee_plan_id,
        exam_body=exam_body,
        course_name=course_name,
        cohort=cohort_name or "Legacy cohort",
        subject=session.subject,
        topic=session.topic,
        instructor_name=session.instructor_name,
        scheduled_at=session.scheduled_at,
        duration_minutes=session.duration_minutes,
        meeting_url=session.meeting_url if admin or current_status == "LIVE" else None,
        recording_url=session.recording_url if admin or current_status == "COMPLETED" else None,
        materials=session.materials,
        description=session.description,
        status=current_status,
    )


@student_router.get("/me/classes", response_model=list[ClassSessionRead])
def list_my_classes(
    user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[ClassSessionRead]:
    rows = db.execute(
        select(ClassSession, FeePlan.name, FeePlan.cohort_name, FeePlan.exam_body)
        .join(FeePlan, FeePlan.id == ClassSession.fee_plan_id)
        .where(
            exists().where(
                PaymentTransaction.student_id == user.id,
                PaymentTransaction.fee_plan_id == ClassSession.fee_plan_id,
                PaymentTransaction.status == "CONFIRMED",
            ),
            FeePlan.exam_body.is_not(None),
        )
        .order_by(ClassSession.scheduled_at.desc())
    ).all()
    now = datetime.now(timezone.utc)
    return [_read(session, course_name, cohort_name, exam_body, now, admin=False) for session, course_name, cohort_name, exam_body in rows]


@admin_router.get("/classes", response_model=list[ClassSessionRead])
def list_classes(
    admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
) -> list[ClassSessionRead]:
    rows = db.execute(
        select(ClassSession, FeePlan.name, FeePlan.cohort_name, FeePlan.exam_body)
        .join(FeePlan, FeePlan.id == ClassSession.fee_plan_id)
        .order_by(ClassSession.scheduled_at.desc())
    ).all()
    now = datetime.now(timezone.utc)
    return [_read(session, course_name, cohort_name, exam_body, now, admin=True) for session, course_name, cohort_name, exam_body in rows]


@admin_router.post("/classes", response_model=ClassSessionRead, status_code=status.HTTP_201_CREATED)
def create_class(
    payload: ClassSessionCreate,
    admin: Annotated[User, Depends(require_admin_csrf)],
    db: Annotated[Session, Depends(get_db)],
) -> ClassSessionRead:
    plan = db.scalar(select(FeePlan).where(FeePlan.id == payload.fee_plan_id, FeePlan.is_active.is_(True)))
    if plan is None:
        raise HTTPException(status_code=404, detail="Active fee plan not found")
    if plan.exam_body is None:
        raise HTTPException(status_code=409, detail="Classify this fee plan by exam body before scheduling a class")
    if plan.exam_body != payload.exam_body:
        raise HTTPException(status_code=409, detail="The selected course does not match the chosen fee plan")
    session = ClassSession(
        fee_plan_id=plan.id,
        subject=payload.subject.strip(),
        topic=payload.topic.strip(),
        instructor_name=payload.instructor_name.strip(),
        scheduled_at=payload.scheduled_at.astimezone(timezone.utc),
        duration_minutes=payload.duration_minutes,
        meeting_url=str(payload.meeting_url) if payload.meeting_url else None,
        recording_url=str(payload.recording_url) if payload.recording_url else None,
        materials=[item.model_dump(mode="json") for item in payload.materials],
        description=payload.description.strip() if payload.description else None,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return _read(session, plan.name, plan.cohort_name, plan.exam_body, datetime.now(timezone.utc), admin=True)


@admin_router.patch("/classes/{class_id}/recording", response_model=ClassSessionRead)
def update_class_recording(
    class_id: str,
    payload: ClassRecordingUpdate,
    admin: Annotated[User, Depends(require_admin_csrf)],
    db: Annotated[Session, Depends(get_db)],
) -> ClassSessionRead:
    session = db.scalar(select(ClassSession).where(ClassSession.id == class_id))
    if session is None:
        raise HTTPException(status_code=404, detail="Class not found")
    if _status(session, datetime.now(timezone.utc)) != "COMPLETED":
        raise HTTPException(status_code=409, detail="Recording links can only be added after a class has ended")
    session.recording_url = str(payload.recording_url) if payload.recording_url else None
    db.commit()
    db.refresh(session)
    plan = db.scalar(select(FeePlan).where(FeePlan.id == session.fee_plan_id))
    if plan is None:
        raise HTTPException(status_code=404, detail="Course cohort not found")
    return _read(session, plan.name, plan.cohort_name, plan.exam_body, datetime.now(timezone.utc), admin=True)


@admin_router.patch("/classes/{class_id}", response_model=ClassSessionRead)
def update_class(
    class_id: str,
    payload: ClassSessionUpdate,
    admin: Annotated[User, Depends(require_admin_csrf)],
    db: Annotated[Session, Depends(get_db)],
) -> ClassSessionRead:
    session = db.scalar(select(ClassSession).where(ClassSession.id == class_id))
    if session is None:
        raise HTTPException(status_code=404, detail="Class not found")
    now = datetime.now(timezone.utc)
    starts_at = session.scheduled_at
    if starts_at.tzinfo is None:
        starts_at = starts_at.replace(tzinfo=timezone.utc)
    if now >= starts_at or session.status == "CANCELLED":
        raise HTTPException(status_code=409, detail="Only upcoming classes can be edited")

    plan = db.scalar(select(FeePlan).where(FeePlan.id == session.fee_plan_id))
    if plan is None:
        raise HTTPException(status_code=404, detail="Course cohort not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "scheduled_at" and value is not None:
            value = value.astimezone(timezone.utc)
        elif field in {"meeting_url", "recording_url"}:
            value = str(value) if value is not None else None
        elif field == "materials" and value is not None:
            value = [item.model_dump(mode="json") for item in value]
        elif field in {"subject", "topic", "instructor_name", "description"} and value is not None:
            value = value.strip()
        setattr(session, field, value)

    db.commit()
    db.refresh(session)
    return _read(session, plan.name, plan.cohort_name, plan.exam_body, datetime.now(timezone.utc), admin=True)
