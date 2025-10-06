import os
from decouple import config
from .base import *

DEBUG = False

SECRET_KEY = config('DJANGO_SECRET_KEY')

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=list, default=['localhost'])
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', cast=list, default=['localhost'])

# Production database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST', 'localhost'),
        'PORT': config('DB_PORT', '5432'),
        'CONN_HEALTH_CHECKS': True
    }
}
