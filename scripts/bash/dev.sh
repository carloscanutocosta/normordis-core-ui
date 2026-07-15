#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

export GITHUB_TOKEN="${GITHUB_TOKEN:-dev-placeholder}"
printf '>>> normordis-core-ui — Playground\n    http://localhost:5173\n    Usa --open num ambiente desktop.\n    Ctrl+C para terminar\n\n'
exec pnpm dev "$@"
