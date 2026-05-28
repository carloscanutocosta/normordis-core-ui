# TODO - normordis-core-ui

## Componentes editoriais

- Implementar um editor rich text baseado em Lexical, com toolbar acessível,
  operável por teclado e alinhada com os temas do `core-ui`. Ver
  `LEXICAL_PLAN.md`.

  Requisitos mínimos:
  - toolbar com comandos principais sempre com nome acessível;
  - suporte inicial para negrito, itálico, sublinhado, listas, headings, links
    e limpar formatação;
  - blocos semânticos configuráveis que possam ser introduzidos no texto;
  - serialização canónica para `.ncrtf`;
  - estados `disabled`, `invalid` e erro associado quando usado em formulários;
  - foco visível no editor e nos controlos da toolbar;
  - compatibilidade com temas claro, escuro e alto contraste;
  - API pública reutilizável, sem dependência directa de web app host, Tauri ou
    backend.

  V2:
  - prever templates editoriais com catálogo de placeholders por template;
  - validar placeholders obrigatórios, tipos, origem de dados e resolução antes
    da exportação/integração documental;
  - avaliar chips visuais para placeholders sem prender o NCRTF a nodes
    proprietários do editor.
  - melhorar imagens no editor: editar legenda após inserção, substituir
    imagem, alinhar à esquerda/centro/direita, usar presets de largura,
    suportar drag resize, validar tamanho/formato e decidir política para
    imagens externas vs embutidas.
  - melhorar tabelas no editor: alterar linhas/colunas, editar cor de fundo,
    configurar células/cabeçalhos e suportar operações estruturais avançadas.
  - células de tabela com rich text completo (negrito, itálico, links, etc.):
    actualmente o `SimpleTableNode` guarda strings planas, pelo que a conversão
    `ncrtf→Lexical` achata o conteúdo rich text das células para plain text;
    em v2 as células devem suportar inlines completos para round-trip perfeito.

## Shell institucional ✅ Concluído

Workspace SDK implementado com `AppShell`, `WorkspaceProvider`, `useApp()` e
todos os sub-componentes: `LeftRail`, `Header`, `TabBar`, `ContentArea`,
`StatusBar`, `RightRail`, `RightPanel`, `AtendimentoPanel`, `NotificationsPanel`,
`WorkspaceCommandPalette`. Inclui navegação multi-app, temas, badges dinâmicos,
comandos por app, notificações internas/externas, painel de atendimento com
sessão persistente, mobile responsive e manual completo em `docs/MAN_WORKSPACE.md`.

V2 (institucional):
- AppShell com identidade configurável (logótipo, nome da app, ambiente);
- suporte a React Router / hash navigation integrado na shell;
- zona de perfil de utilizador no header com avatar e menu contextual.

---

## v1 — Qualidade e Referência

Objectivo: tornar o `core-ui` numa referência técnica — testado, tipado,
documentado e publicado com rigor profissional.

### Testes ✅ Concluído (parcial)
- ✅ Configurar **Vitest** + **@testing-library/react** como base de testes unitários
  e de integração.
- ✅ Cobrir o workspace SDK: WorkspaceContext (57 testes), useApp, persistência de sessão.
- Testes de acessibilidade automáticos com **jest-axe** / **axe-core** em todos
  os componentes exportados.
- Meta de cobertura: ≥ 80 % das linhas nos componentes core.

### TypeScript completo ✅ Concluído
- ✅ Migrar todos os ficheiros `.jsx` do workspace para `.tsx` (AppShell, WorkspaceContext,
  ContentArea, LeftRail, Header, TabBar, StatusBar, RightRail, RightPanel,
  AtendimentoPanel, NotificationsPanel, WorkspaceCommandPalette).
- ✅ Migrar todos os 48 componentes shadcn/ui de `.jsx` para `.tsx`.
- ✅ Migrar `use-app.js` e `use-mobile.jsx` para `.ts`.
- ✅ Barrel `src/index.ts` (era `src/index.js`).
- ✅ Gerar `.d.ts` automáticos via `vite-plugin-dts` na pipeline de build (`tsconfigPath: './jsconfig.json'`).

### Persistência de sessão ✅ Concluído
- ✅ Guardar e restaurar `openTabs`, `activeApp` e `leftRailCollapsed` em `sessionStorage`.
- ✅ Restaurar `atendimento` (started, startTime, step, form) de `sessionStorage`.
- ✅ Testes de persistência (5 testes adicionados ao WorkspaceContext.test.jsx).

### CI/CD ✅ Concluído (parcial)
- ✅ Pipeline **GitHub Actions**: lint → typecheck → test → build → publish para npm (tag `v*`).
- Adoptar **Conventional Commits** (`feat:`, `fix:`, `chore:`, etc.) em todos
  os commits do repositório.
- Gerar **CHANGELOG.md** automático com `standard-version` ou `release-please`.
- Protecção da branch `main`: PRs obrigatórios, checks de CI obrigatórios antes
  de merge.

### Storybook ✅ Concluído (parcial)
- ✅ Configurar **Storybook 10** com o preset Vite.
- ✅ Stories para componentes workspace: AppShell (6 stories) e AtendimentoPanel (7 stories).
- ✅ Stories para Badge e Button (shadcn/ui).
- ✅ Usar **autodocs** para gerar documentação de props a partir de TS.
- Stories para os restantes componentes exportados: data, charts, layout.
- Publicar Storybook estático em GitHub Pages ou Chromatic.

### Bundle e tree-shaking
- Configurar **size-limit** para bloquear CI quando o bundle ultrapassar um
  limite definido (ex: < 120 kB gzip para o core sem workspace).
- Validar tree-shaking: importar um único componente e verificar que apenas os
  seus módulos transitivos entram no bundle do consumidor.
- Separar entrypoints no `vite.config.js` (ex: `core-ui/workspace`,
  `core-ui/charts`) para permitir imports granulares sem carregar o SDK inteiro.

## MapView (v2)
- Requer que o consumidor importe manualmente o CSS do Leaflet:
  ```js
  import 'leaflet/dist/leaflet.css'
  ```
  Sem este import os marcadores ficam sem ícone e o mapa pode renderizar incorrectamente.
  Para v2: considerar alternativa sem CSS externo (ex: maplibre-gl) ou injecção automática do CSS.

## AddressInput (v2)
- Lista de países hardcoded com apenas 7 entradas (PT, BR, ES, FR, DE, GB, US).
  Para v2: aceitar prop `countries` com lista configurável, ou integrar lista ISO 3166-1 completa.
- Usa `<select>` nativo em vez do componente `Select` do design system — inconsistência visual.
