export const EDITOR_SCHEMA = 'normordis.editor.document';
export const EDITOR_SCHEMA_VERSION = '0.1.0';

export const lexicalTheme = {
  heading: {
    h1: 'text-2xl font-semibold leading-tight text-foreground',
    h2: 'text-xl font-semibold leading-tight text-foreground',
    h3: 'mt-4 text-base !font-bold leading-tight text-foreground',
  },
  link: 'text-primary underline underline-offset-2',
  list: {
    listitem: 'my-1',
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-outside !list-decimal space-y-1 pl-6',
    ul: 'list-outside !list-disc space-y-1 pl-6',
  },
  paragraph: 'my-2',
  quote: 'my-3 border-l-2 border-border pl-4 text-muted-foreground',
  table: 'my-3 w-full border-collapse border border-border text-sm',
  tableCell: 'border border-border p-2 align-top',
  tableCellHeader: 'border border-border bg-muted/15 p-2 font-semibold align-top',
  tableScrollableWrapper: 'my-3 overflow-x-auto',
  text: {
    bold: 'font-semibold',
    italic: 'italic',
    underline: 'underline underline-offset-2',
  },
};

export function getLexicalPayload(value) {
  if (!value) return null;

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed.lexical ?? parsed;
    } catch {
      return null;
    }
  }

  return value.lexical ?? value;
}

export function createDocumentPayload(editorState) {
  return {
    schema: EDITOR_SCHEMA,
    version: EDITOR_SCHEMA_VERSION,
    lexical: editorState.toJSON(),
    metadata: {
      updatedAt: new Date().toISOString(),
    },
  };
}

export function createInitialEditorState(value, defaultValue) {
  const payload = getLexicalPayload(value ?? defaultValue);
  return payload ? JSON.stringify(payload) : undefined;
}
