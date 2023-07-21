#!/bin/sh
set -e

# Check if the database is up and running.
if [ "$DATABASE_URL" ]; then
  echo "Waiting for the database to be ready..."
  until timeout 5 bash -c "echo > /dev/tcp/$DATABASE_HOST/$DATABASE_PORT"; do
    sleep 1
  done
fi

# Run migrations if necessary.
if [ "$RAILS_ENV" = "production" ]; then
  echo "Running migrations..."
  bundle exec rails db:migrate
else
  echo "Skipping migrations in non-production environment..."
fi

# Then exec the container's main command (what's set as CMD in the Dockerfile).
exec "$@"