import React from "react";
import { Input } from "@/components/ui/input";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

export default function DateTimeInput({
  label,
  description,
  error,
  required,
  value,
  onChange,
  disabled,
  className,
  type = "datetime-local",
}) {
  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn("h-10", error && "border-destructive")}
      />
    </FormField>
  );
}