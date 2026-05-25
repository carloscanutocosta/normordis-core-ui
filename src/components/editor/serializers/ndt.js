import {
  normalizeEditorDocument,
  parseJsonPayload,
  serializeJson,
} from "./lexical-json";

export const NDT_SCHEMA = "normordis.document.text";
export const NDT_VERSION = "0.1.0";
export const NDT_MIME_TYPE = "application/vnd.normordis.ndt+json";

export function exportToNdt(editorDocument, options = {}) {
  const document = normalizeEditorDocument(editorDocument, options);
  const payload = {
    schema: NDT_SCHEMA,
    version: NDT_VERSION,
    kind: "editable-document",
    document,
    metadata: {
      exportedAt: new Date().toISOString(),
      ...(options.metadata ?? {}),
    },
  };

  return options.as === "string" ? serializeJson(payload, options) : payload;
}

export function importFromNdt(payload) {
  const parsed = parseJsonPayload(payload);
  if (parsed?.schema !== NDT_SCHEMA) {
    throw new Error("Payload NDT invalido.");
  }

  return parsed.document;
}
