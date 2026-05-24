# ============================================================
#  Script de Build Rapido (Debug)
#  Projecto: normordis-core-ui
#  Objectivo: Validacao local rapida do SDK React.
# ============================================================

param(
    [switch]$SkipInstall,
    [switch]$SkipLint,
    [switch]$SkipTypecheck
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
$LogFile = Join-Path $LogsDir ("build-debug-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".log")
Start-Transcript -Path $LogFile -Append

try {
    Write-Host ">>> [DEBUG BUILD] normordis-core-ui" -ForegroundColor Cyan
    Write-Host "    Log: $LogFile" -ForegroundColor DarkGray

    if (-not $SkipInstall) {
        Write-Host ">>> 1. A sincronizar dependencias..." -ForegroundColor Cyan
        pnpm install --frozen-lockfile
        if ($LASTEXITCODE -ne 0) { throw "pnpm install falhou" }
    }

    if (-not $SkipLint) {
        Write-Host ">>> 2. A correr lint..." -ForegroundColor Cyan
        pnpm run lint
        if ($LASTEXITCODE -ne 0) { throw "lint falhou" }
    }

    if (-not $SkipTypecheck) {
        Write-Host ">>> 3. A correr typecheck..." -ForegroundColor Cyan
        pnpm run typecheck
        if ($LASTEXITCODE -ne 0) { throw "typecheck falhou" }
    }

    Write-Host ">>> 4. A construir biblioteca em modo development..." -ForegroundColor Cyan
    pnpm exec vite build --mode development
    if ($LASTEXITCODE -ne 0) { throw "build falhou" }

    Write-Host ""
    Write-Host "------------------------------------------------" -ForegroundColor Green
    Write-Host " DEBUG BUILD CONCLUIDO " -ForegroundColor Green
    Write-Host "------------------------------------------------" -ForegroundColor Green
    Write-Host "Artefactos: $RepoRoot\dist" -ForegroundColor Gray
    exit 0
}
catch {
    Write-Host "[ERRO] $_" -ForegroundColor Red
    exit 1
}
finally {
    Stop-Transcript
}
