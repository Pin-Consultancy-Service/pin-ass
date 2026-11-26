"""Create initial student accounts and payment tables."""

from alembic import op
import sqlalchemy as sa

revision = "0001_student_payments"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("first_name", sa.String(100), nullable=False),
        sa.Column("last_name", sa.String(100), nullable=False),
        sa.Column("phone_number", sa.String(40)),
        sa.Column("role", sa.String(20), nullable=False, server_default="STUDENT"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "fee_plans",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("code", sa.String(80), nullable=False, unique=True),
        sa.Column("name", sa.String(180), nullable=False),
        sa.Column("description", sa.Text()),
        sa.Column("amount_minor", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="NGN"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "payment_transactions",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("student_id", sa.String(36), sa.ForeignKey("users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("fee_plan_id", sa.String(36), sa.ForeignKey("fee_plans.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("reference", sa.String(100), nullable=False, unique=True),
        sa.Column("idempotency_key", sa.String(100), nullable=False),
        sa.Column("amount_minor", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False),
        sa.Column("status", sa.String(20), nullable=False, server_default="PENDING"),
        sa.Column("provider", sa.String(30), nullable=False, server_default="PAYSTACK"),
        sa.Column("authorization_url", sa.Text()),
        sa.Column("provider_transaction_id", sa.String(80)),
        sa.Column("paid_at", sa.DateTime(timezone=True)),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("student_id", "idempotency_key", name="uq_payment_student_idempotency"),
    )
    op.create_index("ix_payment_transactions_student_id", "payment_transactions", ["student_id"])
    op.create_index("ix_payment_transactions_reference", "payment_transactions", ["reference"], unique=True)
    op.create_index("ix_payment_transactions_status", "payment_transactions", ["status"])


def downgrade() -> None:
    op.drop_index("ix_payment_transactions_status", table_name="payment_transactions")
    op.drop_index("ix_payment_transactions_reference", table_name="payment_transactions")
    op.drop_index("ix_payment_transactions_student_id", table_name="payment_transactions")
    op.drop_table("payment_transactions")
    op.drop_table("fee_plans")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
