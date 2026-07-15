# Variante PowerShell; a entrada principal multiplataforma vive em scripts/bash/.
param(
    [string]$OutputDir = $(if ($env:TRUST_OUT_DIR) { $env:TRUST_OUT_DIR } else { "artifacts/trust" })
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $RepoRoot

$OutputPath = if ([System.IO.Path]::IsPathRooted($OutputDir)) {
    $OutputDir
}
else {
    Join-Path $RepoRoot $OutputDir
}

New-Item -ItemType Directory -Force -Path $OutputPath | Out-Null

$ShaPath = Join-Path $OutputPath "MANIFEST.sha256"
$JsonPath = Join-Path $OutputPath "MANIFEST.json"

$ExcludedDirectories = @(
    ".git",
    ".vs",
    ".vscode",
    ".agents",
    ".codex",
    ".claude",
    "node_modules",
    ".pnpm-store",
    "dist",
    "dist-ssr",
    "build",
    ".cache",
    ".turbo",
    ".vite",
    "coverage",
    "storybook-static",
    "package",
    "artifacts",
    "tmp",
    "temp",
    "logs",
    ".logs"
)

function Resolve-ExistingPath {
    param([string]$Path)
    if (Test-Path -LiteralPath $Path) { return (Resolve-Path -LiteralPath $Path).Path }
    return $null
}

$ManifestFiles = @(
    Resolve-ExistingPath -Path $ShaPath
    Resolve-ExistingPath -Path $JsonPath
) | Where-Object { $_ }

function Convert-ToRepoPath {
    param([string]$Path)
    $ResolvedPath = [System.IO.Path]::GetFullPath($Path)
    if ($ResolvedPath.StartsWith($RepoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        $Relative = $ResolvedPath.Substring($RepoRoot.Length).TrimStart("\", "/")
        return ($Relative -replace "\\", "/")
    }

    return ($ResolvedPath -replace "\\", "/")
}

function Test-IsExcludedPath {
    param([string]$Path)
    if ($ManifestFiles -contains $Path) { return $true }

    $RepoPath = Convert-ToRepoPath -Path $Path
    $RelativeParts = $RepoPath -split "[\\/]+"
    foreach ($Part in $RelativeParts) {
        if ($ExcludedDirectories -contains $Part) { return $true }
    }

    return $false
}

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

$Files = Get-ChildItem -LiteralPath $RepoRoot -File -Recurse -Force |
    Where-Object { -not (Test-IsExcludedPath -Path $_.FullName) } |
    Sort-Object { Convert-ToRepoPath -Path $_.FullName }

$Entries = foreach ($File in $Files) {
    $Hash = Get-Sha256 -Path $File.FullName
    $RepoPath = Convert-ToRepoPath -Path $File.FullName
    [pscustomobject]@{ path = $RepoPath; sha256 = $Hash }
}

$ShaLines = foreach ($Entry in $Entries) { "$($Entry.sha256)  $($Entry.path)" }
Set-Content -LiteralPath $ShaPath -Value $ShaLines -Encoding UTF8

$Manifest = [ordered]@{
    schema_version = "0.1.0"
    algorithm = "SHA-256"
    generated_at = (Get-Date).ToUniversalTime().ToString("o")
    files = @($Entries)
}
$Manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $JsonPath -Encoding UTF8

Write-Host "Manifest gerado em $ShaPath e $JsonPath"
