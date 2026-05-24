import { cn } from "@/lib/utils";
import FieldWrapper from "./FieldWrapper";

export default function TextField({
  label,
  hint,
  error,
  required,
  multiline = false,
  rows = 4,
  placeholder,
  value,
  onChange,
  disabled,
  readOnly,
  prefix,
  suffix,
  className,
  inputClassName,
  ...props
}) {
  const baseInput =
    "w-full bg-background text-foreground text-sm rounded-lg border border-input px-3 py-2 transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring disabled:opacity-50 disabled:cursor-not-allowed read-only:bg-muted/50";

  if (multiline) {
    return (
      <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(baseInput, "resize-y min-h-[80px]", error && "border-destructive focus:ring-destructive/30", inputClassName)}
          {...props}
        />
      </FieldWrapper>
    );
  }

  if (prefix || suffix) {
    return (
      <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
        <div className="flex items-center rounded-lg border border-input bg-background focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring transition-all overflow-hidden">
          {prefix && (
            <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-r border-input select-none shrink-0">
              {prefix}
            </span>
          )}
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            className={cn(
              "flex-1 bg-transparent text-sm px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
              inputClassName
            )}
            {...props}
          />
          {suffix && (
            <span className="px-3 py-2 text-sm text-muted-foreground bg-muted border-l border-input select-none shrink-0">
              {suffix}
            </span>
          )}
        </div>
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        className={cn(baseInput, error && "border-destructive focus:ring-destructive/30", inputClassName)}
        {...props}
      />
    </FieldWrapper>
  );
}