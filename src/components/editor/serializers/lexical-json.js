import {
  EDITOR_SCHEMA,
  EDITOR_SCHEMA_VERSION,
  getLexicalPayload,
} from "../editorState";

export function normalizeEditorDocument(input, options = {}) {
  if (input?.schema === EDITOR_SCHEMA && input?.lexical) {
    return {
      ...input,
      metadata: {
        ...(input.metadata ?? {}),
        ...(options.metadata ?? {}),
      },
    };
  }

  const lexical = getLexicalPayload(input) ?? input?.toJSON?.() ?? null;

  return {
    schema: EDITOR_SCHEMA,
    version: EDITOR_SCHEMA_VERSION,
    lexical,
    metadata: {
      ...(options.metadata ?? {}),
    },
  };
}

export function serializeJson(payload, options = {}) {
  const spacing = options.pretty ? 2 : 0;
  return JSON.stringify(payload, null, spacing);
}

export function parseJsonPayload(payload) {
  if (typeof payload === "string") {
    return JSON.parse(payload);
  }

  return payload;
}

export function getPlainTextFromLexical(lexical) {
  const root = lexical?.root;
  if (!root?.children) return "";

  return root.children
    .map((node) => getPlainTextFromNode(node))
    .filter(Boolean)
    .join("\n");
}

function getPlainTextFromNode(node) {
  if (!node) return "";

  if (typeof node.text === "string") {
    return node.text;
  }

  if (Array.isArray(node.children)) {
    return node.children.map((child) => getPlainTextFromNode(child)).join("");
  }

  return "";
}
