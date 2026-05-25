import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  $isListNode,
  insertList,
} from "@lexical/list";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import {
  Bold,
  Braces,
  Image,
  IndentDecrease,
  IndentIncrease,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Subscript,
  Superscript,
  Table2,
  Underline,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  convertSelectionToPlaceholder,
  exitCurrentListItem,
  insertImage,
  insertSemanticBlock,
  insertTable,
  setBlockType,
} from "./editorCommands";

const BLOCK_STYLE_OPTIONS = [
  { value: "paragraph", label: "Normal" },
  { value: "h1", label: "Título" },
  { value: "h2", label: "Subtítulo" },
  { value: "h3", label: "Secção" },
  { value: "quote", label: "Bloco" },
];

const MAX_INDENT_LEVEL = 3;

function getAncestorListDepth(node) {
  let depth = 0;
  let current = node;

  while (current) {
    if ($isListNode(current)) {
      depth += 1;
    }

    current = current.getParent?.();
  }

  return Math.max(0, depth - 1);
}

function getNodeIndentLevel(node, topLevelElement) {
  const listDepth = getAncestorListDepth(node);
  if (listDepth > 0) return listDepth;

  if (typeof topLevelElement.getIndent === "function") {
    return topLevelElement.getIndent();
  }

  return 0;
}

function toggleList(editor, listType, isActive) {
  if (isActive) {
    exitCurrentListItem(editor);
  } else {
    insertList(editor, listType);
    editor.focus();
  }
}

function getPromptText(message, defaultValue = "") {
  if (typeof window === "undefined") return defaultValue;
  const value = window.prompt(message, defaultValue);
  return value === null ? defaultValue : value.trim();
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result ?? "")));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

function TableInsertDialog({ disabled, editor }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const handleInsert = () => {
    setOpen(false);
    window.setTimeout(() => {
      insertTable(editor, { columns, includeHeaders, rows });
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <ToolbarButton
        disabled={disabled}
        label="Inserir tabela"
        onClick={() => setOpen(true)}
      >
        <Table2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>Inserir tabela</DialogTitle>
            <DialogDescription>
              Define uma tabela simples para o documento.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-foreground">
              <span>Linhas</span>
              <Input
                min={1}
                max={20}
                type="number"
                value={rows}
                onChange={(event) => setRows(Number(event.target.value))}
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-foreground">
              <span>Colunas</span>
              <Input
                min={1}
                max={12}
                type="number"
                value={columns}
                onChange={(event) => setColumns(Number(event.target.value))}
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={includeHeaders}
              onChange={(event) => setIncludeHeaders(event.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <span>Incluir cabeçalho</span>
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleInsert}>
              Inserir
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ToolbarButton({
  children,
  disabled,
  label,
  onClick,
  pressed,
  showLabel = false,
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={typeof pressed === "boolean" ? pressed : undefined}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick?.();
      }}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-md border border-transparent px-2 text-sm font-medium text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        pressed && "border-border bg-muted text-foreground"
      )}
    >
      {children}
      {showLabel && <span>{label}</span>}
    </button>
  );
}

export function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px bg-border" />;
}

/**
 * Devolve o estado reativo da toolbar e a instância do editor. Deve ser
 * chamado dentro do LexicalComposer.
 *
 * Usar para construir toolbars personalizadas sem reimplementar o tracking:
 *   const { editor, activeFormats, activeBlockType } = useEditorToolbarState();
 */
export function useEditorToolbarState() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activeBlockType, setActiveBlockType] = useState("paragraph");
  const [activeIndentLevel, setActiveIndentLevel] = useState(0);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    subscript: false,
    superscript: false,
    underline: false,
  });

  const updateToolbarState = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();
    const topLevelElement =
      anchorNode.getKey() === "root"
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();

    setActiveFormats({
      bold: selection.hasFormat("bold"),
      italic: selection.hasFormat("italic"),
      subscript: selection.hasFormat("subscript"),
      superscript: selection.hasFormat("superscript"),
      underline: selection.hasFormat("underline"),
    });
    setActiveIndentLevel(
      Math.min(MAX_INDENT_LEVEL, getNodeIndentLevel(anchorNode, topLevelElement))
    );

    if ($isHeadingNode(topLevelElement)) {
      setActiveBlockType(topLevelElement.getTag());
      return;
    }

    if ($isListNode(topLevelElement)) {
      setActiveBlockType(
        topLevelElement.getListType() === "number" ? "ol" : "ul"
      );
      return;
    }

    if ($isQuoteNode(topLevelElement)) {
      setActiveBlockType("quote");
      return;
    }

    setActiveBlockType(
      topLevelElement.getType() === "paragraph" ? "paragraph" : "unknown"
    );
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbarState);
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => { setCanUndo(payload); return false; },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => { setCanRedo(payload); return false; },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbarState();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbarState]);

  return {
    editor,
    canUndo,
    canRedo,
    activeFormats,
    activeBlockType,
    activeIndentLevel,
  };
}

export function NormordisEditorToolbar({
  disabled,
  onSemanticBlockInsert,
  placeholderDefinitions = [],
  semanticBlocks = [],
  toolbarLabel = "Ferramentas do editor",
}) {
  const {
    editor,
    canUndo,
    canRedo,
    activeFormats,
    activeBlockType,
    activeIndentLevel,
  } = useEditorToolbarState();
  const imageInputRef = useRef(null);

  return (
    <div
      aria-label={toolbarLabel}
      role="toolbar"
      className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/60 px-2 py-2"
    >
      <ToolbarButton
        disabled={disabled || !canUndo}
        label="Desfazer"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Undo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled || !canRedo}
        label="Refazer"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Redo2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        disabled={disabled}
        label="Negrito"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        pressed={activeFormats.bold}
      >
        <Bold className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled}
        label="Italico"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        pressed={activeFormats.italic}
      >
        <Italic className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled}
        label="Sublinhado"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        pressed={activeFormats.underline}
      >
        <Underline className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled}
        label="Subscrito"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}
        pressed={activeFormats.subscript}
      >
        <Subscript className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled}
        label="Sobrescrito"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")}
        pressed={activeFormats.superscript}
      >
        <Superscript className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarDivider />

      <label className="sr-only" htmlFor="normordis-block-style">
        Estilo do bloco
      </label>
      <select
        id="normordis-block-style"
        aria-label="Estilo do bloco"
        disabled={disabled}
        value={
          BLOCK_STYLE_OPTIONS.some((option) => option.value === activeBlockType)
            ? activeBlockType
            : "paragraph"
        }
        onChange={(event) => {
          setBlockType(editor, event.target.value);
          editor.focus();
        }}
        className={cn(
          "h-9 min-w-36 rounded-md border border-input bg-background px-2 text-sm font-medium text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {BLOCK_STYLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ToolbarDivider />

      <ToolbarButton
        disabled={disabled || activeIndentLevel <= 0}
        label="Reduzir indentação"
        onClick={() => {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
          editor.focus();
        }}
      >
        <IndentDecrease className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled || activeIndentLevel >= MAX_INDENT_LEVEL}
        label="Aumentar indentação"
        onClick={() => {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
          editor.focus();
        }}
      >
        <IndentIncrease className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarButton
        disabled={disabled}
        label="Lista"
        onClick={() => toggleList(editor, "bullet", activeBlockType === "ul")}
        pressed={activeBlockType === "ul"}
      >
        <List className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled}
        label="Lista numerada"
        onClick={() => toggleList(editor, "number", activeBlockType === "ol")}
        pressed={activeBlockType === "ol"}
      >
        <ListOrdered className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        disabled={disabled}
        label="Inserir imagem"
        onClick={() => imageInputRef.current?.click()}
      >
        <Image className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;

          const src = await readImageFile(file);
          if (!src) return;

          insertImage(editor, {
            altText: file.name,
            caption: getPromptText("Legenda da imagem", file.name),
            src,
          });
        }}
      />
      <TableInsertDialog disabled={disabled} editor={editor} />

      <ToolbarDivider />

      <ToolbarButton
        disabled={disabled}
        label="Converter em placeholder"
        onClick={() => convertSelectionToPlaceholder(editor, placeholderDefinitions)}
      >
        <Braces className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      {semanticBlocks.length > 0 && (
        <>
          <ToolbarDivider />
          <label className="sr-only" htmlFor="normordis-semantic-blocks">
            Inserir bloco semantico
          </label>
          <select
            id="normordis-semantic-blocks"
            disabled={disabled}
            defaultValue=""
            onChange={(event) => {
              const block = semanticBlocks.find(
                (item) => item.id === event.target.value
              );
              if (!block) return;

              insertSemanticBlock(editor, block);
              onSemanticBlockInsert?.(block);
              event.target.value = "";
            }}
            className={cn(
              "h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            <option value="">Inserir bloco</option>
            {semanticBlocks.map((block) => (
              <option key={block.id} value={block.id}>
                {block.category ? `${block.category} - ${block.label}` : block.label}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
}

export default NormordisEditorToolbar;
