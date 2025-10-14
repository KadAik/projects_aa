#! /usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE ROLE psycho_app WITH LOGIN PASSWORD '${DB_PASSWORD}';
    GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO psycho_app;
EOSQL