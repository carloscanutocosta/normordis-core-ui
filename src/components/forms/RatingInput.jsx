import React, { useState } from "react";
import { Star } from "lucide-react";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

export default function RatingInput({
  label,
  description,
  error,
  required,
  value = 0,
  onChange,
  max = 5,
  disabled,
  className,
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <FormField label={label} description={description} error={error} required={required} className={className}>
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {Array.from({ length: max }, (_, i) => {
          const star = i + 1;
          const active = star <= (hovered || value);
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
              disabled={disabled}
              onClick={() => onChange(star === value ? 0 : star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className={cn(
                "p-0.5 rounded transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !disabled && "hover:scale-110",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <Star
                className={cn(
                  "h-7 w-7 transition-colors",
                  active ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-muted-foreground"
                )}
              />
            </button>
          );
        })}
        {value > 0 && (
          <span className="ml-2 self-center text-sm text-muted-foreground">
            {value}/{max}
          </span>
        )}
      </div>
    </FormField>
  );
}