import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

export default function SelectInput({
  label,
  description,
  error,
  required,
  value,
  onChange,
  options = [],
  placeholder = "Selecionar...",
  disabled,
  className,
}) {
  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn("h-10", error && "border-destructive")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const label = typeof opt === "string" ? opt : opt.label;
            return (
              <SelectItem key={val} value={val}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </FormField>
  );
}