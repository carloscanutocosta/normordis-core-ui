# Windows Setup - Trust Baseline

Estado: Draft v0.1.0.

## Objetivo

Definir a forma recomendada de executar a Trust Baseline v0.1 em Windows 11,
PowerShell 7, Git for Windows e VSCode.

## Requisitos mínimos

- Windows 11.
- PowerShell 7 ou superior.
- Git for Windows.
- Node.js 24.x.
- pnpm 10.20.0 via Corepack.

## Execution policy

Recomendação para desenvolvimento local:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Execução pontual:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/security/generate-manifest.ps1
```

## Testes locais

Gerar manifest:

```powershell
pnpm run security:manifest
```

Verificar manifest:

```powershell
pnpm run security:verify
```

## Integração GitHub Actions

O workflow `.github/workflows/trust-baseline.yml` usa runner Windows
(`windows-2022`), PowerShell, Node 24.x e pnpm 10.20.0. A geração de SBOM ocorre
via Syft, sem secrets e sem serviços pagos.
