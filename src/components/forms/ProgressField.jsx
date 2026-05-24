import { cn } from "@/lib/utils";
import FieldWrapper from "./FieldWrapper";

export default function ProgressField({
  label,
  hint,
  value = 0,
  max = 100,
  showPercent = true,
  variant = "default",
  size = "md",
  animated = false,
  className,
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    default: "bg-primary",
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-destructive",
    gradient: "bg-gradient-to-r from-primary to-purple-500",
  };

  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <FieldWrapper label={label} hint={hint} className={className}>
      <div className="flex items-center gap-3">
        <div className={cn("flex-1 bg-muted rounded-full overflow-hidden", heights[size])}>
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              variants[variant] ?? variants.default,
              animated && "animate-pulse"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        {showPercent && (
          <span className="text-sm font-medium text-foreground tabular-nums min-w-[3.5rem] text-right">
            {pct.toFixed(0)}%
          </span>
        )}
      </div>
    </FieldWrapper>
  );
}