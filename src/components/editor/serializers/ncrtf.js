import { getLexicalPayload } from "../editorState";

export const NCRTF_VERSION = "1.3.0";
export const NCRTF_MIME_TYPE = "application/vnd.normordis.ncrtf+json";

// ---------------------------------------------------------------------------
// Font family mapping  (CSS stored in Lexical ↔ canonical name in NCRTF)
// ---------------------------------------------------------------------------

const FONT_MAP = [
  { ncrtf: "LiberationSans",  css: "LiberationSans, Arial, sans-serif"        },
  { ncrtf: "LiberationSerif", css: "LiberationSerif, Georgia, serif"           },
  { ncrtf: "LiberationMono",  css: "LiberationMono, 'Courier New', monospace"  },
];

function cssToNcrtfFont(cssValue) {
  if (!cssValue) return null;
  const entry = FONT_MAP.find((f) => f.css === cssValue);
  // Fallback: match on first font name in the stack
  if (!entry) {
    const first = cssValue.split(",")[0].trim();
    return FONT_MAP.find((f) => f.ncrtf === first)?.ncrtf ?? null;
  }
  return entry.ncrtf;
}

function ncrtfFontToCss(ncrtfFont) {
  return FONT_MAP.find((f) => f.ncrtf === ncrtfFont)?.css ?? null;
}

// Extract a single CSS property value from a Lexical style string
// e.g. parseCssProperty("font-family: LiberationSans, Arial, sans-serif;", "font-family")
//   → "LiberationSans, Arial, sans-serif"
function parseCssProperty(cssString, property) {
  if (!cssString) return null;
  const re = new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, "i");
  const m = cssString.match(re);
  return m ? m[1].trim() : null;
}

// Build a CSS string fragment for a property
function buildCssProperty(property, value) {
  return `${property}: ${value};`;
}

// =============================================================================
// Lexical → NCRTF
// =============================================================================

// ---------------------------------------------------------------------------
// Format helpers (Lexical → NCRTF)
// ---------------------------------------------------------------------------

// Lexical ElementFormat integers (block node "format" field)
// 0=none, 1=left, 2=center, 3=right, 4=justify, 5=start, 6=end
function elementFormatToAlign(format) {
  switch (format) {
    case 2: return "center";
    case 3: return "right";
    case 4: return "justify";
    default: return undefined; // left is the default — omit
  }
}

// Lexical TextFormat bitmask (text node "format" field)
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
// Inline converters (Lexical → NCRTF)
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
      const marks = textFormatToMarks(node.format) ?? [];
      const fontNcrtf = cssToNcrtfFont(parseCssProperty(node.style, "font-family"));
      if (fontNcrtf) marks.push({ type: "font_family", value: fontNcrtf });
      const n = { type: "text", text: node.text ?? "" };
      if (marks.length > 0) n.marks = marks;
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
// Block converters (Lexical → NCRTF)
// ---------------------------------------------------------------------------

function convertBlock(node) {
  if (!node) return null;

  switch (node.type) {
    case "paragraph": {
      const alignment = elementFormatToAlign(node.format);
      const indent = node.indent > 0 ? node.indent : undefined;
      // textStyle holds the paragraph-level pending font (Lexical ParagraphNode.__textStyle)
      const fontNcrtf = cssToNcrtfFont(parseCssProperty(node.textStyle, "font-family"));
      const n = { type: "paragraph" };
      if (alignment) n.alignment = alignment;
      if (indent != null) n.indent = indent;
      if (fontNcrtf) n.font_family = fontNcrtf;
      n.children = convertInlines(node.children);
      return n;
    }

    case "heading": {
      const level = parseInt(node.tag?.replace("h", "") ?? "1", 10);
      const alignment = elementFormatToAlign(node.format);
      const fontNcrtf = cssToNcrtfFont(parseCssProperty(node.textStyle, "font-family"));
      const n = { type: "heading", level };
      if (alignment) n.alignment = alignment;
      if (fontNcrtf) n.font_family = fontNcrtf;
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

// =============================================================================
// NCRTF → Lexical
// =============================================================================

// ---------------------------------------------------------------------------
// Format helpers (NCRTF → Lexical)
// ---------------------------------------------------------------------------

// NCRTF TextAlign → Lexical ElementFormat integer
function alignToElementFormat(alignment) {
  switch (alignment) {
    case "left": return 1;
    case "center": return 2;
    case "right": return 3;
    case "justify": return 4;
    default: return 0;
  }
}

// NCRTF marks array → Lexical TextFormat bitmask
// Parametrised marks (color, highlight, font_size) are ignored — no Lexical equivalent.
function marksToTextFormat(marks) {
  if (!Array.isArray(marks)) return 0;
  let format = 0;
  for (const mark of marks) {
    switch (typeof mark === "string" ? mark : mark?.type) {
      case "bold":          format |= 1;  break;
      case "italic":        format |= 2;  break;
      case "strikethrough": format |= 4;  break;
      case "underline":     format |= 8;  break;
      case "code":          format |= 16; break;
      case "subscript":     format |= 32; break;
      case "superscript":   format |= 64; break;
    }
  }
  return format;
}

// ---------------------------------------------------------------------------
// Node factory helpers
// ---------------------------------------------------------------------------

function makeElement(type, extra, children) {
  return {
    type,
    version: 1,
    format: 0,
    indent: 0,
    direction: "ltr",
    children,
    ...extra,
  };
}

function makeText(text, format = 0, style = "") {
  return { type: "text", version: 1, format, detail: 0, mode: "normal", style, text };
}

// ---------------------------------------------------------------------------
// Inline converters (NCRTF → Lexical)
// ---------------------------------------------------------------------------

// blockFont: paragraph-level font_family from NCRTF, applied to text nodes
// that don't carry their own font_family mark.
function importInlines(inlines, blockFont) {
  if (!Array.isArray(inlines)) return [];
  return inlines.flatMap((node) => {
    const result = importInlineNode(node, blockFont);
    return result ? [result] : [];
  });
}

function importInlineNode(node, blockFont) {
  if (!node) return null;

  switch (node.type) {
    case "text": {
      const format = marksToTextFormat(node.marks);
      const fontMark = (node.marks ?? []).find(
        (m) => typeof m === "object" && m.type === "font_family"
      );
      // Inline mark takes precedence; fall back to block-level font
      const resolvedNcrtf = fontMark?.value ?? blockFont ?? null;
      const css = resolvedNcrtf ? ncrtfFontToCss(resolvedNcrtf) : null;
      const style = css ? buildCssProperty("font-family", css) : "";
      return makeText(node.text ?? "", format, style);
    }

    case "link": {
      return makeElement(
        "link",
        {
          url: node.href ?? "",
          rel: node.target ? "noreferrer" : null,
          target: node.target ?? null,
          title: node.title ?? null,
        },
        importInlines(node.children, blockFont)
      );
    }

    case "hard_break":
      return { type: "linebreak", version: 1 };

    case "footnote_ref":
      // Render as superscript text — no dedicated node in the editor
      return makeText(String(node.number ?? ""), 64 /* superscript */);

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Block converters (NCRTF → Lexical)
// ---------------------------------------------------------------------------

function importBlock(block) {
  if (!block) return null;

  switch (block.type) {
    case "paragraph": {
      return makeElement(
        "paragraph",
        {
          format: alignToElementFormat(block.alignment),
          indent: block.indent ?? 0,
        },
        importInlines(block.children, block.font_family)
      );
    }

    case "heading": {
      const level = Math.min(Math.max(Number(block.level) || 1, 1), 6);
      return makeElement(
        "heading",
        {
          tag: `h${level}`,
          format: alignToElementFormat(block.alignment),
        },
        importInlines(block.children, block.font_family)
      );
    }

    case "list": {
      const isOrdered = block.list_type === "ordered";
      const isCheck = block.list_type === "checklist";
      const listType = isOrdered ? "number" : isCheck ? "check" : "bullet";
      const tag = isOrdered ? "ol" : "ul";

      const items = (block.children ?? []).map((item, idx) => {
        const n = makeElement(
          "listitem",
          {
            value: idx + 1,
            indent: item.indent ?? 0,
            ...(item.checked != null ? { checked: item.checked } : {}),
          },
          importInlines(item.children)
        );
        return n;
      });

      return makeElement("list", { listType, tag, start: 1 }, items);
    }

    case "blockquote": {
      return makeElement("quote", {}, importInlines(block.children));
    }

    case "table": {
      return importTable(block);
    }

    case "image": {
      return {
        type: "image",
        version: 1,
        src: block.src ?? "",
        altText: block.alt ?? "",
        caption: block.caption ?? "",
        width: block.width_percent ?? 100,
      };
    }

    case "code_block": {
      // No code block node in the editor — map to a plain paragraph
      return makeElement("paragraph", {}, [makeText(block.code ?? "")]);
    }

    // Layout-only blocks with no editor equivalent — skip silently
    case "horizontal_rule":
    case "page_break":
    case "fixed_box":
      return null;

    default:
      return null;
  }
}

function importTable(block) {
  const headRows = (block.head ?? []).map((row) =>
    (row.cells ?? []).map(extractCellText)
  );
  const bodyRows = (block.body ?? []).map((row) =>
    (row.cells ?? []).map(extractCellText)
  );

  const rows = [...headRows, ...bodyRows];
  const includeHeader = headRows.length > 0;
  const columns = rows[0]?.length ?? 0;

  return { type: "simple-table", version: 1, rows, columns, includeHeader };
}

function extractCellText(cell) {
  // SimpleTableNode stores flat strings — extract plain text from NCRTF inlines
  return (cell.children ?? [])
    .map((c) => {
      if (c.type === "text") return c.text ?? "";
      if (c.type === "link") {
        return (c.children ?? [])
          .filter((lc) => lc.type === "text")
          .map((lc) => lc.text ?? "")
          .join("");
      }
      return "";
    })
    .join("");
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Converts a Lexical editor state JSON to an NCRTF v1.3.0 document object.
 */
export function lexicalToNcrtf(lexicalJson) {
  const state =
    typeof lexicalJson === "string" ? JSON.parse(lexicalJson) : lexicalJson;
  const rootNode = state?.root ?? state;

  const blocks = (rootNode?.children ?? []).map(convertBlock).filter(Boolean);

  return { ncrtf: NCRTF_VERSION, blocks };
}

/**
 * Converts an NCRTF v1.3.0 document to a Lexical editor state JSON.
 * The result can be fed directly to editor.parseEditorState().
 */
export function ncrtfToLexical(ncrtfDoc) {
  const parsed =
    typeof ncrtfDoc === "string" ? JSON.parse(ncrtfDoc) : ncrtfDoc;

  if (!parsed?.ncrtf) {
    throw new Error("Payload NCRTF inválido: campo 'ncrtf' em falta.");
  }

  const children = (parsed.blocks ?? []).map(importBlock).filter(Boolean);

  return {
    root: {
      type: "root",
      version: 1,
      format: "",
      indent: 0,
      direction: "ltr",
      children,
    },
  };
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
 * Throws if the payload is missing the 'ncrtf' version field.
 */
export function importFromNcrtf(payload) {
  const parsed =
    typeof payload === "string" ? JSON.parse(payload) : payload;

  if (!parsed?.ncrtf) {
    throw new Error("Payload NCRTF inválido: campo 'ncrtf' em falta.");
  }

  return parsed;
}
