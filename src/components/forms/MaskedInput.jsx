import React, { useId } from "react";
import FormField from "./FormField";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MASKS = {
  nif:   { pattern: "999 999 999",                         placeholder: "123 456 789" },
  iban:  { pattern: "AAAA 9999 9999 9999 9999 9999 9",     placeholder: "PT50 0000 0000 0000 0000 000 0" },
  date:  { pattern: "99/99/9999",                          placeholder: "DD/MM/AAAA" },
  phone: { pattern: "999 999 999",                         placeholder: "912 345 678" },
  cc:    { pattern: "9999 9999 9999 9999",                 placeholder: "0000 0000 0000 0000" },
};

/**
 * Applies a mask pattern to raw input.
 * Pattern characters:
 *   "9" — accepts one digit
 *   "A" — accepts one letter (uppercased)
 *   any other char — treated as a literal separator (e.g. space, "/", "-")
 */
function applyMask(raw, pattern) {
  // Strip all formatting characters — keep only alphanumeric
  const clean = raw.replace(/[^a-zA-Z0-9]/g, "");
  let out = "";
  let ci = 0;
  for (let i = 0; i < pattern.length && ci < clean.length; i++) {
    const slot = pattern[i];
    if (slot === "9") {
      if (/\d/.test(clean[ci])) {
        out += clean[ci++];
      } else {
        // Skip non-digit characters in digit slots
        ci++;
        i--; // retry same slot
      }
    } else if (slot === "A") {
      if (/[a-zA-Z]/.test(clean[ci])) {
        out += clean[ci++].toUpperCase();
      } else {
        ci++;
        i--;
      }
    } else {
      // Literal separator — emit it and stay on the same clean char
      out += slot;
    }
  }
  return out;
}

export default function MaskedInput({
  id: idProp,
  label,
  description,
  error,
  required,
  disabled,
  value = "",
  onChange,
  mask = "nif",
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const cfg = MASKS[mask] ?? MASKS.nif;

  const handleChange = (e) => {
    const masked = applyMask(e.target.value, cfg.pattern);
    onChange?.(masked);
  };

  return (
    <FormField id={id} label={label} description={description} error={error} required={required} className={className}>
      <Input
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={cfg.placeholder}
        disabled={disabled}
        className={cn(error && "border-destructive")}
      />
    </FormField>
  );
}
