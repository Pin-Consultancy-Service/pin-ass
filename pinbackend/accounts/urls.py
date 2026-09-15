from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, LogoutView, MeView, RegisterView, GoogleAuthView

urlpatterns = [
    path("register/",      RegisterView.as_view(),   name="register"),
    path("login/",         LoginView.as_view(),       name="login"),
    path("login/refresh/", TokenRefreshView.as_view(),name="login-refresh"),
    path("logout/",        LogoutView.as_view(),      name="logout"),
    path("me/",            MeView.as_view(),          name="me"),
    # Google OAuth — POST with { credential, role }
    path("google/",        GoogleAuthView.as_view(),  name="google-auth"),
]
