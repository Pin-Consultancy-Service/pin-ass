import uuid
from django.db import models
from django.conf import settings


class TrainingProgramme(models.TextChoices):
    FIN_INTEL_1D  = "FIN_INTEL_1D",  "Financial Intelligence (1 day)"
    FIN_INTEL_2D  = "FIN_INTEL_2D",  "Financial Intelligence (2 days)"
    TAX_UPDATES   = "TAX_UPDATES",   "Tax Updates & Compliance"
    IFRS_1D       = "IFRS_1D",       "IFRS Fundamentals (1 day)"
    IFRS_3D       = "IFRS_3D",       "IFRS Fundamentals (3 days)"
    TEAM_DEV      = "TEAM_DEV",      "Finance Team Development"
    STRATEGY      = "STRATEGY",      "Strategy & Business Planning"
    CUSTOM        = "CUSTOM",        "Custom Programme"


class DeliveryMode(models.TextChoices):
    IN_PERSON = "IN_PERSON", "In-Person"
    ONLINE    = "ONLINE",    "Online (Live)"
    HYBRID    = "HYBRID",    "Hybrid"


class TrainingEnrollment(models.Model):
    """
    Represents a training participant enrolled in a corporate programme.
    Can be an individual or part of an organisation's cohort.
    """
    class EnrollmentStatus(models.TextChoices):
        PENDING   = "PENDING",   "Pending Confirmation"
        CONFIRMED = "CONFIRMED", "Confirmed"
        ATTENDED  = "ATTENDED",  "Attended"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="training_enrollments",
    )
    programme = models.CharField(max_length=20, choices=TrainingProgramme.choices)
    custom_programme_name = models.CharField(
        max_length=200, blank=True,
        help_text="Used when programme=CUSTOM"
    )
    delivery_mode = models.CharField(
        max_length=10, choices=DeliveryMode.choices, default=DeliveryMode.IN_PERSON
    )
    organisation = models.CharField(
        max_length=200, blank=True,
        help_text="Organisation the participant is representing, if applicable"
    )
    training_date = models.DateField(null=True, blank=True)
    training_end_date = models.DateField(null=True, blank=True)
    venue = models.CharField(max_length=200, blank=True)
    status = models.CharField(
        max_length=10, choices=EnrollmentStatus.choices, default=EnrollmentStatus.PENDING
    )
    certificate_issued = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Training Enrollment"
        verbose_name_plural = "Training Enrollments"

    def __str__(self):
        name = self.custom_programme_name or self.get_programme_display()
        return f"{self.participant.get_full_name()} — {name}"


def training_material_upload_path(instance: "TrainingMaterial", filename: str) -> str:
    return f"training_materials/{instance.programme}/{filename}"


class TrainingMaterial(models.Model):
    """
    Materials available to confirmed training participants.
    Accessible only to enrolled participants in the relevant programme.
    """
    class MaterialType(models.TextChoices):
        SLIDES         = "SLIDES",    "Presentation Slides"
        WORKBOOK       = "WORKBOOK",  "Workbook"
        CASE_STUDY     = "CASE",      "Case Study"
        CERTIFICATE    = "CERT",      "Certificate Template"
        OTHER          = "OTHER",     "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    programme = models.CharField(max_length=20, choices=TrainingProgramme.choices)
    material_type = models.CharField(
        max_length=10, choices=MaterialType.choices, default=MaterialType.OTHER
    )
    file = models.FileField(upload_to=training_material_upload_path)
    cloudinary_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="training_materials_uploaded",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Training Material"
        verbose_name_plural = "Training Materials"

    def __str__(self):
        return f"{self.title} — {self.get_programme_display()}"

    @property
    def download_url(self) -> str:
        return self.cloudinary_url or (self.file.url if self.file else "")


class TrainingPayment(models.Model):
    """
    Payment record for a training enrollment.
    Mirrors the pattern of FeeRecord for consistency.
    """
    class PaymentStatus(models.TextChoices):
        PENDING   = "PENDING",   "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        FAILED    = "FAILED",    "Failed"
        REFUNDED  = "REFUNDED",  "Refunded"

    class PaymentMethod(models.TextChoices):
        PAYSTACK  = "PAYSTACK",  "Paystack (Online)"
        TRANSFER  = "TRANSFER",  "Bank Transfer"
        INVOICE   = "INVOICE",   "Corporate Invoice"
        OTHER     = "OTHER",     "Other"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enrollment = models.ForeignKey(
        TrainingEnrollment, on_delete=models.CASCADE, related_name="payments"
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.CharField(max_length=200)
    payment_method = models.CharField(
        max_length=10, choices=PaymentMethod.choices, default=PaymentMethod.PAYSTACK
    )
    paystack_reference = models.CharField(max_length=100, blank=True)
    status = models.CharField(
        max_length=10, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    recorded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="training_payments_recorded",
    )

    class Meta:
        ordering = ["-paid_at", "-created_at"]
        verbose_name = "Training Payment"
        verbose_name_plural = "Training Payments"

    def __str__(self):
        return f"{self.enrollment} — ₦{self.amount} ({self.get_status_display()})"
