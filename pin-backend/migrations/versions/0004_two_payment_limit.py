"""Replace arbitrary installments with a full or two-payment choice."""

from alembic import op
import sqlalchemy as sa

revision = "0004_two_payment_limit"
down_revision = "0003_installments"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "payment_transactions",
        sa.Column("payment_option", sa.String(20), nullable=False, server_default="FULL"),
    )
    op.add_column("payment_transactions", sa.Column("installment_number", sa.Integer(), nullable=True))
    op.drop_column("fee_plans", "minimum_installment_minor")


def downgrade() -> None:
    op.add_column(
        "fee_plans",
        sa.Column("minimum_installment_minor", sa.Integer(), nullable=False, server_default="10000000"),
    )
    op.drop_column("payment_transactions", "installment_number")
    op.drop_column("payment_transactions", "payment_option")
