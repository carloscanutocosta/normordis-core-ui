param(
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $RepoRoot

if (-not (Test-Path "package.json") -or -not (Test-Path "pnpm-lock.yaml")) {
    Write-Error "Este script deve ser executado na raiz de normordis-core-ui."
    exit 1
}

Write-Host ">>> [CHECK] Higiene do repo..." -ForegroundColor Cyan
& (Join-Path $RepoRoot "tools\repo\check-hygiene.ps1")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ">>> [CHECK] Documentacao..." -ForegroundColor Cyan
& (Join-Path $RepoRoot "tools\docs\check-docs.ps1")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ">>> [CHECK] Lint..." -ForegroundColor Cyan
pnpm run lint
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ">>> [CHECK] Typecheck..." -ForegroundColor Cyan
pnpm run typecheck
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

if (-not $SkipBuild) {
    Write-Host ">>> [CHECK] Build..." -ForegroundColor Cyan
    pnpm run build
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host ">>> [CHECK] Concluido com sucesso." -ForegroundColor Green
exit 0
