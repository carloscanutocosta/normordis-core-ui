#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

skip_install=false
no_pack=false
pack_destination="${TMPDIR:-/tmp}/normordis-releases"

usage() {
  cat <<'EOF'
Uso: build-release.sh [--skip-install] [--no-pack] [--pack-destination PASTA]
EOF
}

while (($#)); do
  case "$1" in
    --skip-install) skip_install=true ;;
    --no-pack) no_pack=true ;;
    --pack-destination)
      (($# >= 2)) || { printf 'Falta a pasta após --pack-destination.\n' >&2; exit 2; }
      pack_destination=$2
      shift
      ;;
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
log_file=".logs/build-release-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$log_file") 2>&1

printf '>>> [RELEASE] normordis-core-ui\n    Log: %s\n' "$log_file"
$skip_install || { printf '>>> 1. A sincronizar dependências...\n'; pnpm install --frozen-lockfile; }
printf '>>> 2. A verificar higiene e documentação...\n'
bash tools/repo/check-hygiene.sh --quiet
bash tools/docs/check-docs.sh --quiet
printf '>>> 3. A correr lint...\n'
pnpm run lint
printf '>>> 4. A correr typecheck...\n'
pnpm run typecheck
printf '>>> 5. A verificar barrel...\n'
node scripts/check-exports.mjs
node scripts/check-missing-exports.mjs
printf '>>> 6. A construir biblioteca SDK...\n'
pnpm run build

if ! $no_pack; then
  printf '>>> 7. A validar pacote...\n'
  bash tools/package/inspect-pack.sh "$pack_destination"
else
  printf '>>> 7. Empacotamento ignorado (--no-pack).\n'
fi

printf '\nRELEASE CONCLUÍDA\nArtefactos: %s/dist\n' "$repo_root"
if ! $no_pack; then printf 'Pacote: %s\n' "$pack_destination"; fi
