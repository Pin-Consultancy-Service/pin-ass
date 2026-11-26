"""Track provider refund events and manually recorded business expenses."""

from alembic import op
import sqlalchemy as sa

revision = "0002_refunds_expenses"
down_revision = "0001_student_payments"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "refund_transactions",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("payment_transaction_id", sa.String(36), sa.ForeignKey("payment_transactions.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("provider_refund_reference", sa.String(100), unique=True),
        sa.Column("amount_minor", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False),
        sa.Column("status", sa.String(30), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_refund_transactions_payment_transaction_id", "refund_transactions", ["payment_transaction_id"])
    op.create_index("ix_refund_transactions_status", "refund_transactions", ["status"])

    op.create_table(
        "expenses",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("reference", sa.String(40), nullable=False, unique=True),
        sa.Column("category", sa.String(80), nullable=False),
        sa.Column("payee", sa.String(180)),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("amount_minor", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="NGN"),
        sa.Column("expense_date", sa.Date(), nullable=False),
        sa.Column("recorded_by", sa.String(36), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("expenses")
    op.drop_index("ix_refund_transactions_status", table_name="refund_transactions")
    op.drop_index("ix_refund_transactions_payment_transaction_id", table_name="refund_transactions")
    op.drop_table("refund_transactions")
