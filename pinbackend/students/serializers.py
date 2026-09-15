from rest_framework import serializers
from .models import StudentProfile, FeeRecord, FeeBalance, StudyMaterial


class StudentProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.get_full_name", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)
    phone = serializers.CharField(source="user.phone_number", read_only=True)
    programme_display = serializers.CharField(source="get_programme_display", read_only=True)
    study_mode_display = serializers.CharField(source="get_study_mode_display", read_only=True)

    class Meta:
        model = StudentProfile
        fields = [
            "id", "full_name", "email", "phone",
            "registration_number", "programme", "programme_display",
            "study_mode", "study_mode_display", "diet",
            "date_enrolled", "is_active_student",
        ]
        read_only_fields = ["id", "registration_number"]


class FeeRecordSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    method_display = serializers.CharField(source="get_payment_method_display", read_only=True)

    class Meta:
        model = FeeRecord
        fields = [
            "id", "amount", "description",
            "payment_method", "method_display",
            "status", "status_display",
            "paystack_reference", "paid_at", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class FeeBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeBalance
        fields = ["total_fees_due", "total_paid", "balance_due", "updated_at", "notes"]
        read_only_fields = ["updated_at"]


class StudyMaterialSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    material_type_display = serializers.CharField(source="get_material_type_display", read_only=True)
    programme_display = serializers.CharField(source="get_programme_display", read_only=True)

    class Meta:
        model = StudyMaterial
        fields = [
            "id", "title", "programme", "programme_display",
            "diet", "material_type", "material_type_display",
            "description", "download_url", "uploaded_at",
        ]
        read_only_fields = ["id", "uploaded_at"]

    def get_download_url(self, obj: StudyMaterial) -> str:
        return obj.download_url


# ── Staff-only serializer for updating fee balance ───
class FeeBalanceUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeBalance
        fields = ["total_fees_due", "total_paid", "balance_due", "notes"]

    def update(self, instance: FeeBalance, validated_data: dict) -> FeeBalance:
        request = self.context.get("request")
        instance.total_fees_due = validated_data.get("total_fees_due", instance.total_fees_due)
        instance.notes = validated_data.get("notes", instance.notes)
        if request and request.user.is_authenticated:
            instance.last_updated_by = request.user
        instance.recalculate()
        return instance


# ── Staff-only serializer for creating fee records ───
class FeeRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeRecord
        fields = [
            "student", "amount", "description",
            "payment_method", "paystack_reference",
            "status", "paid_at",
        ]

    def create(self, validated_data: dict) -> FeeRecord:
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["recorded_by"] = request.user
        record = super().create(validated_data)
        # Trigger balance recalculation
        balance, _ = FeeBalance.objects.get_or_create(student=record.student)
        balance.recalculate()
        return record
