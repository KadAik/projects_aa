#!/bin/bash

# Configuration
CONTAINER_NAME=""
DB_NAME=""
DB_USER=""
BACKUP_DIR="./db-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup using pg_dump (recommended)
echo "Creating PostgreSQL backup..."
docker exec -t $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME -F c > $BACKUP_DIR/${DB_NAME}_${DATE}.dump

# Optional: Backup the entire volume as well -- The db container should be stopped before running this.
echo "Creating volume backup..."
docker run --rm -v db-data:/source -v $BACKUP_DIR:/backup alpine tar czf /backup/db-data-volume_${DATE}.tar.gz -C /source .

echo "Backup completed:"
echo "- Database: $BACKUP_DIR/${DB_NAME}_${DATE}.dump"
echo "- Volume: $BACKUP_DIR/db-data-volume_${DATE}.tar.gz"

# Optional: Clean up old backups (keep last 30 days)
# find $BACKUP_DIR -name "*.dump" -mtime +30 -delete
# find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete