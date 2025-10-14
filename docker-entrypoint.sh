#!/bin/sh

# Exit immediately if any command fails
set -e

# Wait for the database to be ready before continuing
MAX_RETRIES=30
COUNTER=0
until python manage.py check_db 2>/dev/null; do
  COUNTER=$((COUNTER+1))
  if [ $COUNTER -ge $MAX_RETRIES ]; then
    echo "Database not ready after $MAX_RETRIES attempts. Exiting."
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

# Start the server (the CMD command from the Dockerfile)
echo "Starting server..."
exec "$@"
