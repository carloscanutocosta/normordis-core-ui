import { $setBlocksType } from "@lexical/selection";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isTextNode,
} from "lexical";
import { $isListNode, ListItemNode } from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createImageNode } from "./nodes/ImageNode";
import { $createSimpleTableNode } from "./nodes/SimpleTableNode";

export function setBlockType(editor, type) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    if (type === "paragraph") {
      $setBlocksType(selection, () => $createParagraphNode());
      return;
    }

    if (type === "quote") {
      $setBlocksType(selection, () => $createQuoteNode());
      return;
    }

    $setBlocksType(selection, () => $createHeadingNode(type));
  });
}

export function exitCurrentListItem(editor) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();
    const listItem = $getNearestNodeOfType(anchorNode, ListItemNode);
    if (!listItem) return;

    const parentList = listItem.getParent();
    if (!$isListNode(parentList)) return;

    let topList = parentList;
    let parent = parentList.getParent();
    while (parent) {
      if ($isListNode(parent)) {
        topList = parent;
      }
      parent = parent.getParent();
    }

    const paragraph = $createParagraphNode();
    const children = listItem.getChildren();
    children.forEach((child) => {
      if (!$isListNode(child)) {
        paragraph.append(child);
      }
    });

    topList.insertAfter(paragraph);
    listItem.remove();
    if (parentList.getChildrenSize() === 0) {
      parentList.remove();
    }

    paragraph.selectEnd();
  });

  editor.focus();
}

export function getPlaceholderToken(placeholder) {
  if (!placeholder) return "";
  if (placeholder.token) return placeholder.token;
  if (placeholder.id) return `{{${placeholder.id}}}`;
  if (placeholder.label) return `{{${placeholder.label}}}`;
  return "";
}

function normalizePlaceholderId(value) {
  return String(value ?? "")
    .trim()
    .replace(/^\{\{\s*/, "")
    .replace(/\s*\}\}$/, "")
    .replace(/\s+/g, ".")
    .replace(/[^\w.-]/g, "")
    .toLowerCase();
}

function resolvePlaceholderToken(rawValue, definitions = []) {
  const normalized = normalizePlaceholderId(rawValue);
  if (!normalized) return "";

  const match = definitions.find((placeholder) => {
    const candidates = [
      placeholder.id,
      placeholder.label,
      placeholder.token,
    ].map(normalizePlaceholderId);

    return candidates.includes(normalized);
  });

  return getPlaceholderToken(match) || `{{${normalized}}}`;
}

export function insertPlaceholder(editor, placeholder) {
  const token = getPlaceholderToken(placeholder);
  if (!token) return;

  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    selection.insertText(token);
  });

  editor.focus();
}

export function convertSelectionToPlaceholder(editor, definitions = []) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    if (!selection.isCollapsed()) {
      const token = resolvePlaceholderToken(selection.getTextContent(), definitions);
      if (token) {
        selection.insertText(token);
      }
      return;
    }

    const anchor = selection.anchor;
    const node = anchor.getNode();
    if (!$isTextNode(node)) return;

    const text = node.getTextContent();
    const offset = anchor.offset;
    const left = text.slice(0, offset).search(/[\w.-]+$/);
    const rightMatch = text.slice(offset).match(/^[\w.-]+/);
    const start = left === -1 ? offset : left;
    const end = offset + (rightMatch?.[0].length ?? 0);
    const rawValue = text.slice(start, end);
    const token = resolvePlaceholderToken(rawValue, definitions);
    if (!token) return;

    node.spliceText(start, end - start, token, true);
  });

  editor.focus();
}

export function insertImage(editor, image) {
  if (!image?.src) return;

  editor.update(() => {
    const imageNode = $createImageNode({
      altText: image.altText ?? "",
      caption: image.caption ?? "",
      src: image.src,
      width: image.width ?? 100,
    });
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      $insertNodes([imageNode]);
      return;
    }

    const trailingParagraph = $createParagraphNode();
    $getRoot().append(imageNode, trailingParagraph);
    trailingParagraph.select();
  });

  editor.focus();
}

export function insertTable(editor, options = {}) {
  const rows = Number(options.rows ?? 3);
  const columns = Number(options.columns ?? 3);
  const normalizedRows = Math.min(Math.max(Math.trunc(rows) || 3, 1), 20);
  const normalizedColumns = Math.min(Math.max(Math.trunc(columns) || 3, 1), 12);

  editor.update(() => {
    const tableNode = $createSimpleTableNode({
      columns: normalizedColumns,
      includeHeader: Boolean(options.includeHeaders ?? true),
      rows: normalizedRows,
    });
    const trailingParagraph = $createParagraphNode();
    const selection = $getSelection();
    let inserted = false;

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const topLevelElement =
        anchorNode.getKey() === "root"
          ? null
          : anchorNode.getTopLevelElementOrThrow();

      if (topLevelElement) {
        topLevelElement.insertAfter(tableNode);
        tableNode.insertAfter(trailingParagraph);
        inserted = true;
      }
    }

    if (!inserted) {
      $getRoot().append(tableNode, trailingParagraph);
    }

    trailingParagraph.selectStart();
  });

  editor.focus();
}

export function insertSemanticBlock(editor, block) {
  editor.update(() => {
    const root = $getRoot();
    const paragraphs = getSemanticBlockParagraphs(block);

    paragraphs.forEach((text) => {
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(text));
      root.append(paragraph);
    });
  });
}

export function getSemanticBlockParagraphs(block) {
  if (!block) return [];

  if (typeof block.content === "string") {
    return block.content.split(/\n{2,}/).filter(Boolean);
  }

  if (Array.isArray(block.content?.blocks)) {
    return block.content.blocks.filter(Boolean);
  }

  if (typeof block.content?.text === "string") {
    return block.content.text.split(/\n{2,}/).filter(Boolean);
  }

  return [block.label].filter(Boolean);
}
