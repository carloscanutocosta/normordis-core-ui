import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Redo2,
  Underline,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { insertSemanticBlock, setBlockType } from "./editorCommands";

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
 * Devolve o estado reativo da toolbar (undo/redo/formatos ativos) e a
 * instância do editor. Deve ser chamado dentro do LexicalComposer.
 *
 * Usar para construir toolbars personalizadas sem reimplementar o tracking:
 *   const { editor, canUndo, canRedo, activeFormats } = useEditorToolbarState();
 */
export function useEditorToolbarState() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    return mergeRegister(
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
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            setActiveFormats({
              bold: selection.hasFormat("bold"),
              italic: selection.hasFormat("italic"),
              underline: selection.hasFormat("underline"),
            });
          });
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  return { editor, canUndo, canRedo, activeFormats };
}

export function NormordisEditorToolbar({
  disabled,
  onSemanticBlockInsert,
  semanticBlocks = [],
  toolbarLabel = "Ferramentas do editor",
}) {
  const { editor, canUndo, canRedo, activeFormats } = useEditorToolbarState();

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

      <ToolbarDivider />

      <ToolbarButton
        disabled={disabled}
        label="Paragrafo"
        onClick={() => setBlockType(editor, "paragraph")}
      >
        <Pilcrow className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled}
        label="Titulo 1"
        onClick={() => setBlockType(editor, "h1")}
      >
        <Heading1 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled}
        label="Titulo 2"
        onClick={() => setBlockType(editor, "h2")}
      >
        <Heading2 className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        disabled={disabled}
        label="Lista"
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
      >
        <List className="h-4 w-4" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        disabled={disabled}
        label="Lista numerada"
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
      >
        <ListOrdered className="h-4 w-4" aria-hidden="true" />
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
