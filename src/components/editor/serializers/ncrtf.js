import { getLexicalPayload } from '../editorState';

export const NCRTF_VERSION = '2.0.0';
export const NCRTF_MIME_TYPE = 'application/vnd.normordis.ncrtf+json';

// ---------------------------------------------------------------------------
// Font family mapping  (CSS stored in Lexical ↔ canonical name in NCRTF)
// ---------------------------------------------------------------------------

const FONT_MAP = [
  { ncrtf: 'LiberationSans', css: 'LiberationSans, Arial, sans-serif' },
  { ncrtf: 'LiberationSerif', css: 'LiberationSerif, Georgia, serif' },
  { ncrtf: 'LiberationMono', css: "LiberationMono, 'Courier New', monospace" },
];

function cssToNcrtfFont(cssValue) {
  if (!cssValue) return null;
  const entry = FONT_MAP.find((f) => f.css === cssValue);
  if (!entry) {
    const first = cssValue.split(',')[0].trim();
    return FONT_MAP.find((f) => f.ncrtf === first)?.ncrtf ?? null;
  }
  return entry.ncrtf;
}

function ncrtfFontToCss(ncrtfFont) {
  return FONT_MAP.find((f) => f.ncrtf === ncrtfFont)?.css ?? null;
}

function parseCssProperty(cssString, property) {
  if (!cssString) return null;
  const re = new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*([^;]+)`, 'i');
  const m = cssString.match(re);
  return m ? m[1].trim() : null;
}

function buildCssProperty(property, value) {
  return `${property}: ${value};`;
}

// =============================================================================
// Lexical → NCRTF
// =============================================================================

// Lexical ElementFormat integers: 0=none/left, 1=left, 2=center, 3=right, 4=justify
function elementFormatToAlign(format) {
  switch (format) {
    case 2: return 'center';
    case 3: return 'right';
    case 4: return 'justify';
    default: return undefined; // left is default — omit (R3)
  }
}

// Lexical TextFormat bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline,
//                             16=code, 32=subscript, 64=superscript
// Output in NCRTF canonical order: bold, code, italic, strikethrough, subscript, superscript, underline
function textFormatToMarks(format) {
  if (!format) return undefined;
  const marks = [];
  if (format & 1)  marks.push('bold');
  if (format & 16) marks.push('code');
  if (format & 2)  marks.push('italic');
  if (format & 4)  marks.push('strikethrough');
  if (format & 32) marks.push('subscript');
  if (format & 64) marks.push('superscript');
  if (format & 8)  marks.push('underline');
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
    case 'text': {
      if (!node.text) return null; // R5: skip empty text
      const marks = textFormatToMarks(node.format);
      const fontNcrtf = cssToNcrtfFont(parseCssProperty(node.style, 'font-family'));
      const n = { type: 'text', text: node.text };
      if (marks) n.marks = marks;
      if (fontNcrtf) n.font_family = fontNcrtf;
      return n;
    }

    case 'link':
    case 'autolink': {
      const content = convertInlines(node.children ?? []).filter((c) => c.type === 'text');
      if (content.length === 0) return null;
      const n = { type: 'link', href: node.url ?? '', content };
      if (node.target) n.target = node.target;
      if (node.title) n.title = node.title;
      return n;
    }

    case 'linebreak':
      return { type: 'hard_break' };

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
    case 'paragraph': {
      const inlines = convertInlines(node.children ?? []);
      if (inlines.length === 0) return null;
      const alignment = elementFormatToAlign(node.format);
      const indent = node.indent > 0 ? node.indent : undefined;
      const fontNcrtf = cssToNcrtfFont(parseCssProperty(node.textStyle, 'font-family'));
      const n = { type: 'paragraph' };
      if (alignment) n.alignment = alignment;
      if (fontNcrtf) n.font_family = fontNcrtf;
      if (indent != null) n.indent = indent;
      n.content = inlines;
      return n;
    }

    case 'heading': {
      const inlines = convertInlines(node.children ?? []);
      if (inlines.length === 0) return null;
      const level = parseInt(node.tag?.replace('h', '') ?? '1', 10);
      const alignment = elementFormatToAlign(node.format);
      const fontNcrtf = cssToNcrtfFont(parseCssProperty(node.textStyle, 'font-family'));
      const n = { type: 'heading', level };
      if (alignment) n.alignment = alignment;
      if (fontNcrtf) n.font_family = fontNcrtf;
      n.content = inlines;
      return n;
    }

    case 'list': {
      const listTypeMap = { number: 'ordered', bullet: 'bullet', check: 'checklist' };
      const list_type = listTypeMap[node.listType] ?? 'bullet';
      const content = convertListItems(node.children ?? []);
      if (content.length === 0) return null;
      return { type: 'list', list_type, content };
    }

    case 'quote': {
      const inlines = convertInlines(node.children ?? []);
      if (inlines.length === 0) return null;
      return { type: 'blockquote', content: inlines };
    }

    case 'simple-table':
      return convertSimpleTable(node);

    case 'image': {
      if (!node.src && !node.ref) return null;
      const n = { type: 'image' };
      // Archival form uses ref; editing state uses src.
      // prepareImagesForArchive() must be called before embedding in NDF-core.
      if (node.ref) {
        n.ref = node.ref;
      } else {
        n.src = node.src; // NOT valid in NDF-core — caller must extract
      }
      n.alt = node.altText ?? '';
      if (node.caption) n.caption = node.caption;
      if (node.width != null) n.width_percent = node.width;
      return n;
    }

    default:
      return null;
  }
}

// list_item.content can contain inlines AND nested list blocks
function convertListItemChildren(children) {
  const result = [];
  for (const child of children ?? []) {
    if (child.type === 'list') {
      const nested = convertBlock(child);
      if (nested) result.push(nested);
    } else {
      const inline = convertInlineNode(child);
      if (inline) result.push(inline);
    }
  }
  return result;
}

function convertListItems(children) {
  return children
    .filter((child) => child?.type === 'listitem')
    .map((node) => {
      const content = convertListItemChildren(node.children ?? []);
      if (content.length === 0) return null;
      const item = { type: 'list_item', content };
      if (node.checked != null) item.checked = node.checked;
      return item;
    })
    .filter(Boolean);
}

function convertSimpleTable(node) {
  const rows = Array.isArray(node.rows) ? node.rows : [];
  const includeHeader = Boolean(node.includeHeader);

  const head = [];
  const body = [];

  rows.forEach((row, rowIndex) => {
    const isHeaderRow = includeHeader && rowIndex === 0;
    const cells = (Array.isArray(row) ? row : []).map((cellText) =>
      typeof cellText === 'string' ? cellText : '',
    );
    (isHeaderRow ? head : body).push({ cells });
  });

  const n = { type: 'table' };
  if (head.length > 0) n.head = head;
  if (body.length > 0) n.body = body;
  return body.length > 0 ? n : null;
}

// =============================================================================
// NCRTF → Lexical
// =============================================================================

// NCRTF alignment → Lexical ElementFormat integer
function alignToElementFormat(alignment) {
  switch (alignment) {
    case 'left':    return 1;
    case 'center':  return 2;
    case 'right':   return 3;
    case 'justify': return 4;
    default:        return 0;
  }
}

// NCRTF marks array → Lexical TextFormat bitmask (marks are plain strings in v2)
function marksToTextFormat(marks) {
  if (!Array.isArray(marks)) return 0;
  let format = 0;
  for (const mark of marks) {
    switch (mark) {
      case 'bold':          format |= 1;  break;
      case 'italic':        format |= 2;  break;
      case 'strikethrough': format |= 4;  break;
      case 'underline':     format |= 8;  break;
      case 'code':          format |= 16; break;
      case 'subscript':     format |= 32; break;
      case 'superscript':   format |= 64; break;
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
    direction: 'ltr',
    children,
    ...extra,
  };
}

function makeText(text, format = 0, style = '') {
  return { type: 'text', version: 1, format, detail: 0, mode: 'normal', style, text };
}

// ---------------------------------------------------------------------------
// Inline converters (NCRTF → Lexical)
// ---------------------------------------------------------------------------

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
    case 'text': {
      const format = marksToTextFormat(node.marks);
      // font_family is now a direct field (not a mark object)
      const resolvedNcrtf = node.font_family ?? blockFont ?? null;
      const css = resolvedNcrtf ? ncrtfFontToCss(resolvedNcrtf) : null;
      const style = css ? buildCssProperty('font-family', css) : '';
      return makeText(node.text ?? '', format, style);
    }

    case 'link': {
      return makeElement(
        'link',
        {
          url: node.href ?? '',
          rel: node.target ? 'noreferrer' : null,
          target: node.target ?? null,
          title: node.title ?? null,
        },
        importInlines(node.content ?? [], blockFont),
      );
    }

    case 'hard_break':
      return { type: 'linebreak', version: 1 };

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
    case 'paragraph': {
      return makeElement(
        'paragraph',
        {
          format: alignToElementFormat(block.alignment),
          indent: block.indent ?? 0,
          ...(block.font_family
            ? { textStyle: buildCssProperty('font-family', ncrtfFontToCss(block.font_family) ?? '') }
            : {}),
        },
        importInlines(block.content ?? [], block.font_family),
      );
    }

    case 'heading': {
      const level = Math.min(Math.max(Number(block.level) || 1, 1), 6);
      return makeElement(
        'heading',
        {
          tag: `h${level}`,
          format: alignToElementFormat(block.alignment),
          ...(block.font_family
            ? { textStyle: buildCssProperty('font-family', ncrtfFontToCss(block.font_family) ?? '') }
            : {}),
        },
        importInlines(block.content ?? [], block.font_family),
      );
    }

    case 'list': {
      const listTypeMap = { ordered: 'number', bullet: 'bullet', checklist: 'check' };
      const listType = listTypeMap[block.list_type] ?? 'bullet';
      const tag = block.list_type === 'ordered' ? 'ol' : 'ul';

      const items = (block.content ?? []).map((item, idx) => {
        return makeElement(
          'listitem',
          {
            value: idx + 1,
            indent: 0,
            ...(item.checked != null ? { checked: item.checked } : {}),
          },
          importListItemContent(item.content ?? []),
        );
      });

      return makeElement('list', { listType, tag, start: 1 }, items);
    }

    case 'blockquote':
      return makeElement('quote', {}, importInlines(block.content ?? []));

    case 'table':
      return importTable(block);

    case 'image': {
      return {
        type: 'image',
        version: 1,
        src: block.src ?? block.ref ?? '',
        altText: block.alt ?? '',
        caption: block.caption ?? '',
        width: block.width_percent ?? 100,
      };
    }

    default:
      return null;
  }
}

// list_item.content can contain inlines AND nested list blocks
function importListItemContent(content) {
  return (content ?? []).flatMap((node) => {
    if (node.type === 'list') {
      const nested = importBlock(node);
      return nested ? [nested] : [];
    }
    const inline = importInlineNode(node);
    return inline ? [inline] : [];
  });
}

function importTable(block) {
  const headRows = (block.head ?? []).map((row) => row.cells ?? []);
  const bodyRows = (block.body ?? []).map((row) => row.cells ?? []);

  const rows = [...headRows, ...bodyRows];
  const includeHeader = headRows.length > 0;
  const columns = rows[0]?.length ?? 0;

  return { type: 'simple-table', version: 1, rows, columns, includeHeader };
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Converts a Lexical editor state JSON to an NCRTF v2.0.0 document object.
 *
 * Images in the result may have `src` (data URL) if the Lexical state uses them.
 * Call prepareImagesForArchive() before embedding in NDF-core.
 */
export function lexicalToNcrtf(lexicalJson) {
  const state = typeof lexicalJson === 'string' ? JSON.parse(lexicalJson) : lexicalJson;
  const rootNode = state?.root ?? state;

  const content = (rootNode?.children ?? []).map(convertBlock).filter(Boolean);

  return { ncrtf_version: NCRTF_VERSION, content };
}

/**
 * Converts an NCRTF v2.0.0 document to a Lexical editor state JSON.
 * The result can be fed directly to editor.parseEditorState().
 */
export function ncrtfToLexical(ncrtfDoc) {
  const parsed = typeof ncrtfDoc === 'string' ? JSON.parse(ncrtfDoc) : ncrtfDoc;

  if (!parsed?.ncrtf_version) {
    throw new Error("Payload NCRTF inválido: campo 'ncrtf_version' em falta.");
  }

  const children = (parsed.content ?? []).map(importBlock).filter(Boolean);

  return {
    root: {
      type: 'root',
      version: 1,
      format: '',
      indent: 0,
      direction: 'ltr',
      children,
    },
  };
}

/**
 * Exports an editor document (any form accepted by getLexicalPayload) to NCRTF v2.0.0.
 *
 * Options:
 *   as: "string"   — return JSON string instead of object
 *   pretty: true   — indent JSON string output
 *
 * Note: images will have `src` (data URL). Call prepareImagesForArchive()
 * before embedding the result in NDF-core.
 */
export function exportToNcrtf(editorDocument, options = {}) {
  const lexical = getLexicalPayload(editorDocument) ?? editorDocument?.toJSON?.() ?? editorDocument;

  const doc = lexicalToNcrtf(lexical);

  return options.as === 'string' ? JSON.stringify(doc, null, options.pretty ? 2 : 0) : doc;
}

/**
 * Parses an NCRTF payload and returns the parsed document object.
 * Throws if ncrtf_version is missing.
 */
export function importFromNcrtf(payload) {
  const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;

  if (!parsed?.ncrtf_version) {
    throw new Error("Payload NCRTF inválido: campo 'ncrtf_version' em falta.");
  }

  return parsed;
}

/**
 * Replaces image `src` data URLs with archival `ref` paths.
 *
 * Call this before embedding an NCRTF document in NDF-core.
 *
 * @param {object} ncrtfDoc - NCRTF document object (from lexicalToNcrtf or exportToNcrtf)
 * @param {(src: string, alt: string) => Promise<string>} imageExtractor
 *   Async callback that receives the data URL and alt text,
 *   saves the image to the .ndfpkg assets/ directory,
 *   and returns the ref path (e.g. "assets/img-001.png").
 * @returns {Promise<object>} A new NCRTF document with src replaced by ref.
 */
export async function prepareImagesForArchive(ncrtfDoc, imageExtractor) {
  async function processContent(content) {
    if (!Array.isArray(content)) return content;
    const result = [];
    for (const node of content) {
      result.push(await processNode(node));
    }
    return result;
  }

  async function processNode(node) {
    if (!node || typeof node !== 'object') return node;

    if (node.type === 'image' && node.src) {
      const ref = await imageExtractor(node.src, node.alt ?? '');
      const { src: _src, ...rest } = node;
      return { ...rest, ref };
    }

    if (node.content) {
      return { ...node, content: await processContent(node.content) };
    }

    return node;
  }

  return {
    ...ncrtfDoc,
    content: await processContent(ncrtfDoc.content ?? []),
  };
}
