import React, { useState } from "react";
import FormField from "./FormField";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const COUNTRIES = [
  { code: "PT", dial: "+351", flag: "🇵🇹" },
  { code: "BR", dial: "+55",  flag: "🇧🇷" },
  { code: "US", dial: "+1",   flag: "🇺🇸" },
  { code: "GB", dial: "+44",  flag: "🇬🇧" },
  { code: "ES", dial: "+34",  flag: "🇪🇸" },
  { code: "FR", dial: "+33",  flag: "🇫🇷" },
  { code: "DE", dial: "+49",  flag: "🇩🇪" },
];

export default function PhoneInput({
  label,
  description,
  error,
  required,
  value = "",
  onChange,
  disabled,
  placeholder = "912 345 678",
  className,
}) {
  const [countryCode, setCountryCode] = useState("+351");
  const [open, setOpen] = useState(false);

  const selected = COUNTRIES.find((c) => c.dial === countryCode) || COUNTRIES[0];

  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <div className={cn(
        "flex h-9 rounded-md border border-input bg-background overflow-hidden",
        "focus-within:ring-1 focus-within:ring-ring",
        error && "border-destructive",
        disabled && "opacity-50"
      )}>
        {/* Country selector */}
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 h-full px-2 border-r border-input bg-muted/40 text-sm focus:outline-none"
          >
            <span>{selected.flag}</span>
            <span className="text-muted-foreground text-xs">{selected.dial}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
          {open && (
            <div className="absolute top-full left-0 z-50 mt-1 w-36 rounded-md border border-border bg-popover shadow-md">
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { setCountryCode(c.dial); setOpen(false); }}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-muted text-foreground",
                    c.dial === countryCode && "bg-accent"
                  )}
                >
                  <span>{c.flag}</span>
                  <span className="text-muted-foreground text-xs">{c.dial}</span>
                  <span>{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Phone number input */}
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 px-3 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>
    </FormField>
  );
}