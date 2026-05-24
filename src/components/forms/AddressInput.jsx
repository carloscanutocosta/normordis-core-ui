import React from "react";
import FormField from "./FormField";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  { value: "PT", label: "Portugal" },
  { value: "BR", label: "Brasil" },
  { value: "ES", label: "Espanha" },
  { value: "FR", label: "França" },
  { value: "DE", label: "Alemanha" },
  { value: "GB", label: "Reino Unido" },
  { value: "US", label: "Estados Unidos" },
];

export default function AddressInput({ label = "Morada", value = {}, onChange, required, disabled, error, className }) {
  const update = (key) => (val) => onChange?.({ ...value, [key]: val });

  return (
    <FormField label={label} error={error} required={required} className={className}>
      <div className="space-y-2">
        <Input placeholder="Rua, Av., Largo..." value={value.street ?? ""} onChange={(e) => update("street")(e.target.value)} disabled={disabled} className={error ? "border-destructive" : ""} />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Cidade" value={value.city ?? ""} onChange={(e) => update("city")(e.target.value)} disabled={disabled} />
          <Input placeholder="Código Postal" value={value.postal ?? ""} onChange={(e) => update("postal")(e.target.value)} disabled={disabled} />
        </div>
        <select
          value={value.country ?? ""}
          onChange={(e) => update("country")(e.target.value)}
          disabled={disabled}
          className={cn("w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring", disabled && "opacity-50 cursor-not-allowed")}
        >
          <option value="">Seleccionar país…</option>
          {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
    </FormField>
  );
}