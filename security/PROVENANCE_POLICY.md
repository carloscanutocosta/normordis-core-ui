# Política de Provenance

Estado: Draft v0.1.0.

## Objetivo

Definir como a origem e o processo de produção de artefactos devem ser
registados e verificáveis.

## Âmbito

Aplica-se a artefactos de build, pacote `.tgz`, SBOM, manifests e outputs
técnicos produzidos por CI neste repositório.

## Regras mínimas

- Builds devem ser executados a partir de fonte Git versionada.
- Artefactos publicados devem ter hash SHA-256 registado no manifest.
- GitHub Artifact Attestations deve ser usado quando disponível.
- A ausência de atestação no MVP não deve bloquear builds, mas deve ficar
  visível no workflow.
- Artefactos não devem depender de secrets para a primeira baseline.
- Publicação npm automática exige trusted publishing/OIDC configurado no npm.
- Tokens npm clássicos só devem ser usados em exceção temporária e documentada.

## Evidência esperada

- `artifacts/trust/MANIFEST.sha256`.
- `artifacts/trust/MANIFEST.json`.
- `artifacts/trust/sbom.cyclonedx.json`.
- `artifacts/release/*.tgz`.
- Atestação GitHub quando suportada.
- Logs de CI preservados pelo fornecedor.

## Relação com NORMORDIS

Provenance permite ligar um artefacto institucional ao commit, pipeline e
contexto que o produziram, sem prometer segurança absoluta.
