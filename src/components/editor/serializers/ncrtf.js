import { getLexicalPayload } from "../editorState";

export const NCRTF_VERSION = "1.3.0";
export const NCRTF_MIME_TYPE = "application/vnd.normordis.ncrtf+json";

// ---------------------------------------------------------------------------
// Lexical format helpers
// ---------------------------------------------------------------------------

// Lexical ElementFormat integers (serialized in block node "format" field)
// 0=none, 1=left, 2=center, 3=right, 4=justify, 5=start, 6=end
function elementFormatToAlign(format) {
  switch (format) {
    case 2: return "center";
    case 3: return "right";
    case 4: return "justify";
    default: return undefined; // left is the default — omit
  }
}

// Lexical TextFormat bitmask (serialized in text node "format" field)
// 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
function textFormatToMarks(format) {
  if (!format) return undefined;
  const marks = [];
  if (format & 1) marks.push("bold");
  if (format & 2) marks.push("italic");
  if (format & 8) marks.push("underline");
  if (format & 4) marks.push("strikethrough");
  if (format & 16) marks.push("code");
  if (format & 32) marks.push("subscript");
  if (format & 64) marks.push("superscript");
  return marks.length > 0 ? marks : undefined;
}

// ---------------------------------------------------------------------------
// Inline converters
// ---------------------------------------------------------------------------

function convertInlines(children) {
  if (!Array.isArray(children)) return [];
  return children.flatMap((node) => {
    const inline = convertInlineNode(node);
    return inline ? [inline] : [];
  });
}

function convertInlineNode(node) {
  if (!node) return null;

  switch (node.type) {
    case "text": {
      const marks = textFormatToMarks(node.format);
      const n = { type: "text", text: node.text ?? "" };
      if (marks) n.marks = marks;
      return n;
    }

    case "link":
    case "autolink": {
      return {
        type: "link",
        href: node.url ?? "",
        ...(node.title ? { title: node.title } : {}),
        ...(node.target ? { target: node.target } : {}),
        children: convertInlines(node.children),
      };
    }

    case "linebreak":
      return { type: "hard_break" };

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Block converters
// ---------------------------------------------------------------------------

function convertBlock(node) {
  if (!node) return null;

  switch (node.type) {
    case "paragraph": {
      const alignment = elementFormatToAlign(node.format);
      const indent = node.indent > 0 ? node.indent : undefined;
      const n = { type: "paragraph" };
      if (alignment) n.alignment = alignment;
      if (indent != null) n.indent = indent;
      n.children = convertInlines(node.children);
      return n;
    }

    case "heading": {
      const level = parseInt(node.tag?.replace("h", "") ?? "1", 10);
      const alignment = elementFormatToAlign(node.format);
      const n = { type: "heading", level };
      if (alignment) n.alignment = alignment;
      n.children = convertInlines(node.children);
      return n;
    }

    case "list": {
      const listType = node.listType === "number" ? "ordered" : "bullet";
      return {
        type: "list",
        list_type: listType,
        children: convertListItems(node.children ?? []),
      };
    }

    case "quote": {
      return {
        type: "blockquote",
        children: convertInlines(node.children),
      };
    }

    case "simple-table":
      return convertSimpleTable(node);

    case "image": {
      const n = { type: "image", src: node.src ?? "" };
      if (node.altText) n.alt = node.altText;
      if (node.caption) n.caption = node.caption;
      if (node.width != null) n.width_percent = node.width;
      return n;
    }

    default:
      return null;
  }
}

function convertListItems(children) {
  return children
    .filter((child) => child?.type === "listitem")
    .map((node) => {
      // Collect inline children; skip nested list nodes
      const inlines = convertInlines(
        (node.children ?? []).filter((c) => c?.type !== "list")
      );
      const item = { children: inlines };
      if (node.indent > 0) item.indent = node.indent;
      if (node.checked != null) item.checked = node.checked;
      return item;
    });
}

function convertSimpleTable(node) {
  const rows = Array.isArray(node.rows) ? node.rows : [];
  const includeHeader = Boolean(node.includeHeader);

  const head = [];
  const body = [];

  rows.forEach((row, rowIndex) => {
    const isHeaderRow = includeHeader && rowIndex === 0;
    const cells = (Array.isArray(row) ? row : []).map((cellText) => {
      const text = typeof cellText === "string" ? cellText : "";
      const cell = {};
      if (isHeaderRow) cell.header = true;
      cell.children = text ? [{ type: "text", text }] : [];
      return cell;
    });

    (isHeaderRow ? head : body).push({ cells });
  });

  return { type: "table", head, body };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Converts a Lexical editor state JSON object to an NCRTF v1.3.0 document.
 * The input can be a Lexical state JSON object or its string representation.
 */
export function lexicalToNcrtf(lexicalJson) {
  const state =
    typeof lexicalJson === "string" ? JSON.parse(lexicalJson) : lexicalJson;
  const rootNode = state?.root ?? state;

  const blocks = (rootNode?.children ?? [])
    .map(convertBlock)
    .filter(Boolean);

  return { ncrtf: NCRTF_VERSION, blocks };
}

/**
 * Exports an editor document (any form accepted by getLexicalPayload) to NCRTF v1.3.0.
 *
 * Options:
 *   title, lang, author, meta — populate the NCRTF meta field
 *   as: "string"              — return JSON string instead of object
 *   pretty: true              — indent JSON string output
 */
export function exportToNcrtf(editorDocument, options = {}) {
  const lexical =
    getLexicalPayload(editorDocument) ??
    editorDocument?.toJSON?.() ??
    editorDocument;

  const doc = lexicalToNcrtf(lexical);

  const { title, lang, author, meta } = options;
  if (title || lang || author || meta) {
    doc.meta = {
      ...(title ? { title } : {}),
      ...(lang ? { lang } : {}),
      ...(author ? { author } : {}),
      updated_at: new Date().toISOString(),
      ...(meta ?? {}),
    };
  }

  return options.as === "string"
    ? JSON.stringify(doc, null, options.pretty ? 2 : 0)
    : doc;
}

/**
 * Parses and validates an NCRTF payload.
 * Returns the parsed NCRTF document object.
 * Throws if the payload is not a valid NCRTF document.
 */
export function importFromNcrtf(payload) {
  const parsed =
    typeof payload === "string" ? JSON.parse(payload) : payload;

  if (!parsed?.ncrtf) {
    throw new Error("Payload NCRTF inválido: campo 'ncrtf' em falta.");
  }

  return parsed;
}
