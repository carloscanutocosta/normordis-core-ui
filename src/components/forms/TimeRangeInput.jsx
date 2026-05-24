import React from "react";
import FormField from "./FormField";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function TimeRangeInput({
  label,
  description,
  error,
  required,
  value = { start: "", end: "" },
  onChange,
  disabled,
  className,
}) {
  const update = (key) => (e) => onChange({ ...value, [key]: e.target.value });

  const inputClass = cn(
    "h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground",
    "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    error && "border-destructive"
  );

  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <div className="flex items-center gap-2">
        <input
          type="time"
          value={value.start}
          onChange={update("start")}
          disabled={disabled}
          className={inputClass}
        />
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="time"
          value={value.end}
          onChange={update("end")}
          disabled={disabled}
          className={inputClass}
        />
      </div>
    </FormField>
  );
}