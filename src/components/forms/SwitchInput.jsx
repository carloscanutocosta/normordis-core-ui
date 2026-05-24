import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import FormField from "./FormField";

export default function SwitchInput({
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
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          {label && <Label className="font-medium text-sm">{label}</Label>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
      </div>
    </FormField>
  );
}