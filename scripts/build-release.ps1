# ============================================================
#  Script de Release (Producao)
#  Projecto: normordis-core-ui
#  Objectivo: Validacao completa e empacotamento do SDK React.
# ============================================================

param(
    [switch]$SkipInstall,
    [switch]$NoPack,
    [string]$PackDestination = "D:\tmp\normordis-releases"
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $RepoRoot

if (-not (Test-Path "package.json") -or -not (Test-Path "pnpm-lock.yaml")) {
    Write-Error "Este script deve ser executado na raiz de normordis-core-ui."
    exit 1
}

$LogsDir = Join-Path $RepoRoot ".logs"
if (-not (Test-Path $LogsDir)) { New-Item -ItemType Directory -Path $LogsDir -Force | Out-Null }
$LogFile = Join-Path $LogsDir ("build-release-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".log")
Start-Transcript -Path $LogFile -Append

try {
    Write-Host ">>> [RELEASE] normordis-core-ui" -ForegroundColor Cyan
    Write-Host "    Log: $LogFile" -ForegroundColor DarkGray

    if (-not $SkipInstall) {
        Write-Host ">>> 1. A sincronizar dependencias..." -ForegroundColor Cyan
        pnpm install --frozen-lockfile
        if ($LASTEXITCODE -ne 0) { throw "pnpm install falhou" }
    }

    Write-Host ">>> 2. A verificar higiene do repo..." -ForegroundColor Cyan
    & (Join-Path $RepoRoot "tools\repo\check-hygiene.ps1") -Quiet
    if ($LASTEXITCODE -ne 0) { throw "higiene do repo falhou" }

    & (Join-Path $RepoRoot "tools\docs\check-docs.ps1") -Quiet
    if ($LASTEXITCODE -ne 0) { throw "validacao documental falhou" }

    Write-Host ">>> 3. A correr lint..." -ForegroundColor Cyan
    pnpm run lint
    if ($LASTEXITCODE -ne 0) { throw "lint falhou" }

    Write-Host ">>> 4. A correr typecheck..." -ForegroundColor Cyan
    pnpm run typecheck
    if ($LASTEXITCODE -ne 0) { throw "typecheck falhou" }

    Write-Host ">>> 5. A verificar barrel (colisoes e exports em falta)..." -ForegroundColor Cyan
    node (Join-Path $RepoRoot "scripts\check-exports.mjs")
    if ($LASTEXITCODE -ne 0) { throw "colisoes de nomes no barrel detectadas" }
    node (Join-Path $RepoRoot "scripts\check-missing-exports.mjs")
    if ($LASTEXITCODE -ne 0) { throw "componentes sem export publico detectados" }

    Write-Host ">>> 6. A construir biblioteca SDK..." -ForegroundColor Cyan
    pnpm run build
    if ($LASTEXITCODE -ne 0) { throw "build falhou" }

    if (-not $NoPack) {
        Write-Host ">>> 7. A validar pacote..." -ForegroundColor Cyan
        & (Join-Path $RepoRoot "tools\package\inspect-pack.ps1") -PackDestination $PackDestination
        if ($LASTEXITCODE -ne 0) { throw "validacao do pacote falhou" }
    }
    else {
        Write-Host ">>> 7. Empacotamento ignorado (-NoPack)." -ForegroundColor DarkGray
    }

    Write-Host ""
    Write-Host "    Para publicar no GitHub Packages:" -ForegroundColor DarkGray
    Write-Host "    pnpm publish --no-git-checks" -ForegroundColor DarkGray
    Write-Host "    (requer GITHUB_TOKEN definido - ver scripts\publish-sdk.bat)" -ForegroundColor DarkGray

    Write-Host ""
    Write-Host "------------------------------------------------" -ForegroundColor Green
    Write-Host " RELEASE CONCLUIDA " -ForegroundColor Green
    Write-Host "------------------------------------------------" -ForegroundColor Green
    Write-Host "Artefactos: $RepoRoot\dist" -ForegroundColor Gray
    if (-not $NoPack) { Write-Host "Pacote: $PackDestination" -ForegroundColor Gray }
    exit 0
}
catch {
    Write-Host "[ERRO] $_" -ForegroundColor Red
    exit 1
}
finally {
    Stop-Transcript
}
