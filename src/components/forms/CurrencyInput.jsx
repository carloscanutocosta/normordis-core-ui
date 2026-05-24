import React, { useState } from "react";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

const CURRENCIES = [
  { code: "EUR", symbol: "€" },
  { code: "BRL", symbol: "R$" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
];

export default function CurrencyInput({
  label,
  description,
  error,
  required,
  value = "",
  onChange,
  disabled,
  currency: defaultCurrency = "EUR",
  placeholder = "0,00",
  className,
}) {
  const [currency, setCurrency] = useState(defaultCurrency);
  const selected = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  const handleChange = (e) => {
    // Allow only digits, comma, dot
    const raw = e.target.value.replace(/[^0-9.,]/g, "");
    onChange(raw);
  };

  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <div className={cn(
        "flex h-9 rounded-md border border-input bg-background overflow-hidden",
        "focus-within:ring-1 focus-within:ring-ring",
        error && "border-destructive",
        disabled && "opacity-50"
      )}>
        {/* Currency selector */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
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
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 px-3 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-right"
        />
      </div>
    </FormField>
  );
}