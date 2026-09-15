from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import StudentProfile, FeeRecord, FeeBalance, StudyMaterial
from .serializers import (
    StudentProfileSerializer,
    FeeRecordSerializer,
    FeeBalanceSerializer,
    StudyMaterialSerializer,
    FeeBalanceUpdateSerializer,
    FeeRecordCreateSerializer,
)


class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "STUDENT"
        )


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "STAFF"
        )


# ──────────────────────────────────────────────────────
# Student-facing views
# ──────────────────────────────────────────────────────

class MyStudentProfileView(generics.RetrieveUpdateAPIView):
    """GET / PATCH — authenticated student's own profile."""
    serializer_class = StudentProfileSerializer
    permission_classes = [IsStudent]

    def get_object(self):
        profile, _ = StudentProfile.objects.get_or_create(user=self.request.user)
        return profile


class MyFeeRecordsView(generics.ListAPIView):
    """GET — authenticated student's payment history."""
    serializer_class = FeeRecordSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        try:
            profile = self.request.user.student_profile
        except StudentProfile.DoesNotExist:
            return FeeRecord.objects.none()
        return profile.fee_records.filter(status="CONFIRMED").order_by("-paid_at")


class MyFeeBalanceView(generics.RetrieveAPIView):
    """GET — authenticated student's current fee balance."""
    serializer_class = FeeBalanceSerializer
    permission_classes = [IsStudent]

    def get_object(self):
        try:
            profile = self.request.user.student_profile
        except StudentProfile.DoesNotExist:
            return Response(
                {"detail": "Student profile not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        balance, _ = FeeBalance.objects.get_or_create(student=profile)
        return balance


class MyStudyMaterialsView(generics.ListAPIView):
    """GET — study materials for the student's enrolled programme."""
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsStudent]

    def get_queryset(self):
        try:
            profile = self.request.user.student_profile
        except StudentProfile.DoesNotExist:
            return StudyMaterial.objects.none()
        return StudyMaterial.objects.filter(
            programme=profile.programme,
            is_active=True,
        ).order_by("-uploaded_at")


# ──────────────────────────────────────────────────────
# Staff-facing views (admin portal uses these)
# ──────────────────────────────────────────────────────

class StudentListView(generics.ListAPIView):
    """GET — all student profiles (staff only)."""
    serializer_class = StudentProfileSerializer
    permission_classes = [IsStaff]
    queryset = StudentProfile.objects.select_related("user").all()


class StudentDetailView(generics.RetrieveUpdateAPIView):
    """GET / PATCH — specific student profile (staff only)."""
    serializer_class = StudentProfileSerializer
    permission_classes = [IsStaff]
    queryset = StudentProfile.objects.select_related("user").all()
    lookup_field = "id"


class FeeBalanceUpdateView(generics.RetrieveUpdateAPIView):
    """GET / PUT — update fee balance for a student (staff only)."""
    permission_classes = [IsStaff]
    lookup_field = "student__id"
    lookup_url_kwarg = "student_id"

    def get_queryset(self):
        return FeeBalance.objects.select_related("student__user").all()

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return FeeBalanceUpdateSerializer
        return FeeBalanceSerializer

    def get_object(self):
        student_id = self.kwargs["student_id"]
        profile = generics.get_object_or_404(StudentProfile, id=student_id)
        balance, _ = FeeBalance.objects.get_or_create(student=profile)
        return balance


class FeeRecordCreateView(generics.CreateAPIView):
    """POST — record a new fee payment for a student (staff only)."""
    serializer_class = FeeRecordCreateSerializer
    permission_classes = [IsStaff]


class StudyMaterialUploadView(generics.CreateAPIView):
    """POST — upload a new study material (staff only)."""
    serializer_class = StudyMaterialSerializer
    permission_classes = [IsStaff]

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)


class StudyMaterialDeleteView(generics.DestroyAPIView):
    """DELETE — remove a study material (staff only)."""
    permission_classes = [IsStaff]
    queryset = StudyMaterial.objects.all()
    lookup_field = "id"
