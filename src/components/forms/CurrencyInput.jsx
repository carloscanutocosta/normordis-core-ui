import React, { useId } from "react";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "EUR", symbol: "€" },
  { code: "BRL", symbol: "R$" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
];

/**
 * Currency input with currency selector.
 *
 * value: { currency: string, amount: string }
 * onChange: (value: { currency: string, amount: string }) => void
 */
export default function CurrencyInput({
  id: idProp,
  label,
  description,
  error,
  required,
  value = { currency: "EUR", amount: "" },
  onChange,
  disabled,
  placeholder = "0,00",
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;

  const currency = value?.currency ?? "EUR";
  const amount = value?.amount ?? "";

  const update = (patch) => onChange?.({ currency, amount, ...patch });

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.,]/g, "");
    update({ amount: raw });
  };

  return (
    <FormField id={id} label={label} description={description} error={error} required={required} className={className}>
      <div className={cn(
        "flex h-9 rounded-md border border-input bg-background overflow-hidden",
        "focus-within:ring-1 focus-within:ring-ring",
        error && "border-destructive",
        disabled && "opacity-50"
      )}>
        {/* Currency selector */}
        <select
          value={currency}
          onChange={(e) => update({ currency: e.target.value })}
          disabled={disabled}
          className="h-full px-2 border-r border-input bg-muted/40 text-sm text-foreground focus:outline-none"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.symbol} {c.code}
            </option>
          ))}
        </select>
        {/* Amount input */}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={handleAmountChange}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 px-3 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-right"
        />
      </div>
    </FormField>
  );
}
