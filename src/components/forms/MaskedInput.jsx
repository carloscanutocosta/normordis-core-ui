import React from "react";
import FormField from "./FormField";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const MASKS = {
  nif:  { pattern: "999 999 999",   placeholder: "123 456 789" },
  iban: { pattern: "AAAA 9999 9999 9999 9999 9",  placeholder: "PT50 0000 0000 0000 0000 000 0" },
  date: { pattern: "99/99/9999",    placeholder: "DD/MM/AAAA" },
  phone:{ pattern: "999 999 999",   placeholder: "912 345 678" },
  cc:   { pattern: "9999 9999 9999 9999", placeholder: "0000 0000 0000 0000" },
};

function applyMask(raw, pattern) {
  const digits = raw.replace(/\D/g, "");
  let out = "";
  let di = 0;
  for (let i = 0; i < pattern.length && di < digits.length; i++) {
    const ch = pattern[i];
    if (ch === "9" || ch === "A") {
      out += digits[di++];
    } else {
      out += ch;
    }
  }
  return out;
}

export default function MaskedInput({ label, description, error, required, disabled, value = "", onChange, mask = "nif", className }) {
  const cfg = MASKS[mask] || MASKS.nif;

  const handleChange = (e) => {
    const masked = applyMask(e.target.value, cfg.pattern);
    onChange?.(masked);
  };

  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={cfg.placeholder}
        disabled={disabled}
        className={cn(error && "border-destructive")}
      />
    </FormField>
  );
}