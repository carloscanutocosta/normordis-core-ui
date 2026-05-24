import React from "react";
import { Input } from "@/components/ui/input";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

export default function ColorInput({
  label,
  description,
  error,
  required,
  value,
  onChange,
  disabled,
  className,
}) {
  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-md border border-input shrink-0 overflow-hidden cursor-pointer"
          style={{ backgroundColor: value || "#000000" }}
        >
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="#000000"
          disabled={disabled}
          className={cn("h-10 font-mono text-sm uppercase", error && "border-destructive")}
        />
      </div>
    </FormField>
  );
}