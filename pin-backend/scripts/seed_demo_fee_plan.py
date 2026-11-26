"""Create the explicitly non-production sample installment plan."""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select

from app.core.config import get_settings
from app.db.session import SessionLocal
from app.models import FeePlan


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a non-production example fee plan")
    parser.add_argument("--exam-body", required=True, choices=["ICAN", "ACCA", "CITN", "CISA", "ATS"])
    args = parser.parse_args()
    if get_settings().is_production:
        raise SystemExit("Refusing to seed demo tuition in production")
    with SessionLocal() as db:
        existing = db.scalar(select(FeePlan).where(FeePlan.code == "DEMO-COURSE-2026"))
        if existing:
            print("Demo fee plan already exists")
            return
        db.add(FeePlan(
            code="DEMO-COURSE-2026",
            name="DEMO ONLY — Sample course fee",
            exam_body=args.exam_body,
            description="Development example only. Not approved tuition or a real published price.",
            amount_minor=50_000_000,  # ₦500,000
            currency="NGN",
        ))
        db.commit()
        print(f"Created {args.exam_body} demo-only fee plan: 500,000 NGN total; full or two installments")


if __name__ == "__main__":
    main()
