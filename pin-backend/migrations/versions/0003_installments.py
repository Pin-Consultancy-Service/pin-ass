"""Add admin-controlled minimum installments."""

from alembic import op
import sqlalchemy as sa

revision = "0003_installments"
down_revision = "0002_refunds_expenses"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "fee_plans",
        sa.Column("minimum_installment_minor", sa.Integer(), nullable=False, server_default="10000000"),
    )


def downgrade() -> None:
    op.drop_column("fee_plans", "minimum_installment_minor")
