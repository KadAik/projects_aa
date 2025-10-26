import os
from decouple import config
from decouple import Csv
from .base import *

DEBUG = False

SECRET_KEY = config("DJANGO_SECRET_KEY")

ALLOWED_HOSTS = config("ALLOWED_HOSTS", cast=Csv(), default=["127.0.0.1", "localhost"])

CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS", cast=Csv(), default=["127.0.0.1", "localhost"]
)

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
MEDIA_ROOT = config("MEDIA_ROOT", default="/media/")  # note not using BASE_DIR here
