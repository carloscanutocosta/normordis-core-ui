# NCRTF - Normordis Craft Document

Estado: Draft v0.1.0.

## Objetivo

`.ncrtf` é o formato canónico do editor NORMORDIS para documentos em composição.
Deve preservar o estado editável, blocos semânticos, placeholders e metadata.

O fluxo previsto é:

```text
rich text editor -> NCRTF -> core-documental -> NDF de custódia em DB
```

O editor concreto pode ser Lexical, Quill ou outro. O `core-documental` deve
consumir NCRTF, não o formato interno do editor. Se for introduzido outro editor
rich text, a integração esperada é criar apenas um serializador desse editor
para NCRTF, sem alterar o contrato do `core-documental`.

Formatos finais, de intercâmbio ou de custódia devem ser derivados de `.ncrtf`
por `core-documental` ou por renderizadores/exportadores próprios, não por
serializers editoriais paralelos dentro do `core-ui`.

## Contrato inicial

- MIME recomendado: `application/vnd.normordis.ncrtf+json`
- Schema: `normordis.document.craft`
- Encoding: JSON UTF-8
- Uso principal: representar rascunhos, modelos e documentos parametrizáveis.
- Consumidor de domínio esperado: `core-documental`.

## Estrutura

```json
{
  "schema": "normordis.document.craft",
  "version": "0.1.0",
  "kind": "craft-document",
  "status": "draft",
  "sourceEditor": "lexical",
  "document": {
    "schema": "normordis.editor.document",
    "version": "0.1.0",
    "lexical": {},
    "metadata": {}
  },
  "semanticBlocks": [],
  "placeholders": [],
  "metadata": {}
}
```

`sourceEditor` identifica a origem técnica do payload (`lexical`, `quill`, etc.)
para diagnóstico e migração. O domínio documental não deve depender desse campo
para interpretar regras de custódia.

Na v1, placeholders são tokens textuais no conteúdo editorial, como `{{nome}}`.
O campo `placeholders` pode permanecer vazio ou declarar marcadores conhecidos
quando a app consumidora já tiver esse catálogo. A v2 de templates poderá usar
esse campo para catálogo por template, obrigatoriedade, tipos, origem dos dados
e validação, mantendo o NCRTF independente de nodes proprietários de Lexical,
Quill ou outro editor rich text.

## Estado

`status` pode evoluir sem mudar o formato:

- `draft`
- `review`
- `final`

O estado `final` não torna `.ncrtf` um formato de distribuição final. Apenas
assinala a maturidade do documento dentro do ciclo editorial.

## Relação com NDF

NDF é responsabilidade do `core-documental`. Deve representar a versão sob
custódia, normalizada e persistida em base de dados, com metadata, integridade,
histórico e políticas próprias.

O `core-ui` não deve produzir NDF directamente. Deve produzir NCRTF e deixar a
conversão `NCRTF -> NDF` para o domínio documental.

## Responsabilidades

O `core-ui` serializa e importa o payload. Apps consumidoras decidem:

- onde gravar;
- como descarregar;
- como enviar para backend;
- que renderizador final usar.

O `core-documental` valida NCRTF, normaliza conteúdo, resolve placeholders
quando aplicável e integra o resultado no NDF de custódia em DB.
