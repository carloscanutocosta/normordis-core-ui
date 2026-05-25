import React, { useId } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FormField from "./FormField";
import { cn } from "@/lib/utils";

export default function DateInput({
  id: idProp,
  label,
  description,
  error,
  required,
  value,
  onChange,
  placeholder = "Selecionar data",
  disabled,
  dateFormat = "dd/MM/yyyy",
  className,
}) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const [open, setOpen] = React.useState(false);
  const dateValue = value ? new Date(value) : undefined;

  return (
    <FormField id={id} label={label} description={description} error={error} required={required} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full h-10 justify-start text-left font-normal",
              !dateValue && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? format(dateValue, dateFormat) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={(date) => {
              onChange?.(date?.toISOString() || "");
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </FormField>
  );
}
