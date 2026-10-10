#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.."

node --check tools/fff-current-basis-review-burden.mjs
node tools/fff-d3-cockpit.mjs
node --test tests/fff-d3-cockpit.test.mjs
# The positive current-basis test binds a historical host-local .serena hash.
# Keep that validator unchanged and run its independently portable negatives.
node --test --test-name-pattern='fails closed' tests/fff-current-basis-review-burden.test.mjs
git diff --check
echo 'FastFictionFactory Cloud development checks passed (D3 exact basis and current-basis negatives).'
echo 'Host-local current-basis positive validation requires the original protected .serena bytes; see docs/CODEX_CLOUD.md.'
