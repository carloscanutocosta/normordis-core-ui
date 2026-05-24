import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

const SAMPLE_EVENTS = [
  { id:1, date:"2026-05-04", title:"Reunião de equipa",    color:"bg-blue-500" },
  { id:2, date:"2026-05-07", title:"Entrega do relatório", color:"bg-red-500" },
  { id:3, date:"2026-05-12", title:"Demo do produto",      color:"bg-green-500" },
  { id:4, date:"2026-05-15", title:"Formação interna",     color:"bg-purple-500" },
  { id:5, date:"2026-05-20", title:"Review trimestral",    color:"bg-amber-500" },
  { id:6, date:"2026-05-20", title:"Almoço de equipa",     color:"bg-teal-500" },
  { id:7, date:"2026-05-28", title:"Sprint planning",      color:"bg-indigo-500" },
];

export default function CalendarView({ events = SAMPLE_EVENTS, className }) {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState(null);

  const prev = () => setCurrent(({ year, month }) => month === 0 ? { year: year-1, month: 11 } : { year, month: month-1 });
  const next = () => setCurrent(({ year, month }) => month === 11 ? { year: year+1, month: 0 } : { year, month: month+1 });

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dateStr = (d) => `${current.year}-${String(current.month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const eventsForDay = (d) => events.filter((e) => e.date === dateStr(d));
  const isToday = (d) => d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{MONTHS[current.month]} {current.year}</h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}>Hoje</Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>)}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border border-border">
        {cells.map((day, i) => {
          const dayEvents = day ? eventsForDay(day) : [];
          const sel = day && selected === dateStr(day);
          return (
            <div
              key={i}
              onClick={() => day && setSelected(sel ? null : dateStr(day))}
              className={cn(
                "bg-card min-h-[72px] p-1 cursor-pointer hover:bg-muted/30 transition-colors",
                !day && "bg-muted/20 cursor-default",
                sel && "bg-primary/5 ring-1 ring-inset ring-primary/40"
              )}
            >
              {day && (
                <>
                  <div className={cn("text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1", isToday(day) ? "bg-primary text-primary-foreground" : "text-foreground")}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div key={ev.id} className={cn("text-[10px] text-white px-1 rounded truncate leading-4", ev.color)}>{ev.title}</div>
                    ))}
                    {dayEvents.length > 2 && <div className="text-[10px] text-muted-foreground">+{dayEvents.length-2} mais</div>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}