import uuid
from django.db import models
from django.conf import settings


class ServiceType(models.TextChoices):
    ADVISORY    = "ADVISORY",   "Business Advisory"
    TAXATION    = "TAXATION",   "Taxation"
    FINANCIALS  = "FINANCIALS", "Financial Statements"
    AUDIT       = "AUDIT",      "Audit Support"
    ASSET       = "ASSET",      "Asset Review"
    COMPLIANCE  = "COMPLIANCE", "Regulatory Compliance"
    OTHER       = "OTHER",      "Other"


class ClientEngagement(models.Model):
    """
    Represents a consultancy engagement for a specific client.
    Staff update the status and milestones; clients can view progress.
    """
    class EngagementStatus(models.TextChoices):
        ACTIVE    = "ACTIVE",    "Active"
        ON_HOLD   = "ON_HOLD",   "On Hold"
        COMPLETED = "COMPLETED", "Completed"
        CANCELLED = "CANCELLED", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="engagements",
        limit_choices_to={"role": "CLIENT"},
    )
    title = models.CharField(max_length=200, help_text="e.g. 'Tax Advisory — FY 2026'")
    service_type = models.CharField(max_length=15, choices=ServiceType.choices)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=10, choices=EngagementStatus.choices, default=EngagementStatus.ACTIVE
    )
    # Progress — staff updates these
    work_completed = models.TextField(
        blank=True,
        help_text="Freeform description of work completed so far (visible to client)"
    )
    next_steps = models.TextField(blank=True, help_text="Visible to client")
    start_date = models.DateField(null=True, blank=True)
    expected_completion = models.DateField(null=True, blank=True)
    actual_completion = models.DateField(null=True, blank=True)
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="assigned_engagements",
        limit_choices_to={"role": "STAFF"},
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Client Engagement"
        verbose_name_plural = "Client Engagements"

    def __str__(self):
        return f"{self.client.get_full_name()} — {self.title}"


def deliverable_upload_path(instance: "Deliverable", filename: str) -> str:
    """
    Files stored under: deliverables/<client_id>/<engagement_id>/<filename>
    Ensures each client's documents are isolated.
    """
    return f"deliverables/{instance.engagement.client_id}/{instance.engagement_id}/{filename}"


class Deliverable(models.Model):
    """
    A file deliverable uploaded by staff to a client's engagement.
    Visible ONLY to the relevant client and authorised staff.
    Document access is controlled at the view layer.
    """
    class DeliverableType(models.TextChoices):
        FINANCIAL_STATEMENT = "FINANCIAL",  "Financial Statement"
        TAX_REPORT          = "TAX",        "Tax Report / Filing"
        AUDIT_REPORT        = "AUDIT",      "Audit Report"
        ADVISORY_REPORT     = "ADVISORY",   "Advisory Report"
        VALUATION           = "VALUATION",  "Valuation Report"
        COMPLIANCE_REPORT   = "COMPLIANCE", "Compliance Report"
        INVOICE             = "INVOICE",    "Invoice"
        OTHER               = "OTHER",      "Other Document"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    engagement = models.ForeignKey(
        ClientEngagement, on_delete=models.CASCADE, related_name="deliverables"
    )
    title = models.CharField(max_length=200)
    deliverable_type = models.CharField(
        max_length=15, choices=DeliverableType.choices, default=DeliverableType.OTHER
    )
    file = models.FileField(upload_to=deliverable_upload_path)
    cloudinary_url = models.URLField(
        blank=True,
        help_text="Cloudinary URL if uploaded via Cloudinary"
    )
    description = models.TextField(blank=True)
    is_final = models.BooleanField(
        default=False,
        help_text="Mark True when this is the final version, not a draft"
    )
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="deliverables_uploaded",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Deliverable"
        verbose_name_plural = "Deliverables"

    def __str__(self):
        return f"{self.title} — {self.engagement}"

    @property
    def download_url(self) -> str:
        return self.cloudinary_url or (self.file.url if self.file else "")
