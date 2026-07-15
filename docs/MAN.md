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
// Ambas as formas são equivalentes:
import '@carloscanutocosta/core-ui/styles';
// ou, com extensão explícita (@normordis/core-ui/styles.css):
// import '@normordis/core-ui/styles.css';
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

## Inputs personalizados com FieldWrapper

O `FieldWrapper` é o contentor semântico de todos os campos de formulário — gere o
label, hint, mensagem de erro e os IDs ARIA associados. Todos os `*Field` do SDK
injetam automaticamente `aria-invalid`, `aria-describedby` e `aria-required` nos
seus controlos internos via `FieldContext`.

Para criar um input personalizado que se comporte como os nativos do SDK, usa-se
`useFieldContext` e `FieldContextValue`, exportados pelo entrypoint principal:

```tsx
import {
  FieldWrapper,
  useFieldContext,
} from '@carloscanutocosta/core-ui';
import type { FieldContextValue } from '@carloscanutocosta/core-ui';

// Input personalizado que consome o contexto do FieldWrapper pai.
function MyCustomInput({ value, onChange, ...props }) {
  // Retorna null quando chamado fora de um FieldWrapper — sem crash.
  const field = useFieldContext();

  return (
    <input
      value={value}
      onChange={onChange}
      // Atributos ARIA injetados automaticamente pelo contexto:
      id={field?.id}
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
      aria-required={field?.required || undefined}
      {...props}
    />
  );
}

// Uso — FieldWrapper gere label, hint, erro e os IDs ARIA.
// MyCustomInput lê esses IDs via contexto sem acoplamento direto.
<FieldWrapper
  label="Campo personalizado"
  hint="Texto de ajuda"
  error="Mensagem de erro"
  required
>
  <MyCustomInput value={value} onChange={setValue} />
</FieldWrapper>
```

### Contrato de `FieldContextValue`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string` | ID estável do campo — usar em `id` e como alvo de `htmlFor` |
| `invalid` | `boolean` | `true` quando existe uma mensagem de erro |
| `describedBy` | `string \| undefined` | Valor para `aria-describedby` — aponta para o ID do erro ou hint |
| `required` | `boolean` | `true` quando o campo é obrigatório |

### Componentes Radix UI

Para componentes baseados em Radix, os atributos ARIA são passados como props ao
elemento Radix, que os propaga para o elemento interativo correto:

```tsx
import { Switch } from '@/components/ui/switch';
import { useFieldContext } from '@carloscanutocosta/core-ui';

function MySwitch(props) {
  const field = useFieldContext();
  return (
    <Switch
      {...props}
      // O Radix Switch propaga estes atributos para o <button role="switch"> interno.
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
    />
  );
}
```

Para editores ricos (contenteditable, ReactQuill, etc.) onde não é possível
injetar atributos ARIA no elemento interno, usa-se um `<div role="group">` como
contentor semântico:

```tsx
function MyRichEditor({ value, onChange, ...props }) {
  const field = useFieldContext();
  return (
    <div
      role="group"
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
    >
      <MyEditorLibrary value={value} onChange={onChange} />
    </div>
  );
}
```

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
- `pnpm run pack:inspect` — gera e inspeciona o pacote em `D:\tmp`.
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
