#!/usr/bin/env bash
set -e

echo "Initializing database..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create the db user if not exists
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${DB_USER:-psycho_app}') THEN
            CREATE ROLE ${DB_USER:-psycho_app} WITH LOGIN PASSWORD '${DB_PASSWORD}';
            RAISE NOTICE 'Role ${DB_USER:-psycho_app} created';
        ELSE
            RAISE NOTICE 'Role ${DB_USER:-psycho_app} already exists';
        END IF;
    END \$\$;

    -- Create database if not exists
    SELECT 'CREATE DATABASE ${DB_NAME:-psycho_db} OWNER ${DB_USER:-psycho_app}'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME:-psycho_db}')\gexec

    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME:-psycho_db} TO ${DB_USER:-psycho_app};

EOSQL

echo "Database initialized successfully."
echo "User '${DB_USER:-psycho_app}' has access to database '${DB_NAME:-psycho_db}'."