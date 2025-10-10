#!/bin/sh

# Entrypoint script for the Docker container

set -e # Exit immediately if a command exits with a non-zero status (exit on error)

# Collect static files (.env is only supplied at runtime, so we do this here)
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the server
echo "Starting server..."
exec "$@"