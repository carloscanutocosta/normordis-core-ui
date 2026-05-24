import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Stepper({ steps = [], className }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Step indicators */}
      <div className="flex items-center">
        {steps.map((step, i) => {
          const done    = i < current;
          const active  = i === current;
          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all",
                    done   ? "bg-primary border-primary text-primary-foreground" :
                    active ? "bg-background border-primary text-primary" :
                             "bg-background border-border text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </button>
                <span className={cn("text-xs whitespace-nowrap hidden sm:block", active ? "text-primary font-medium" : "text-muted-foreground")}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn("flex-1 h-0.5 mx-2 mb-5", i < current ? "bg-primary" : "bg-border")} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      <div className="border border-border rounded-lg p-4 min-h-[80px]">
        <p className="text-sm font-medium text-foreground mb-1">{steps[current]?.label}</p>
        <p className="text-sm text-muted-foreground">{steps[current]?.description}</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setCurrent(c => c - 1)}>
          Anterior
        </Button>
        <Button size="sm" disabled={current === steps.length - 1} onClick={() => setCurrent(c => c + 1)}>
          {current === steps.length - 2 ? "Concluir" : "Seguinte"}
        </Button>
      </div>
    </div>
  );
}