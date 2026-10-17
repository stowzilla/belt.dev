#!/usr/bin/env bash
set -euo pipefail

# Publishes build/ to S3.
#
# The per-route prerendered pages (docs/<topic>.html, docs.html, tutorial.html) are uploaded
# under their extensionless keys (docs/<topic>, docs, tutorial) as text/html, so CloudFront
# serves real content at /docs/<topic> instead of the SPA shell. Everything else is synced as-is.
#
# Usage: scripts/publish-site.sh <bucket>

BUCKET="${1:?usage: publish-site.sh <bucket>}"
BUILD_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/build"

aws s3 sync "$BUILD_DIR/" "s3://$BUCKET" --delete --quiet \
    --exclude "docs/*.html" --exclude "docs.html" --exclude "tutorial.html"

cd "$BUILD_DIR"
for file in docs/*.html docs.html tutorial.html; do
    aws s3 cp "$file" "s3://$BUCKET/${file%.html}" \
        --content-type "text/html; charset=utf-8" --cache-control "max-age=300" --quiet
done
