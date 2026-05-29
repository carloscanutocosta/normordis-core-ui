import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const SAMPLE_TASKS = [
  {
    id: 1,
    name: 'Levantamento de requisitos',
    start: 1,
    duration: 5,
    color: 'bg-blue-500',
    group: 'Fase 1',
  },
  {
    id: 2,
    name: 'Design de interfaces',
    start: 4,
    duration: 8,
    color: 'bg-purple-500',
    group: 'Fase 1',
  },
  {
    id: 3,
    name: 'Desenvolvimento backend',
    start: 6,
    duration: 12,
    color: 'bg-indigo-500',
    group: 'Fase 2',
  },
  {
    id: 4,
    name: 'Desenvolvimento frontend',
    start: 8,
    duration: 10,
    color: 'bg-teal-500',
    group: 'Fase 2',
  },
  {
    id: 5,
    name: 'Testes de qualidade',
    start: 16,
    duration: 6,
    color: 'bg-amber-500',
    group: 'Fase 3',
  },
  {
    id: 6,
    name: 'Deploy e go-live',
    start: 20,
    duration: 4,
    color: 'bg-green-500',
    group: 'Fase 3',
  },
];

const TOTAL_DAYS = 28;

export default function GanttChart({ tasks = SAMPLE_TASKS, className }) {
  const [hover, setHover] = useState(null);

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="min-w-[640px]">
        {/* Header */}
        <div className="flex border-b border-border mb-1">
          <div className="w-48 shrink-0 text-xs font-medium text-muted-foreground px-3 py-2">
            Tarefa
          </div>
          <div className="flex-1 flex">
            {Array.from({ length: TOTAL_DAYS }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 text-center text-[10px] text-muted-foreground py-2 border-l border-border/50',
                  (i + 1) % 7 === 0 && 'border-l-border',
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center hover:bg-muted/20 group"
            onMouseEnter={() => setHover(task.id)}
            onMouseLeave={() => setHover(null)}
          >
            <div className="w-48 shrink-0 px-3 py-2">
              <p className="text-xs font-medium text-foreground truncate">{task.name}</p>
              <p className="text-[10px] text-muted-foreground">{task.group}</p>
            </div>
            <div className="flex-1 relative h-9 flex items-center">
              {/* Grid lines */}
              {Array.from({ length: TOTAL_DAYS }, (_, i) => (
                <div
                  key={i}
                  className={cn(
                    'absolute top-0 bottom-0 border-l border-border/30',
                    (i + 1) % 7 === 0 && 'border-border/60',
                  )}
                  style={{ left: `${(i / TOTAL_DAYS) * 100}%` }}
                />
              ))}
              {/* Bar */}
              <div
                className={cn(
                  'absolute h-5 rounded-md flex items-center px-2 transition-all',
                  task.color,
                  hover === task.id && 'h-6 shadow-md',
                )}
                style={{
                  left: `${((task.start - 1) / TOTAL_DAYS) * 100}%`,
                  width: `${(task.duration / TOTAL_DAYS) * 100}%`,
                }}
                title={`${task.name}: dia ${task.start} – ${task.start + task.duration - 1}`}
              >
                <span className="text-[10px] text-white font-medium truncate">{task.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
