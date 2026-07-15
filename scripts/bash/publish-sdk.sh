#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

token="${GITHUB_TOKEN:-}"
skip_build=false
dry_run=false

usage() {
  cat <<'EOF'
Uso: publish-sdk.sh [--token TOKEN] [--skip-build] [--dry-run]

É preferível definir GITHUB_TOKEN no ambiente em vez de o passar na linha de comandos.
EOF
}

while (($#)); do
  case "$1" in
    -t|--token)
      (($# >= 2)) || { printf 'Falta o valor de --token.\n' >&2; exit 2; }
      token=$2
      shift
      ;;
    --skip-build) skip_build=true ;;
    --dry-run) dry_run=true ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Opção desconhecida: %s\n' "$1" >&2; usage >&2; exit 2 ;;
  esac
  shift
done

if [[ -z "$token" || "$token" == dev-placeholder ]]; then
  printf '[ERRO] GITHUB_TOKEN não está definido. Consulta docs/PUBLISHING.md.\n' >&2
  exit 1
fi

read -r package_name package_version < <(
  node -e "const p=require('./package.json'); console.log(p.name+' '+p.version)"
)
printf '>>> Publicar %s@%s no GitHub Packages\n' "$package_name" "$package_version"

if ! $skip_build; then
  printf '>>> 1. A construir SDK...\n'
  pnpm run build
else
  printf '>>> 1. Build ignorado (--skip-build).\n'
fi

printf '>>> 2. A verificar barrel...\n'
node scripts/check-exports.mjs

if $dry_run; then
  printf '>>> [DRY RUN] Nenhum pacote será enviado.\n'
  pnpm pack --dry-run
  exit 0
fi

temp_npmrc="$(mktemp "${TMPDIR:-/tmp}/normordis-npmrc.XXXXXX")"
cleanup() { rm -f "$temp_npmrc"; }
trap cleanup EXIT
chmod 600 "$temp_npmrc"
printf '@carloscanutocosta:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\n' "$token" > "$temp_npmrc"

printf '>>> 3. A publicar...\n'
NPM_CONFIG_USERCONFIG="$temp_npmrc" pnpm publish --no-git-checks
printf '\n%s@%s publicado com sucesso.\n' "$package_name" "$package_version"
