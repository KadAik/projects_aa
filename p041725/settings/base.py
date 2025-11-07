"""
Django shared settings for p041725 project.
"""

import os
from pathlib import Path
from decouple import config
from corsheaders.defaults import default_headers

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Application definition

INSTALLED_APPS = [
    "corsheaders",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Psycho app
    "psycho.apps.PsychoConfig",
    # Phone number field
    "phonenumber_field",
    # Django REST framework
    "rest_framework",
    "simple_history",
    "django_q",
    "rest_framework.authtoken",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "simple_history.middleware.HistoryRequestMiddleware",
]

ROOT_URLCONF = "p041725.urls"

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

WSGI_APPLICATION = "p041725.wsgi.application"

# Database (dev)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": config("DB_NAME", default="psycho_db"),
        "USER": config("DB_USER", default="psycho_app"),
        "PASSWORD": config("DB_PASSWORD"),
        "HOST": config("DB_HOST", default="localhost"),
        "PORT": config("DB_PORT", default="5432"),
    }
}

# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

# The absolute path to the directory where collectstatic will collect static files for deployment.
STATIC_ROOT_ = BASE_DIR / "staticfiles"
STATIC_ROOT = config("STATIC_ROOT", default=STATIC_ROOT_)

# The URL to use when referring to static files (where they will be served from)
STATIC_URL_ = "/static/"
STATIC_URL = config("STATIC_URL", default=STATIC_URL_)

# Media files (User uploaded files)
# The absolute path to the directory where media files are stored.
MEDIA_ROOT_ = BASE_DIR / "media"
MEDIA_ROOT = config("MEDIA_ROOT", default=MEDIA_ROOT_)

# The URL to use when referring to media files (where they will be served from)
MEDIA_URL_ = "/media/"
MEDIA_URL = config("MEDIA_URL", default=MEDIA_URL_)

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Custom USER model
AUTH_USER_MODEL = "psycho.User"

# For DRF API settings
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
        # 'rest_framework_xml.renderers.XMLRenderer',  # requires djangorestframework-xml
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 3,
}

# Email settings
DEFAULT_FROM_EMAIL = config(
    "DEFAULT_FROM_EMAIL", default="noreply@psycho-tests.emaa.mil.bj"
)
EMAIL_BACKEND = config(
    "EMAIL_BACKEND", default="django.core.mail.backends.smtp.EmailBackend"
)
EMAIL_HOST = config("EMAIL_HOST", default="behanzin.001.africa")
EMAIL_PORT = config("EMAIL_PORT", default=465, cast=int)
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=False, cast=bool)
EMAIL_USE_SSL = config("EMAIL_USE_SSL", default=False, cast=bool)
EMAIL_HOST_USER = config(
    "EMAIL_HOST_USER", default="noreply@psycho-tests.emaa.defense.bj"
)
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="********")


# Site URL
SITE_URL = config("SITE_URL", default="http://localhost:8000")
LOGIN_URL = "/admin/login/"  # Use Django admin's login page

# Django Q settings
Q_CLUSTER = {
    "name": "PsychoTestsCluster",
    "workers": 4,
    "recycle": 500,
    "timeout": 120,
    "retry": 150,
    "max_attempts": 10,
    "compress": False,
    "save_limit": 250,
    "queue_limit": 10,
    "cpu_affinity": 1,
    "label": "Django Q",
    "redis": {
        "host": config("REDIS_HOST", default="127.0.0.1"),
        "port": config("REDIS_PORT", default=6379, cast=int),
        "db": config("REDIS_DB", default=0, cast=int),
    },
}

# File handler settings
FILE_UPLOAD_MAX_MEMORY_SIZE = (
    0.5 * 1024 * 1024
)  # 0.5 MB (typically forces files larger than this to be streamed to disk)

CORS_ALLOW_HEADERS = list(default_headers) + [
    "x-caller-secret",
]

LOG_DIR = config("LOG_DIR", default="/var/log/django/")

# Safe LOG_DIR directory creation
try:
    os.makedirs(LOG_DIR, exist_ok=True)
    print(f"Log directory created/verified: {LOG_DIR}")
except PermissionError:
    print(f"Permission denied creating log directory: {LOG_DIR}")
    # Fallback to project directory
    LOG_DIR = BASE_DIR / "logs"
    os.makedirs(LOG_DIR, exist_ok=True)
    print(f"Using fallback log directory: {LOG_DIR}")
except Exception as e:
    print(f"Error creating log directory: {e}")
    # Ultimate fallback
    LOG_DIR = "/tmp"
    print(f"Using temp directory for logs: {LOG_DIR}")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
    "filters": {
        "require_debug_false": {
            "()": "django.utils.log.RequireDebugFalse",
        },
        "require_debug_true": {
            "()": "django.utils.log.RequireDebugTrue",
        },
    },
    "handlers": {
        "console": {
            "level": "INFO",
            "filters": ["require_debug_true"],
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        "file": {
            "level": "ERROR",
            "class": "logging.FileHandler",
            "filename": os.path.join(
                LOG_DIR, "errors.log"
            ),  # log dir is created in base
            "formatter": "verbose",
        },
        "mail_admins": {
            "level": "ERROR",
            "filters": ["require_debug_false"],
            "class": "django.utils.log.AdminEmailHandler",
            "include_html": True,
        },
        "file_client_errors": {
            "level": "ERROR",
            "class": "logging.FileHandler",
            "filename": os.path.join(LOG_DIR, "client_errors.log"),
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file", "mail_admins"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["file", "mail_admins"],
            "level": "ERROR",
            "propagate": False,
        },
        "psycho-backend": {
            "handlers": ["console", "file", "mail_admins"],
            "level": "ERROR",
        },
        "client_errors": {
            "handlers": ["file_client_errors", "mail_admins"],
            "level": "ERROR",
            "propagate": False,
        },
    },
}
