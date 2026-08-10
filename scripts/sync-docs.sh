#!/usr/bin/env bash
set -euo pipefail

# Syncs belt gem docs (lib/belt/docs/*.md) into belt.dev for static site generation.
# Called automatically during build via the "prebuild" npm script.
#
# The belt gem source is expected at $BELT_GEM_PATH or ../belt relative to this repo.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_DEST="$PROJECT_ROOT/src/docs"

# Resolve belt gem path
BELT_GEM_PATH="${BELT_GEM_PATH:-$(cd "$PROJECT_ROOT/../belt" 2>/dev/null && pwd || echo "")}"

if [ -z "$BELT_GEM_PATH" ] || [ ! -d "$BELT_GEM_PATH/lib/belt/docs" ]; then
  echo "⚠️  Belt gem not found at $BELT_GEM_PATH — using existing docs (if any)"
  if [ -d "$DOCS_DEST" ] && [ "$(ls -A "$DOCS_DEST"/*.md 2>/dev/null)" ]; then
    echo "   Found existing docs in src/docs/, proceeding with those."
    exit 0
  else
    echo "❌ No docs available. Set BELT_GEM_PATH or clone belt adjacent to belt.dev."
    exit 1
  fi
fi

# Sync markdown files
mkdir -p "$DOCS_DEST"
cp "$BELT_GEM_PATH/lib/belt/docs/"*.md "$DOCS_DEST/"

echo "✅ Synced $(ls "$DOCS_DEST"/*.md | wc -l | tr -d ' ') doc files from $BELT_GEM_PATH/lib/belt/docs/"

# Rebuild search index from synced docs
echo "🔍 Rebuilding search index..."
node "$PROJECT_ROOT/src/search/build-index.js"
