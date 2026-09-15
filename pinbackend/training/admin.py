from django.contrib import admin
from .models import TrainingEnrollment, TrainingMaterial, TrainingPayment


class TrainingPaymentInline(admin.TabularInline):
    model = TrainingPayment
    extra = 0
    readonly_fields = ["id", "paystack_reference", "created_at", "recorded_by"]
    fields = ["description", "amount", "payment_method", "status", "paid_at", "paystack_reference"]


@admin.register(TrainingEnrollment)
class TrainingEnrollmentAdmin(admin.ModelAdmin):
    list_display = ["__str__", "programme", "delivery_mode", "status", "training_date", "certificate_issued"]
    list_filter = ["programme", "delivery_mode", "status", "certificate_issued"]
    search_fields = ["participant__first_name", "participant__last_name", "participant__email", "organisation"]
    inlines = [TrainingPaymentInline]
    readonly_fields = ["id", "created_at", "updated_at"]
    raw_id_fields = ["participant"]


@admin.register(TrainingMaterial)
class TrainingMaterialAdmin(admin.ModelAdmin):
    list_display = ["title", "programme", "material_type", "is_active", "uploaded_at"]
    list_filter = ["programme", "material_type", "is_active"]
    search_fields = ["title"]
    readonly_fields = ["id", "uploaded_at"]


@admin.register(TrainingPayment)
class TrainingPaymentAdmin(admin.ModelAdmin):
    list_display = ["enrollment", "amount", "status", "payment_method", "paid_at"]
    list_filter = ["status", "payment_method"]
    readonly_fields = ["id", "created_at"]
