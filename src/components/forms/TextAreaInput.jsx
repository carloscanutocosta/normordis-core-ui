import React, { useId } from 'react';
import { Textarea } from '@/components/ui/textarea';
import FormField from './FormField';
import { cn } from '@/lib/utils';

export default function TextAreaInput({
  id: idProp,
  label,
  description,
  error,
  required,
  placeholder,
  value,
  onChange,
  rows = 4,
  maxLength,
  disabled,
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <FormField
      id={id}
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(
          'transition-colors resize-y min-h-[80px]',
          error && 'border-destructive focus-visible:ring-destructive',
        )}
      />
      {maxLength && (
        <div className="text-xs text-muted-foreground text-right">
          {(value || '').length}/{maxLength}
        </div>
      )}
    </FormField>
  );
}
