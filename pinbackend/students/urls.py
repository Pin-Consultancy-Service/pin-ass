from django.urls import path
from .views import (
    MyStudentProfileView,
    MyFeeRecordsView,
    MyFeeBalanceView,
    MyStudyMaterialsView,
    StudentListView,
    StudentDetailView,
    FeeBalanceUpdateView,
    FeeRecordCreateView,
    StudyMaterialUploadView,
    StudyMaterialDeleteView,
)

urlpatterns = [
    # Student-facing
    path("me/profile/",           MyStudentProfileView.as_view(),   name="student-profile"),
    path("me/fees/",              MyFeeRecordsView.as_view(),        name="student-fees"),
    path("me/balance/",           MyFeeBalanceView.as_view(),        name="student-balance"),
    path("me/materials/",         MyStudyMaterialsView.as_view(),    name="student-materials"),

    # Staff-facing
    path("staff/list/",                          StudentListView.as_view(),         name="staff-student-list"),
    path("staff/<uuid:id>/",                     StudentDetailView.as_view(),       name="staff-student-detail"),
    path("staff/<uuid:student_id>/balance/",     FeeBalanceUpdateView.as_view(),    name="staff-fee-balance"),
    path("staff/fee-record/",                    FeeRecordCreateView.as_view(),     name="staff-fee-record"),
    path("staff/materials/upload/",              StudyMaterialUploadView.as_view(), name="staff-material-upload"),
    path("staff/materials/<uuid:id>/delete/",    StudyMaterialDeleteView.as_view(), name="staff-material-delete"),
]
