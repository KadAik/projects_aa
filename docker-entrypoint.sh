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
python manage.py createsuperuser --username "${DJANGO_SUPERUSER_USERNAME}" --email "${DJANGO_SUPERUSER_EMAIL}" --password "${DJANGO_SUPERUSER_PASSWORD}" --noinput || echo "Superuser already exists, skipping..."

# Get qcluster up and running for background tasks
echo "Starting Django Q cluster..."
python manage.py qcluster &

# Start the server (the CMD command from the Dockerfile)
echo "Starting server..."
exec "$@"
