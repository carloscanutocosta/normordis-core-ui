import React from "react";
import { Textarea } from "@/components/ui/textarea";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

export default function TextAreaInput({
  label,
  description,
  error,
  required,
  placeholder,
  value,
  onChange,
  rows = 4,
  maxLength,
  disabled,
  className,
}) {
  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(
          "transition-colors resize-y min-h-[80px]",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {maxLength && (
        <div className="text-xs text-muted-foreground text-right">
          {(value || "").length}/{maxLength}
        </div>
      )}
    </FormField>
  );
}