# Variante PowerShell; a entrada principal multiplataforma vive em scripts/bash/.
param(
    [string]$ManifestPath = $(if ($env:TRUST_MANIFEST) { $env:TRUST_MANIFEST } else { "artifacts/trust/MANIFEST.sha256" }),
    [switch]$VerboseOk
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = (Resolve-Path ".").Path
$ManifestFullPath = if ([System.IO.Path]::IsPathRooted($ManifestPath)) {
    $ManifestPath
}
else {
    Join-Path $Root $ManifestPath
}

if (-not (Test-Path -LiteralPath $ManifestFullPath -PathType Leaf)) {
    Write-Error "Manifest nao encontrado: $ManifestFullPath"
    exit 2
}

$Failures = @()
$LineNumber = 0
$VerifiedCount = 0

function Get-Sha256 {
    param([string]$Path)
    $Stream = [System.IO.File]::OpenRead($Path)
    try {
        $Sha = [System.Security.Cryptography.SHA256]::Create()
        try {
            $HashBytes = $Sha.ComputeHash($Stream)
            return ([System.BitConverter]::ToString($HashBytes) -replace "-", "").ToLowerInvariant()
        }
        finally {
            $Sha.Dispose()
        }
    }
    finally {
        $Stream.Dispose()
    }
}

foreach ($Line in Get-Content -LiteralPath $ManifestFullPath) {
    $LineNumber++
    if ([string]::IsNullOrWhiteSpace($Line)) { continue }

    $Parts = $Line -split "  ", 2
    if ($Parts.Count -ne 2) {
        $Failures += "Linha $LineNumber invalida no manifest."
        continue
    }

    $Expected = $Parts[0].Trim().ToLowerInvariant()
    $RepoPath = $Parts[1].Trim()
    $FilePath = Join-Path $Root ($RepoPath -replace "/", [System.IO.Path]::DirectorySeparatorChar)

    if (-not (Test-Path -LiteralPath $FilePath -PathType Leaf)) {
        $Failures += "Ficheiro nao encontrado: $RepoPath"
        continue
    }

    $Actual = Get-Sha256 -Path $FilePath
    if ($Actual -ne $Expected) {
        $Failures += "Hash invalido: $RepoPath"
        continue
    }

    $VerifiedCount++
    if ($VerboseOk) { Write-Host "${RepoPath}: OK" }
}

if ($Failures.Count -gt 0) {
    foreach ($Failure in $Failures) { Write-Error $Failure }
    exit 1
}

Write-Host "Manifest verificado com sucesso: $ManifestFullPath ($VerifiedCount ficheiros)"
