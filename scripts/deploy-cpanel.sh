#!/bin/bash
# Auto-deploy for the cPanel Node.js app (unlimitedwebhosting / CloudLinux Passenger).
# The site is BUILT IN GITHUB ACTIONS and the finished .next output is committed
# to the repo — this script just pulls it and restarts the app. The server never
# builds (CloudLinux thread/memory limits make Next.js builds fail there).
# Runs from cron every 15 min; exits instantly when there is nothing new.
# Log: /home/bmbrenov/autoblog-deploy.log
set -e

cd /home/bmbrenov/public_html
before=$(git rev-parse HEAD)
git pull --ff-only -q
after=$(git rev-parse HEAD)

if [ "$before" = "$after" ]; then
  exit 0
fi

# Runtime dependencies only change when package files do (rare).
cd nextjs_space
CHANGED=$(git diff --name-only "$before" "$after")
if echo "$CHANGED" | grep -qE 'package(-lock)?\.json'; then
  export UV_THREADPOOL_SIZE=1 RAYON_NUM_THREADS=1
  VENV=/home/bmbrenov/nodevenv/public_html/nextjs_space/22
  source "$VENV/bin/activate"
  npm ci --ignore-scripts --legacy-peer-deps --omit=dev
fi

# Restart the Passenger app.
mkdir -p tmp
touch tmp/restart.txt
echo "deployed $after"
