from pathlib import Path
from datetime import timedelta

try:
    from decouple import config as env
except ImportError:
    import os
    def env(key, default=None, cast=None):
        val = os.environ.get(key, default)
        if cast and val is not None:
            return cast(val)
        return val

# ──────────────────────────────────────────────────────
# Paths
# ──────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent

# ──────────────────────────────────────────────────────
# Security
# ──────────────────────────────────────────────────────
SECRET_KEY = env(
    "SECRET_KEY",
    default="django-insecure-4vc4thb16dkq*kftt$#486ytcr41+^f^&56o(!h9pl!n%5*p3f",
)
DEBUG = env("DEBUG", default=True, cast=bool)
ALLOWED_HOSTS = env("ALLOWED_HOSTS", default="127.0.0.1,localhost").split(",")

# ──────────────────────────────────────────────────────
# Application definition
# ──────────────────────────────────────────────────────
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Third-party
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",

    # PIN apps
    "accounts",
    "students",
    "clients",
    "training",
]

# CorsMiddleware MUST come before CommonMiddleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "pinbackend.urls"
WSGI_APPLICATION = "pinbackend.wsgi.application"
AUTH_USER_MODEL = "accounts.User"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ──────────────────────────────────────────────────────
# Database
# ──────────────────────────────────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
# To switch to PostgreSQL, set DATABASE_URL in .env and use dj-database-url:
# import dj_database_url
# DATABASES = {"default": dj_database_url.config(conn_max_age=600)}

# ──────────────────────────────────────────────────────
# Auth
# ──────────────────────────────────────────────────────
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ──────────────────────────────────────────────────────
# Internationalisation
# ──────────────────────────────────────────────────────
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Lagos"
USE_I18N = True
USE_TZ = True

# ──────────────────────────────────────────────────────
# Static & Media files
# ──────────────────────────────────────────────────────
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ──────────────────────────────────────────────────────
# Django REST Framework
# ──────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

# ──────────────────────────────────────────────────────
# Simple JWT
# ──────────────────────────────────────────────────────
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# ──────────────────────────────────────────────────────
# CORS
# ──────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = env(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:3000",
).split(",")
CORS_ALLOW_CREDENTIALS = True

# ──────────────────────────────────────────────────────
# Cloudinary (media hosting)
# Configure CLOUDINARY_URL in .env once Cloudinary account is set up.
# Format: cloudinary://<api_key>:<api_secret>@<cloud_name>
# ──────────────────────────────────────────────────────
CLOUDINARY_URL = env("CLOUDINARY_URL", default="")
# When CLOUDINARY_URL is set, install cloudinary and django-cloudinary-storage,
# then set DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

# ──────────────────────────────────────────────────────
# Email
# ──────────────────────────────────────────────────────
EMAIL_BACKEND = env(
    "EMAIL_BACKEND",
    default="django.core.mail.backends.console.EmailBackend",
)

# ──────────────────────────────────────────────────────
# Paystack webhook secret
# Set PAYSTACK_SECRET_KEY in .env for webhook verification
# ──────────────────────────────────────────────────────
PAYSTACK_SECRET_KEY = env("PAYSTACK_SECRET_KEY", default="")

# ──────────────────────────────────────────────────────
# Google OAuth
# 1. Go to console.cloud.google.com → APIs & Services → Credentials
# 2. Create an OAuth 2.0 Client ID (Web application)
# 3. Add your frontend origin to Authorised JavaScript origins
# 4. Copy the Client ID here (and to NEXT_PUBLIC_GOOGLE_CLIENT_ID in frontend .env.local)
# ──────────────────────────────────────────────────────
GOOGLE_OAUTH_CLIENT_ID = env("GOOGLE_OAUTH_CLIENT_ID", default="")
