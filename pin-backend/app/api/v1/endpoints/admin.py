"""Admin-only student, fee-plan, and payment reporting endpoints."""

from datetime import datetime, timedelta, timezone
from io import BytesIO
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from openpyxl import Workbook
from openpyxl.cell import WriteOnlyCell
from openpyxl.styles import Font, PatternFill
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin, require_admin_csrf
from app.db.session import get_db
from app.models import Expense, FeePlan, PaymentTransaction, User
from app.schemas.payments import (
    AdminStudentRead,
    ExpenseCreate,
    ExpenseRead,
    FeePlanCreate,
    FeePlanExamBodyUpdate,
    FeePlanRead,
    FinanceSummary,
    PaymentRead,
    PaymentSummary,
)

router = APIRouter()


@router.get("/students", response_model=list[AdminStudentRead])
def list_students(
    admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
) -> list[User]:
    return list(
        db.scalars(
            select(User).where(User.role == "STUDENT").order_by(User.created_at.desc()).offset(offset).limit(limit)
        )
    )


@router.get("/payments", response_model=list[PaymentRead])
def list_payments(
    admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
    payment_status: str | None = Query(default=None, alias="status", pattern="^(PENDING|CONFIRMED|FAILED)$"),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
) -> list[PaymentTransaction]:
    query = select(PaymentTransaction).order_by(PaymentTransaction.created_at.desc())
    if payment_status:
        query = query.where(PaymentTransaction.status == payment_status)
    return list(db.scalars(query.offset(offset).limit(limit)))


@router.get("/payments/export.xlsx")
def export_payments_excel(
    admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    """Export the complete payment ledger for authorized finance staff."""
    query = (
        select(PaymentTransaction, User, FeePlan)
        .join(User, User.id == PaymentTransaction.student_id)
        .join(FeePlan, FeePlan.id == PaymentTransaction.fee_plan_id)
        .order_by(PaymentTransaction.created_at.desc())
    )
    payment_count = db.scalar(select(func.count()).select_from(PaymentTransaction)) or 0
    if payment_count > 1_048_575:
        raise HTTPException(status_code=413, detail="Payment ledger exceeds the Excel worksheet row limit")

    def safe_text(value: str | None) -> str:
        text = value or ""
        # Prevent untrusted database text from becoming an Excel formula.
        if text.lstrip("\t\r\n ").startswith(("=", "+", "-", "@")):
            return "'" + text
        return text

    workbook = Workbook(write_only=True)
    sheet = workbook.create_sheet("Payment Ledger")
    headers = [
        "Reference", "Student", "Student Email", "Exam Body", "Course / Fee", "Cohort",
        "Amount (NGN)", "Payment Type", "Installment", "Status", "Provider",
        "Created At (UTC)", "Confirmed At (UTC)",
    ]
    header_cells = [WriteOnlyCell(sheet, value=header) for header in headers]
    for cell in header_cells:
        cell.font = Font(bold=True, color="FFFFFF")
        cell.fill = PatternFill("solid", fgColor="203D8F")
    sheet.append(header_cells)
    for transaction, student, plan in db.execute(query.execution_options(yield_per=1000)):
        payment_type = "Installment" if transaction.installment_number else "Full payment"
        amount = WriteOnlyCell(sheet, value=transaction.amount_minor / 100)
        amount.number_format = '"₦"#,##0.00'
        created = transaction.created_at.isoformat() if transaction.created_at else ""
        paid_at = transaction.paid_at.isoformat() if transaction.paid_at else ""
        sheet.append([
            safe_text(transaction.reference),
            safe_text(f"{student.first_name} {student.last_name}"),
            safe_text(student.email),
            safe_text(plan.exam_body),
            safe_text(plan.name),
            safe_text(plan.cohort_name),
            amount,
            payment_type,
            transaction.installment_number or "—",
            transaction.status,
            transaction.provider,
            created,
            paid_at,
        ])
    sheet.freeze_panes = "A2"
    sheet.auto_filter.ref = f"A1:M{payment_count + 1}"
    for column, width in {"A": 34, "B": 28, "C": 36, "D": 14, "E": 34, "F": 26, "G": 18, "H": 18, "I": 14, "J": 16, "K": 14, "L": 24, "M": 24}.items():
        sheet.column_dimensions[column].width = width
    output = BytesIO()
    workbook.save(output)
    return Response(
        content=output.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": 'attachment; filename="pin-associate-payment-ledger.xlsx"',
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
        },
    )


@router.get("/payments/summary", response_model=PaymentSummary)
def payment_summary(
    admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
) -> PaymentSummary:
    totals = db.execute(
        select(
            func.coalesce(func.sum(PaymentTransaction.amount_minor).filter(PaymentTransaction.status == "CONFIRMED"), 0),
            func.count().filter(PaymentTransaction.status == "PENDING"),
            func.count().filter(PaymentTransaction.status == "CONFIRMED"),
            func.count().filter(PaymentTransaction.status == "FAILED"),
        )
    ).one()
    return PaymentSummary(
        total_confirmed_minor=int(totals[0]),
        pending_count=int(totals[1]),
        confirmed_count=int(totals[2]),
        failed_count=int(totals[3]),
    )


@router.get("/expenses", response_model=list[ExpenseRead])
def list_expenses(
    admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
) -> list[Expense]:
    return list(db.scalars(select(Expense).order_by(Expense.expense_date.desc()).offset(offset).limit(limit)))


@router.post("/expenses", response_model=ExpenseRead, status_code=status.HTTP_201_CREATED)
def record_expense(
    payload: ExpenseCreate,
    admin: Annotated[User, Depends(require_admin_csrf)],
    db: Annotated[Session, Depends(get_db)],
) -> Expense:
    expense = Expense(
        **payload.model_dump(),
        reference=f"EXP-{uuid4().hex[:20].upper()}",
        recorded_by=admin.id,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.get("/finance/summary", response_model=FinanceSummary)
def finance_summary(
    admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
) -> FinanceSummary:
    income = int(db.scalar(
        select(func.coalesce(func.sum(PaymentTransaction.amount_minor), 0)).where(
            PaymentTransaction.status == "CONFIRMED"
        )
    ) or 0)
    expenses = int(db.scalar(select(func.coalesce(func.sum(Expense.amount_minor), 0))) or 0)
    pending = int(db.scalar(select(func.count()).select_from(PaymentTransaction).where(PaymentTransaction.status == "PENDING")) or 0)
    new_students = int(db.scalar(
        select(func.count()).select_from(User).where(
            User.role == "STUDENT",
            User.created_at >= datetime.now(timezone.utc) - timedelta(days=30),
        )
    ) or 0)
    return FinanceSummary(
        confirmed_income_minor=income,
        expenses_minor=expenses,
        net_recorded_minor=income - expenses,
        pending_payments=pending,
        new_students=new_students,
    )


@router.get("/fee-plans", response_model=list[FeePlanRead])
def list_fee_plans(
    admin: Annotated[User, Depends(require_admin)],
    db: Annotated[Session, Depends(get_db)],
) -> list[FeePlan]:
    return list(db.scalars(select(FeePlan).order_by(FeePlan.created_at.desc())))


@router.post("/fee-plans", response_model=FeePlanRead, status_code=status.HTTP_201_CREATED)
def create_fee_plan(
    payload: FeePlanCreate,
    admin: Annotated[User, Depends(require_admin_csrf)],
    db: Annotated[Session, Depends(get_db)],
) -> FeePlan:
    plan = FeePlan(**payload.model_dump())
    db.add(plan)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Unable to create fee plan") from None
    db.refresh(plan)
    return plan


@router.patch("/fee-plans/{plan_id}/exam-body", response_model=FeePlanRead)
def classify_fee_plan(
    plan_id: str,
    payload: FeePlanExamBodyUpdate,
    admin: Annotated[User, Depends(require_admin_csrf)],
    db: Annotated[Session, Depends(get_db)],
) -> FeePlan:
    plan = db.get(FeePlan, plan_id)
    if plan is None:
        raise HTTPException(status_code=404, detail="Fee plan not found")
    if plan.exam_body is not None and plan.exam_body != payload.exam_body:
        raise HTTPException(status_code=409, detail="A classified fee plan cannot be moved to another exam body. Create a new plan instead.")
    plan.exam_body = payload.exam_body
    db.commit()
    db.refresh(plan)
    return plan


