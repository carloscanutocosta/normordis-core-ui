import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const sizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export default function Spinner({ size = "md", className, label }) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}