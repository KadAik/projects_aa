#!/bin/bash
set -e

echo "Initializing database..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create user if not exists
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER}') THEN
            CREATE ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASSWORD}';
            RAISE NOTICE 'Role ${DB_USER} created';
        ELSE
            RAISE NOTICE 'Role ${DB_USER} already exists';
        END IF;
    END \$\$;

    -- Create database if not exists
    SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
    
EOSQL

echo "Database initialized successfully."
echo "User '${DB_USER}' has access to database '${DB_NAME}'."