import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import FieldWrapper from './FieldWrapper';

export default function NumberField({
  id: idProp,
  label,
  hint,
  error,
  required,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  placeholder,
  showControls = true,
  prefix,
  suffix,
  className,
  ...props
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const handleChange = (e) => {
    const v = e.target.value;
    if (v === '' || v === '-') {
      onChange?.(v);
      return;
    }
    const num = parseFloat(v);
    if (!isNaN(num)) onChange?.(num);
  };

  const increment = () => {
    const current = typeof value === 'number' ? value : 0;
    const next = current + step;
    if (max !== undefined && next > max) return;
    onChange?.(parseFloat(next.toFixed(10)));
  };

  const decrement = () => {
    const current = typeof value === 'number' ? value : 0;
    const next = current - step;
    if (min !== undefined && next < min) return;
    onChange?.(parseFloat(next.toFixed(10)));
  };

  return (
    <FieldWrapper
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <div
        className={cn(
          'flex items-center rounded-lg border border-input bg-background transition-all focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring overflow-hidden',
          error && 'border-destructive focus-within:ring-destructive/30',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        {prefix && (
          <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r border-input shrink-0 select-none">
            {prefix}
          </span>
        )}
        {showControls && (
          <button
            type="button"
            onClick={decrement}
            disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
            className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        )}
        <input
          id={id}
          type="number"
          value={value ?? ''}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          placeholder={placeholder ?? '0'}
          className="flex-1 bg-transparent text-sm px-3 py-2 text-foreground text-center placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...props}
        />
        {showControls && (
          <button
            type="button"
            onClick={increment}
            disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
            className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
        {suffix && (
          <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-l border-input shrink-0 select-none">
            {suffix}
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}
