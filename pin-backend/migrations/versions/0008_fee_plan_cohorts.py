"""Add cohort identity and dates to priced course offerings."""

from alembic import op
import sqlalchemy as sa


revision = "0008_fee_plan_cohorts"
down_revision = "0007_fee_plan_exam_bodies"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("fee_plans", sa.Column("cohort_name", sa.String(120), nullable=True))
    op.add_column("fee_plans", sa.Column("cohort_starts_on", sa.Date(), nullable=True))
    op.add_column("fee_plans", sa.Column("cohort_ends_on", sa.Date(), nullable=True))
    # Preserve existing access while marking old unsegmented plans as legacy.
    op.execute(sa.text("UPDATE fee_plans SET cohort_name = 'Legacy cohort' WHERE cohort_name IS NULL"))


def downgrade() -> None:
    op.drop_column("fee_plans", "cohort_ends_on")
    op.drop_column("fee_plans", "cohort_starts_on")
    op.drop_column("fee_plans", "cohort_name")
