import requests as http_requests

from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import CustomTokenObtainPairSerializer, RegisterSerializer, UserSerializer

User = get_user_model()


# ─── Standard auth views ─────────────────────────────

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


# ─── Google OAuth view ────────────────────────────────

class GoogleAuthView(APIView):
    """
    POST /api/auth/google/

    Accepts a Google ID token from the frontend (obtained via Google
    Identity Services / One Tap). Verifies the token with Google's
    tokeninfo endpoint, then either:
      - Creates a new account (STUDENT role by default), or
      - Signs in the existing account.

    Returns the same JWT payload as the standard login endpoint so the
    frontend can treat both flows identically.

    Request body:
      { "credential": "<google_id_token>", "role": "STUDENT" | "CLIENT" }

    The `role` field is only used when creating a NEW account.
    Existing accounts keep their existing role.

    Setup required (see SYSTEM.md — Google OAuth section):
      1. Create a Google Cloud project and OAuth 2.0 client ID.
      2. Add GOOGLE_OAUTH_CLIENT_ID to your backend .env file.
      3. Add the client ID to NEXT_PUBLIC_GOOGLE_CLIENT_ID in
         pin-frontend/.env.local.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        credential = request.data.get("credential", "").strip()
        role        = request.data.get("role", "STUDENT").upper()

        if not credential:
            return Response(
                {"detail": "Google credential token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate role — only STUDENT and CLIENT are self-registerable
        if role not in ("STUDENT", "CLIENT"):
            role = "STUDENT"

        # ── Verify ID token with Google ──────────────────
        google_client_id = getattr(settings, "GOOGLE_OAUTH_CLIENT_ID", "")
        if not google_client_id:
            return Response(
                {"detail": "Google OAuth is not configured on this server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            verify_resp = http_requests.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": credential},
                timeout=10,
            )
            if verify_resp.status_code != 200:
                return Response(
                    {"detail": "Invalid or expired Google token. Please try again."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            google_data = verify_resp.json()
        except http_requests.RequestException:
            return Response(
                {"detail": "Could not reach Google to verify your sign-in. Please try again."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Verify the token was issued for OUR client ID (security check)
        if google_data.get("aud") != google_client_id:
            return Response(
                {"detail": "Token audience mismatch. Sign-in rejected."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        email      = google_data.get("email", "").lower().strip()
        first_name = google_data.get("given_name", "")
        last_name  = google_data.get("family_name", "")

        if not email:
            return Response(
                {"detail": "No email address returned by Google."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ── Get or create the user ───────────────────────
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": first_name,
                "last_name":  last_name,
                "role":       role,
                # Google-authenticated users have no usable password
                # (they can always set one later via a password-reset flow)
            },
        )

        if created:
            user.set_unusable_password()
            user.save(update_fields=["password"])

        # ── Issue JWT tokens ─────────────────────────────
        refresh = RefreshToken.for_user(user)
        refresh["role"]      = user.role
        refresh["full_name"] = user.get_full_name()

        return Response(
            {
                "access":  str(refresh.access_token),
                "refresh": str(refresh),
                "user":    UserSerializer(user).data,
                "created": created,   # True = new account, False = existing sign-in
            },
            status=status.HTTP_200_OK,
        )
