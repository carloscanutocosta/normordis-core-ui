import React from 'react';
import { Input } from '@/components/ui/input';
import FormField from './FormField';
import { cn } from '@/lib/utils';

interface DateTimeInputProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  type?: string;
}

export default function DateTimeInput({
  label,
  description,
  error,
  required,
  value,
  onChange,
  disabled,
  className,
  type = 'datetime-local',
}: DateTimeInputProps) {
  return (
    <FormField
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      <Input
        type={type}
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn('h-10', error && 'border-destructive')}
      />
    </FormField>
  );
}
