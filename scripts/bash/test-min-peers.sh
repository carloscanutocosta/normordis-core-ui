#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"

# Corre a suite de testes e o build contra os mínimos de peerDependencies
# realmente anunciados no package.json, não contra as versões (mais
# recentes) usadas no dia-a-dia do desenvolvimento. Existe porque, em
# 2026-09, uma revisão pós-lançamento da 2.0.0 descobriu que o mínimo
# anunciado de react-day-picker (v9.0.0) não expõe os mesmos data-* que a
# v10.x usada em dev, e que o mínimo inicialmente escolhido para
# react-quill-new (3.8.0) nem sequer publica o CSS que o componente importa
# — ambos só foram detectados correndo a suite contra os mínimos exatos.
#
# A lista abaixo cobre os peers cujo código interno foi adaptado a uma API
# nova nesta ronda de upgrades (ver CHANGELOG.md, 2.0.0/2.0.1). Atualizar
# esta lista sempre que o código passar a depender de uma API mais recente
# de um peer aqui listado, ou sempre que um novo peer ganhar código
# version-specific.
#
# Uso: scripts/bash/test-min-peers.sh
#
# `pnpm add -D` reescreve package.json e pnpm-lock.yaml no disco — não é só
# node_modules que muda. Por isso este script faz backup dos dois antes de
# instalar os mínimos, e restaura-os sempre no fim (sucesso, falha, ou
# Ctrl+C), reinstalando a partir do lockfile restaurado. Um simples
# `pnpm install` a seguir ao `pnpm add -D` NÃO repõe nada — instalaria de
# novo exatamente os mínimos que acabaram de ser escritos no lockfile.

[[ -f package.json && -f pnpm-lock.yaml ]] || {
  printf 'Este script deve ser executado no repositório normordis-core-ui.\n' >&2
  exit 1
}

backup_dir="$(mktemp -d)"
cp package.json "$backup_dir/package.json"
cp pnpm-lock.yaml "$backup_dir/pnpm-lock.yaml"

restore() {
  local exit_code=$?
  printf '>>> [MIN-PEERS] A repor package.json/pnpm-lock.yaml e a reinstalar...\n'
  cp "$backup_dir/package.json" package.json
  cp "$backup_dir/pnpm-lock.yaml" pnpm-lock.yaml
  rm -rf "$backup_dir"
  pnpm install --frozen-lockfile >/dev/null 2>&1 || true
  exit "$exit_code"
}
trap restore EXIT

# peer -> versão mínima real e instalável (o mínimo anunciado em
# peerDependencies nem sempre existe como release exata no registry — usar
# sempre uma versão publicada que satisfaça esse mínimo).
declare -A MIN_PEERS=(
  [react]=18.2.0
  [react-dom]=18.2.0
  [recharts]=3.0.0
  [react-day-picker]=9.0.0
  [react-quill-new]=3.8.3
)

args=()
for peer in "${!MIN_PEERS[@]}"; do
  args+=("${peer}@${MIN_PEERS[$peer]}")
done

printf '>>> [MIN-PEERS] A instalar peers nos mínimos anunciados: %s\n' "${args[*]}"
pnpm add -D "${args[@]}"

printf '>>> [MIN-PEERS] Lint...\n'
pnpm run lint

printf '>>> [MIN-PEERS] Typecheck...\n'
pnpm run typecheck

printf '>>> [MIN-PEERS] Testes...\n'
pnpm run test

printf '>>> [MIN-PEERS] Build...\n'
pnpm run build

printf '>>> [MIN-PEERS] OK — suite completa passa contra os mínimos anunciados.\n'
