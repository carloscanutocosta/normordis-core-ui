# ============================================================
#  Publicacao no GitHub Packages -- normordis-core-ui
#  Ver docs\PUBLISHING.md para instrucoes detalhadas.
#
#  Uso rapido:
#    .\scripts\publish-sdk.ps1 -t ghp_xxxxxxxxxxxx
#    .\scripts\publish-sdk.ps1 -t ghp_xxxxxxxxxxxx -DryRun
#    .\scripts\publish-sdk.ps1 -t ghp_xxxxxxxxxxxx -SkipBuild
# ============================================================

param(
    [Alias("t")]
    [string]$Token,
    [switch]$SkipBuild,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $RepoRoot

# Resolver token: parametro -t tem prioridade sobre variavel de ambiente
if ($Token) {
    $env:GITHUB_TOKEN = $Token
    Write-Host ">>> Token recebido via parametro -t." -ForegroundColor DarkGray
}

# Verificar que existe token valido
if (-not $env:GITHUB_TOKEN -or $env:GITHUB_TOKEN -eq "dev-placeholder") {
    Write-Host ""
    Write-Host "[ERRO] GITHUB_TOKEN nao esta definido." -ForegroundColor Red
    Write-Host ""
    Write-Host "  Opcao A -- passar o token directamente (recomendado):" -ForegroundColor Yellow
    Write-Host '    .\scripts\publish-sdk.ps1 -t ghp_xxxxxxxxxxxx' -ForegroundColor White
    Write-Host ""
    Write-Host "  Opcao B -- definir na sessao PowerShell actual:" -ForegroundColor Yellow
    Write-Host '    $env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"' -ForegroundColor White
    Write-Host '    .\scripts\publish-sdk.ps1' -ForegroundColor White
    Write-Host ""
    Write-Host "  Como obter o token: ver docs\PUBLISHING.md" -ForegroundColor DarkGray
    exit 1
}

# Ler versao actual
$pkg     = Get-Content "package.json" | ConvertFrom-Json
$version = $pkg.version
$name    = $pkg.name

Write-Host ">>> Publicar $name@$version no GitHub Packages" -ForegroundColor Cyan

if (-not $SkipBuild) {
    Write-Host ">>> 1. A construir SDK..." -ForegroundColor Cyan
    pnpm run build
    if ($LASTEXITCODE -ne 0) { throw "build falhou -- cancela publicacao" }
} else {
    Write-Host ">>> 1. Build ignorado (-SkipBuild)." -ForegroundColor DarkGray
}

Write-Host ">>> 2. A verificar barrel..." -ForegroundColor Cyan
node (Join-Path $RepoRoot "scripts\check-exports.mjs")
if ($LASTEXITCODE -ne 0) { throw "colisoes de nomes detectadas -- cancela publicacao" }

if ($DryRun) {
    Write-Host ">>> [DRY RUN] Publicacao simulada -- nenhum pacote enviado." -ForegroundColor Yellow
    pnpm pack --dry-run
    exit 0
}

# Injetar token no ~/.npmrc do utilizador apenas durante o publish.
# O .npmrc do repositorio define o registry mas nao guarda tokens.
# Esta abordagem nao polui o repositorio nem deixa tokens em disco apos o publish.
$userNpmrc  = Join-Path $env:USERPROFILE ".npmrc"
$tokenLine  = "//npm.pkg.github.com/:_authToken=$env:GITHUB_TOKEN"
$backupContent = $null

if (Test-Path $userNpmrc) {
    $backupContent = Get-Content $userNpmrc -Raw -Encoding UTF8
    # Nao duplicar se ja existir uma linha para este registry
    $alreadyHasToken = $backupContent -match [regex]::Escape("//npm.pkg.github.com/:_authToken")
} else {
    $alreadyHasToken = $false
}

try {
    if (-not $alreadyHasToken) {
        Add-Content -Path $userNpmrc -Value $tokenLine -Encoding UTF8
        Write-Host ">>> Token injectado em ~/.npmrc para esta publicacao." -ForegroundColor DarkGray
    } else {
        # Substituir a linha existente com o token actual
        $newContent = $backupContent -replace "//npm\.pkg\.github\.com/:_authToken=.*", $tokenLine
        Set-Content -Path $userNpmrc -Value $newContent -Encoding UTF8
        Write-Host ">>> Token actualizado em ~/.npmrc para esta publicacao." -ForegroundColor DarkGray
    }

    Write-Host ">>> 3. A publicar..." -ForegroundColor Cyan
    pnpm publish --no-git-checks
    if ($LASTEXITCODE -ne 0) { throw "publicacao falhou" }

    Write-Host ""
    Write-Host "------------------------------------------------" -ForegroundColor Green
    Write-Host " $name@$version publicado com sucesso!" -ForegroundColor Green
    Write-Host "------------------------------------------------" -ForegroundColor Green
    Write-Host "Registry: https://github.com/carloscanutocosta/normordis-core-ui/packages" -ForegroundColor Gray

} finally {
    # Restaurar ~/.npmrc ao estado original
    if (-not $alreadyHasToken) {
        if ($backupContent) {
            Set-Content -Path $userNpmrc -Value $backupContent -Encoding UTF8
        } else {
            Remove-Item $userNpmrc -ErrorAction SilentlyContinue
        }
        Write-Host ">>> ~/.npmrc restaurado." -ForegroundColor DarkGray
    }
}
