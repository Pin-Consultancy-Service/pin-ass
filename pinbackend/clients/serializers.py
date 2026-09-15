from rest_framework import serializers
from .models import ClientEngagement, Deliverable


class DeliverableSerializer(serializers.ModelSerializer):
    download_url = serializers.SerializerMethodField()
    type_display = serializers.CharField(source="get_deliverable_type_display", read_only=True)
    uploaded_by_name = serializers.CharField(source="uploaded_by.get_full_name", read_only=True)

    class Meta:
        model = Deliverable
        fields = [
            "id", "title", "deliverable_type", "type_display",
            "description", "is_final",
            "download_url", "uploaded_by_name", "uploaded_at",
        ]
        read_only_fields = ["id", "uploaded_at"]

    def get_download_url(self, obj: Deliverable) -> str:
        return obj.download_url


class ClientEngagementSerializer(serializers.ModelSerializer):
    deliverables = DeliverableSerializer(many=True, read_only=True)
    service_type_display = serializers.CharField(source="get_service_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    assigned_to_name = serializers.CharField(source="assigned_to.get_full_name", read_only=True)

    class Meta:
        model = ClientEngagement
        fields = [
            "id", "title", "service_type", "service_type_display",
            "description", "status", "status_display",
            "work_completed", "next_steps",
            "start_date", "expected_completion", "actual_completion",
            "assigned_to_name", "deliverables", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class ClientEngagementSummarySerializer(serializers.ModelSerializer):
    """Lighter serializer for list views — no nested deliverables."""
    service_type_display = serializers.CharField(source="get_service_type_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    deliverable_count = serializers.IntegerField(source="deliverables.count", read_only=True)

    class Meta:
        model = ClientEngagement
        fields = [
            "id", "title", "service_type", "service_type_display",
            "status", "status_display", "deliverable_count",
            "start_date", "expected_completion", "updated_at",
        ]


class DeliverableUploadSerializer(serializers.ModelSerializer):
    """Used by staff to upload a deliverable to an engagement."""
    class Meta:
        model = Deliverable
        fields = [
            "engagement", "title", "deliverable_type",
            "file", "cloudinary_url", "description", "is_final",
        ]

    def create(self, validated_data: dict) -> Deliverable:
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["uploaded_by"] = request.user
        return super().create(validated_data)


class EngagementUpdateSerializer(serializers.ModelSerializer):
    """Staff-only: update work_completed, next_steps, status."""
    class Meta:
        model = ClientEngagement
        fields = [
            "title", "service_type", "description", "status",
            "work_completed", "next_steps",
            "start_date", "expected_completion", "actual_completion",
            "assigned_to",
        ]
