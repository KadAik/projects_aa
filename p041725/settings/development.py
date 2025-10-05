from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-h0z$5-+(=x@&s-#xo!2qyi1*$fl0tcq+6-@+v4f+7d1q+$+n&5'

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']
CORS_ORIGIN_ALLOW_ALL = True

INSTALLED_APPS += ['debug_toolbar']

MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")

# The Debug Toolbar is shown only if the IP address is listed in Django’s INTERNAL_IPS setting
INTERNAL_IPS = ['127.0.0.1']
