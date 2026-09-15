from rest_framework import generics, permissions

from .models import TrainingEnrollment, TrainingMaterial, TrainingPayment
from .serializers import (
    TrainingEnrollmentSerializer,
    TrainingMaterialSerializer,
    TrainingPaymentSerializer,
    TrainingPaymentCreateSerializer,
    EnrollmentUpdateSerializer,
)


class IsTrainingParticipant(permissions.BasePermission):
    """Any authenticated user can be a training participant."""
    def has_permission(self, request, view):
        return request.user.is_authenticated


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "STAFF"


# ──────────────────────────────────────────────────────
# Participant-facing views
# ──────────────────────────────────────────────────────

class MyEnrollmentsView(generics.ListAPIView):
    """GET — authenticated participant's training enrollments."""
    serializer_class = TrainingEnrollmentSerializer
    permission_classes = [IsTrainingParticipant]

    def get_queryset(self):
        return TrainingEnrollment.objects.filter(
            participant=self.request.user
        ).prefetch_related("payments")


class MyEnrollmentDetailView(generics.RetrieveAPIView):
    """GET — single enrollment detail with payments."""
    serializer_class = TrainingEnrollmentSerializer
    permission_classes = [IsTrainingParticipant]
    lookup_field = "id"

    def get_queryset(self):
        return TrainingEnrollment.objects.filter(participant=self.request.user)


class MyTrainingMaterialsView(generics.ListAPIView):
    """GET — materials for programmes the participant is confirmed for."""
    serializer_class = TrainingMaterialSerializer
    permission_classes = [IsTrainingParticipant]

    def get_queryset(self):
        confirmed_programmes = TrainingEnrollment.objects.filter(
            participant=self.request.user,
            status="CONFIRMED",
        ).values_list("programme", flat=True)
        return TrainingMaterial.objects.filter(
            programme__in=confirmed_programmes,
            is_active=True,
        ).order_by("-uploaded_at")


class MyTrainingPaymentsView(generics.ListAPIView):
    """GET — payment records for the participant's enrollments."""
    serializer_class = TrainingPaymentSerializer
    permission_classes = [IsTrainingParticipant]

    def get_queryset(self):
        return TrainingPayment.objects.filter(
            enrollment__participant=self.request.user,
        ).order_by("-paid_at")


# ──────────────────────────────────────────────────────
# Staff-facing views
# ──────────────────────────────────────────────────────

class AllEnrollmentsView(generics.ListCreateAPIView):
    """GET list / POST create (staff only)."""
    permission_classes = [IsStaff]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return EnrollmentUpdateSerializer
        return TrainingEnrollmentSerializer

    def get_queryset(self):
        return TrainingEnrollment.objects.select_related("participant").prefetch_related("payments").all()

    def perform_create(self, serializer):
        serializer.save()


class EnrollmentManageView(generics.RetrieveUpdateDestroyAPIView):
    """GET / PATCH / DELETE — specific enrollment (staff only)."""
    permission_classes = [IsStaff]
    queryset = TrainingEnrollment.objects.all()
    lookup_field = "id"

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return EnrollmentUpdateSerializer
        return TrainingEnrollmentSerializer


class TrainingMaterialUploadView(generics.CreateAPIView):
    """POST — upload a training material (staff only)."""
    serializer_class = TrainingMaterialSerializer
    permission_classes = [IsStaff]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class TrainingMaterialDeleteView(generics.DestroyAPIView):
    """DELETE — remove a training material (staff only)."""
    permission_classes = [IsStaff]
    queryset = TrainingMaterial.objects.all()
    lookup_field = "id"


class TrainingPaymentCreateView(generics.CreateAPIView):
    """POST — record a training payment (staff only)."""
    serializer_class = TrainingPaymentCreateSerializer
    permission_classes = [IsStaff]
