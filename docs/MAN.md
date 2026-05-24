# MAN - normordis-core-ui

## Contrato

`normordis-core-ui` é a biblioteca frontend partilhada do ecossistema NORMORDIS.
O contrato público é a API exportada por `src/index.js`, o CSS publicado como
`@normordis/core-ui/styles.css` e o preset Tailwind exposto como
`@normordis/core-ui/tailwind.config`.

## Invariantes

- Componentes exportados devem ser reutilizáveis entre apps NORMORDIS.
- Componentes exportados não devem depender de Base44, Tauri, browser storage
  obrigatório, autenticação concreta, routing da app host ou chamadas diretas a
  backend.
- `react` e `react-dom` são dependências pares.
- Temas devem funcionar por classes CSS no elemento raiz: `dark`,
  `high-contrast` e `high-contrast-dark`.
- Utilitários importáveis não devem falhar em ambientes sem `window` ou
  `document`.

## Limites

- A biblioteca é React-first.
- O pacote ainda contém uma app/showcase herdada para validação manual, mas essa
  app não é parte do contrato público.
- Componentes que materializem workflows específicos devem viver em apps ou em
  pacotes próprios até haver evidência de reutilização transversal.

## Integração

Apps consumidoras devem importar componentes do pacote principal e carregar o
CSS uma vez na entrada da aplicação.

```jsx
import "@normordis/core-ui/styles.css";
import { Button } from "@normordis/core-ui";
```

Apps que usem Tailwind devem incluir o preset/config do pacote ou replicar os
tokens CSS publicados.

## Qualidade

Checks mínimos antes de publicar:

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run build`

Atalhos operacionais:

- `pnpm run check`: corre higiene do repositório, documentação, lint, typecheck
  e build.
- `pnpm run check:repo`: valida invariantes estruturais do SDK, incluindo
  lockfiles, Node/pnpm e dependências pares de React.
- `pnpm run check:docs`: valida a presença da documentação obrigatória.
- `pnpm run build:debug`: sincroniza dependências e gera build local em modo
  `development`, com log em `.logs`.
- `pnpm run build:release`: corre checks estruturais, lint, typecheck, build e
  validação do pacote com `pnpm pack --json --pack-destination C:\tmp`, salvo se
  for usado `-NoPack` diretamente no script PowerShell.
- `pnpm run pack:inspect`: gera e inspeciona o pacote em `C:\tmp`, validando os
  ficheiros públicos esperados.
- `pnpm run backup`: cria snapshot ZIP em `D:\Backup\normordis-core-ui`.
- `pnpm run security:manifest`: gera `MANIFEST.sha256` e `MANIFEST.json` em
  `artifacts/trust`.
- `pnpm run security:verify`: verifica o manifest gerado.
- `pnpm run restore:list`: lista backups disponíveis no destino por defeito.

O restore completo é feito diretamente por
`scripts/backup/full-repo-restore.ps1 -RestoreDir "<destino>"`. Com `-Rebuild`,
o script executa `pnpm install` e `pnpm run build` após a extração.

`scripts/` deve permanecer a fachada para operações completas. `tools/` contém
helpers reutilizáveis por scripts e CI: higiene de repositório, documentação,
inspeção de pacote e checklist a11y.

## Release e segurança

A política de segurança vive em `SECURITY.md` e `security/`. A baseline
executável usa:

- CI com `pnpm run check`.
- Trust observacional com manifest SHA-256 e `pnpm audit --audit-level high`.
- Trust Baseline com SBOM CycloneDX, manifest e atestação GitHub quando
  suportada.
- Release por tag `v*` ou `workflow_dispatch`, gerando pacote `.tgz`, manifest,
  artefactos de evidência e GitHub Release draft.

Publicação npm automática fica fora da baseline inicial até existir trusted
publishing/OIDC configurado no npm para este repositório.

O objetivo seguinte é adicionar testes unitários/comportamentais para os
componentes mais usados e documentação visual com Storybook ou equivalente.

## Trabalhos futuros

- Separar fisicamente o showcase herdado para `demo/` ou `examples/`.
- Remover integrações Base44 do caminho principal de desenvolvimento.
- Adicionar testes com Vitest e Testing Library.
- Adicionar Changesets para versionamento e release automatizado.
- Gerar declarações TypeScript para consumidores.
