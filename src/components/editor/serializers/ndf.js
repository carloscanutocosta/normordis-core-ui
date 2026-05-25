import {
  getPlainTextFromLexical,
  normalizeEditorDocument,
  parseJsonPayload,
  serializeJson,
} from "./lexical-json";

export const NDF_SCHEMA = "normordis.document.final";
export const NDF_VERSION = "0.1.0";
export const NDF_MIME_TYPE = "application/vnd.normordis.ndf+json";

export function exportToNdf(editorDocument, options = {}) {
  const document = normalizeEditorDocument(editorDocument, options);
  const payload = {
    schema: NDF_SCHEMA,
    version: NDF_VERSION,
    kind: "final-document",
    content: {
      plainText: getPlainTextFromLexical(document.lexical),
      lexical: options.includeLexical === false ? undefined : document.lexical,
    },
    metadata: {
      ...(document.metadata ?? {}),
      exportedAt: new Date().toISOString(),
      finalized: Boolean(options.finalized),
      ...(options.metadata ?? {}),
    },
  };

  if (payload.content.lexical === undefined) {
    delete payload.content.lexical;
  }

  return options.as === "string" ? serializeJson(payload, options) : payload;
}

export function importFromNdf(payload) {
  const parsed = parseJsonPayload(payload);
  if (parsed?.schema !== NDF_SCHEMA) {
    throw new Error("Payload NDF invalido.");
  }

  return {
    schema: "normordis.editor.document",
    version: "0.1.0",
    lexical: parsed.content?.lexical ?? null,
    metadata: parsed.metadata ?? {},
  };
}
