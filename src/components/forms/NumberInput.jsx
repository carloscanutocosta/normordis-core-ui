import React, { useId } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

export default function NumberInput({
  id: idProp,
  label,
  description,
  error,
  required,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  showStepper = false,
  disabled,
  placeholder,
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;

  const handleChange = (newVal) => {
    const num = parseFloat(newVal);
    if (isNaN(num)) { onChange?.(""); return; }
    if (min !== undefined && num < min) return;
    if (max !== undefined && num > max) return;
    onChange?.(num);
  };

  const increment = () => handleChange((parseFloat(value) || 0) + step);
  const decrement = () => handleChange((parseFloat(value) || 0) - step);

  return (
    <FormField id={id} label={label} description={description} error={error} required={required} className={className}>
      <div className="flex items-center gap-2">
        {showStepper && (
          <Button type="button" variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={decrement} disabled={disabled || (min !== undefined && (parseFloat(value) || 0) <= min)}>
            <Minus className="h-4 w-4" />
          </Button>
        )}
        <div className="relative flex-1">
          {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
          <Input
            id={id}
            type="number"
            value={value ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "h-10 transition-colors [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              prefix && "pl-8",
              suffix && "pr-10",
              error && "border-destructive"
            )}
          />
          {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
        </div>
        {showStepper && (
          <Button type="button" variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={increment} disabled={disabled || (max !== undefined && (parseFloat(value) || 0) >= max)}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </FormField>
  );
}
