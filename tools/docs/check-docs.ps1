param(
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $RepoRoot

$RequiredDocs = @(
    "README.md",
    "docs\MAN.md",
    "DESIGN.md",
    "CHANGELOG.md",
    "LICENSE",
    "AGENTS.md",
    "SECURITY.md",
    "security\README.md",
    "security\DEPENDENCY_POLICY.md",
    "security\PROVENANCE_POLICY.md"
)

$Errors = New-Object System.Collections.Generic.List[string]

if (-not $Quiet) {
    Write-Host ">>> [TOOL docs] A verificar documentacao obrigatoria..." -ForegroundColor Cyan
}

foreach ($docPath in $RequiredDocs) {
    if (-not (Test-Path $docPath)) {
        $Errors.Add("Documento obrigatorio em falta: $docPath") | Out-Null
        continue
    }

    $item = Get-Item $docPath
    if ($item.Length -eq 0) {
        $Errors.Add("Documento vazio: $docPath") | Out-Null
    }
}

if ((Test-Path "README.md") -and -not (Select-String -Path "README.md" -Pattern "pnpm run build" -Quiet)) {
    $Errors.Add("README.md deve documentar o comando pnpm run build.") | Out-Null
}

if (Test-Path "package.json") {
    $PackageName = (Get-Content -Path "package.json" -Raw | ConvertFrom-Json).name
    $PublicCssEntrypoint = "$PackageName/styles.css"
    if ((Test-Path "docs\MAN.md") -and -not (Select-String -Path "docs\MAN.md" -Pattern ([regex]::Escape($PublicCssEntrypoint)) -Quiet)) {
        $Errors.Add("docs/MAN.md deve documentar o CSS publico $PublicCssEntrypoint.") | Out-Null
    }
}

if ($Errors.Count -gt 0) {
    foreach ($errorMessage in $Errors) {
        Write-Host "  [ERRO] $errorMessage" -ForegroundColor Red
    }
    exit 1
}

if (-not $Quiet) {
    Write-Host ">>> [TOOL docs] OK." -ForegroundColor Green
}

exit 0
