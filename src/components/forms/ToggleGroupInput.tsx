import React from 'react';
import FormField from './FormField';
import { cn } from '@/lib/utils';

export default function ToggleGroupInput({
  label,
  description,
  error,
  required,
  value,
  onChange,
  options = [],
  multiple = false,
  disabled,
  className,
}) {
  const isSelected = (opt) =>
    multiple ? (Array.isArray(value) ? value.includes(opt) : false) : value === opt;

  const handleClick = (opt) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      onChange(current.includes(opt) ? current.filter((v) => v !== opt) : [...current, opt]);
    } else {
      onChange(value === opt ? null : opt);
    }
  };

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map(({ value: opt, label: lbl, icon: Icon }) => {
          const active = isSelected(opt);
          return (
            <button
              key={opt}
              type="button"
              disabled={disabled}
              onClick={() => handleClick(opt)}
              aria-pressed={active}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-medium transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-input hover:bg-muted',
                disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {lbl}
            </button>
          );
        })}
      </div>
    </FormField>
  );
}
