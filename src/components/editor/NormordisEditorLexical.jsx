import { useCallback, useEffect, useId, useMemo, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { cn } from "@/lib/utils";
import {
  createDocumentPayload,
  createInitialEditorState,
  EDITOR_SCHEMA,
  EDITOR_SCHEMA_VERSION,
  getLexicalPayload,
  lexicalTheme,
} from "./editorState";
import NormordisEditorToolbar from "./NormordisEditorToolbar";

function SyncExternalValuePlugin({ value }) {
  const [editor] = useLexicalComposerContext();
  const lastValueRef = useRef(null);

  useEffect(() => {
    const payload = getLexicalPayload(value);
    if (!payload) return;

    const serialized = JSON.stringify(payload);
    if (serialized === lastValueRef.current) return;

    lastValueRef.current = serialized;
    const nextState = editor.parseEditorState(serialized);
    editor.setEditorState(nextState);
  }, [editor, value]);

  return null;
}

export default function NormordisEditorLexical({
  "aria-label": ariaLabel,
  className,
  defaultValue,
  description,
  disabled = false,
  error,
  id,
  invalid,
  label,
  minHeight = 220,
  namespace = "NormordisEditorLexical",
  onChange,
  onError,
  onSemanticBlockInsert,
  placeholder = "Escrever documento...",
  readOnly = false,
  required = false,
  semanticBlocks = [],
  ToolbarComponent = NormordisEditorToolbar,
  toolbarProps,
  toolbarLabel,
  value,
}) {
  const generatedId = useId();
  const editorId = id ?? `normordis-editor-${generatedId}`;
  const descriptionId = description ? `${editorId}-description` : undefined;
  const errorId = error ? `${editorId}-error` : undefined;
  const isInvalid = Boolean(invalid || error);
  const isReadOnly = readOnly || disabled;

  const initialConfig = useMemo(
    () => ({
      editable: !isReadOnly,
      editorState: createInitialEditorState(value, defaultValue),
      namespace,
      nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
      onError: (err) => {
        onError?.(err);
        if (!onError) {
          throw err;
        }
      },
      theme: lexicalTheme,
    }),
    [defaultValue, isReadOnly, namespace, onError, value]
  );

  const handleChange = useCallback(
    (editorState) => {
      onChange?.(createDocumentPayload(editorState));
    },
    [onChange]
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground" htmlFor={editorId}>
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <div
        className={cn(
          "overflow-hidden rounded-md border border-input bg-background shadow-sm transition-colors",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
          isInvalid && "border-destructive focus-within:ring-destructive/30",
          disabled && "opacity-60"
        )}
      >
        <LexicalComposer initialConfig={initialConfig}>
          {!isReadOnly && ToolbarComponent && (
            <ToolbarComponent
              disabled={disabled}
              onSemanticBlockInsert={onSemanticBlockInsert}
              semanticBlocks={semanticBlocks}
              toolbarLabel={toolbarLabel}
              {...toolbarProps}
            />
          )}
          <ListPlugin />
          <LinkPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  id={editorId}
                  aria-describedby={
                    [descriptionId, errorId].filter(Boolean).join(" ") ||
                    undefined
                  }
                  aria-invalid={isInvalid || undefined}
                  aria-label={ariaLabel ?? (label ? undefined : "Editor")}
                  aria-required={required || undefined}
                  className={cn(
                    "prose prose-sm max-w-none px-4 py-3 text-sm text-foreground outline-none",
                    "focus:outline-none disabled:cursor-not-allowed",
                    isReadOnly && "cursor-default"
                  )}
                  style={{ minHeight }}
                />
              }
              placeholder={
                <div className="pointer-events-none absolute left-4 top-3 select-none text-sm text-muted-foreground">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <OnChangePlugin ignoreSelectionChange onChange={handleChange} />
          <SyncExternalValuePlugin value={value} />
        </LexicalComposer>
      </div>

      {error && (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export { EDITOR_SCHEMA, EDITOR_SCHEMA_VERSION, NormordisEditorLexical };
