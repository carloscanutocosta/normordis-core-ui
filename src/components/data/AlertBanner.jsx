import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react";

const VARIANTS = {
  info:    { icon: Info,          bg: "bg-blue-50 dark:bg-blue-950/40",    border: "border-blue-200 dark:border-blue-800",    text: "text-blue-800 dark:text-blue-200",    icon_cls: "text-blue-500" },
  success: { icon: CheckCircle2,  bg: "bg-green-50 dark:bg-green-950/40",  border: "border-green-200 dark:border-green-800",  text: "text-green-800 dark:text-green-200",  icon_cls: "text-green-500" },
  warning: { icon: AlertTriangle, bg: "bg-amber-50 dark:bg-amber-950/40",  border: "border-amber-200 dark:border-amber-800",  text: "text-amber-800 dark:text-amber-200",  icon_cls: "text-amber-500" },
  error:   { icon: XCircle,       bg: "bg-red-50 dark:bg-red-950/40",      border: "border-red-200 dark:border-red-800",      text: "text-red-800 dark:text-red-200",      icon_cls: "text-red-500" },
};

export default function AlertBanner({ variant = "info", title, description, dismissible = false, className }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const cfg = VARIANTS[variant] ?? VARIANTS.info;
  const Icon = cfg.icon;

  return (
    <div className={cn(
      "flex gap-3 rounded-lg border p-4",
      cfg.bg, cfg.border, className
    )}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", cfg.icon_cls)} />
      <div className="flex-1 min-w-0">
        {title && <p className={cn("text-sm font-medium", cfg.text)}>{title}</p>}
        {description && <p className={cn("text-sm mt-0.5", cfg.text, "opacity-80")}>{description}</p>}
      </div>
      {dismissible && (
        <button type="button" onClick={() => setDismissed(true)} className={cn("h-5 w-5 shrink-0 opacity-60 hover:opacity-100 transition-opacity", cfg.text)}>
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}