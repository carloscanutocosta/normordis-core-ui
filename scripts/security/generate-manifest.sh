#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)

OUT_DIR="${1:-${TRUST_OUT_DIR:-artifacts/trust}}"
if [ "$OUT_DIR" = "${OUT_DIR#/}" ]; then
  ABS_OUT_DIR="$REPO_ROOT/$OUT_DIR"
else
  ABS_OUT_DIR="$OUT_DIR"
fi
SHA_FILE="$ABS_OUT_DIR/MANIFEST.sha256"
JSON_FILE="$ABS_OUT_DIR/MANIFEST.json"
TMP_FILE="$ABS_OUT_DIR/.manifest-files.tmp"

mkdir -p "$ABS_OUT_DIR"

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

find "$REPO_ROOT" \
  \( -path "$REPO_ROOT/.git" -o -path "$REPO_ROOT/.git/*" \
    -o -path "$REPO_ROOT/.vs" -o -path "$REPO_ROOT/.vs/*" \
    -o -path "$REPO_ROOT/.vscode" -o -path "$REPO_ROOT/.vscode/*" \
    -o -path "$REPO_ROOT/node_modules" -o -path "$REPO_ROOT/node_modules/*" \
    -o -path "$REPO_ROOT/dist" -o -path "$REPO_ROOT/dist/*" \
    -o -path "$REPO_ROOT/dist-ssr" -o -path "$REPO_ROOT/dist-ssr/*" \
    -o -path "$REPO_ROOT/build" -o -path "$REPO_ROOT/build/*" \
    -o -path "$REPO_ROOT/.cache" -o -path "$REPO_ROOT/.cache/*" \
    -o -path "$REPO_ROOT/.turbo" -o -path "$REPO_ROOT/.turbo/*" \
    -o -path "$REPO_ROOT/.vite" -o -path "$REPO_ROOT/.vite/*" \
    -o -path "$REPO_ROOT/coverage" -o -path "$REPO_ROOT/coverage/*" \
    -o -path "$REPO_ROOT/artifacts" -o -path "$REPO_ROOT/artifacts/*" \
    -o -path "$REPO_ROOT/tmp" -o -path "$REPO_ROOT/tmp/*" \
    -o -path "$REPO_ROOT/temp" -o -path "$REPO_ROOT/temp/*" \
    -o -path "$REPO_ROOT/logs" -o -path "$REPO_ROOT/logs/*" \
    -o -path "$REPO_ROOT/.logs" -o -path "$REPO_ROOT/.logs/*" \
    -o -path "$SHA_FILE" -o -path "$SHA_FILE/*" \
    -o -path "$JSON_FILE" -o -path "$JSON_FILE/*" \
    -o -path "$TMP_FILE" -o -path "$TMP_FILE/*" \) -prune \
  -o -type f -print | LC_ALL=C sort > "$TMP_FILE"

: > "$SHA_FILE"
{
  printf '{\n'
  printf '  "schema_version": "0.1.0",\n'
  printf '  "algorithm": "SHA-256",\n'
  printf '  "files": [\n'
} > "$JSON_FILE"

first=1
while IFS= read -r file; do
  path=${file#"$REPO_ROOT/"}
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
