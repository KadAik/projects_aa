# Base image : this is python official image
FROM python:3.12-slim

# Set a directory for the app
WORKDIR /usr/src/app

# Copy all the files to the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Network port the container will listen on
EXPOSE 8000

# Set environment variables
ENV DJANGO_SETTINGS_MODULE=p041725.settings.production

# Launching the application (CMD execute the container : CMD is to tell the container which command it should run when it is started)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "p041725.asgi:application"]