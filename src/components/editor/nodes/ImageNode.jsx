import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Trash2 } from 'lucide-react';
import { $applyNodeReplacement, $getNodeByKey, DecoratorNode } from 'lexical';

function ImageComponent({ altText, caption, nodeKey, src, width }) {
  const [editor] = useLexicalComposerContext();

  const handleDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.remove();
      }
    });
  };

  const handleWidthChange = (event) => {
    const nextWidth = Number(event.target.value);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidth(nextWidth);
      }
    });
  };

  return (
    <figure
      className="group my-3 overflow-hidden rounded-md border border-border bg-muted/30"
      style={{ width: `${width}%` }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/70 px-2 py-1">
        <label className="flex min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground">
          <span className="shrink-0">Largura</span>
          <input
            aria-label="Largura da imagem"
            type="range"
            min="25"
            max="100"
            step="5"
            value={width}
            onChange={handleWidthChange}
            className="h-2 min-w-24 flex-1 accent-primary"
          />
          <span className="w-10 text-right tabular-nums">{width}%</span>
        </label>
        <button
          type="button"
          aria-label="Apagar imagem"
          onClick={handleDelete}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <img
        alt={altText}
        src={src}
        className="max-h-[360px] w-full object-contain"
        draggable={false}
      />
      {caption && (
        <figcaption className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export class ImageNode extends DecoratorNode {
  __altText;
  __caption;
  __src;
  __width;

  static getType() {
    return 'image';
  }

  static clone(node) {
    return new ImageNode(node.__src, node.__altText, node.__caption, node.__width, node.__key);
  }

  static importJSON(serializedNode) {
    return $createImageNode({
      altText: serializedNode.altText,
      caption: serializedNode.caption,
      src: serializedNode.src,
      width: serializedNode.width,
    });
  }

  constructor(src, altText = '', caption = '', width = 100, key) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__caption = caption;
    this.__width = width;
  }

  createDOM() {
    const element = document.createElement('div');
    element.className = 'normordis-editor-image';
    return element;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <ImageComponent
        altText={this.__altText}
        caption={this.__caption}
        nodeKey={this.getKey()}
        src={this.__src}
        width={this.__width}
      />
    );
  }

  exportDOM() {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.setAttribute('src', this.__src);
    image.setAttribute('alt', this.__altText);
    image.setAttribute('width', `${this.__width}%`);
    figure.append(image);

    if (this.__caption) {
      const caption = document.createElement('figcaption');
      caption.textContent = this.__caption;
      figure.append(caption);
    }

    return { element: figure };
  }

  exportJSON() {
    return {
      altText: this.__altText,
      caption: this.__caption,
      src: this.__src,
      type: 'image',
      version: 1,
      width: this.__width,
    };
  }

  isInline() {
    return false;
  }

  setWidth(width) {
    const writable = this.getWritable();
    writable.__width = Math.min(Math.max(Number(width) || 100, 25), 100);
  }
}

export function $createImageNode({ altText = '', caption = '', src, width = 100 }) {
  return $applyNodeReplacement(new ImageNode(src, altText, caption, width));
}

export function $isImageNode(node) {
  return node instanceof ImageNode;
}
