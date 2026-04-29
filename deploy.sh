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

# ── Step 1.5: Strip admin-only chunks from dist ───────────────────────────────
# The /admin route is blocked by isDevMode() at runtime, but we also remove the
# lazy JS chunks entirely so no admin code ships to GitHub Pages.
echo "▶  Stripping admin chunks from dist..."
ADMIN_CHUNKS=()
for f in "$DIST_DIR"/*.js; do
  if grep -qF "AdminShellComponent" "$f" 2>/dev/null; then
    ADMIN_CHUNKS+=("$(basename "$f")")
    rm "$f"
    echo "  Removed: $(basename "$f")"
  fi
done

if [ ${#ADMIN_CHUNKS[@]} -gt 0 ]; then
  # Patch ngsw.json so the service worker does not reference deleted chunk files
  if [ -f "$DIST_DIR/ngsw.json" ]; then
    node -e "
      const fs = require('fs');
      const swPath = process.argv[1];
      const removed = process.argv.slice(2);
      const sw = JSON.parse(fs.readFileSync(swPath, 'utf8'));
      for (const g of sw.assetGroups || []) {
        g.urls = (g.urls || []).filter(u => !removed.some(c => u.includes(c)));
      }
      const ht = sw.hashTable || {};
      for (const key of Object.keys(ht)) {
        if (removed.some(c => key.includes(c))) delete ht[key];
      }
      fs.writeFileSync(swPath, JSON.stringify(sw, null, 2));
    " "$DIST_DIR/ngsw.json" "${ADMIN_CHUNKS[@]}"
    echo "  Patched ngsw.json"
  fi
  echo "✔  Admin chunks stripped (${#ADMIN_CHUNKS[@]} file(s))."
else
  echo "✔  No admin chunks found — nothing to strip."
fi
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
