#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.."

if [[ "$(uname -s)" != Linux ]]; then
  echo 'Cloud setup requires Linux; use bash scripts/codex/check.sh for local checks.' >&2
  exit 2
fi
node -e 'if (Number(process.versions.node.split(".")[0]) < 22) throw new Error("Node.js 22 or newer is required")'
# These tools use Node.js built-ins. There is no npm dependency installation.
bash scripts/codex/check.sh
