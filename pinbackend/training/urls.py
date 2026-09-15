from django.urls import path
from .views import (
    MyEnrollmentsView,
    MyEnrollmentDetailView,
    MyTrainingMaterialsView,
    MyTrainingPaymentsView,
    AllEnrollmentsView,
    EnrollmentManageView,
    TrainingMaterialUploadView,
    TrainingMaterialDeleteView,
    TrainingPaymentCreateView,
)

urlpatterns = [
    # Participant-facing
    path("me/enrollments/",                 MyEnrollmentsView.as_view(),       name="training-enrollments"),
    path("me/enrollments/<uuid:id>/",       MyEnrollmentDetailView.as_view(),  name="training-enrollment-detail"),
    path("me/materials/",                   MyTrainingMaterialsView.as_view(), name="training-materials"),
    path("me/payments/",                    MyTrainingPaymentsView.as_view(),  name="training-payments"),

    # Staff-facing
    path("staff/enrollments/",                          AllEnrollmentsView.as_view(),         name="staff-enrollments"),
    path("staff/enrollments/<uuid:id>/",                EnrollmentManageView.as_view(),        name="staff-enrollment-manage"),
    path("staff/materials/upload/",                     TrainingMaterialUploadView.as_view(),  name="staff-training-material-upload"),
    path("staff/materials/<uuid:id>/delete/",           TrainingMaterialDeleteView.as_view(),  name="staff-training-material-delete"),
    path("staff/payments/",                             TrainingPaymentCreateView.as_view(),   name="staff-training-payment"),
]
