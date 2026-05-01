#!/usr/bin/env bash
set -euo pipefail

PORT="${1:-8000}"
cd "$(dirname "$0")"

echo "Serving $(pwd) at http://localhost:${PORT}"
echo "Press Ctrl+C to stop."

if command -v python3 >/dev/null 2>&1; then
  exec python3 -m http.server "${PORT}"
elif command -v python >/dev/null 2>&1; then
  exec python -m SimpleHTTPServer "${PORT}"
else
  echo "Error: python3 (or python) not found in PATH." >&2
  exit 1
fi
