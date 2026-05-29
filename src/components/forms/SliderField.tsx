import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import FieldWrapper from './FieldWrapper';

export default function SliderField({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  showValue = true,
  formatValue,
  className,
}) {
  const display = formatValue ? formatValue(value ?? min) : (value ?? min);

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Slider
            value={[value ?? min]}
            onValueChange={([v]) => onChange?.(v)}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn(error && '[&>span]:border-destructive')}
          />
        </div>
        {showValue && (
          <span className="min-w-[3rem] text-right text-sm font-medium text-foreground tabular-nums">
            {display}
          </span>
        )}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-0.5 mt-0.5">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </FieldWrapper>
  );
}
