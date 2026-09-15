import uuid
from django.db import models
from django.conf import settings


class Programme(models.TextChoices):
    ICAN_FDN   = "ICAN_FDN",   "ICAN Foundation"
    ICAN_SKL   = "ICAN_SKL",   "ICAN Skills"
    ICAN_PRO   = "ICAN_PRO",   "ICAN Professional"
    ACCA_APK   = "ACCA_APK",   "ACCA Applied Knowledge"
    ACCA_APS   = "ACCA_APS",   "ACCA Applied Skills"
    ACCA_SP    = "ACCA_SP",    "ACCA Strategic Professional"
    CITN_QLF   = "CITN_QLF",   "CITN Qualifying"
    CITN_PRO   = "CITN_PRO",   "CITN Professional"
    ATS        = "ATS",        "ATS"
    CISA       = "CISA",       "CISA"
    IFRS_CERT  = "IFRS_CERT",  "Certificate in IFRS"
    IFRS_DIP   = "IFRS_DIP",   "Diploma in IFRS"


class StudyMode(models.TextChoices):
    WEEKDAY  = "WEEKDAY",  "Weekday"
    WEEKEND  = "WEEKEND",  "Weekend"
    ONLINE   = "ONLINE",   "Online"
    HYBRID   = "HYBRID",   "Hybrid"


class StudentProfile(models.Model):
    """
    Extends the base User account with student-specific fields.
    One profile per user (student role).
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    registration_number = models.CharField(
        max_length=30, unique=True, blank=True,
        help_text="PIN internal registration number, e.g. PIN-2026-00123"
    )
    programme = models.CharField(max_length=20, choices=Programme.choices)
    study_mode = models.CharField(max_length=10, choices=StudyMode.choices, default=StudyMode.WEEKDAY)
    diet = models.CharField(
        max_length=30, blank=True,
        help_text="Current examination diet, e.g. Nov/Dec 2026"
    )
    date_enrolled = models.DateField(null=True, blank=True)
    is_active_student = models.BooleanField(default=True)
    notes = models.TextField(blank=True)  # Internal staff notes

    class Meta:
        ordering = ["-date_enrolled"]
        verbose_name = "Student Profile"
        verbose_name_plural = "Student Profiles"

    def __str__(self):
        return f"{self.user.get_full_name()} — {self.get_programme_display()}"


class FeeRecord(models.Model):
    """
    Tracks individual fee payments and the current balance for a student.
    Staff can update these records via the admin portal.
    """
    class PaymentStatus(models.TextChoices):
        PENDING   = "PENDING",   "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        FAILED    = "FAILED",    "Failed"
        REFUNDED  = "REFUNDED",  "Refunded"

    class PaymentMethod(models.TextChoices):
        PAYSTACK  = "PAYSTACK",  "Paystack (Online)"
        TRANSFER  = "TRANSFER",  "Bank Transfer"
        CASH      = "CASH",      "Cash"
        OTHER     = "OTHER",     "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        StudentProfile, on_delete=models.CASCADE, related_name="fee_records"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(
        max_length=200,
        help_text="e.g. 'ICAN Skills — Nov/Dec 2026 Diet Tuition Fee'"
    )
    payment_method = models.CharField(
        max_length=10, choices=PaymentMethod.choices, default=PaymentMethod.PAYSTACK
    )
    paystack_reference = models.CharField(max_length=100, blank=True)
    status = models.CharField(
        max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="fee_entries_recorded",
        help_text="Staff member who recorded/confirmed this payment"
    )

    class Meta:
        ordering = ["-paid_at", "-created_at"]
        verbose_name = "Fee Record"
        verbose_name_plural = "Fee Records"

    def __str__(self):
        return f"{self.student} — ₦{self.amount} ({self.get_status_display()})"


class FeeBalance(models.Model):
    """
    Running balance for a student — updated by staff via admin portal.
    Total paid is computed from confirmed FeeRecords but staff can also
    override the balance field directly.
    """
    student = models.OneToOneField(
        StudentProfile, on_delete=models.CASCADE, related_name="fee_balance"
    )
    total_fees_due = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    balance_due = models.DecimalField(
        max_digits=12, decimal_places=2, default=0,
        help_text="Computed automatically; can be overridden by staff if needed"
    )
    last_updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="balances_updated",
    )
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True, help_text="Staff notes on the balance")

    class Meta:
        verbose_name = "Fee Balance"
        verbose_name_plural = "Fee Balances"

    def __str__(self):
        return f"{self.student} — Balance: ₦{self.balance_due}"

    def recalculate(self):
        """Recompute total_paid from confirmed records and update balance_due."""
        from django.db.models import Sum
        confirmed = self.student.fee_records.filter(status="CONFIRMED").aggregate(
            total=Sum("amount")
        )["total"] or 0
        self.total_paid = confirmed
        self.balance_due = max(self.total_fees_due - confirmed, 0)
        self.save(update_fields=["total_paid", "balance_due", "updated_at"])


def study_material_upload_path(instance: "StudyMaterial", filename: str) -> str:
    return f"study_materials/{instance.programme}/{instance.diet}/{filename}"


class StudyMaterial(models.Model):
    """
    Downloadable study material accessible to all students enrolled in
    the relevant programme and diet.
    """
    class MaterialType(models.TextChoices):
        TEXTBOOK       = "TEXTBOOK",      "Textbook"
        PAST_QUESTIONS = "PAST_QS",       "Past Questions"
        REVISION_NOTES = "REVISION",      "Revision Notes"
        EXAMINER_REPORT= "EXAM_REPORT",   "Examiner Report"
        OTHER          = "OTHER",         "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    programme = models.CharField(max_length=20, choices=Programme.choices)
    diet = models.CharField(max_length=30, blank=True, help_text="e.g. Nov/Dec 2026")
    material_type = models.CharField(
        max_length=15, choices=MaterialType.choices, default=MaterialType.OTHER
    )
    file = models.FileField(upload_to=study_material_upload_path)
    cloudinary_url = models.URLField(
        blank=True,
        help_text="Optional: Cloudinary URL if file is hosted on Cloudinary"
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="materials_uploaded",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Study Material"
        verbose_name_plural = "Study Materials"

    def __str__(self):
        return f"{self.title} — {self.get_programme_display()}"

    @property
    def download_url(self) -> str:
        """Return Cloudinary URL if set, else the FileField URL."""
        return self.cloudinary_url or (self.file.url if self.file else "")
