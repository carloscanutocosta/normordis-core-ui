import { useId } from "react";
import { cn } from "@/lib/utils";
import FieldWrapper from "./FieldWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectField({
  id: idProp,
  label,
  hint,
  error,
  required,
  value,
  onChange,
  options = [],
  placeholder = "Selecione...",
  disabled,
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;

  // options: [{ value, label, disabled? }] or ["string", ...]
  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  return (
    <FieldWrapper id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <Select value={value ?? ""} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={cn(
            "w-full",
            error && "border-destructive focus:ring-destructive/30"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {normalized.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}