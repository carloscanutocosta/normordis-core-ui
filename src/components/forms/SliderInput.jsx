import React from "react";
import { Slider } from "@/components/ui/slider";
import FormField from "./FormField";

export default function SliderInput({
  label,
  description,
  error,
  required,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  suffix = "",
  disabled,
  className,
}) {
  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <div className="space-y-3">
        {showValue && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{min}{suffix}</span>
            <span className="font-semibold text-primary">{value ?? min}{suffix}</span>
            <span className="text-muted-foreground">{max}{suffix}</span>
          </div>
        )}
        <Slider
          value={[value ?? min]}
          onValueChange={([val]) => onChange?.(val)}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      </div>
    </FormField>
  );
}