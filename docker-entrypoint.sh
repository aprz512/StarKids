#!/bin/sh
set -e

echo "Syncing database schema..."
npx prisma db push --accept-data-loss --skip-generate

echo "Running seed (non-fatal if fails)..."
npx tsx prisma/seed.ts || echo "Seed skipped"

echo "Starting StarKids..."
exec "$@"
