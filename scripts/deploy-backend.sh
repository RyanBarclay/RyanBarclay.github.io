#!/usr/bin/env bash
# Dispatches the backend deploy workflow and watches it to completion.
#
# The backend deploys from origin/master (CI checks out the repo), NOT
# your working tree — so this refuses to run until local master is
# pushed, preventing silent stale deploys.
set -euo pipefail

git fetch -q origin master
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/master)" ]; then
  echo "✗ HEAD != origin/master — commit & push first (the backend deploys from origin/master)"
  exit 1
fi

echo "Dispatching backend deploy workflow…"
gh workflow run deploy-backend.yml

# The run takes a moment to register; find it, then follow to completion.
RUN_ID=""
for _ in 1 2 3 4 5 6; do
  sleep 3
  RUN_ID=$(gh run list --workflow=deploy-backend.yml --limit 1 \
    --json databaseId,status --jq '.[0] | select(.status != "completed") | .databaseId' || true)
  [ -n "$RUN_ID" ] && break
done

if [ -z "$RUN_ID" ]; then
  echo "✗ couldn't find the dispatched run — check: gh run list --workflow=deploy-backend.yml"
  exit 1
fi

gh run watch "$RUN_ID" --exit-status
echo "✓ backend deployed"
