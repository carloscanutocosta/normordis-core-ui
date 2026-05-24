# Trust Graph

Estado: Draft v0.1.0.

## Objetivo

Descrever, de forma simples e validável, as relações mínimas entre fonte,
pipeline, dependências, artefactos, manifests e provenance.

## Âmbito

O grafo inicial cobre o caminho mínimo de confiança de `normordis-core-ui`:
código fonte, GitHub Actions, lockfile pnpm, SBOM, build Vite, pacote `.tgz`,
manifesto, atestação e GitHub Release draft.

## Regras mínimas

- Cada nó deve ter identificador estável.
- Cada aresta deve declarar origem, destino e relação.
- Alterações estruturais devem ser documentadas quando tiverem impacto
  transversal.
- O JSON deve permanecer simples e extensível.

## Evidência esperada

- `security/TRUST_GRAPH.json`.
- Validação opcional por `security/schemas/trust-graph.schema.json`.
- Artefactos de CI em `artifacts/trust/`.
