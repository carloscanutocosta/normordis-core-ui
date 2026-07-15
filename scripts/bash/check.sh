#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

skip_build=false
case "${1:-}" in
  --skip-build) skip_build=true; shift ;;
  -h|--help) printf 'Uso: check.sh [--skip-build]\n'; exit 0 ;;
esac
if (($#)); then
  printf 'Opção desconhecida: %s\n' "$1" >&2
  exit 2
fi

[[ -f package.json && -f pnpm-lock.yaml ]] || {
  printf 'Este script deve ser executado no repositório normordis-core-ui.\n' >&2
  exit 1
}

printf '>>> [CHECK] Higiene do repositório...\n'
bash tools/repo/check-hygiene.sh
printf '>>> [CHECK] Documentação...\n'
bash tools/docs/check-docs.sh
printf '>>> [CHECK] Lint...\n'
pnpm run lint
printf '>>> [CHECK] Typecheck...\n'
pnpm run typecheck

if ! $skip_build; then
  printf '>>> [CHECK] Build...\n'
  pnpm run build
fi

printf '>>> [CHECK] Concluído com sucesso.\n'
