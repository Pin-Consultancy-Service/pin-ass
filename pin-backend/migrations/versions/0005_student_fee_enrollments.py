"""Link students to fee plans they start paying."""

from alembic import op
import sqlalchemy as sa
from uuid import uuid4


revision = "0005_student_fee_enrollments"
down_revision = "0004_two_payment_limit"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "student_fee_enrollments",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("student_id", sa.String(36), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("fee_plan_id", sa.String(36), sa.ForeignKey("fee_plans.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("enrolled_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("student_id", "fee_plan_id", name="uq_student_fee_enrollment"),
    )
    op.create_index("ix_student_fee_enrollments_student_id", "student_fee_enrollments", ["student_id"])
    op.create_index("ix_student_fee_enrollments_fee_plan_id", "student_fee_enrollments", ["fee_plan_id"])

    bind = op.get_bind()
    existing_enrollments = bind.execute(sa.text("""
        SELECT student_id, fee_plan_id, MIN(created_at) AS enrolled_at
        FROM payment_transactions
        GROUP BY student_id, fee_plan_id
    """)).mappings()
    for enrollment in existing_enrollments:
        bind.execute(
            sa.text("""
                INSERT INTO student_fee_enrollments (id, student_id, fee_plan_id, enrolled_at)
                VALUES (:id, :student_id, :fee_plan_id, :enrolled_at)
            """),
            {"id": str(uuid4()), **enrollment},
        )


def downgrade() -> None:
    op.drop_index("ix_student_fee_enrollments_fee_plan_id", table_name="student_fee_enrollments")
    op.drop_index("ix_student_fee_enrollments_student_id", table_name="student_fee_enrollments")
    op.drop_table("student_fee_enrollments")
