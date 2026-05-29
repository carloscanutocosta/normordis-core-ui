import React, { useRef, useState } from 'react';
import { Upload, X, File, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormField from './FormField';
import { cn } from '@/lib/utils';

export default function FileUploadInput({
  label,
  description,
  error,
  required,
  value,
  onChange,
  accept,
  multiple = false,
  disabled,
  className,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const files = value ? (Array.isArray(value) ? value : [value]) : [];

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);
    if (multiple) {
      onChange?.([...files, ...arr]);
    } else {
      onChange?.(arr[0] || null);
    }
  };

  const removeFile = (index) => {
    if (multiple) {
      onChange?.(files.filter((_, i) => i !== index));
    } else {
      onChange?.(null);
    }
  };

  const isImage = (file) => file?.type?.startsWith('image/');

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
          'border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer',
          dragOver ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive',
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Arrastar e soltar ou <span className="text-primary font-medium">procurar</span>
        </p>
        {accept && <p className="text-xs text-muted-foreground mt-1">{accept}</p>}
      </div>

      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-md bg-muted/50 border">
              {isImage(file) ? (
                <Image className="h-4 w-4 text-primary" />
              ) : (
                <File className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm truncate flex-1">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </FormField>
  );
}
