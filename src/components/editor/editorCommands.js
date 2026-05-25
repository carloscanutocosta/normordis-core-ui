import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";

export function setBlockType(editor, type) {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    if (type === "paragraph") {
      $setBlocksType(selection, () => $createParagraphNode());
      return;
    }

    $setBlocksType(selection, () => $createHeadingNode(type));
  });
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
