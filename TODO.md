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
  - estados `disabled`, `invalid` e erro associado quando usado em formulários;
  - foco visível no editor e nos controlos da toolbar;
  - compatibilidade com temas claro, escuro e alto contraste;
  - API pública reutilizável, sem dependência directa de web app host, Tauri ou
    backend.
