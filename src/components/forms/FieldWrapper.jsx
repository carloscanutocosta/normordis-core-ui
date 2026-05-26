import { useId } from "react";
import { cn } from "@/lib/utils";

export default function FieldWrapper({ id: idProp, label, hint, error, required, children, className }) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground leading-none">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  );
}
