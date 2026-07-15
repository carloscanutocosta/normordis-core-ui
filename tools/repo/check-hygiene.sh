#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"
quiet=false
[[ "${1:-}" == --quiet ]] && quiet=true

$quiet || printf '>>> [TOOL repo] A verificar higiene do repositório...\n'
errors=0
warnings=0

error() { printf '  [ERRO] %s\n' "$*" >&2; errors=$((errors + 1)); }
warning() { printf '  [AVISO] %s\n' "$*" >&2; warnings=$((warnings + 1)); }

for file in package.json pnpm-lock.yaml .nvmrc .node-version src/index.ts; do
  [[ -f "$file" ]] || error "Ficheiro obrigatório em falta: $file"
done
for lockfile in package-lock.json npm-shrinkwrap.json yarn.lock; do
  [[ ! -e "$lockfile" ]] || error "Lockfile indevido encontrado: $lockfile."
done

if [[ -f .nvmrc && -f .node-version ]]; then
  nvm_version="$(tr -d '[:space:]' < .nvmrc)"
  node_version="$(tr -d '[:space:]' < .node-version)"
  [[ "$nvm_version" == "$node_version" ]] || error ".nvmrc ($nvm_version) e .node-version ($node_version) não coincidem."
  [[ "$nvm_version" =~ ^24([.]|x$) ]] || warning "Versão Node esperada: 24.x. Valor atual: $nvm_version."
fi

if [[ -f package.json ]]; then
  while IFS=$'\t' read -r level message; do
    if [[ "$level" == error ]]; then
      error "$message"
    else
      warning "$message"
    fi
  done < <(node <<'NODE'
const p = require('./package.json');
const out = (level, message) => console.log(`${level}\t${message}`);
if (p.engines?.node !== '24.x') out('warning', `engines.node esperado: 24.x. Valor atual: ${p.engines?.node}.`);
if (!/^(10|11|>=10|>=11)/.test(p.engines?.pnpm ?? '')) out('warning', `engines.pnpm esperado: 10.x ou 11.x. Valor atual: ${p.engines?.pnpm}.`);
if (!/^pnpm@/.test(p.packageManager ?? '')) out('warning', 'packageManager deve começar com pnpm@.');
if (!p.peerDependencies?.react) out('error', 'react deve existir em peerDependencies.');
if (!p.peerDependencies?.['react-dom']) out('error', 'react-dom deve existir em peerDependencies.');
if (p.dependencies?.react) out('error', 'react não deve estar em dependencies.');
if (p.dependencies?.['react-dom']) out('error', 'react-dom não deve estar em dependencies.');
if (!p.exports?.['./styles.css']) out('error', 'Export público em falta: ./styles.css.');
if (!p.exports?.['./tailwind.config']) out('error', 'Export público em falta: ./tailwind.config.');
NODE
  )
fi

((errors == 0)) || exit 1
$quiet || printf '>>> [TOOL repo] OK.\n'
