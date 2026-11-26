"""Add scheduled classes linked to student fee plans."""

from alembic import op
import sqlalchemy as sa


revision = "0006_class_sessions"
down_revision = "0005_student_fee_enrollments"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "class_sessions",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("fee_plan_id", sa.String(36), sa.ForeignKey("fee_plans.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("subject", sa.String(180), nullable=False),
        sa.Column("topic", sa.String(240), nullable=False),
        sa.Column("instructor_name", sa.String(180), nullable=False),
        sa.Column("scheduled_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("duration_minutes", sa.Integer(), nullable=False),
        sa.Column("meeting_url", sa.String(2048)),
        sa.Column("recording_url", sa.String(2048)),
        sa.Column("materials", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("description", sa.Text()),
        sa.Column("status", sa.String(20), nullable=False, server_default="SCHEDULED"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_class_sessions_fee_plan_scheduled", "class_sessions", ["fee_plan_id", "scheduled_at"])
    op.create_index("ix_class_sessions_scheduled_at", "class_sessions", ["scheduled_at"])
    op.create_index("ix_class_sessions_status", "class_sessions", ["status"])


def downgrade() -> None:
    op.drop_index("ix_class_sessions_status", table_name="class_sessions")
    op.drop_index("ix_class_sessions_scheduled_at", table_name="class_sessions")
    op.drop_index("ix_class_sessions_fee_plan_scheduled", table_name="class_sessions")
    op.drop_table("class_sessions")
