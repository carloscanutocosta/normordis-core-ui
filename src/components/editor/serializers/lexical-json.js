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
