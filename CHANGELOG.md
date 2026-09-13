# Changelog

Todas as alterações relevantes deste projeto devem ser documentadas neste ficheiro.

O formato segue a ideia de Keep a Changelog e o versionamento deve seguir SemVer.

## [Unreleased]

## [2.0.1] - 2026-09-13

Correção de duas regressões introduzidas pela 2.0.0, identificadas em revisão
pós-publicação do PR #32.

### Fixed (crítico)

- **`RichTextField` quebrava ao montar sob React 19**: `react-quill` usa
  `ReactDOM.findDOMNode` internamente, removido no React 19
  (`TypeError: react_dom_1.default.findDOMNode is not a function`). Nenhum
  teste renderizava o componente, pelo que a suite completa passava com o
  editor inutilizável em runtime. Substituído por `react-quill-new` (fork
  mantido, mesma API pública, `peerDependencies` declara suporte a React
  16–19) — `peerDependencies`/`peerDependenciesMeta` atualizadas
  (`react-quill` → `react-quill-new >=3.8.3`, ambas opcionais; a 3.8.3 é o
  mínimo real necessário — versões anteriores do fork não publicam o CSS
  que o componente importa, `dist/quill.snow.css`, algo só detectado
  correndo a suite contra o mínimo exato). Adicionado
  `src/test/forms/RichTextField.test.jsx` para prevenir regressão.

### Fixed

- **`Calendar` — seletores CSS que nunca correspondiam**: a migração para
  `react-day-picker` v9+/v10 manteve seletores `:has([aria-selected])` /
  `:has(>.range-start)` na classe `day`, herdados da estrutura da v8. Na
  v9+/v10, `aria-selected`, `data-selected` e as classes de modificador
  (`selected`, `outside`, `range_start`, `range_end`) são aplicadas ao
  próprio `<td>` ("day"), não a um descendente — `:has()` procura sempre um
  descendente, pelo que nunca correspondia a nada (sem erro, sem crash —
  apenas fundo/arredondamento em falta em dias selecionados, hoje e
  intervalos). Reescrito para seletores de filho direto (`[&>button]`), que
  refletem a estrutura real do DOM. Adicionado
  `src/test/forms/Calendar.test.jsx`, fixando a estrutura DOM da lib. Os
  testes usam apenas `aria-selected` (não `data-selected`/`data-today`):
  confirmado, correndo contra `react-day-picker@9.0.0` (o mínimo
  anunciado), que estes `data-*` por-dia só existem numa versão posterior.
- **`Calendar` — cor errada em intervalos multi-dia** (apanhado pelo revisor
  automático Codex no PR #33): o react-day-picker marca cada dia do meio de
  um intervalo como `selected` **e** `range_middle` simultaneamente. A
  primeira versão desta correção dava a cada um a sua cor via CSS
  (`bg-primary` para `selected`, `bg-accent` para `range_middle`) no mesmo
  elemento — com a mesma especificidade, quem "vencia" dependia da ordem de
  emissão do Tailwind, não da intenção do código, e os dias do meio ficavam
  com a cor de seleção única (`primary`) em vez da cor de intervalo
  (`accent`). Só visível com uma seleção de intervalo real de vários dias;
  o teste anterior só cobria seleção única. Corrigido com um `DayButton`
  customizado (`CalendarDayButton`) que decide a cor em JavaScript, com
  prioridade explícita e mutuamente exclusiva, em vez de depender da
  cascata CSS. Teste de intervalo multi-dia adicionado.

### CI

- **Novo workflow `peer-matrix.yml`** (`scripts/bash/test-min-peers.sh`):
  corre lint, typecheck, testes e build contra os mínimos reais de
  `peerDependencies` (`react@18.2.0`, `react-dom@18.2.0`,
  `recharts@3.0.0`, `react-day-picker@9.0.0`, `react-quill-new@3.8.3`), não
  só contra as versões de desenvolvimento. Foi correndo isto manualmente
  que se descobriram os dois bugs acima.
- **Chromatic: removido `exitOnceUploaded`**. O job publicava o Storybook e
  saía sem esperar pelo resultado real dos 235 testes visuais (corriam
  depois, assincronamente, no servidor do Chromatic) — isto deu check verde
  num PR cujo build no Chromatic reportou "component errors" em todos os
  charts, sem que ninguém fosse notificado. Agora o job espera e falha se
  houver diffs/erros pendentes de revisão. Tier gratuito do Chromatic: só
  testa Chrome — não cobre regressões específicas de Safari/Firefox.

## [2.0.0] - 2026-09-13

Atualização completa da stack de build/test/runtime, avaliada a partir dos
PRs do Dependabot em aberto e do `pnpm outdated`. Ver PR de upgrade
`chore/full-stack-upgrade-2026-09`.

### Changed (breaking)

- **`recharts` `>=2.0.0` → `>=3.0.0`** (peer dependency). `ChartTooltipContent`/
  `ChartLegendContent` (`src/components/ui/chart.tsx`) e o label customizado
  do `PieChart` foram ajustados à nova forma das props de `content` do
  Recharts v3. Consumidores em recharts v2 deixam de ser suportados.
- **`react-day-picker` `>=8.10.0` → `>=9.0.0`** (peer dependency). O
  componente `Calendar` foi reescrito para a nomenclatura de `classNames` e
  `components.Chevron` da v9+/v10 (`month_caption`, `button_previous`,
  `day_button`, `range_start/end/middle`, etc. — ver
  https://daypicker.dev/upgrading); `DateField`/`DateInput` usam agora
  `autoFocus` em vez de `initialFocus` (removido).
- `tailwind.config.js` passa a ser carregado como configuração legada do
  Tailwind v4 via `@config` no CSS de entrada (`src/index.css`), em vez de
  ser lido diretamente pelo PostCSS. **A API pública mantém-se** — o export
  `./tailwind.config` continua válido e sem alterações para quem já o
  consome — mas o motor interno passou de `tailwindcss` (plugin PostCSS
  direto) para `@tailwindcss/postcss`.

### Changed

- Toolchain de build/test elevada para as versões major mais recentes
  disponíveis: TypeScript 7 (com `@typescript/typescript6` como ponte de
  compatibilidade para o `vite-plugin-dts`), Vite 8, Vitest 5 (+
  `@vitest/coverage-v8` 5), Tailwind CSS 4, React 19 (+ `@types/react`,
  `@types/react-dom`), `react-router-dom` 7, `framer-motion` 13,
  `lucide-react` 1.x, `react-leaflet` 5, `@hookform/resolvers` 5, `date-fns`
  4, `@hello-pangea/dnd` 18, `jsdom` 30, `jest-axe` 11,
  `@testing-library/jest-dom` 7, `size-limit`/`@size-limit/preset-small-lib`
  13, Storybook 10.6, e patches/minors de `@radix-ui/*`, `zod`, `dompurify`,
  `sonner`, `input-otp`, `react-hook-form`, `@tanstack/react-query`, entre
  outros.
- `vite.config.js`/`vitest.config.js`: `__dirname` substituído por
  `import.meta.dirname` (o Vite 8 vai deixar de suportar `__dirname` na
  resolução nativa de config).
- GitHub Actions atualizadas: `actions/checkout` v7, `actions/setup-node` v7,
  `pnpm/action-setup` v6, `chromaui/action` v18, `gitleaks/gitleaks-action`
  v3.
- `OTPInput`: callback ref ajustado para devolver `void` em vez do elemento
  (exigido pelos novos tipos de `Ref` do React 19, que passaram a aceitar
  também uma função de cleanup).
- `jsconfig.json`: `noImplicitAny`/`strict` fixados explicitamente a `false`
  para preservar o comportamento de tipagem anterior (o TypeScript 7 passou
  a assumir `noImplicitAny: true` por omissão); adicionado `src/global.d.ts`
  com `declare module '*.css'` (o TypeScript 7 passou a validar também
  imports de efeito lateral sem tipos, erro TS2882).

### Deliberadamente não atualizado

- **ESLint mantido em 9.x** (não subiu para 10.x): `eslint-plugin-react`
  ainda não suporta ESLint 10 (`peerDependencies` trava em `^9.7`) e falha
  em runtime (`contextOrFilename.getFilename is not a function`). Reavaliar
  quando o plugin publicar suporte.

### Changed (from Unreleased, carried over)

- Scripts operacionais reorganizados por runtime em `scripts/bash/` e
  `scripts/powershell/`, com Bash como entrada principal dos comandos `pnpm`.
- Adicionadas variantes Bash para build, checks, demo, publicação, backup e
  restauro, mantendo as variantes PowerShell para compatibilidade Windows.
- A abertura automática do browser no playground Bash passou a ser opcional
  através de `pnpm run demo -- --open`.
- Adicionada cópia offsite não cifrada para Google Drive com `rclone copy
  --immutable`, sem propagação de eliminações locais.
- Adicionado timer `systemd --user` diário para executar sequencialmente o
  backup local e a cópia offsite, com logs operacionais centralizados.
- Limitada a retenção a 5 snapshots no SSD e no Google Drive; documentada a
  cobertura do log pela política central de `logrotate`.
- Alinhada a documentação de consumo com o pacote público
  `@carloscanutocosta/core-ui`, a versão `1.0.2` e o entrypoint CSS
  `@carloscanutocosta/core-ui/styles.css`.
- Atualizadas as actions de checkout e CodeQL para as versões atuais.

### Fixed

- Corrigida a raiz do repositório no gerador PowerShell do manifesto de
  confiança, para produzir a evidência em `artifacts/trust/`.
- `NormordisEditorToolbar`: `insertList` → `$insertList` (o Lexical ≥0.25
  renomeou este export; o ambiente de dev do próprio `core-ui` ainda
  resolvia um 0.21.0 desatualizado com o nome antigo, o que partia
  silenciosamente os consumidores). `resizable.tsx` migrado para a API do
  `react-resizable-panels` v4 (`Group`/`Separator`). `peerDependencies` de
  `@lexical/*` e `react-resizable-panels` apertadas para o intervalo real
  suportado.

## [1.0.0] - 2026-05-29

### Added

- **Storybook + Chromatic** — 36 ficheiros de stories (CSF3 + autodocs) cobrindo todos os
  grupos de componentes: display, charts, ui-extra, layout, forms/inputs,
  forms/fields e data. Publicação automática no Chromatic a cada push.
- **Testes de smoke e acessibilidade** — 358 testes (vitest + @testing-library/react +
  jest-axe) cobrindo display, charts, forms inputs/fields e data. Todos os
  componentes testados incluem verificação axe.

### Changed

- **Migração TypeScript completa** — 97 componentes renomeados de `.jsx` para `.tsx`
  com interfaces de props explícitas em todos os componentes públicos.
  `FormField`, `FieldWrapper` e todos os wrappers de formulário passaram a ter
  interfaces completas com props correctamente opcionais.
- **`cmdk` movido para `peerDependencies` (opcional)** — era uma dependência interna
  bundled que quebrava o `size-limit` em CI (pnpm strict mode no Linux não
  hoistava as deps transitivas da Radix para `dist/node_modules/`). AppShell
  reduziu de **24.5 kB → 20.2 kB** (brotli).
- **`pnpm-lock.yaml` sincronizado** com o `package.json` (peer dep specifiers
  tinham mudado de `^x` para `>=x` e `leaflet` tinha sido adicionado mas nunca
  commitado no lock).

### Fixed

- **7 violações de acessibilidade** encontradas pelos testes axe e corrigidas nos componentes:
  - `PasswordInput` — botão mostrar/ocultar sem `aria-label`
  - `TagsInput` — input interno sem label acessível
  - `SliderInput` + `ui/slider.tsx` — `aria-label` propagado ao `SliderThumb` do Radix
  - `AlertBanner` — botão de dispensar sem `aria-label`
  - `Breadcrumbs` — botão Home (só ícone) sem `aria-label`
  - `DataTable` — botões de paginação e `<select>` de página sem nomes acessíveis
  - `ProgressDisplay` — `role="progressbar"` sem nome acessível
- **ESLint** — override para `*.stories.*` que permitia hooks em funções `render` do
  CSF3 (false-positive de `react-hooks/rules-of-hooks`).
- **size-limit em CI** — `cmdk` como peer dep resolve o erro
  `Cannot resolve @radix-ui/react-primitive` causado pelo pnpm strict mode em Linux.
- **TypeScript** — 69 erros pós-rename corrigidos; `@ts-nocheck` aplicado a ficheiros
  de integração com Lexical e jsPDF onde os tipos publicados divergem da API runtime.

### Breaking Changes

- `cmdk` foi movido de `dependencies` para `peerDependencies` (opcional).
  Se usas `WorkspaceCommandPalette`, adiciona ao teu projecto:
  ```bash
  pnpm add cmdk
  ```

---

## [0.1.1] - 2026-05-28

### Fixed

- Sincronização do `pnpm-lock.yaml` após alteração de specifiers de peer deps.

---

## [0.1.0] - 2026-05-24

### Added

- Conversão inicial do projeto para o pacote `@normordis/core-ui`.
- Build em modo biblioteca com Vite.
- Entrada pública do SDK em `src/index.js`.
- Documentação inicial em `README.md` e `docs/MAN.md`.
- Licença EUPL-1.2.
- CI inicial com lint, typecheck e build.
- Fixação inicial de Node.js 24 e pnpm 10.
- Scripts PowerShell para check, build debug/release e backup/restore do repositório.
- Pasta `tools/` com validações de higiene do repositório, documentação,
  inspeção de pacote e checklist a11y.
- Baseline de segurança e release com workflows CI/Trust/Release, scripts de
  manifest, política de dependências/provenance e Security Policy.
- Componente inicial `NormordisEditorLexical`, baseado em Lexical, exportado na
  API pública do SDK.
- Toolbar Lexical separada em `NormordisEditorToolbar`, com helpers exportados
  para permitir personalização por apps consumidoras.
- Serializer inicial para `.ncrtf`, contrato em `docs/formats/NCRTF.md` e
  componente composto `DocumentEditor`.
- Documentação do fluxo `Lexical JSON -> NCRTF -> core-documental -> NDF de
  custódia em DB`, mantendo NCRTF como fronteira estável entre editores rich
  text e domínio documental.
- Remoção de integrações herdadas de autenticação/app host e dependências de
  negócio do pacote, incluindo Stripe e SDKs de fornecedores externos.
