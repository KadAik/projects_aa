import os
from decouple import config
from decouple import Csv
from .base import *

DEBUG = False

SECRET_KEY = config("DJANGO_SECRET_KEY")

# Production database
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME"),
        "USER": config("DB_USER"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST", "localhost"),
        "PORT": config("DB_PORT", "5432"),
        "CONN_HEALTH_CHECKS": True,
    }
}

# Base location from which static files will be served (URL to refer to static files)
STATIC_URL = config("STATIC_URL", default="/static/")
STATIC_ROOT = config(
    "STATIC_ROOT", default="/staticfiles/"
)  # note not using BASE_DIR here

# Media files settings
MEDIA_URL = config("MEDIA_URL", default="/media/")
MEDIA_ROOT = config(
    "MEDIA_ROOT", default="/mediafiles/"
)  # note not using BASE_DIR here

# Security settings
# Security Headers

ALLOWED_HOSTS = config("ALLOWED_HOSTS", cast=Csv(), default=["127.0.0.1", "localhost"])

CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS", cast=Csv(), default=["127.0.0.1", "localhost"]
)

CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS", default=[], cast=Csv())

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"  # Clickjacking protection


# HTTPS Enforcement
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# HTTP Strict Transport Security (HSTS):
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
