#!/bin/sh
set -e

DB_PATH="/app/data/database.sqlite"

if [ ! -f "$DB_PATH" ]; then
    mkdir -p "$(dirname "$DB_PATH")"
    touch "$DB_PATH"
    php /app/db/setup/setup.php
fi

exec "$@"