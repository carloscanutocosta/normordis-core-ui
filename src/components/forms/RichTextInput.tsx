// @ts-nocheck — @lexical/html, @lexical/rich-text, @lexical/list are optional peer deps
// not hoisted by pnpm in CI; complex Lexical internals don't benefit from strict typing
import React, { useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND, $getRoot, $insertNodes } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
} from 'lucide-react';
import FormField from './FormField';
import { cn } from '@/lib/utils';

// ── Toolbar ────────────────────────────────────────────────────────────────
function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const btn = (cmd, payload, Icon, title) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        editor.dispatchCommand(cmd, payload);
      }}
      className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-input bg-muted/40">
      {btn(FORMAT_TEXT_COMMAND, 'bold', Bold, 'Negrito')}
      {btn(FORMAT_TEXT_COMMAND, 'italic', Italic, 'Itálico')}
      {btn(FORMAT_TEXT_COMMAND, 'underline', Underline, 'Sublinhado')}
      {btn(FORMAT_TEXT_COMMAND, 'strikethrough', Strikethrough, 'Riscado')}
      <span className="w-px h-4 bg-border mx-1" />
      {btn(INSERT_UNORDERED_LIST_COMMAND, undefined, List, 'Lista')}
      {btn(INSERT_ORDERED_LIST_COMMAND, undefined, ListOrdered, 'Lista numerada')}
      <span className="w-px h-4 bg-border mx-1" />
      {btn(UNDO_COMMAND, undefined, Undo, 'Desfazer')}
      {btn(REDO_COMMAND, undefined, Redo, 'Refazer')}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
const theme = {
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
  },
  list: {
    ul: 'list-disc ml-4',
    ol: 'list-decimal ml-4',
  },
};

/**
 * Rich text input backed by Lexical.
 *
 * `value` (HTML string) is used to populate the editor on first mount only —
 * the "defaultValue" pattern. After mount the editor runs uncontrolled and
 * fires `onChange(html)` on every change. For a fully controlled editor use
 * NormordisEditorLexical which has SyncExternalValuePlugin.
 *
 * @param {{ value?: string, onChange?: (html: string) => void, label?: string, description?: string, error?: string, required?: boolean, disabled?: boolean, placeholder?: string, className?: string }} props
 */
export default function RichTextInput({
  label,
  description,
  error,
  required,
  value,
  onChange,
  placeholder = 'Escrever conteúdo...',
  disabled,
  className,
}) {
  const initialConfig = {
    namespace: 'RichTextInput',
    theme,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    onError: (err) => console.error(err),
    editable: !disabled,
    // Populate the editor from the HTML value on first mount.
    // After mount the editor is uncontrolled — use onChange to capture updates.
    editorState: value
      ? (editor) => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(value, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          $getRoot().select();
          $insertNodes(nodes);
        }
      : undefined,
  };

  const handleChange = useCallback(
    (editorState, editor) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        onChange?.(html);
      });
    },
    [onChange],
  );

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      <div
        className={cn(
          'rounded-md border border-input overflow-hidden bg-background',
          error && 'border-destructive',
          disabled && 'opacity-50',
        )}
      >
        <LexicalComposer initialConfig={initialConfig}>
          {!disabled && <Toolbar />}
          <ListPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-[160px] px-3 py-2 text-sm text-foreground outline-none focus:outline-none" />
              }
              placeholder={
                <div className="absolute top-2 left-3 text-sm text-muted-foreground pointer-events-none select-none">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
          <OnChangePlugin onChange={handleChange} />
        </LexicalComposer>
      </div>
    </FormField>
  );
}
