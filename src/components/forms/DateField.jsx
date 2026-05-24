import { useState, useEffect } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import FieldWrapper from "./FieldWrapper";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function DateField({
  label,
  hint,
  error,
  required,
  value,
  onChange,
  disabled,
  showTime = false,
  placeholder,
  clearable = true,
  className,
}) {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("00:00");

  const parsed = value ? (typeof value === "string" ? parseISO(value) : value) : null;
  const isValidDate = parsed && isValid(parsed);

  useEffect(() => {
    if (isValidDate && showTime) {
      setTime(format(parsed, "HH:mm"));
    }
  }, [value]);

  const handleSelect = (date) => {
    if (!date) return;
    if (showTime) {
      const [h, m] = time.split(":").map(Number);
      date.setHours(h, m, 0, 0);
    }
    onChange?.(date.toISOString());
    if (!showTime) setOpen(false);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    if (isValidDate) {
      const [h, m] = e.target.value.split(":").map(Number);
      const updated = new Date(parsed);
      updated.setHours(h, m, 0, 0);
      onChange?.(updated.toISOString());
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(null);
  };

  const displayValue = isValidDate
    ? showTime
      ? format(parsed, "dd/MM/yyyy HH:mm", { locale: ptBR })
      : format(parsed, "dd/MM/yyyy", { locale: ptBR })
    : "";

  return (
    <FieldWrapper label={label} hint={hint} error={error} required={required} className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full flex items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring",
              !isValidDate && "text-muted-foreground",
              error && "border-destructive focus:ring-destructive/30",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span className="flex items-center gap-2">
              {showTime ? <Clock className="w-4 h-4 text-muted-foreground" /> : <Calendar className="w-4 h-4 text-muted-foreground" />}
              {displayValue || placeholder || (showTime ? "Selecione data e hora" : "Selecione uma data")}
            </span>
            {clearable && isValidDate && (
              <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" onClick={handleClear} />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarPicker
            mode="single"
            selected={isValidDate ? parsed : undefined}
            onSelect={handleSelect}
            locale={ptBR}
            initialFocus
          />
          {showTime && (
            <div className="border-t p-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <input
                type="time"
                value={time}
                onChange={handleTimeChange}
                className="flex-1 text-sm bg-background border border-input rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}