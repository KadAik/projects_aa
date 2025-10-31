#!/bin/bash

# Exit immediately if any command fails
set -e

# Wait for the database to be ready before continuing
echo "Waiting for the database to be ready..."
MAX_RETRIES=10
COUNTER=0
until python manage.py check_db; do
  COUNTER=$((COUNTER+1))
  if [ $COUNTER -ge $MAX_RETRIES ]; then
    echo "Database not ready after $MAX_RETRIES attempts. Exiting..."
    exit 1
  fi
  echo "Database not ready yet... retrying ($COUNTER/$MAX_RETRIES)"
  sleep 2
done


# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Apply migrations
echo "Applying database migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Create default superuser if it doesn't exist
echo "Creating default superuser if it doesn't exist..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="${DJANGO_SUPERUSER_USERNAME}").exists():
    User.objects.create_superuser(
        username="${DJANGO_SUPERUSER_USERNAME}",
        email="${DJANGO_SUPERUSER_EMAIL}",
        password="${DJANGO_SUPERUSER_PASSWORD}",
    )
    print("Superuser created.")
else:
    print("Superuser already exists, skipping...")
EOF

# Create default superuser if it doesn't exist
echo "Creating HR Manager group with required defaults permissions..."
python manage.py create_hr_manager_group

# Get qcluster up and running for background tasks
echo "Starting Django Q cluster..."
python manage.py qcluster &

# Start the server (the CMD command from the Dockerfile)
echo "Starting server..."
exec "$@"
