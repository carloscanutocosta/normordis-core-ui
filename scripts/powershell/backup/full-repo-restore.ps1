# ============================================================
#  Full Repo Restore (PowerShell) - normordis-core-ui
#  Origem:  D:\Backup\normordis-core-ui  (ou -BackupFile)
#  Destino: pasta a escolha              (ou -RestoreDir)
#
#  Uso:
#    .\full-repo-restore.ps1 -RestoreDir "C:\Projetos\normordis-core-ui"
#    .\full-repo-restore.ps1 -BackupFile "D:\Backup\normordis-core-ui\normordis-core-ui-20260524-083841.zip" -RestoreDir "C:\Projetos\normordis-core-ui"
#    .\full-repo-restore.ps1 -RestoreDir "C:\Projetos\normordis-core-ui" -Rebuild
#    .\full-repo-restore.ps1 -List
# ============================================================

param(
    [string]$BackupFile = "",
    [string]$RestoreDir = "",
    [string]$BackupDir = "D:\Backup\normordis-core-ui",
    [switch]$Rebuild = $false,
    [switch]$List = $false
)

$ErrorActionPreference = "Stop"

if ($List) {
    if (-not (Test-Path $BackupDir)) {
        Write-Host "  Pasta de backup nao encontrada: $BackupDir" -ForegroundColor Yellow
        exit 0
    }

    $All = Get-ChildItem $BackupDir -Filter "normordis-core-ui-*.zip" | Sort-Object LastWriteTime -Descending
    if ($All.Count -eq 0) {
        Write-Host "  Nenhum backup encontrado em $BackupDir" -ForegroundColor Yellow
        exit 0
    }

    Write-Host ""
    Write-Host "  Backups disponiveis em $BackupDir :" -ForegroundColor Cyan
    Write-Host ""
    $i = 1
    foreach ($f in $All) {
        $sizeMB = [math]::Round($f.Length / 1MB, 1)
        $marker = if ($i -eq 1) { " < mais recente" } else { "" }
        Write-Host ("  [{0,2}]  {1}   {2,7} MB   {3}{4}" -f $i, $f.LastWriteTime.ToString("yyyy-MM-dd HH:mm"), $sizeMB, $f.Name, $marker)
        $i++
    }
    Write-Host ""
    exit 0
}

if (-not $RestoreDir) {
    Write-Host ""
    Write-Host "  [ERRO] E necessario especificar -RestoreDir" -ForegroundColor Red
    Write-Host "  Exemplo: .\full-repo-restore.ps1 -RestoreDir `"C:\Projetos\normordis-core-ui`"" -ForegroundColor DarkGray
    Write-Host "  Para listar backups: .\full-repo-restore.ps1 -List" -ForegroundColor DarkGray
    Write-Host ""
    exit 1
}

if (-not $BackupFile) {
    if (-not (Test-Path $BackupDir)) {
        Write-Host "  [ERRO] Pasta de backups nao encontrada: $BackupDir" -ForegroundColor Red
        exit 1
    }

    $Latest = Get-ChildItem $BackupDir -Filter "normordis-core-ui-*.zip" |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if (-not $Latest) {
        Write-Host "  [ERRO] Nenhum backup encontrado em $BackupDir" -ForegroundColor Red
        exit 1
    }

    $BackupFile = $Latest.FullName
}

if (-not (Test-Path $BackupFile)) {
    Write-Host "  [ERRO] Ficheiro de backup nao encontrado: $BackupFile" -ForegroundColor Red
    exit 1
}

$ZipSize = [math]::Round((Get-Item $BackupFile).Length / 1MB, 1)

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "        FULL REPO RESTORE - normordis-core-ui           " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Backup  : $BackupFile ($ZipSize MB)"
Write-Host "  Destino : $RestoreDir"
Write-Host "  Data    : $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Host ""

if (Test-Path $RestoreDir) {
    $existing = (Get-ChildItem $RestoreDir -Force | Measure-Object).Count
    if ($existing -gt 0) {
        Write-Host "  [!] ATENCAO: A pasta destino ja existe e nao esta vazia ($existing itens)." -ForegroundColor Yellow
        Write-Host "      O conteudo do backup sera extraido por cima." -ForegroundColor Yellow
        Write-Host ""
        $confirm = Read-Host "  Continuar? (s/N)"
        if ($confirm -notmatch "^[sS]$") {
            Write-Host "  Operacao cancelada." -ForegroundColor DarkGray
            exit 0
        }
        Write-Host ""
    }
}
else {
    Write-Host "  [+] A criar pasta destino..." -ForegroundColor DarkGray
    New-Item -ItemType Directory -Path $RestoreDir -Force | Out-Null
}

Write-Host "  [1/3] A extrair backup..." -ForegroundColor DarkCyan

$SevenZip = $null
foreach ($candidate in @("7z", "${env:ProgramFiles}\7-Zip\7z.exe", "${env:ProgramFiles(x86)}\7-Zip\7z.exe")) {
    if (Get-Command $candidate -ErrorAction SilentlyContinue) { $SevenZip = $candidate; break }
}

try {
    if ($SevenZip) {
        Write-Host "  [+] A usar 7-Zip: $SevenZip" -ForegroundColor DarkGray
        & $SevenZip x "$BackupFile" -o"$RestoreDir" -y | Out-Null
        if ($LASTEXITCODE -gt 1) { throw "7-Zip saiu com codigo $LASTEXITCODE" }
    }
    else {
        Write-Host "  [+] A usar tar (built-in)" -ForegroundColor DarkGray
        & tar.exe -xf "$BackupFile" -C "$RestoreDir" 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "tar saiu com codigo $LASTEXITCODE" }
    }
}
catch {
    Write-Host "  [ERRO] Falha ao extrair: $_" -ForegroundColor Red
    exit 1
}

$ExtractedCount = (Get-ChildItem $RestoreDir -Recurse -File).Count
Write-Host "  [+] $ExtractedCount ficheiros extraidos" -ForegroundColor DarkGray

if ($Rebuild) {
    Write-Host ""
    Write-Host "  [2/3] A reconstruir dependencias Node (pnpm install)..." -ForegroundColor DarkCyan

    Push-Location $RestoreDir
    try {
        pnpm install
        if ($LASTEXITCODE -ne 0) { throw "pnpm install falhou" }

        Write-Host ""
        Write-Host "  [3/3] A validar build..." -ForegroundColor DarkCyan
        pnpm run build
        if ($LASTEXITCODE -ne 0) { throw "pnpm run build falhou" }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "  [2/3] Dependencias nao reconstruidas (usa -Rebuild para reconstruir automaticamente)" -ForegroundColor DarkGray
    Write-Host "  [3/3] Passos manuais necessarios:" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "  RESTORE CONCLUIDO COM SUCESSO" -ForegroundColor Green
Write-Host ""
Write-Host "  Localizacao : $RestoreDir"
Write-Host "  Ficheiros   : $ExtractedCount"
Write-Host ""

if (-not $Rebuild) {
    Write-Host "  Proximos passos:" -ForegroundColor DarkCyan
    Write-Host "    cd `"$RestoreDir`""
    Write-Host "    corepack enable"
    Write-Host "    pnpm install"
    Write-Host "    pnpm run build"
    Write-Host ""
}
