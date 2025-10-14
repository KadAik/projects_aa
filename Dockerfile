# Base image : this is python official image
FROM python:3.12-slim

# Set a directory for the app
WORKDIR /usr/src/app

# Copy requirements.txt first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files into the container
COPY . .

# Network port the container will listen on
EXPOSE 8000

# Make entrypoint script executable
RUN chmod +x /usr/src/app/docker-entrypoint.sh

ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]

# Default command to run the application (will be used or overridden by entrypoint script)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "p041725.asgi:application"]