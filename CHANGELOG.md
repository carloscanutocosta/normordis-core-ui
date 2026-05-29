# Changelog

Todas as alterações relevantes deste projeto devem ser documentadas neste ficheiro.

O formato segue a ideia de Keep a Changelog e o versionamento deve seguir SemVer.

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
