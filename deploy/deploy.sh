#!/usr/bin/env bash
# Zero-downtime deploy of origin/main using release folders:
#
#   /var/www/techno27/repo/                     git clone, only used to fetch
#   /var/www/techno27/shared/.env.production.local   secrets (chmod 600)
#   /var/www/techno27/releases/<time>-<sha>/    one folder per deploy, built in isolation
#   /var/www/techno27/current -> releases/...   what PM2 runs
#   /var/www/techno27-uploads/                  user uploads, shared by every release
#
# The live site keeps running from `current` while the new release builds. Only a successful build
# moves the link and reloads PM2 (one process at a time). A failed build changes nothing.
#
# Usage:   bash /var/www/techno27/repo/deploy/deploy.sh            deploy latest main
#          bash /var/www/techno27/repo/deploy/deploy.sh rollback   switch back to the previous release
set -euo pipefail

BASE=/var/www/techno27
UPLOADS=/var/www/techno27-uploads
KEEP=3   # releases to keep on disk (current + 2 to roll back to)

reload() {
  ln -sfn "$1" "$BASE/current"
  pm2 startOrReload "$BASE/current/deploy/ecosystem.config.cjs" --update-env
  pm2 save
  sleep 4
  curl -fsS -o /dev/null -w "Health check: HTTP %{http_code}\n" http://127.0.0.1:3000/ \
    || { echo "App did not respond on :3000 — check: pm2 logs techno27"; exit 1; }
}

if [[ "${1:-}" == "rollback" ]]; then
  now="$(readlink -f "$BASE/current")"
  prev="$(ls -1dt "$BASE"/releases/*/ | sed 's:/$::' | grep -vx "$now" | head -1)"
  [[ -n "$prev" ]] || { echo "No previous release to roll back to"; exit 1; }
  echo "==> Rolling back to $(basename "$prev")"
  reload "$prev"
  exit 0
fi

echo "==> Fetching main"
git -C "$BASE/repo" fetch --prune origin
# Keep repo/ (and so this script) current for the next run; git replaces files rather than editing in place,
# so the copy of this script already running is unaffected.
git -C "$BASE/repo" checkout -q main && git -C "$BASE/repo" reset -q --hard origin/main
SHA="$(git -C "$BASE/repo" rev-parse --short origin/main)"
REL="$BASE/releases/$(date +%Y%m%d-%H%M%S)-$SHA"
mkdir -p "$REL"
git -C "$BASE/repo" archive origin/main | tar -x -C "$REL"

# Shared secrets and uploads are links, so every release sees the same ones.
ln -s "$BASE/shared/.env.production.local" "$REL/.env.production.local"
rm -rf "$REL/public/uploads"
ln -s "$UPLOADS" "$REL/public/uploads"

echo "==> Installing dependencies in $(basename "$REL")"
cd "$REL"
npm ci --include=dev --no-audit --no-fund   # dev deps (TypeScript) are needed for the build

echo "==> Building"
# t3.large (8 GB): leaves room for the live app while the new build compiles.
NODE_OPTIONS="--max-old-space-size=4096" npm run build

echo "==> Switching to $SHA"
reload "$REL"

echo "==> Pruning old releases (keeping $KEEP)"
ls -1dt "$BASE"/releases/*/ | tail -n +$((KEEP + 1)) | xargs -r rm -rf
echo "Deployed $SHA"
