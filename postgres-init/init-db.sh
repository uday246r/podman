#!/bin/bash
set -e

echo "Initializing microservice databases..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE "authService";
    CREATE DATABASE "asset_management_db";
    CREATE DATABASE "HelpdeskDB";
    CREATE DATABASE "inventorydb";
EOSQL

echo "Microservice databases initialized successfully!"
