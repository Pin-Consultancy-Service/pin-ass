"""Student portal reads scoped to the authenticated student."""

from io import BytesIO
from typing import Annotated
from xml.sax.saxutils import escape

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.dependencies import require_student
from app.db.session import get_db
from app.models import FeePlan, PaymentTransaction, StudentFeeEnrollment, User
from app.schemas.payments import FeePlanRead, PaymentRead, StudentAccessRead, StudentFeeBalanceRead

router = APIRouter()


@router.get("/me/access", response_model=StudentAccessRead)
def student_access_status(
    user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> StudentAccessRead:
    paid_minor = db.scalar(
        select(func.coalesce(func.sum(PaymentTransaction.amount_minor), 0)).where(
            PaymentTransaction.student_id == user.id,
            PaymentTransaction.status == "CONFIRMED",
        )
    ) or 0
    has_paid = paid_minor > 0
    return StudentAccessRead(
        has_paid=has_paid,
        can_access_dashboard=has_paid,
        message="Access active" if has_paid else "Complete a student fee payment to unlock dashboard resources.",
    )


@router.get("/me/fee-plans", response_model=list[FeePlanRead])
def list_available_fee_plans(
    user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[FeePlan]:
    return list(db.scalars(
        select(FeePlan)
        # Legacy plans may predate exam-body classification. Keep active plans
        # visible and payable; class access remains scoped to classified plans.
        .where(FeePlan.is_active.is_(True))
        .order_by(FeePlan.exam_body, FeePlan.name)
    ))


@router.get("/me/fee-balances", response_model=list[StudentFeeBalanceRead])
def list_fee_balances(
    user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[StudentFeeBalanceRead]:
    plans = db.scalars(
        select(FeePlan)
        .join(StudentFeeEnrollment, StudentFeeEnrollment.fee_plan_id == FeePlan.id)
        .where(
            StudentFeeEnrollment.student_id == user.id,
            FeePlan.is_active.is_(True),
        )
        .order_by(FeePlan.name)
    ).all()
    result = []
    for plan in plans:
        payments = db.scalars(select(PaymentTransaction).where(
            PaymentTransaction.student_id == user.id, PaymentTransaction.fee_plan_id == plan.id,
            PaymentTransaction.status.in_(["PENDING", "CONFIRMED"]),
        )).all()
        confirmed = [p for p in payments if p.status == "CONFIRMED"]
        pending_payments = [p for p in payments if p.status == "PENDING"]
        paid = sum(p.amount_minor for p in confirmed)
        pending = sum(p.amount_minor for p in pending_payments)
        result.append(StudentFeeBalanceRead(
            fee_plan_id=plan.id, fee_plan_name=plan.name, cohort_name=plan.cohort_name,
            total_minor=plan.amount_minor,
            paid_minor=max(0, paid), pending_minor=pending,
            # Pending checkout attempts are not money received; keep the full
            # unpaid amount outstanding until Paystack confirms the payment.
            balance_minor=max(0, plan.amount_minor - paid),
            confirmed_payment_count=len(confirmed), payment_pending=pending > 0,
            pending_payment_option=pending_payments[-1].payment_option if pending_payments else None,
            currency=plan.currency,
        ))
    return result


@router.get("/me/payments", response_model=list[PaymentRead])
def list_my_payments(
    user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> list[PaymentTransaction]:
    return list(
        db.scalars(
            select(PaymentTransaction)
            .where(PaymentTransaction.student_id == user.id)
            .order_by(PaymentTransaction.created_at.desc())
        )
    )


@router.get("/me/payments/{payment_id}/receipt")
def download_payment_receipt(
    payment_id: str,
    user: Annotated[User, Depends(require_student)],
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    transaction = db.scalar(select(PaymentTransaction).where(
        PaymentTransaction.id == payment_id,
        PaymentTransaction.student_id == user.id,
        PaymentTransaction.status == "CONFIRMED",
    ))
    if transaction is None:
        # Do not disclose whether another student's payment exists.
        raise HTTPException(status_code=404, detail="Confirmed payment receipt not found")
    plan = db.get(FeePlan, transaction.fee_plan_id)
    if plan is None:
        raise HTTPException(status_code=404, detail="Fee plan not found")

    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer, pagesize=A4, rightMargin=22 * mm, leftMargin=22 * mm,
        topMargin=22 * mm, bottomMargin=22 * mm,
        title=f"Payment receipt {transaction.reference}",
    )
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("ReceiptTitle", parent=styles["Title"], alignment=TA_CENTER, textColor=colors.HexColor("#203d8f"))
    story = [
        Paragraph("PIN Associate", title_style),
        Paragraph("PAYMENT RECEIPT", styles["Heading2"]),
        Spacer(1, 10 * mm),
    ]
    student_name = escape(f"{user.first_name} {user.last_name}")
    course_name = escape(f"{plan.exam_body + ' · ' if plan.exam_body else ''}{plan.name}")
    payment_type = f"Payment {transaction.installment_number} of 2" if transaction.installment_number else "Full payment"
    paid_at = transaction.paid_at.strftime("%d %b %Y, %H:%M UTC") if transaction.paid_at else "Confirmed"
    rows = [
        ["Student", Paragraph(student_name, styles["BodyText"])],
        ["Email", Paragraph(escape(user.email), styles["BodyText"])],
        ["Course", Paragraph(course_name, styles["BodyText"])],
        ["Cohort", escape(plan.cohort_name or "Legacy cohort")],
        ["Amount paid", f"{transaction.currency} {transaction.amount_minor / 100:,.2f}"],
        ["Payment type", payment_type],
        ["Status", "CONFIRMED"],
        ["Payment reference", transaction.reference],
        ["Date confirmed", paid_at],
        ["Payment provider", "Paystack"],
    ]
    details = Table(rows, colWidths=[42 * mm, 118 * mm], hAlign="LEFT")
    details.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f2f4f8")),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#344054")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d0d5dd")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    story.extend([details, Spacer(1, 12 * mm), Paragraph("This receipt confirms that the payment was verified by Paystack and recorded by PIN Associate.", styles["BodyText"])])
    document.build(story)
    filename = f"payment-receipt-{transaction.reference}.pdf"
    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "private, no-store",
            "X-Content-Type-Options": "nosniff",
        },
    )
