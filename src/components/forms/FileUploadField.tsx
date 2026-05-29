import { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import FieldWrapper from './FieldWrapper';

function FileIcon({ type }) {
  if (type?.startsWith('image/')) return <Image className="w-4 h-4 text-primary" />;
  if (type?.includes('pdf') || type?.includes('text'))
    return <FileText className="w-4 h-4 text-primary" />;
  return <File className="w-4 h-4 text-primary" />;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function FileUploadField({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  disabled,
  accept,
  multiple = false,
  maxSize,
  className,
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const files = value ? (Array.isArray(value) ? value : [value]) : [];

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    onChange?.(multiple ? [...files, ...newFiles] : (newFiles[0] ?? null));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    if (multiple) {
      onChange?.(files.filter((_, i) => i !== index));
    } else {
      onChange?.(null);
    }
  };

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input bg-background px-6 py-8 text-center cursor-pointer transition-all',
          dragOver && 'border-primary bg-primary/5',
          error && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <div
          className={cn(
            'p-3 rounded-full bg-primary/10 transition-transform',
            dragOver && 'scale-110',
          )}
        >
          <Upload className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Arraste arquivos ou{' '}
            <span className="text-primary underline underline-offset-2">
              clique para selecionar
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {accept ? `Formatos: ${accept}` : 'Qualquer formato'}
            {maxSize && ` · Máx. ${formatBytes(maxSize)}`}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
      {files.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
            >
              <FileIcon type={file.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                disabled={disabled}
                className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </FieldWrapper>
  );
}
