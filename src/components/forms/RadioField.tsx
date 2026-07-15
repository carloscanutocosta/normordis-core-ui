import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FieldWrapper, { useFieldContext } from './FieldWrapper';

export default function RadioField({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  options = [],
  disabled,
  layout = 'vertical',
  className,
}) {
  const normalized = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));

  return (
    // O FieldWrapper cria o label de grupo (via <label htmlFor>), mas para
    // RadioGroup a semântica correta é aria-labelledby no grupo. O Radix
    // RadioGroup aceita aria-* props que são aplicados ao <div role="radiogroup">.
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <RadioGroupWithContext
        value={value ?? ''}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(layout === 'horizontal' ? 'flex flex-wrap gap-4' : 'flex flex-col gap-2')}
      >
        {normalized.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'flex items-center gap-2.5 cursor-pointer text-sm',
              opt.disabled && 'opacity-50 cursor-not-allowed',
            )}
          >
            <RadioGroupItem value={opt.value} disabled={opt.disabled} />
            <span className="text-foreground">{opt.label}</span>
          </label>
        ))}
      </RadioGroupWithContext>
    </FieldWrapper>
  );
}

// RadioGroup com `aria-invalid`, `aria-describedby` e `aria-required` via FieldContext.
// O Radix RadioGroup renderiza um <div role="radiogroup"> — aceita atributos ARIA arbitrários.
function RadioGroupWithContext({ children, ...props }) {
  const field = useFieldContext();
  return (
    <RadioGroup
      {...props}
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
      aria-required={field?.required || undefined}
    >
      {children}
    </RadioGroup>
  );
}
