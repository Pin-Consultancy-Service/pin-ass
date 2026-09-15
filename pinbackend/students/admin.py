from django.contrib import admin
from .models import StudentProfile, FeeRecord, FeeBalance, StudyMaterial


class FeeRecordInline(admin.TabularInline):
    model = FeeRecord
    extra = 0
    readonly_fields = ["id", "paystack_reference", "created_at", "recorded_by"]
    fields = ["description", "amount", "payment_method", "status", "paid_at", "paystack_reference", "recorded_by"]


class FeeBalanceInline(admin.StackedInline):
    model = FeeBalance
    extra = 0
    readonly_fields = ["total_paid", "updated_at", "last_updated_by"]


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ["__str__", "registration_number", "programme", "diet", "study_mode", "is_active_student"]
    list_filter = ["programme", "study_mode", "is_active_student", "diet"]
    search_fields = ["user__first_name", "user__last_name", "user__email", "registration_number"]
    inlines = [FeeBalanceInline, FeeRecordInline]
    readonly_fields = ["id"]


@admin.register(FeeRecord)
class FeeRecordAdmin(admin.ModelAdmin):
    list_display = ["student", "amount", "description", "status", "payment_method", "paid_at"]
    list_filter = ["status", "payment_method"]
    search_fields = ["student__user__first_name", "student__user__email", "paystack_reference"]
    readonly_fields = ["id", "created_at", "updated_at"]


@admin.register(StudyMaterial)
class StudyMaterialAdmin(admin.ModelAdmin):
    list_display = ["title", "programme", "diet", "material_type", "is_active", "uploaded_at"]
    list_filter = ["programme", "material_type", "is_active"]
    search_fields = ["title", "description"]
    readonly_fields = ["id", "uploaded_at"]
