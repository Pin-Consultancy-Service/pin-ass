from django.urls import path
from .views import (
    MyEngagementsView,
    MyEngagementDetailView,
    MyDeliverablesView,
    AllEngagementsView,
    EngagementManageView,
    DeliverableUploadView,
    DeliverableDeleteView,
)

urlpatterns = [
    # Client-facing
    path("me/engagements/",               MyEngagementsView.as_view(),       name="client-engagements"),
    path("me/engagements/<uuid:id>/",     MyEngagementDetailView.as_view(),  name="client-engagement-detail"),
    path("me/deliverables/",              MyDeliverablesView.as_view(),      name="client-deliverables"),

    # Staff-facing
    path("staff/engagements/",                        AllEngagementsView.as_view(),     name="staff-engagements"),
    path("staff/engagements/<uuid:id>/",              EngagementManageView.as_view(),   name="staff-engagement-manage"),
    path("staff/deliverables/upload/",                DeliverableUploadView.as_view(),  name="staff-deliverable-upload"),
    path("staff/deliverables/<uuid:id>/delete/",      DeliverableDeleteView.as_view(),  name="staff-deliverable-delete"),
]
