# MAN - normordis-core-ui

## Contrato

`normordis-core-ui` é a biblioteca frontend partilhada do ecossistema NORMORDIS.
O contrato público é a API exportada pelos três entrypoints do pacote:

| Entrypoint | Importação |
|---|---|
| Componentes e utilitários | `@carloscanutocosta/core-ui` |
| Workspace SDK | `@carloscanutocosta/core-ui/workspace` |
| Charts | `@carloscanutocosta/core-ui/charts` |
| CSS | `@carloscanutocosta/core-ui/styles` |

O preset Tailwind está exposto via o ficheiro `tailwind.config.js` publicado no pacote.

## Invariantes

- Componentes exportados devem ser reutilizáveis entre apps NORMORDIS.
- Componentes exportados não devem depender de Tauri, browser storage
  obrigatório, autenticação concreta, routing da app host, fornecedores de app
  externos ou chamadas diretas a backend.
- `react` e `react-dom` são dependências pares obrigatórias.
- Temas devem funcionar por classes CSS no elemento raiz: `dark`,
  `high-contrast` e `high-contrast-dark`.
- Utilitários importáveis não devem falhar em ambientes sem `window` ou `document`.
- Todos os componentes exportados devem ter interfaces TypeScript explícitas nos props.

## Limites

- A biblioteca é React-first.
- O pacote contém uma app/showcase herdada para validação manual, mas essa
  app não é parte do contrato público.
- Componentes que materializem workflows específicos devem viver em apps ou em
  pacotes próprios até haver evidência de reutilização transversal.
- Ficheiros do editor (NormordisEditorLexical, NormordisEditorToolbar, RichTextInput,
  nodes/) e do PDFConfigModal usam `@ts-nocheck` porque os tipos publicados pelas
  bibliotecas (Lexical, jsPDF) divergem da API runtime. Isto é intencional e
  documentado; a lógica foi validada por testes de comportamento.

## Integração

Apps consumidoras importam componentes do entrypoint principal e carregam o
CSS uma vez na entrada da aplicação:

```js
// entry point da app (ex: main.tsx)
import '@carloscanutocosta/core-ui/styles';
import { applyTheme, getStoredTheme } from '@carloscanutocosta/core-ui';

applyTheme(getStoredTheme()); // evita flash de tema errado
```

```jsx
import { Button, TextField, DataTable } from '@carloscanutocosta/core-ui';
import { AppShell } from '@carloscanutocosta/core-ui/workspace';
import { BarChart } from '@carloscanutocosta/core-ui/charts';
```

Apps que usem Tailwind devem adicionar o caminho do SDK ao `content`:

```js
// tailwind.config.js
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@carloscanutocosta/core-ui/dist/**/*.js',
  ],
};
```

O editor `NormordisEditorLexical` expõe uma base rich text baseada em Lexical. O
valor emitido por `onChange` usa Lexical JSON envolvido por metadata NORMORDIS.
Não grava ficheiros, não chama backend e não depende de web app host ou Tauri;
consumidores decidem como persistir ou exportar o payload. A toolbar default é
exportada como `NormordisEditorToolbar` e pode ser substituída por `ToolbarComponent`.

`DocumentEditor` compõe o editor com botão de exportação e chama
`onExport("ncrtf", payload)`. Os serializers `exportToNcrtf` / `importFromNcrtf`
são exportados pelo pacote. Contrato em `docs/formats/NCRTF.md`.

NCRTF é a fronteira entre editor rich text e domínio documental:
`Lexical JSON → NCRTF → core-documental → NDF de custódia em DB`.

## Qualidade

O CI corre automaticamente em cada push para `devel`/`main`:

```
format:check → lint → typecheck → test:coverage → build → size-limit → audit
```

Checks mínimos antes de publicar manualmente:

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run size
```

Atalhos operacionais:

- `pnpm run check` — higiene do repositório, lint, typecheck e build.
- `pnpm run check:repo` — valida invariantes estruturais do SDK.
- `pnpm run check:docs` — valida presença da documentação obrigatória.
- `pnpm run build:debug` — build local em modo `development`.
- `pnpm run build:release` — checks completos + build + validação do pacote.
- `pnpm run pack:inspect` — gera e inspeciona o pacote em `C:\tmp`.
- `pnpm run backup` — snapshot ZIP em `D:\Backup\normordis-core-ui`.
- `pnpm run security:manifest` — gera `MANIFEST.sha256` e `MANIFEST.json`.
- `pnpm run security:verify` — verifica o manifest gerado.

O restore completo é feito por `scripts/backup/full-repo-restore.ps1 -RestoreDir "<destino>"`.

## Release e segurança

A política de segurança vive em `SECURITY.md` e `security/`. A baseline usa:

- CI com lint, typecheck, 358 testes (Vitest + jest-axe) e cobertura ≥ 80% (workspace).
- Trust observacional com manifest SHA-256 e `pnpm audit --audit-level high`.
- Trust Baseline com SBOM CycloneDX e atestação GitHub.
- Release por tag `v*` ou `workflow_dispatch` — gera `.tgz`, manifest,
  artefactos de evidência e GitHub Release draft.
- Storybook publicado automaticamente no Chromatic a cada push.

## Trabalhos futuros (v1.1+)

- Stories para `KanbanBoard`, `GanttChart`, `CalendarView`, `MapView`.
- Expandir cobertura de testes para forms/data/charts nos thresholds do CI.
- Changesets para versionamento e release automatizado.
- Separar showcase herdado para `demo/` ou `examples/`.
