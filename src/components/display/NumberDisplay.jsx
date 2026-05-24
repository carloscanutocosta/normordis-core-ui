import React from "react";
import { cn } from "@/lib/utils";

export default function NumberDisplay({
  value,
  prefix,
  suffix,
  decimals = 2,
  locale = "pt-BR",
  variant = "default",
  className,
}) {
  if (value === null || value === undefined) {
    return <span className="text-sm text-muted-foreground italic">—</span>;
  }

  const formatted = Number(value).toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  const variantStyles = {
    default: "text-sm text-foreground",
    large: "text-3xl font-bold text-foreground tracking-tight",
    currency: "text-lg font-semibold text-foreground",
    compact: "text-xs font-medium text-muted-foreground",
    positive: "text-sm font-medium text-green-600",
    negative: "text-sm font-medium text-destructive",
  };

  return (
    <span className={cn(variantStyles[variant], className)}>
      {prefix}{formatted}{suffix}
    </span>
  );
}