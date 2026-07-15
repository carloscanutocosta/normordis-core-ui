import { Switch } from '@/components/ui/switch';
import FieldWrapper, { useFieldContext } from './FieldWrapper';

export default function SwitchField({
  label,
  hint,
  error,
  value,
  onChange,
  disabled,
  switchLabel,
  description,
  className,
}) {
  return (
    <FieldWrapper hint={hint} error={error} className={className}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
        <SwitchWithContext
          checked={!!value}
          onCheckedChange={onChange}
          disabled={disabled}
          aria-label={switchLabel ?? label}
        />
      </div>
    </FieldWrapper>
  );
}

// Switch com `aria-invalid` e `aria-describedby` injetados via FieldContext.
// O Radix Switch renderiza um <button role="switch"> — aceita atributos ARIA arbitrários.
function SwitchWithContext(props) {
  const field = useFieldContext();
  return (
    <Switch
      {...props}
      aria-invalid={field?.invalid || undefined}
      aria-describedby={field?.describedBy}
    />
  );
}
