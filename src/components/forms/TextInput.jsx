import React from "react";
import { Input } from "@/components/ui/input";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

export default function TextInput({
  label,
  description,
  error,
  required,
  placeholder,
  value,
  onChange,
  type = "text",
  icon: Icon,
  disabled,
  className,
  inputClassName,
  ...props
}) {
  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={cn(
            "h-10 transition-colors",
            Icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            inputClassName
          )}
          {...props}
        />
      </div>
    </FormField>
  );
}