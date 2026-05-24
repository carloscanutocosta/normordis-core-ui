import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FormField from "./FormField";

export default function CheckboxInput({
  label,
  description,
  error,
  checked,
  onChange,
  disabled,
  className,
}) {
  return (
    <FormField error={error} className={className}>
      <label className="flex items-start gap-3 cursor-pointer group">
        <Checkbox
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className="mt-0.5"
        />
        <div className="space-y-0.5">
          {label && <Label className="cursor-pointer font-medium text-sm group-hover:text-primary transition-colors">{label}</Label>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </label>
    </FormField>
  );
}