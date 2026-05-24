import React from "react";
import { cn } from "@/lib/utils";

const HOURS = ["00h","02h","04h","06h","08h","10h","12h","14h","16h","18h","20h","22h"];
const DAYS  = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

function randomGrid() {
  return DAYS.map(() => HOURS.map(() => Math.floor(Math.random() * 100)));
}

const GRID = randomGrid();

function intensity(v) {
  if (v < 10) return "bg-primary/5";
  if (v < 25) return "bg-primary/15";
  if (v < 50) return "bg-primary/35";
  if (v < 75) return "bg-primary/60";
  return "bg-primary/90 text-primary-foreground";
}

export default function Heatmap({ data = GRID, days = DAYS, hours = HOURS, className }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Hour headers */}
          <div className="flex mb-1 ml-10">
            {hours.map((h) => <div key={h} className="flex-1 text-[10px] text-muted-foreground text-center">{h}</div>)}
          </div>
          {/* Rows */}
          {days.map((day, di) => (
            <div key={day} className="flex items-center gap-0.5 mb-0.5">
              <div className="w-10 text-[10px] font-medium text-muted-foreground shrink-0">{day}</div>
              {hours.map((_, hi) => {
                const val = data[di]?.[hi] ?? 0;
                return (
                  <div
                    key={hi}
                    title={`${day} ${hours[hi]}: ${val}`}
                    className={cn("flex-1 h-7 rounded-sm transition-all hover:scale-110 cursor-default", intensity(val))}
                  />
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-1 mt-3 justify-end">
            <span className="text-[10px] text-muted-foreground mr-1">Menos</span>
            {["bg-primary/5","bg-primary/15","bg-primary/35","bg-primary/60","bg-primary/90"].map((c, i) => (
              <div key={i} className={cn("h-4 w-4 rounded-sm", c)} />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">Mais</span>
          </div>
        </div>
      </div>
    </div>
  );
}