from django.contrib import admin
from .models import ClientEngagement, Deliverable


class DeliverableInline(admin.TabularInline):
    model = Deliverable
    extra = 0
    readonly_fields = ["id", "uploaded_by", "uploaded_at"]
    fields = ["title", "deliverable_type", "is_final", "cloudinary_url", "file", "uploaded_by", "uploaded_at"]


@admin.register(ClientEngagement)
class ClientEngagementAdmin(admin.ModelAdmin):
    list_display = ["title", "client", "service_type", "status", "start_date", "expected_completion", "assigned_to"]
    list_filter = ["status", "service_type"]
    search_fields = ["title", "client__first_name", "client__last_name", "client__email"]
    inlines = [DeliverableInline]
    readonly_fields = ["id", "created_at", "updated_at"]
    raw_id_fields = ["client", "assigned_to"]


@admin.register(Deliverable)
class DeliverableAdmin(admin.ModelAdmin):
    list_display = ["title", "engagement", "deliverable_type", "is_final", "uploaded_at"]
    list_filter = ["deliverable_type", "is_final"]
    search_fields = ["title", "engagement__title", "engagement__client__email"]
    readonly_fields = ["id", "uploaded_at"]
