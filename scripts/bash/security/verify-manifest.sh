#!/usr/bin/env bash
set -Eeuo pipefail

repo_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$repo_root"

MANIFEST="${1:-${TRUST_MANIFEST:-artifacts/trust/MANIFEST.sha256}}"

if [ ! -f "$MANIFEST" ]; then
  echo "Manifest nao encontrado: $MANIFEST" >&2
  exit 2
fi

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum -c "$MANIFEST"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 -c "$MANIFEST"
else
  failed=0
  while IFS= read -r line; do
    hash=${line%%  *}
    path=${line#*  }
    actual=$(openssl dgst -sha256 "$path" | awk '{print $NF}')
    if [ "$actual" = "$hash" ]; then
      printf '%s: OK\n' "$path"
    else
      printf '%s: FALHOU\n' "$path" >&2
      failed=1
    fi
  done < "$MANIFEST"
  exit "$failed"
fi
