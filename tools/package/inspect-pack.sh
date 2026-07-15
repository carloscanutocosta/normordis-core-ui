#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$repo_root"
destination="${1:-./package}"
mkdir -p "$destination"
output="$(mktemp "${TMPDIR:-/tmp}/normordis-pack.XXXXXX.json")"
trap 'rm -f "$output"' EXIT

printf '>>> [TOOL package] A validar pacote com pnpm pack...\n'
pnpm pack --json --pack-destination "$destination" > "$output"
node - "$output" <<'NODE'
const fs = require('node:fs');
const parsed = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const info = Array.isArray(parsed) ? parsed[0] : parsed;
const paths = new Set((info.files ?? []).map((file) => file.path));
const required = [
  'package.json', 'README.md', 'CHANGELOG.md', 'LICENSE', 'docs/MAN.md',
  'tailwind.config.js', 'dist/normordis-core-ui.css', 'dist/index.js',
  'dist/index.d.ts', 'dist/charts.js', 'dist/workspace.js',
];
const missing = required.filter((path) => !paths.has(path));
if (missing.length) {
  for (const path of missing) console.error(`  [ERRO] Ficheiro esperado ausente do pacote: ${path}`);
  process.exit(1);
}
console.log(`  [+] Pacote: ${info.filename}`);
console.log(`  [+] Ficheiros incluídos: ${paths.size}`);
NODE
printf '>>> [TOOL package] OK.\n'
