#!/bin/bash
# deploy.sh — Build and deploy CBSE CS Hub to GitHub Pages (gh-pages branch)
# Usage: bash deploy.sh

set -e  # Exit on any error

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$REPO_ROOT/cbse-cs-hub"
DIST_DIR="$APP_DIR/dist/cbse-cs-hub/browser"
CURRENT_BRANCH=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)

echo ""
echo "================================================"
echo "  CBSE CS Hub — Deploy to GitHub Pages"
echo "================================================"
echo "  Source branch : $CURRENT_BRANCH"
echo "  Target branch : gh-pages"
echo ""

# ── Step 1: Production build ──────────────────────────────────────────────────
echo "▶  Building production bundle..."
cd "$APP_DIR"
node node_modules/@angular/cli/bin/ng build --configuration production
echo "✔  Build complete."
echo ""

# ── Step 2: Switch to gh-pages branch ────────────────────────────────────────
echo "▶  Switching to gh-pages branch..."
cd "$REPO_ROOT"
git checkout gh-pages
git rm -rf . --quiet
echo "✔  Cleaned gh-pages branch."
echo ""

# ── Step 3: Copy build output ─────────────────────────────────────────────────
echo "▶  Copying built files..."
cp -r "$DIST_DIR"/. .
touch .nojekyll
echo "✔  Files copied."
echo ""

# ── Step 4: Commit and push ───────────────────────────────────────────────────
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
echo "▶  Committing and pushing..."
git add -A
git commit -m "Deploy: $TIMESTAMP (from $CURRENT_BRANCH)"
git push origin gh-pages --force
echo "✔  Pushed to gh-pages."
echo ""

# ── Step 5: Switch back ───────────────────────────────────────────────────────
git checkout "$CURRENT_BRANCH"
echo ""
echo "================================================"
echo "  ✅ Deployment complete!"
echo "  🌐 https://sumit-sharma77.github.io/CBSE_CS_HUB/"
echo "================================================"
echo ""
