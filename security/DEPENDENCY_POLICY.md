# Política de Dependências

Estado: Draft v0.1.0.

## Objetivo

Definir regras mínimas para introdução, revisão e evidência de dependências.

## Âmbito

Aplica-se a dependências Node/pnpm usadas neste repositório.

## Regras mínimas

- `pnpm-lock.yaml` é obrigatório e deve ser versionado.
- `package-lock.json`, `npm-shrinkwrap.json` e `yarn.lock` não são permitidos.
- `react` e `react-dom` devem permanecer em `peerDependencies`.
- Novas dependências devem ser revistas quanto a manutenção, origem, licença,
  superfície de execução, peso e necessidade real.
- Scripts `postinstall` e equivalentes devem ser tratados como código
  executável de terceiros.
- Dependências abandonadas, sem release recente ou sem repositório verificável
  exigem justificação.
- Dependências críticas devem ter substituto ou mitigação documentada.
- `pnpm audit --audit-level high` corre em CI como evidência observacional.
- SBOM CycloneDX deve ser gerado em CI via Syft.

## Evidência esperada

- `pnpm-lock.yaml` versionado.
- Resultado de `pnpm run check`.
- Resultado de `pnpm audit --audit-level high`.
- SBOM em `artifacts/trust/sbom.cyclonedx.json`.
- Justificação em PR ou ADR para dependências sensíveis.

## Relação com NORMORDIS

Dependências afetam diretamente a cadeia de confiança de artefactos
institucionais. A política reduz alterações implícitas e facilita auditoria.
