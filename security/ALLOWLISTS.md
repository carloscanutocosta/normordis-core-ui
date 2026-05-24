# Allowlists e Blocklists

Estado: Draft v0.1.0.

## Objetivo

Registar a intenção e o formato inicial para allowlists e blocklists futuras.

## Âmbito

Aplica-se a dependências, licenças, actions, imagens e ferramentas usadas neste
repositório.

## Regras mínimas

- Não existe allowlist permissiva por omissão.
- Entradas futuras devem ter motivo, data, responsável e âmbito.
- Blocklists devem indicar impacto esperado e alternativa recomendada.
- Exceções devem ser temporárias e rastreáveis.

## Allowlist atual

### Build scripts Node aprovados

| Pacote | Motivo |
| --- | --- |
| `esbuild` | Dependência técnica do pipeline Vite |

### Actions GitHub aprovadas

| Action | Motivo |
| --- | --- |
| `actions/checkout` | Checkout de código fonte |
| `actions/setup-node` | Preparação de Node.js |
| `pnpm/action-setup` | Preparação de pnpm |
| `actions/upload-artifact` | Preservação de evidência CI |
| `actions/attest` | Atestação de artefactos |

## Evidência esperada

- PR ou ADR para listas formais.
- Referência ao SBOM quando aplicável.
- Revisão periódica em ciclo de release.
