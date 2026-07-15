#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$repo_root"

OUT_DIR="${1:-${TRUST_OUT_DIR:-artifacts/trust}}"
SHA_FILE="$OUT_DIR/MANIFEST.sha256"
JSON_FILE="$OUT_DIR/MANIFEST.json"
TMP_FILE="$OUT_DIR/.manifest-files.tmp"

mkdir -p "$OUT_DIR"

hash_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$1" | awk '{print $1}'
  else
    openssl dgst -sha256 "$1" | awk '{print $NF}'
  fi
}

json_escape() {
  sed 's/\\/\\\\/g; s/"/\\"/g'
}

find . \
  \( -path './.git' -o -path './.git/*' \
    -o -path './.vs' -o -path './.vs/*' \
    -o -path './.vscode' -o -path './.vscode/*' \
    -o -path './.agents' -o -path './.agents/*' \
    -o -path './.codex' -o -path './.codex/*' \
    -o -path './.claude' -o -path './.claude/*' \
    -o -path './node_modules' -o -path './node_modules/*' \
    -o -path './.pnpm-store' -o -path './.pnpm-store/*' \
    -o -path './dist' -o -path './dist/*' \
    -o -path './dist-ssr' -o -path './dist-ssr/*' \
    -o -path './build' -o -path './build/*' \
    -o -path './.cache' -o -path './.cache/*' \
    -o -path './.turbo' -o -path './.turbo/*' \
    -o -path './.vite' -o -path './.vite/*' \
    -o -path './coverage' -o -path './coverage/*' \
    -o -path './storybook-static' -o -path './storybook-static/*' \
    -o -path './package' -o -path './package/*' \
    -o -path './artifacts' -o -path './artifacts/*' \
    -o -path './tmp' -o -path './tmp/*' \
    -o -path './temp' -o -path './temp/*' \
    -o -path './logs' -o -path './logs/*' \
    -o -path './.logs' -o -path './.logs/*' \
    -o -path "./$SHA_FILE" \
    -o -path "./$JSON_FILE" \
    -o -path "./$TMP_FILE" \) -prune \
  -o -type f -print | LC_ALL=C sort > "$TMP_FILE"

: > "$SHA_FILE"
{
  printf '{\n'
  printf '  "schema_version": "0.1.0",\n'
  printf '  "algorithm": "SHA-256",\n'
  printf '  "generated_at": "%s",\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  printf '  "files": [\n'
} > "$JSON_FILE"

first=1
while IFS= read -r file; do
  path=${file#./}
  hash=$(hash_file "$file")
  printf '%s  %s\n' "$hash" "$path" >> "$SHA_FILE"

  escaped_path=$(printf '%s' "$path" | json_escape)
  if [ "$first" -eq 1 ]; then
    first=0
  else
    printf ',\n' >> "$JSON_FILE"
  fi
  printf '    { "path": "%s", "sha256": "%s" }' "$escaped_path" "$hash" >> "$JSON_FILE"
done < "$TMP_FILE"

{
  printf '\n'
  printf '  ]\n'
  printf '}\n'
} >> "$JSON_FILE"

rm -f "$TMP_FILE"
printf 'Manifest gerado em %s e %s\n' "$SHA_FILE" "$JSON_FILE"
