# Plano - Editor Lexical NORMORDIS

## Objetivo

Implementar no `normordis-core-ui` um editor rich text baseado em Lexical, com
toolbar acessível, integração com os temas do SDK e exportação/importação para
formatos NORMORDIS.

O editor deve ser reutilizável entre apps e não deve depender directamente de
web app host, filesystem, Tauri, backend, autenticação ou regras de negócio de
uma app concreta.

## Princípios

- O `core-ui` fornece UI, contrato de edição e serialização.
- As apps consumidoras decidem onde gravar, como descarregar ou como enviar os
  payloads.
- Lexical JSON é a representação canónica interna.
- `.ndt`, `.ndf` e `.ncrft` devem ter contratos documentados antes de estabilizar
  API pública.
- Acessibilidade é requisito funcional: teclado, foco visível, nomes acessíveis,
  contraste e estados percetíveis sem depender apenas da cor.

## Estrutura proposta

```text
src/components/editor/
  DocumentEditor.jsx
  NormordisLexicalEditor.jsx
  NormordisEditorToolbar.jsx
  SemanticBlockMenu.jsx
  editorCommands.js
  editorState.js
  plugins/
    SemanticBlocksPlugin.jsx
  nodes/
    SemanticBlockNode.jsx
  serializers/
    lexical-json.js
    ndt.js
    ndf.js
    ncrft.js
  index.js
```

## Componentes

### `NormordisLexicalEditor`

Editor base Lexical.

Responsabilidades:

- receber `value`, `defaultValue`, `onChange`, `disabled`, `readOnly`,
  `invalid`, `required` e mensagens associadas;
- aplicar tema visual do `core-ui`;
- expor estado de foco e erro de forma acessível;
- não gravar ficheiros nem chamar serviços externos.

### `EditorToolbar`

Toolbar acessível e operável por teclado. A toolbar default deve viver separada
do editor e poder ser substituída pelas apps consumidoras via prop, sem obrigar
à reimplementação do editor Lexical.

Comandos mínimos:

- undo/redo;
- negrito;
- itálico;
- sublinhado;
- headings;
- listas;
- links;
- limpar formatação;
- inserção de bloco semântico.

Regras:

- comandos importantes devem ter rótulo visível, não só ícone;
- botões toggle devem expor `aria-pressed`;
- botões indisponíveis devem usar `disabled`;
- tooltips são complemento, não substituto de nome acessível.
- helpers de comandos e componentes básicos da toolbar devem ser exportáveis
  para permitir toolbars personalizadas consistentes.

### `DocumentEditor`

Componente composto para uso directo pelas apps:

```jsx
<DocumentEditor
  value={value}
  onChange={setValue}
  semanticBlocks={blocks}
  formats={["ndt", "ndf", "ncrft"]}
  onExport={(format, payload) => {}}
/>
```

## Blocos semânticos

O editor deve suportar blocos semânticos: blocos de texto configuráveis que
podem ser introduzidos no documento a partir da toolbar ou de um menu contextual.

Objetivo:

- permitir reutilização de texto institucional recorrente;
- inserir cláusulas, notas, avisos, fundamentos, assinaturas, secções padrão ou
  excertos parametrizáveis;
- preservar significado estrutural, não apenas HTML visual.

Exemplo de configuração:

```js
const semanticBlocks = [
  {
    id: "legal.notice",
    label: "Aviso legal",
    description: "Texto padrão para aviso legal.",
    category: "Avisos",
    content: {
      type: "paragraphs",
      blocks: [
        "Este documento contém informação institucional sujeita a validação."
      ]
    }
  },
  {
    id: "signature.standard",
    label: "Assinatura padrão",
    category: "Assinaturas",
    placeholders: [
      { id: "name", label: "Nome" },
      { id: "role", label: "Função" }
    ],
    content: {
      type: "template",
      text: "{{name}}\n{{role}}"
    }
  }
];
```

Requisitos dos blocos semânticos:

- cada bloco deve ter `id`, `label` e conteúdo;
- categorias opcionais devem permitir agrupamento no menu;
- placeholders devem ser explícitos e validáveis;
- a inserção deve ser operável por teclado;
- o bloco inserido deve manter metadata suficiente para exportação;
- o utilizador deve conseguir distinguir blocos semânticos de texto normal
  quando isso for relevante;
- estados de erro devem indicar placeholders em falta ou bloco inválido;
- a API deve permitir às apps fornecerem blocos próprios sem acoplar o editor a
  regras de negócio.

Possível nó Lexical:

```js
{
  type: "normordis-semantic-block",
  version: 1,
  blockId: "legal.notice",
  label: "Aviso legal",
  category: "Avisos",
  locked: false,
  placeholders: {},
  children: [...]
}
```

## Formatos

### `.ndt`

Formato editável NORMORDIS.

Uso esperado:

- reabrir no editor sem perda;
- preservar Lexical JSON, metadata e blocos semânticos;
- guardar versão de schema.

### `.ndf`

Formato final/intercâmbio.

Uso esperado:

- representar documento estabilizado;
- reduzir dependência directa de Lexical;
- preservar estrutura essencial, metadata e blocos resolvidos.

### `.ncrft`

Formato de template/craft.

Uso esperado:

- representar rascunhos, modelos ou documentos com placeholders;
- preservar blocos semânticos configuráveis;
- suportar composição por apps ou workflows externos.

## API de serialização

Funções puras, sem efeitos laterais:

```js
exportToNdt(editorState, options)
importFromNdt(payload)

exportToNdf(editorState, options)
importFromNdf(payload)

exportToNcrft(editorState, options)
importFromNcrft(payload)
```

As funções devem devolver `string`, `Blob` ou objecto serializado. A app decide
se faz download, grava em disco ou envia para backend.

## Fases

1. Documentar contratos iniciais de `.ndt`, `.ndf` e `.ncrft`. Concluído em
   `docs/formats/`.
2. Criar editor Lexical base com tema `core-ui`. Concluído em
   `NormordisEditorLexical`.
3. Implementar toolbar acessível. Concluído em `NormordisEditorToolbar`, com
   possibilidade de substituição por `ToolbarComponent`.
4. Implementar plugins básicos: history, lists, links, headings. Parcialmente
   concluído.
5. Implementar blocos semânticos configuráveis. Parcialmente concluído por
   inserção textual; falta nó Lexical próprio com metadata.
6. Implementar serialização `.ndt`. Concluído em `exportToNdt`.
7. Implementar serialização `.ndf`. Concluído em `exportToNdf`.
8. Implementar serialização `.ncrft`. Concluído em `exportToNcrft`.
9. Criar showcase com import/export local apenas para demonstração.
10. Validar acessibilidade e comportamento em temas claro, escuro e alto
    contraste.

## Checklist a11y

- Nome acessível da área editável.
- Toolbar navegável por teclado.
- Foco visível no editor e em todos os comandos.
- Estados `disabled`, `pressed`, `invalid` e erro associados semanticamente.
- Inserção de blocos semânticos operável sem rato.
- Contraste adequado nos temas claro, escuro e alto contraste.
- Mensagens de erro associadas a placeholders inválidos.
- Informação importante não transmitida apenas por cor.

## Fora de âmbito inicial

- Persistência em backend.
- Gravação directa em filesystem.
- Integração Tauri.
- Autenticação ou permissões de app.
- Assinatura digital de documentos.
- Motor de templates complexo fora do contrato de blocos semânticos.
