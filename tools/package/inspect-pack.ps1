param(
    [string]$PackDestination = "D:\tmp\normordis-packages"
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $RepoRoot

Write-Host ">>> [TOOL package] A validar pacote com pnpm pack..." -ForegroundColor Cyan

if (-not (Test-Path $PackDestination)) {
    New-Item -ItemType Directory -Path $PackDestination -Force | Out-Null
}

$PackOutput = pnpm pack --json --pack-destination "$PackDestination"
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [ERRO] pnpm pack falhou." -ForegroundColor Red
    exit $LASTEXITCODE
}

$PackJson = $PackOutput | ConvertFrom-Json
if ($PackJson -is [array]) {
    $PackInfo = $PackJson[0]
}
else {
    $PackInfo = $PackJson
}

$PackedPaths = @($PackInfo.files | ForEach-Object { $_.path })
$RequiredPaths = @(
    "package.json",
    "README.md",
    "CHANGELOG.md",
    "LICENSE",
    "docs/MAN.md",
    "tailwind.config.js",
    "dist/normordis-core-ui.css",
    "dist/index.js",
    "dist/index.d.ts",
    "dist/charts.js",
    "dist/workspace.js"
)

$Errors = New-Object System.Collections.Generic.List[string]

foreach ($requiredPath in $RequiredPaths) {
    if ($PackedPaths -notcontains $requiredPath) {
        $Errors.Add("Ficheiro esperado ausente do pacote: $requiredPath") | Out-Null
    }
}

if ($Errors.Count -gt 0) {
    foreach ($errorMessage in $Errors) {
        Write-Host "  [ERRO] $errorMessage" -ForegroundColor Red
    }
    exit 1
}

Write-Host "  [+] Pacote: $($PackInfo.filename)" -ForegroundColor DarkGray
Write-Host "  [+] Ficheiros incluidos: $($PackedPaths.Count)" -ForegroundColor DarkGray
Write-Host ">>> [TOOL package] OK." -ForegroundColor Green

exit 0
