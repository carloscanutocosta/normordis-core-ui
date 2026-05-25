import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * @param {{ id?: string, label?: string, description?: string, error?: string, required?: boolean, className?: string, children?: React.ReactNode }} props
 */
export default function FormField({ id, label, description, error, required, className, children }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-destructive font-medium mt-1">{error}</p>
      )}
    </div>
  );
}
