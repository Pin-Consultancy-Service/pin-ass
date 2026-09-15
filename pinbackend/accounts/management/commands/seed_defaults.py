"""
Management command: seed_defaults
----------------------------------
Creates the default PIN Associate accounts for development and initial
production setup. Run once after initial migration:

    python manage.py seed_defaults

Re-running is safe — existing accounts are skipped.

DEFAULT CREDENTIALS
--------------------
Staff / Admin
  email:    admin@pinassociate.com
  password: PINadmin2026!

Demo Student
  email:    student@pinassociate.com
  password: PINstudent2026!

Demo Client
  email:    client@pinassociate.com
  password: PINclient2026!

IMPORTANT: Change all passwords immediately in production via the
Django admin panel (/admin/) or the management command:
    python manage.py changepassword <email>
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

DEFAULT_ACCOUNTS = [
    {
        "email":      "admin@pinassociate.com",
        "password":   "PINadmin2026!",
        "first_name": "PIN",
        "last_name":  "Admin",
        "role":       "STAFF",
        "is_staff":   True,
        "is_superuser": True,
        "label":      "Staff / Superuser",
    },
    {
        "email":      "student@pinassociate.com",
        "password":   "PINstudent2026!",
        "first_name": "Demo",
        "last_name":  "Student",
        "role":       "STUDENT",
        "is_staff":   False,
        "is_superuser": False,
        "label":      "Demo Student",
    },
    {
        "email":      "client@pinassociate.com",
        "password":   "PINclient2026!",
        "first_name": "Demo",
        "last_name":  "Client",
        "role":       "CLIENT",
        "is_staff":   False,
        "is_superuser": False,
        "label":      "Demo Client",
    },
]


class Command(BaseCommand):
    help = "Seed default PIN Associate accounts (staff, student, client)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force-update",
            action="store_true",
            help="Update passwords on existing accounts instead of skipping them.",
        )

    def handle(self, *args, **options):
        force = options["force_update"]

        self.stdout.write(self.style.MIGRATE_HEADING("\nPIN Associate — Default Account Seeder"))
        self.stdout.write("=" * 50)

        for acct in DEFAULT_ACCOUNTS:
            email = acct["email"]
            exists = User.objects.filter(email=email).exists()

            if exists and not force:
                self.stdout.write(
                    self.style.WARNING(f"  SKIP   {acct['label']:20s}  {email}  (already exists)")
                )
                continue

            if exists and force:
                user = User.objects.get(email=email)
                user.set_password(acct["password"])
                user.save(update_fields=["password"])
                self.stdout.write(
                    self.style.SUCCESS(f"  UPDATE {acct['label']:20s}  {email}  (password reset)")
                )
                continue

            User.objects.create_user(
                email=email,
                password=acct["password"],
                first_name=acct["first_name"],
                last_name=acct["last_name"],
                role=acct["role"],
                is_staff=acct["is_staff"],
                is_superuser=acct["is_superuser"],
            )
            self.stdout.write(
                self.style.SUCCESS(f"  CREATE {acct['label']:20s}  {email}")
            )

        self.stdout.write("\n" + "=" * 50)
        self.stdout.write(self.style.WARNING(
            "⚠  Change all default passwords before going to production!\n"
            "   Run: python manage.py changepassword <email>\n"
            "   Or:  python manage.py seed_defaults --force-update\n"
        ))
