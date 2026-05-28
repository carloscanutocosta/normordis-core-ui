import React, { useId, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import FormField from './FormField';
import { cn } from '@/lib/utils';

export default function TagsInput({
  id: idProp,
  label,
  description,
  error,
  required,
  value = [],
  onChange,
  placeholder = 'Digitar e pressionar Enter...',
  disabled,
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange?.([...value, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = (tag) => {
    onChange?.(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <FormField
      id={id}
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      <div
        className={cn(
          'flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 min-h-[40px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all',
          error && 'border-destructive',
          disabled && 'opacity-50',
        )}
      >
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs gap-1 shrink-0">
            {tag}
            {!disabled && <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />}
          </Badge>
        ))}
        <Input
          aria-label={label ?? placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled}
          className="border-0 p-0 h-7 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-w-[120px]"
        />
      </div>
    </FormField>
  );
}
