from rest_framework import serializers
from .models import TrainingEnrollment, TrainingMaterial, TrainingPayment


class TrainingPaymentSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    method_display = serializers.CharField(source="get_payment_method_display", read_only=True)

    class Meta:
        model = TrainingPayment
        fields = [
            "id", "amount", "description",
            "payment_method", "method_display",
            "status", "status_display",
            "paystack_reference", "paid_at", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class TrainingEnrollmentSerializer(serializers.ModelSerializer):
    programme_display = serializers.CharField(source="get_programme_display", read_only=True)
    mode_display = serializers.CharField(source="get_delivery_mode_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    payments = TrainingPaymentSerializer(many=True, read_only=True)
    participant_name = serializers.CharField(source="participant.get_full_name", read_only=True)
    participant_email = serializers.CharField(source="participant.email", read_only=True)

    class Meta:
        model = TrainingEnrollment
        fields = [
            "id", "participant_name", "participant_email",
            "programme", "programme_display",
            "custom_programme_name",
            "delivery_mode", "mode_display",
            "organisation",
            "training_date", "training_end_date", "venue",
            "status", "status_display",
            "certificate_issued",
            "payments", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class TrainingMaterialSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    material_type_display = serializers.CharField(source="get_material_type_display", read_only=True)
    programme_display = serializers.CharField(source="get_programme_display", read_only=True)

    class Meta:
        model = TrainingMaterial
        fields = [
            "id", "title", "programme", "programme_display",
            "material_type", "material_type_display",
            "description", "download_url", "uploaded_at",
        ]
        read_only_fields = ["id", "uploaded_at"]

    def get_download_url(self, obj: TrainingMaterial) -> str:
        return obj.download_url


class TrainingPaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingPayment
        fields = [
            "enrollment", "amount", "description",
            "payment_method", "paystack_reference", "status", "paid_at",
        ]

    def create(self, validated_data: dict) -> TrainingPayment:
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["recorded_by"] = request.user
        return super().create(validated_data)


class EnrollmentUpdateSerializer(serializers.ModelSerializer):
    """Staff-only: update enrollment status, dates, certificate."""
    class Meta:
        model = TrainingEnrollment
        fields = [
            "programme", "custom_programme_name", "delivery_mode",
            "organisation", "training_date", "training_end_date",
            "venue", "status", "certificate_issued", "notes",
        ]
