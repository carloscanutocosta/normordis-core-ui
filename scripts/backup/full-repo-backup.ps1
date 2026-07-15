# ============================================================
#  Full Repo Backup - normordis-core-ui
#  Destino: E:\Backup\normordis-core-ui
#  Objectivo: Snapshot completo do SDK para reposicao noutro PC.
#             Exclui artefactos reconstruiveis.
#
#  Uso:
#    .\full-repo-backup.ps1
#    .\full-repo-backup.ps1 -DestDir "E:\outro\destino"
#    .\full-repo-backup.ps1 -KeepLast 5
# ============================================================

param(
    [string]$DestDir = "E:\Backup\normordis-core-ui",
    [int]$KeepLast = 7
)

$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ZipName = "normordis-core-ui-$Timestamp.zip"
$ZipPath = Join-Path $DestDir $ZipName
$TempStage = Join-Path $env:TEMP "ncu_bkp_$Timestamp"

function Remove-TempStage {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) { return }

    $FullPath = [System.IO.Path]::GetFullPath($Path)
    $TempRoot = [System.IO.Path]::GetFullPath($env:TEMP).TrimEnd("\", "/") + [System.IO.Path]::DirectorySeparatorChar

    if (-not $FullPath.StartsWith($TempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Recusa limpar staging fora de TEMP: $FullPath"
    }

    try {
        Remove-Item -LiteralPath $FullPath -Recurse -Force -ErrorAction Stop
    }
    catch {
        $EmptyDir = Join-Path $env:TEMP ("ncu_empty_" + [guid]::NewGuid().ToString("N"))
        New-Item -ItemType Directory -Path $EmptyDir -Force | Out-Null
        try {
            & robocopy.exe $EmptyDir $FullPath /MIR /R:0 /W:0 /NFL /NDL /NP | Out-Null
            Remove-Item -LiteralPath $FullPath -Recurse -Force -ErrorAction Stop
        }
        finally {
            if (Test-Path -LiteralPath $EmptyDir) {
                Remove-Item -LiteralPath $EmptyDir -Recurse -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "         FULL REPO BACKUP - normordis-core-ui           " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Origem  : $RepoRoot"
Write-Host "  Destino : $ZipPath"
Write-Host "  Data    : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

if (-not (Test-Path $DestDir)) {
    Write-Host "  [+] A criar pasta de destino: $DestDir" -ForegroundColor DarkGray
    New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
}

$ExcludeDirs = @(
    "node_modules",
    "dist",
    ".vite",
    ".turbo",
    ".cache",
    ".logs",
    "artifacts",
    "coverage",
    "tmp",
    "temp",
    (Join-Path $RepoRoot ".git\refs\codex"),
    (Join-Path $RepoRoot ".git\logs\refs\codex")
)

$ExcludeFiles = @(
    "*.log",
    "*.tmp",
    "*.bak",
    ".DS_Store",
    "Thumbs.db",
    "Desktop.ini",
    "*.env.local",
    "*.env.*.local",
    "*.tgz"
)

Write-Host "  [1/3] A copiar ficheiros (Robocopy)..." -ForegroundColor DarkCyan

$RoboArgs = @(
    $RepoRoot,
    $TempStage,
    "/E",
    "/COPY:DAT",
    "/DCOPY:DAT",
    "/MT:8",
    "/R:0",
    "/W:0",
    "/NFL",
    "/NDL",
    "/NP",
    "/XD"
) + $ExcludeDirs + @(
    "/XF"
) + $ExcludeFiles

& robocopy.exe @RoboArgs | Out-Null

if ($LASTEXITCODE -ge 8) {
    Write-Host "  [ERRO] Robocopy falhou com codigo $LASTEXITCODE" -ForegroundColor Red
    Remove-TempStage -Path $TempStage
    exit 1
}

$FileCount = (Get-ChildItem $TempStage -Recurse -File).Count
$StageSize = (Get-ChildItem $TempStage -Recurse -File | Measure-Object -Property Length -Sum).Sum
$StageMB = [math]::Round($StageSize / 1MB, 1)
Write-Host "  [+] $FileCount ficheiros, ${StageMB} MB copiados para staging" -ForegroundColor DarkGray

Write-Host "  [2/3] A comprimir para ZIP..." -ForegroundColor DarkCyan

$SevenZip = $null
foreach ($candidate in @("7z", "${env:ProgramFiles}\7-Zip\7z.exe", "${env:ProgramFiles(x86)}\7-Zip\7z.exe")) {
    if (Get-Command $candidate -ErrorAction SilentlyContinue) { $SevenZip = $candidate; break }
}

try {
    if ($SevenZip) {
        Write-Host "  [+] A usar 7-Zip: $SevenZip" -ForegroundColor DarkGray
        & $SevenZip a -tzip -mx=5 "$ZipPath" "$TempStage\*" | Out-Null
        if ($LASTEXITCODE -gt 1) { throw "7-Zip saiu com codigo $LASTEXITCODE" }
    }
    else {
        Write-Host "  [+] A usar tar (built-in)" -ForegroundColor DarkGray
        Push-Location $TempStage
        & tar.exe -a -cf "$ZipPath" * 2>&1 | Out-Null
        Pop-Location
        if ($LASTEXITCODE -ne 0) { throw "tar saiu com codigo $LASTEXITCODE" }
    }
}
catch {
    Write-Host "  [ERRO] Falha ao comprimir: $_" -ForegroundColor Red
    Remove-TempStage -Path $TempStage
    exit 1
}

$ZipSize = [math]::Round((Get-Item $ZipPath).Length / 1MB, 1)
Write-Host "  [+] ZIP criado: ${ZipSize} MB" -ForegroundColor DarkGray

Write-Host "  [3/3] A limpar staging temporario..." -ForegroundColor DarkCyan
Remove-TempStage -Path $TempStage

if ($KeepLast -gt 0) {
    $AllBackups = Get-ChildItem $DestDir -Filter "normordis-core-ui-*.zip" | Sort-Object LastWriteTime -Descending
    $ToDelete = $AllBackups | Select-Object -Skip $KeepLast
    if ($ToDelete.Count -gt 0) {
        Write-Host ""
        Write-Host "  [~] Rotacao: a remover $($ToDelete.Count) backup(s) antigo(s) (KeepLast=$KeepLast)..." -ForegroundColor DarkGray
        $ToDelete | ForEach-Object {
            Remove-Item $_.FullName -Force
            Write-Host "      Removido: $($_.Name)" -ForegroundColor DarkGray
        }
    }
}

Write-Host ""
Write-Host "  BACKUP CONCLUIDO COM SUCESSO" -ForegroundColor Green
Write-Host ""
Write-Host "  Ficheiro : $ZipPath"
Write-Host "  Tamanho  : ${ZipSize} MB (fonte: ${StageMB} MB)"
Write-Host "  Ficheiros: $FileCount"
Write-Host ""
Write-Host "  Para restaurar noutro PC:" -ForegroundColor DarkCyan
Write-Host "    1. Extrair o ZIP ou usar scripts\backup\full-repo-restore.ps1"
Write-Host "    2. corepack enable"
Write-Host "    3. pnpm install"
Write-Host "    4. pnpm run build"
Write-Host ""
