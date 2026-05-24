import React from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * FilterPanel — painel lateral deslizante de filtros avançados.
 *
 * filterDefs: Array<{
 *   key: string,
 *   label: string,
 *   type: "text" | "select" | "date" | "date-range",
 *   options?: string[]   // para type="select"
 * }>
 *
 * values: Record<string, any>
 * onChange: (key, value) => void
 * onReset: () => void
 * open / onClose
 */
export default function FilterPanel({ filterDefs = [], values = {}, onChange, onReset, open, onClose }) {
  const activeCount = filterDefs.filter(({ key }) => {
    const v = values[key];
    if (!v) return false;
    if (typeof v === "object") return v.from || v.to;
    return v !== "";
  }).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[1px]"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-72 bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Filtros</span>
            {activeCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {filterDefs.map(({ key, label, type = "text", options = [] }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </label>

              {type === "text" && (
                <Input
                  className="h-9 text-sm"
                  placeholder={`Filtrar por ${label.toLowerCase()}…`}
                  value={values[key] ?? ""}
                  onChange={(e) => onChange(key, e.target.value)}
                />
              )}

              {type === "select" && (
                <select
                  value={values[key] ?? ""}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">Todos</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {type === "date" && (
                <Input
                  type="date"
                  className="h-9 text-sm"
                  value={values[key] ?? ""}
                  onChange={(e) => onChange(key, e.target.value)}
                />
              )}

              {type === "date-range" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-6">De</span>
                    <Input
                      type="date"
                      className="h-9 text-sm flex-1"
                      value={values[key]?.from ?? ""}
                      onChange={(e) => onChange(key, { ...values[key], from: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-6">Até</span>
                    <Input
                      type="date"
                      className="h-9 text-sm flex-1"
                      value={values[key]?.to ?? ""}
                      onChange={(e) => onChange(key, { ...values[key], to: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onReset}
            disabled={activeCount === 0}
          >
            Limpar filtros
          </Button>
        </div>
      </div>
    </>
  );
}