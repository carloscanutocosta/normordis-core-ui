# ============================================================
#  Playground / Demo — normordis-core-ui
#  Arranca o servidor Vite com hot-reload para explorar
#  os componentes do SDK em modo de desenvolvimento.
# ============================================================

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $RepoRoot

Write-Host ">>> normordis-core-ui — Playground" -ForegroundColor Cyan
Write-Host "    http://localhost:5173" -ForegroundColor DarkGray
Write-Host "    Ctrl+C para terminar" -ForegroundColor DarkGray
Write-Host ""

# Suprimir o aviso do GITHUB_TOKEN no .npmrc durante o dev local
$env:GITHUB_TOKEN ??= "dev-placeholder"

pnpm dev --open
