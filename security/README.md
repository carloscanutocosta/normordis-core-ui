# Trust Baseline v0.1

Estado: Draft v0.1.0.

## Objetivo

Definir uma baseline inicial de confiança verificável para
`normordis-core-ui`. A confiança não é assumida; deve ser suportada por
evidência reprodutível: SBOM, manifests, hashes, provenance, workflows com
permissões mínimas e política formal.

## Âmbito

Esta baseline aplica-se ao SDK React `@normordis/core-ui`, aos seus artefactos
de build e ao pacote npm gerado localmente por `pnpm pack`.

## Regras mínimas

- Manter `pnpm-lock.yaml` versionado como único lockfile ativo.
- Gerar SBOM CycloneDX em CI.
- Gerar `MANIFEST.sha256` e `MANIFEST.json`.
- Usar permissões mínimas em GitHub Actions.
- Evitar `latest` em actions, runners, Node e pnpm.
- Usar GitHub Artifact Attestations quando suportado.
- Não exigir secrets para a baseline MVP.
- Publicação npm automática apenas com trusted publishing/OIDC configurado.

## Evidência esperada

- `artifacts/trust/sbom.cyclonedx.json`.
- `artifacts/trust/MANIFEST.sha256`.
- `artifacts/trust/MANIFEST.json`.
- `artifacts/release/*.tgz` em workflow de release.
- Atestação GitHub quando disponível.

## Documentos

- [TRUST_GRAPH.md](TRUST_GRAPH.md)
- [DEPENDENCY_POLICY.md](DEPENDENCY_POLICY.md)
- [PROVENANCE_POLICY.md](PROVENANCE_POLICY.md)
- [RUNTIME_INTEGRITY.md](RUNTIME_INTEGRITY.md)
- [ALLOWLISTS.md](ALLOWLISTS.md)
- [WINDOWS_SETUP.md](WINDOWS_SETUP.md)

## Scripts

- `scripts/bash/security/generate-manifest.sh`
- `scripts/bash/security/verify-manifest.sh`
- `scripts/powershell/security/generate-manifest.ps1`
- `scripts/powershell/security/verify-manifest.ps1`
