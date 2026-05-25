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
