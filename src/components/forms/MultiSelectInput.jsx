import React, { useId } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, X } from "lucide-react";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

export default function MultiSelectInput({
  id: idProp,
  label,
  description,
  error,
  required,
  value = [],
  onChange,
  options = [],
  placeholder = "Selecionar...",
  disabled,
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [open, setOpen] = React.useState(false);

  const toggleOption = (optValue) => {
    const newValue = value.includes(optValue)
      ? value.filter((v) => v !== optValue)
      : [...value, optValue];
    onChange?.(newValue);
  };

  const removeOption = (optValue, e) => {
    e.stopPropagation();
    onChange?.(value.filter((v) => v !== optValue));
  };

  const getLabel = (val) => {
    const opt = options.find((o) => (typeof o === "string" ? o : o.value) === val);
    return opt ? (typeof opt === "string" ? opt : opt.label) : val;
  };

  return (
    <FormField id={id} label={label} description={description} error={error} required={required} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full h-auto min-h-[40px] justify-between font-normal px-3 py-2",
              error && "border-destructive"
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length === 0 && <span className="text-muted-foreground">{placeholder}</span>}
              {value.map((v) => (
                <Badge key={v} variant="secondary" className="text-xs gap-1">
                  {getLabel(v)}
                  <X className="h-3 w-3 cursor-pointer" onClick={(e) => removeOption(v, e)} />
                </Badge>
              ))}
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {options.map((opt) => {
              const val = typeof opt === "string" ? opt : opt.value;
              const lab = typeof opt === "string" ? opt : opt.label;
              return (
                <label key={val} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer text-sm">
                  <Checkbox checked={value.includes(val)} onCheckedChange={() => toggleOption(val)} />
                  {lab}
                </label>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </FormField>
  );
}