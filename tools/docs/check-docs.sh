#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"
quiet=false
[[ "${1:-}" == --quiet ]] && quiet=true
$quiet || printf '>>> [TOOL docs] A verificar documentação obrigatória...\n'

errors=0
for file in README.md docs/MAN.md DESIGN.md CHANGELOG.md LICENSE AGENTS.md SECURITY.md \
  security/README.md security/DEPENDENCY_POLICY.md security/PROVENANCE_POLICY.md; do
  if [[ ! -f "$file" ]]; then
    printf '  [ERRO] Documento obrigatório em falta: %s\n' "$file" >&2
    errors=$((errors + 1))
  elif [[ ! -s "$file" ]]; then
    printf '  [ERRO] Documento vazio: %s\n' "$file" >&2
    errors=$((errors + 1))
  fi
done

rg -q 'pnpm run build' README.md || { printf '  [ERRO] README.md deve documentar pnpm run build.\n' >&2; errors=$((errors + 1)); }
rg -q '@normordis/core-ui/styles.css' docs/MAN.md || { printf '  [ERRO] docs/MAN.md deve documentar o CSS público.\n' >&2; errors=$((errors + 1)); }
((errors == 0)) || exit 1
$quiet || printf '>>> [TOOL docs] OK.\n'
