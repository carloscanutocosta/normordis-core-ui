import React, { useId } from "react";
import FormField from "./FormField";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export default function TimeRangeInput({
  id: idProp,
  label,
  description,
  error,
  required,
  value = { start: "", end: "" },
  onChange,
  disabled,
  className,
}) {
  const autoId = useId();
  const startId = idProp ? `${idProp}-start` : `${autoId}-start`;
  const endId   = idProp ? `${idProp}-end`   : `${autoId}-end`;

  const update = (key) => (e) => onChange?.({ ...value, [key]: e.target.value });

  const inputClass = cn(
    "h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground",
    "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    error && "border-destructive"
  );

  return (
    <FormField id={startId} label={label} description={description} error={error} required={required} className={className}>
      <div className="flex items-center gap-2">
        <input
          id={startId}
          type="time"
          value={value.start}
          onChange={update("start")}
          disabled={disabled}
          className={inputClass}
        />
        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          id={endId}
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
