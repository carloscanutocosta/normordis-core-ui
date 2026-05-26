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

## Shell institucional (v2)

Implementar uma shell reutilizável que sirva de envolvente standard para todas
as aplicações desenvolvidas com o core-ui — Normordis ou externas — garantindo
coerência visual, estrutural e de navegação entre produtos.

Objectivo: qualquer app que use a shell herda automaticamente o layout, os
temas, a navegação e a identidade Normordis, sem ter de reimplementar estas
camadas.

Requisitos a definir:
- estrutura de layout (sidebar / topbar / conteúdo / footer);
- suporte a navegação configurável por props (itens de menu, rotas, permissões);
- integração nativa com o `ThemeSwitcher` e o sistema de temas do core-ui;
- zona de identidade configurável (logótipo, nome da aplicação, ambiente);
- suporte a notificações, perfil de utilizador e acções globais no header;
- compatibilidade com React Router e navegação por hash;
- responsiva e acessível (WCAG AA mínimo);
- exportada como componente de layout (`AppShell`) com slots bem definidos para
  que o consumidor injete o conteúdo das páginas.

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
