#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

skip_install=false
skip_lint=false
skip_typecheck=false

usage() {
  cat <<'EOF'
Uso: build-debug.sh [--skip-install] [--skip-lint] [--skip-typecheck]
EOF
}

while (($#)); do
  case "$1" in
    --skip-install) skip_install=true ;;
    --skip-lint) skip_lint=true ;;
    --skip-typecheck) skip_typecheck=true ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Opção desconhecida: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

[[ -f package.json && -f pnpm-lock.yaml ]] || {
  printf 'Este script deve ser executado no repositório normordis-core-ui.\n' >&2
  exit 1
}

mkdir -p .logs
log_file=".logs/build-debug-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$log_file") 2>&1

printf '>>> [DEBUG BUILD] normordis-core-ui\n    Log: %s\n' "$log_file"

$skip_install || { printf '>>> 1. A sincronizar dependências...\n'; pnpm install --frozen-lockfile; }
$skip_lint || { printf '>>> 2. A correr lint...\n'; pnpm run lint; }
$skip_typecheck || { printf '>>> 3. A correr typecheck...\n'; pnpm run typecheck; }

printf '>>> 4. A construir biblioteca em modo development...\n'
pnpm exec vite build --mode development
printf '\nDEBUG BUILD CONCLUÍDO\nArtefactos: %s/dist\n' "$repo_root"
