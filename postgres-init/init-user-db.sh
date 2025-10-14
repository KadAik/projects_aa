#! /bin/bash

set -e

echo "Initializing database..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE ROLE psycho_app WITH LOGIN PASSWORD '${DB_PASSWORD}';
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO psycho_app;
EOSQL

echo "Database initialized."
echo "User psycho_app created with access to database $POSTGRES_DB."