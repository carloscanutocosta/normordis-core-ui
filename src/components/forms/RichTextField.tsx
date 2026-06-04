import { useId } from 'react';
import { cn } from '@/lib/utils';
import FieldWrapper, { useFieldContext } from './FieldWrapper';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'blockquote',
  'code-block',
  'link',
];

export default function RichTextField({
  id: idProp,
  label,
  hint,
  error,
  required,
  value,
  onChange,
  disabled,
  placeholder = 'Digite aqui...',
  minHeight = 200,
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <FieldWrapper
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      {/* Wrapper com role="group" associa aria-invalid e aria-describedby ao editor.
          O ReactQuill não expõe atributos ARIA no contenteditable interno, por isso
          o grupo é a alternativa semântica mais robusta para leitores de ecrã. */}
      <RichEditorWithContext
        disabled={disabled}
        error={error}
        minHeight={minHeight}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </FieldWrapper>
  );
}

function RichEditorWithContext({ disabled, error, minHeight, placeholder, value, onChange }) {
  const field = useFieldContext();
  const wrapperId = field ? `${field.describedBy ?? ''}-editor` : undefined;

  return (
    <div
      role="group"
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
      className={cn(
        'rounded-lg border border-input overflow-hidden transition-all focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring',
        error && 'border-destructive focus-within:ring-destructive/30',
        disabled && 'opacity-50 pointer-events-none',
      )}
    >
      <style>{`
        .ql-toolbar { border: none !important; border-bottom: 1px solid hsl(var(--border)) !important; background: hsl(var(--muted)); padding: 8px 12px !important; }
        .ql-container { border: none !important; font-family: var(--font-inter) !important; font-size: 14px !important; }
        .ql-editor { min-height: ${minHeight}px; padding: 12px 16px !important; }
        .ql-editor.ql-blank::before { color: hsl(var(--muted-foreground)) !important; font-style: normal !important; }
        .ql-snow .ql-stroke { stroke: hsl(var(--muted-foreground)) !important; }
        .ql-snow .ql-fill { fill: hsl(var(--muted-foreground)) !important; }
        .ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke { stroke: hsl(var(--primary)) !important; }
        .ql-snow.ql-toolbar button:hover .ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-fill { fill: hsl(var(--primary)) !important; }
        .ql-picker-label { color: hsl(var(--foreground)) !important; }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value ?? ''}
        onChange={onChange}
        readOnly={disabled}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}
