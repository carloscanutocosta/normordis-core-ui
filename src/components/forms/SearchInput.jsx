import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Pesquisar...",
  disabled,
  className,
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="h-10 pl-10 pr-10"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
          onClick={() => onChange?.("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}