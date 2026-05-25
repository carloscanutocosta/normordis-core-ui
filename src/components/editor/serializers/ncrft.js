import {
  normalizeEditorDocument,
  parseJsonPayload,
  serializeJson,
} from "./lexical-json";

export const NCRFT_SCHEMA = "normordis.document.craft";
export const NCRFT_VERSION = "0.1.0";
export const NCRFT_MIME_TYPE = "application/vnd.normordis.ncrft+json";

export function exportToNcrft(editorDocument, options = {}) {
  const document = normalizeEditorDocument(editorDocument, options);
  const payload = {
    schema: NCRFT_SCHEMA,
    version: NCRFT_VERSION,
    kind: "craft-document",
    document,
    semanticBlocks: options.semanticBlocks ?? [],
    placeholders: options.placeholders ?? [],
    metadata: {
      exportedAt: new Date().toISOString(),
      ...(options.metadata ?? {}),
    },
  };

  return options.as === "string" ? serializeJson(payload, options) : payload;
}

export function importFromNcrft(payload) {
  const parsed = parseJsonPayload(payload);
  if (parsed?.schema !== NCRFT_SCHEMA) {
    throw new Error("Payload NCRFT invalido.");
  }

  return {
    document: parsed.document,
    semanticBlocks: parsed.semanticBlocks ?? [],
    placeholders: parsed.placeholders ?? [],
    metadata: parsed.metadata ?? {},
  };
}
