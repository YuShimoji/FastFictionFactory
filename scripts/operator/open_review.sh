#!/usr/bin/env sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$script_dir/../.." && pwd)

mode=brief
mode_was_set=false
print_uri=false
docs=false

fail() {
  printf 'open_review.sh: %s\n' "$1" >&2
  exit 2
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --docs)
      docs=true
      shift
      ;;
    --mode)
      [ "$#" -ge 2 ] || fail "--mode requires a value"
      mode=$2
      mode_was_set=true
      shift 2
      ;;
    --mode=*)
      mode=${1#--mode=}
      mode_was_set=true
      shift
      ;;
    --print-uri)
      print_uri=true
      shift
      ;;
    *)
      fail "unknown option: $1"
      ;;
  esac
done

if [ "$docs" = true ]; then
  if [ "$mode_was_set" = true ] || [ "$print_uri" = true ]; then
    fail "--docs cannot be combined with --mode or --print-uri"
  fi
  cd "$repo_root"
  if command -v uvx >/dev/null 2>&1; then
    exec uvx --with mkdocs-material mkdocs serve -a 127.0.0.1:8000
  fi
  if command -v python3 >/dev/null 2>&1; then
    exec python3 -m mkdocs serve -a 127.0.0.1:8000
  fi
  if command -v python >/dev/null 2>&1; then
    exec python -m mkdocs serve -a 127.0.0.1:8000
  fi
  fail "docs mode requires uvx or a Python installation with MkDocs"
fi

review_path="$repo_root/public/review/index.html"

case "$mode" in
  brief|home|layout-lab|bridge|handoff|revision|derivative|story|designer|draft|source|project|artifacts)
    ;;
  *)
    fail "unknown or unsafe mode: $mode"
    ;;
esac

encode_uri_path() {
  printf '%s' "$1" | sed \
    -e 's/%/%25/g' \
    -e 's/ /%20/g' \
    -e 's/#/%23/g' \
    -e 's/?/%3F/g'
}

if command -v cygpath >/dev/null 2>&1; then
  uri_path=$(cygpath -m "$review_path")
  review_uri="file:///$(encode_uri_path "$uri_path")?mode=$mode"
else
  review_uri="file://$(encode_uri_path "$review_path")?mode=$mode"
fi

if [ "$print_uri" = true ]; then
  printf '%s\n' "$review_uri"
  exit 0
fi

if command -v xdg-open >/dev/null 2>&1; then
  exec xdg-open "$review_uri"
fi

if command -v open >/dev/null 2>&1; then
  exec open "$review_uri"
fi

if command -v cygpath >/dev/null 2>&1 && command -v powershell.exe >/dev/null 2>&1; then
  exec powershell.exe -NoProfile -Command 'Start-Process -FilePath $args[0]' "$review_uri"
fi

printf 'Open this URI: %s\n' "$review_uri"
