# ============================================================
#  Publicacao no GitHub Packages — normordis-core-ui
#  Ver docs\PUBLISHING.md para instrucoes detalhadas.
# ============================================================

param(
    [switch]$SkipBuild,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $RepoRoot

# Verificar token
if (-not $env:GITHUB_TOKEN -or $env:GITHUB_TOKEN -eq "dev-placeholder") {
    Write-Host "[ERRO] GITHUB_TOKEN nao esta definido." -ForegroundColor Red
    Write-Host "       Defina a variavel antes de publicar:" -ForegroundColor Yellow
    Write-Host '       $env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"' -ForegroundColor Yellow
    Write-Host "       Ver docs\PUBLISHING.md para obter o token." -ForegroundColor Yellow
    exit 1
}

# Ler versao actual
$pkg = Get-Content "package.json" | ConvertFrom-Json
$version = $pkg.version
$name    = $pkg.name

Write-Host ">>> Publicar $name@$version no GitHub Packages" -ForegroundColor Cyan

if (-not $SkipBuild) {
    Write-Host ">>> 1. A construir SDK..." -ForegroundColor Cyan
    pnpm run build
    if ($LASTEXITCODE -ne 0) { throw "build falhou — cancela publicacao" }
} else {
    Write-Host ">>> 1. Build ignorado (-SkipBuild)." -ForegroundColor DarkGray
}

Write-Host ">>> 2. A verificar barrel..." -ForegroundColor Cyan
node (Join-Path $RepoRoot "scripts\check-exports.mjs")
if ($LASTEXITCODE -ne 0) { throw "colisoes de nomes detectadas — cancela publicacao" }

if ($DryRun) {
    Write-Host ">>> [DRY RUN] Publicacao simulada — nenhum pacote enviado." -ForegroundColor Yellow
    pnpm pack --dry-run
    exit 0
}

Write-Host ">>> 3. A publicar..." -ForegroundColor Cyan
pnpm publish --no-git-checks
if ($LASTEXITCODE -ne 0) { throw "publicacao falhou" }

Write-Host ""
Write-Host "------------------------------------------------" -ForegroundColor Green
Write-Host " $name@$version publicado com sucesso!" -ForegroundColor Green
Write-Host "------------------------------------------------" -ForegroundColor Green
Write-Host "Registry: https://github.com/carloscanutocosta/normordis-core-ui/packages" -ForegroundColor Gray
