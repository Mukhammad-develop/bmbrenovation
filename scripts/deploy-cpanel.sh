#!/bin/bash
# Auto-deploy for the cPanel Node.js app (unlimitedwebhosting / CloudLinux Passenger).
# Pulls the latest commit, rebuilds the site, restarts the app.
# Runs from cron every 15 min; exits instantly when there is nothing new.
# Log: /home/bmbrenov/autoblog-deploy.log
set -e

# CloudLinux LVE limits threads/processes — keep everything single-threaded.
export UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1

VENV=/home/bmbrenov/nodevenv/public_html/nextjs_space/22
source "$VENV/bin/activate"

cd /home/bmbrenov/public_html
before=$(git rev-parse HEAD)
git pull --ff-only -q
after=$(git rev-parse HEAD)

if [ "$before" = "$after" ]; then
  exit 0
fi

cd nextjs_space

# Only reinstall when package files changed (npm ci is slow on shared hosting).
# --ignore-scripts: postinstall scripts crash under the LVE thread limit.
CHANGED=$(git diff --name-only "$before" "$after")
if echo "$CHANGED" | grep -qE 'package(-lock)?\.json'; then
  npm ci --ignore-scripts --legacy-peer-deps --include=dev
fi

# Native SWC spawns threads the LVE limit blocks — force the WASM build of SWC.
rm -rf node_modules/@next/swc-linux-x64-gnu node_modules/@next/swc-linux-x64-musl

npm run build

mkdir -p tmp
touch tmp/restart.txt
echo "deployed $after"
