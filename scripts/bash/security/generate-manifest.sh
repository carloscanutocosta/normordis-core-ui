#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$repo_root"

out_dir="${1:-${TRUST_OUT_DIR:-artifacts/trust}}"
if [[ "$out_dir" = /* ]]; then
  output_dir=$out_dir
else
  output_dir="$repo_root/$out_dir"
fi
SHA_FILE="$output_dir/MANIFEST.sha256"
JSON_FILE="$output_dir/MANIFEST.json"
TMP_FILE="$output_dir/.manifest-files.tmp"

mkdir -p "$output_dir"

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

find "$repo_root" \
  \( -path "$repo_root/.git" -o -path "$repo_root/.git/*" \
    -o -path "$repo_root/.vs" -o -path "$repo_root/.vs/*" \
    -o -path "$repo_root/.vscode" -o -path "$repo_root/.vscode/*" \
    -o -path "$repo_root/.agents" -o -path "$repo_root/.agents/*" \
    -o -path "$repo_root/.codex" -o -path "$repo_root/.codex/*" \
    -o -path "$repo_root/.claude" -o -path "$repo_root/.claude/*" \
    -o -path "$repo_root/node_modules" -o -path "$repo_root/node_modules/*" \
    -o -path "$repo_root/.pnpm-store" -o -path "$repo_root/.pnpm-store/*" \
    -o -path "$repo_root/dist" -o -path "$repo_root/dist/*" \
    -o -path "$repo_root/dist-ssr" -o -path "$repo_root/dist-ssr/*" \
    -o -path "$repo_root/build" -o -path "$repo_root/build/*" \
    -o -path "$repo_root/.cache" -o -path "$repo_root/.cache/*" \
    -o -path "$repo_root/.turbo" -o -path "$repo_root/.turbo/*" \
    -o -path "$repo_root/.vite" -o -path "$repo_root/.vite/*" \
    -o -path "$repo_root/coverage" -o -path "$repo_root/coverage/*" \
    -o -path "$repo_root/storybook-static" -o -path "$repo_root/storybook-static/*" \
    -o -path "$repo_root/package" -o -path "$repo_root/package/*" \
    -o -path "$repo_root/artifacts" -o -path "$repo_root/artifacts/*" \
    -o -path "$repo_root/tmp" -o -path "$repo_root/tmp/*" \
    -o -path "$repo_root/temp" -o -path "$repo_root/temp/*" \
    -o -path "$repo_root/logs" -o -path "$repo_root/logs/*" \
    -o -path "$repo_root/.logs" -o -path "$repo_root/.logs/*" \
    -o -path "$SHA_FILE" -o -path "$SHA_FILE/*" \
    -o -path "$JSON_FILE" -o -path "$JSON_FILE/*" \
    -o -path "$TMP_FILE" -o -path "$TMP_FILE/*" \) -prune \
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
  path=${file#"$repo_root/"}
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
