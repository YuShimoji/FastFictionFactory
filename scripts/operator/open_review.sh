#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/../.." && pwd)

if [ "${1:-}" = "--docs" ]; then
  cd "$repo_root"
  exec python -m mkdocs serve -a 127.0.0.1:8000
fi

review_path="$repo_root/public/review/index.html"

if command -v xdg-open >/dev/null 2>&1; then
  exec xdg-open "$review_path"
fi

if command -v open >/dev/null 2>&1; then
  exec open "$review_path"
fi

if command -v cygpath >/dev/null 2>&1 && command -v powershell.exe >/dev/null 2>&1; then
  windows_path=$(cygpath -w "$review_path")
  exec powershell.exe -NoProfile -Command "Invoke-Item -LiteralPath '$windows_path'"
fi

printf 'Open this file: %s\n' "$review_path"
