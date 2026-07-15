param(
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $RepoRoot

$Errors = New-Object System.Collections.Generic.List[string]
$Warnings = New-Object System.Collections.Generic.List[string]

function Add-ErrorMessage([string]$Message) {
    $Errors.Add($Message) | Out-Null
}

function Add-WarningMessage([string]$Message) {
    $Warnings.Add($Message) | Out-Null
}

function Test-RequiredFile([string]$Path) {
    if (-not (Test-Path $Path)) {
        Add-ErrorMessage "Ficheiro obrigatorio em falta: $Path"
    }
}

if (-not $Quiet) {
    Write-Host ">>> [TOOL repo] A verificar higiene do repositorio..." -ForegroundColor Cyan
}

Test-RequiredFile "package.json"
Test-RequiredFile "pnpm-lock.yaml"
Test-RequiredFile ".nvmrc"
Test-RequiredFile ".node-version"
Test-RequiredFile "src\index.ts"

foreach ($forbiddenLock in @("package-lock.json", "npm-shrinkwrap.json", "yarn.lock")) {
    if (Test-Path $forbiddenLock) {
        Add-ErrorMessage "Lockfile indevido encontrado: $forbiddenLock. Este repo deve manter apenas pnpm-lock.yaml."
    }
}

if ((Test-Path ".nvmrc") -and (Test-Path ".node-version")) {
    $NvmVersion = (Get-Content ".nvmrc" -Raw).Trim()
    $NodeVersion = (Get-Content ".node-version" -Raw).Trim()

    if ($NvmVersion -ne $NodeVersion) {
        Add-ErrorMessage ".nvmrc ($NvmVersion) e .node-version ($NodeVersion) nao coincidem."
    }

    if ($NvmVersion -notmatch "^24(\.|x$)") {
        Add-WarningMessage "Versao Node esperada pelo projeto: 24.x. Valor atual: $NvmVersion."
    }
}

if (Test-Path "package.json") {
    $Package = Get-Content "package.json" -Raw | ConvertFrom-Json

    if ($Package.engines.node -ne "24.x") {
        Add-WarningMessage "engines.node esperado: 24.x. Valor atual: $($Package.engines.node)."
    }

    $expectedPnpmMajor = "10"
    if ($Package.engines.pnpm -notmatch "^(10|11|>=10|>=11)") {
        Add-WarningMessage "engines.pnpm esperado: 10.x ou 11.x. Valor atual: $($Package.engines.pnpm)."
    }

    if ($Package.packageManager -notmatch "^pnpm@") {
        Add-WarningMessage "packageManager deve comecar com pnpm@. Valor atual: $($Package.packageManager)."
    }

    if (-not $Package.peerDependencies.react) {
        Add-ErrorMessage "react deve existir em peerDependencies."
    }

    if (-not $Package.peerDependencies.'react-dom') {
        Add-ErrorMessage "react-dom deve existir em peerDependencies."
    }

    if ($Package.dependencies.react) {
        Add-ErrorMessage "react nao deve estar em dependencies; deve permanecer em peerDependencies/devDependencies."
    }

    if ($Package.dependencies.'react-dom') {
        Add-ErrorMessage "react-dom nao deve estar em dependencies; deve permanecer em peerDependencies/devDependencies."
    }

    if (-not $Package.exports.'./styles.css') {
        Add-ErrorMessage "Export publico em falta: ./styles.css."
    }

    if (-not $Package.exports.'./tailwind.config') {
        Add-ErrorMessage "Export publico em falta: ./tailwind.config."
    }
}

foreach ($warning in $Warnings) {
    Write-Host "  [AVISO] $warning" -ForegroundColor Yellow
}

if ($Errors.Count -gt 0) {
    foreach ($errorMessage in $Errors) {
        Write-Host "  [ERRO] $errorMessage" -ForegroundColor Red
    }
    exit 1
}

if (-not $Quiet) {
    Write-Host ">>> [TOOL repo] OK." -ForegroundColor Green
}

exit 0
