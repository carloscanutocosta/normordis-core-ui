import { cn } from "@/lib/utils";
import FieldWrapper from "./FieldWrapper";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function DisplayField({
  label,
  hint,
  value,
  mono = false,
  copyable = false,
  badge,
  badgeVariant = "default",
  emptyText = "—",
  className,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeColors = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    muted: "bg-muted text-muted-foreground",
  };

  return (
    <FieldWrapper label={label} hint={hint} className={className}>
      <div className={cn(
        "flex items-center justify-between rounded-lg bg-muted/50 border border-border px-3 py-2 min-h-[42px]"
      )}>
        <span className={cn(
          "text-sm text-foreground flex-1",
          mono && "font-mono text-xs",
          !value && "text-muted-foreground"
        )}>
          {value !== undefined && value !== null && value !== "" ? String(value) : emptyText}
        </span>
        <div className="flex items-center gap-2 ml-2">
          {badge && (
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", badgeColors[badgeVariant])}>
              {badge}
            </span>
          )}
          {copyable && value && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </FieldWrapper>
  );
}