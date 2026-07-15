import { useId } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import FieldWrapper, { useFieldContext } from './FieldWrapper';

export default function CheckboxField({
  id: idProp,
  label,
  hint,
  error,
  required,
  value,
  onChange,
  disabled,
  checkLabel,
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    // Passar `id` ao FieldWrapper para gerar hintId/errorId corretos.
    // O label de grupo usa um <p> (não <label htmlFor>) porque o Checkbox
    // tem o seu próprio rótulo inline via checkLabel.
    <FieldWrapper id={id} hint={hint} error={error} required={required} className={className}>
      {label && (
        <p className="text-sm font-medium text-foreground">
          {label}
          {required && (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </p>
      )}
      <label
        className={cn(
          'flex items-center gap-3 cursor-pointer group',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <CheckboxWithContext
          id={id}
          checked={!!value}
          onCheckedChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(error && 'border-destructive')}
        />
        {checkLabel && (
          <span className="text-sm text-foreground group-hover:text-foreground/80 transition-colors">
            {checkLabel}
          </span>
        )}
      </label>
    </FieldWrapper>
  );
}

// Checkbox com `aria-invalid`, `aria-describedby` e `aria-required` via FieldContext.
// O Radix Checkbox renderiza um <button role="checkbox"> — aceita atributos ARIA arbitrários.
function CheckboxWithContext({ required: _required, ...props }) {
  const field = useFieldContext();
  return (
    <Checkbox
      {...props}
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
      aria-required={field?.required || undefined}
    />
  );
}
