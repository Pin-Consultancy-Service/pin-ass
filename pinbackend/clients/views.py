from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import ClientEngagement, Deliverable
from .serializers import (
    ClientEngagementSerializer,
    ClientEngagementSummarySerializer,
    DeliverableSerializer,
    DeliverableUploadSerializer,
    EngagementUpdateSerializer,
)


class IsClient(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "CLIENT"


class IsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "STAFF"


class IsClientOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ("CLIENT", "STAFF")


# ──────────────────────────────────────────────────────
# Client-facing views
# ──────────────────────────────────────────────────────

class MyEngagementsView(generics.ListAPIView):
    """GET — list of the authenticated client's engagements (summary)."""
    serializer_class = ClientEngagementSummarySerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return ClientEngagement.objects.filter(
            client=self.request.user
        ).prefetch_related("deliverables")


class MyEngagementDetailView(generics.RetrieveAPIView):
    """GET — full detail of one engagement including deliverables."""
    serializer_class = ClientEngagementSerializer
    permission_classes = [IsClientOrStaff]
    lookup_field = "id"

    def get_object(self):
        engagement = generics.get_object_or_404(ClientEngagement, id=self.kwargs["id"])
        # Clients can only see their own engagements
        if self.request.user.role == "CLIENT" and engagement.client != self.request.user:
            raise PermissionDenied("You do not have access to this engagement.")
        return engagement


class MyDeliverablesView(generics.ListAPIView):
    """GET — all deliverables across all of the client's engagements."""
    serializer_class = DeliverableSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return Deliverable.objects.filter(
            engagement__client=self.request.user
        ).select_related("engagement").order_by("-uploaded_at")


# ──────────────────────────────────────────────────────
# Staff-facing views
# ──────────────────────────────────────────────────────

class AllEngagementsView(generics.ListCreateAPIView):
    """GET list / POST create — all engagements (staff only)."""
    permission_classes = [IsStaff]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return EngagementUpdateSerializer
        return ClientEngagementSummarySerializer

    def get_queryset(self):
        qs = ClientEngagement.objects.select_related("client", "assigned_to").all()
        client_id = self.request.query_params.get("client")
        if client_id:
            qs = qs.filter(client__id=client_id)
        return qs


class EngagementManageView(generics.RetrieveUpdateDestroyAPIView):
    """GET / PATCH / DELETE — manage a specific engagement (staff only)."""
    permission_classes = [IsStaff]
    queryset = ClientEngagement.objects.all()
    lookup_field = "id"

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return EngagementUpdateSerializer
        return ClientEngagementSerializer


class DeliverableUploadView(generics.CreateAPIView):
    """POST — upload a deliverable to an engagement (staff only)."""
    serializer_class = DeliverableUploadSerializer
    permission_classes = [IsStaff]


class DeliverableDeleteView(generics.DestroyAPIView):
    """DELETE — remove a deliverable (staff only)."""
    permission_classes = [IsStaff]
    queryset = Deliverable.objects.all()
    lookup_field = "id"
