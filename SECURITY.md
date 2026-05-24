# Security Policy

## Âmbito suportado

Este repositório mantém o SDK React `@normordis/core-ui`. A política de
segurança cobre:

- código fonte do SDK;
- dependências Node/pnpm;
- workflows GitHub Actions;
- artefactos de build, pacote npm local, SBOM e manifests;
- documentação de provenance e cadeia de confiança.

O repositório não contém backend, persistência, autenticação concreta nem
integrações runtime com sistemas institucionais.

## Reportar vulnerabilidades

Não abrir issues públicas com detalhes exploráveis. Usar um canal privado do
projeto ou GitHub Security Advisories quando o repositório estiver publicado com
essa funcionalidade ativa.

Ao reportar, incluir:

- versão ou commit afetado;
- descrição do impacto;
- passos mínimos de reprodução;
- dependência afetada, quando aplicável;
- mitigação conhecida, se existir.

## Baseline executável

A baseline de segurança local e CI é:

```bash
pnpm run check
pnpm run security:manifest
pnpm run security:verify
pnpm run pack:inspect
```

Em CI, os workflows `CI`, `Trust`, `Trust Baseline` e `Release` geram evidência
de build, manifest SHA-256, SBOM e atestação GitHub quando suportada.

## Publicação

Publicação npm automática só deve ser ativada depois de configurar trusted
publishing/OIDC no npm para este repositório. Até lá, o workflow de release cria
um GitHub Release draft com pacote `.tgz`, manifest e evidência.
