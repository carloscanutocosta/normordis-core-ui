import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import FieldWrapper from "./FieldWrapper";

export default function CheckboxField({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  disabled,
  checkLabel,
  className,
}) {
  return (
    <FieldWrapper hint={hint} error={error} className={className}>
      {label && (
        <p className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </p>
      )}
      <label className={cn(
        "flex items-center gap-3 cursor-pointer group",
        disabled && "cursor-not-allowed opacity-50"
      )}>
        <Checkbox
          checked={!!value}
          onCheckedChange={onChange}
          disabled={disabled}
          className={cn(error && "border-destructive")}
        />
        {checkLabel && (
          <span className="text-sm text-foreground group-hover:text-foreground/80 transition-colors">
            {checkLabel}
          </span>
        )}
      </label>
    </FieldWrapper>
  );
}