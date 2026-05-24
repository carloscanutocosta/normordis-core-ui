import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FieldWrapper from "./FieldWrapper";

export default function RadioField({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  options = [],
  disabled,
  layout = "vertical",
  className,
}) {
  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <RadioGroup
        value={value ?? ""}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(
          layout === "horizontal" ? "flex flex-wrap gap-4" : "flex flex-col gap-2"
        )}
      >
        {normalized.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              "flex items-center gap-2.5 cursor-pointer text-sm",
              opt.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <RadioGroupItem value={opt.value} disabled={opt.disabled} />
            <span className="text-foreground">{opt.label}</span>
          </label>
        ))}
      </RadioGroup>
    </FieldWrapper>
  );
}