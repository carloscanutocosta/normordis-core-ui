import { useState } from "react";
import { cn } from "@/lib/utils";
import FieldWrapper from "./FieldWrapper";

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#64748b", "#1e293b", "#ffffff", "#000000",
];

export default function ColorField({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  disabled,
  showPresets = true,
  className,
}) {
  const [open, setOpen] = useState(false);

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg border border-input cursor-pointer transition-all hover:scale-105 shadow-sm",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{ background: value || "#ffffff" }}
            onClick={() => !disabled && setOpen(!open)}
          />
          <div className={cn(
            "flex-1 flex items-center rounded-lg border border-input bg-background px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-ring/40 focus-within:border-ring overflow-hidden",
            error && "border-destructive"
          )}>
            <span className="text-sm text-muted-foreground mr-2">#</span>
            <input
              type="text"
              value={(value || "#ffffff").replace("#", "")}
              onChange={(e) => {
                const v = "#" + e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
                onChange?.(v);
              }}
              disabled={disabled}
              className="flex-1 bg-transparent text-sm font-mono text-foreground focus:outline-none disabled:cursor-not-allowed uppercase"
              maxLength={6}
            />
            <input
              type="color"
              value={value || "#ffffff"}
              onChange={(e) => onChange?.(e.target.value)}
              disabled={disabled}
              className="w-0 h-0 opacity-0"
              id="native-color"
            />
          </div>
        </div>
        {showPresets && (
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => !disabled && onChange?.(color)}
                disabled={disabled}
                className={cn(
                  "w-6 h-6 rounded-md border-2 transition-all hover:scale-110",
                  value === color ? "border-primary shadow-sm scale-110" : "border-transparent"
                )}
                style={{ background: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}