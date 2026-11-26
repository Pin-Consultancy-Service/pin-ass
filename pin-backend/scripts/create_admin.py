"""Create the first administrator from a trusted local terminal."""

import argparse
from getpass import getpass
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select

from app.core.auth import hash_password
from app.db.session import SessionLocal
from app.models import User


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", required=True)
    args = parser.parse_args()
    password = getpass("New administrator password (minimum 8 characters): ")
    confirmation = getpass("Confirm password: ")
    if password != confirmation or len(password) < 8:
        raise SystemExit("Passwords did not match or were shorter than 8 characters.")
    if (
        not any(char.islower() for char in password)
        or not any(char.isupper() for char in password)
        or not any(char.isdigit() for char in password)
        or not any(not char.isalnum() for char in password)
    ):
        raise SystemExit("Password must include upper-case, lower-case, a number, and a symbol.")
    db = SessionLocal()
    try:
        email = args.email.strip().lower()
        if db.scalar(select(User).where(User.email == email)):
            raise SystemExit("An account already exists for that email.")
        db.add(
            User(
                email=email,
                password_hash=hash_password(password),
                first_name="PIN",
                last_name="Administrator",
                role="ADMIN",
                is_active=True,
            )
        )
        db.commit()
        print("Administrator account created.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
