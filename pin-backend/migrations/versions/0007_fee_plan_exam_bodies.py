"""Classify fee plans by professional exam body."""

from alembic import op
import sqlalchemy as sa


revision = "0007_fee_plan_exam_bodies"
down_revision = "0006_class_sessions"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("fee_plans", sa.Column("exam_body", sa.String(20), nullable=True))
    op.create_index("ix_fee_plans_exam_body", "fee_plans", ["exam_body"])


def downgrade() -> None:
    op.drop_index("ix_fee_plans_exam_body", table_name="fee_plans")
    op.drop_column("fee_plans", "exam_body")
