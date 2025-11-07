import os
from .base import *
from decouple import Csv

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
    default="django-insecure-h0z$5-+(=x@&s-#xo!2qyi1*$fl0tcq+6-@+v4f+7d1q+$+n&5",
)

ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="*", cast=Csv())
CORS_ALLOWED_ORIGINS = config("CORS_ALLOWED_ORIGINS", default="*", cast=Csv())
CSRF_TRUSTED_ORIGINS = config("CSRF_TRUSTED_ORIGINS", cast=Csv(), default="*")

INSTALLED_APPS += ["debug_toolbar"]

MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")

# The Debug Toolbar is shown only if the IP address is listed in Django’s INTERNAL_IPS setting
INTERNAL_IPS = ["127.0.0.1"]

# Cookie security for development (allow HTTP)
SESSION_COOKIE_SECURE = config("SESSION_COOKIE_SECURE", default=False, cast=bool)
CSRF_COOKIE_SECURE = config("CSRF_COOKIE_SECURE", default=False, cast=bool)

CORS_ALLOW_CREDENTIALS = config("CORS_ALLOW_CREDENTIALS", default=False, cast=bool)
