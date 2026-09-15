from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),

    # Auth
    path("api/auth/",     include("accounts.urls")),

    # Student portal APIs
    path("api/students/", include("students.urls")),

    # Client portal APIs
    path("api/clients/",  include("clients.urls")),

    # Training portal APIs
    path("api/training/", include("training.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
