import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Default column color palette — keyed by column id.
// Consumers can override per-column via column.color: { header, dot }.
const DEFAULT_COLUMN_COLORS = {
  todo: { header: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  in_progress: { header: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  review: { header: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  done: { header: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
};

const FALLBACK_COLOR = { header: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };

// Default sample data — used when no initialData prop is provided.
const DEFAULT_DATA = {
  columns: {
    todo: { id: 'todo', title: 'A fazer', cardIds: ['c1', 'c2', 'c3'] },
    in_progress: { id: 'in_progress', title: 'Em progresso', cardIds: ['c4', 'c5'] },
    review: { id: 'review', title: 'Em revisão', cardIds: ['c6'] },
    done: { id: 'done', title: 'Concluído', cardIds: ['c7', 'c8'] },
  },
  columnOrder: ['todo', 'in_progress', 'review', 'done'],
  cards: {
    c1: { id: 'c1', title: 'Redesign da página inicial', tag: 'Design', priority: 'high' },
    c2: { id: 'c2', title: 'Corrigir bug de autenticação', tag: 'Bug', priority: 'high' },
    c3: { id: 'c3', title: 'Adicionar dark mode', tag: 'Feature', priority: 'low' },
    c4: { id: 'c4', title: 'API de relatórios', tag: 'Backend', priority: 'medium' },
    c5: { id: 'c5', title: 'Testes unitários', tag: 'QA', priority: 'medium' },
    c6: { id: 'c6', title: 'Code review PR #42', tag: 'Review', priority: 'low' },
    c7: { id: 'c7', title: 'Setup CI/CD', tag: 'DevOps', priority: 'high' },
    c8: { id: 'c8', title: 'Documentação da API', tag: 'Docs', priority: 'low' },
  },
};

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

const TAG_COLORS = {
  Design: 'bg-purple-100 text-purple-700',
  Bug: 'bg-red-100 text-red-700',
  Feature: 'bg-blue-100 text-blue-700',
  Backend: 'bg-indigo-100 text-indigo-700',
  QA: 'bg-teal-100 text-teal-700',
  Review: 'bg-amber-100 text-amber-700',
  DevOps: 'bg-orange-100 text-orange-700',
  Docs: 'bg-slate-100 text-slate-600',
};

function KanbanCard({ card, index }) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'bg-card border border-border rounded-lg p-3 shadow-sm space-y-2 cursor-grab active:cursor-grabbing select-none',
            snapshot.isDragging && 'shadow-lg rotate-1 ring-2 ring-primary/30',
          )}
        >
          <p className="text-sm font-medium text-foreground leading-snug">{card.title}</p>
          {(card.tag || card.priority) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {card.tag && (
                <span
                  className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded',
                    TAG_COLORS[card.tag] || 'bg-muted text-muted-foreground',
                  )}
                >
                  {card.tag}
                </span>
              )}
              {card.priority && (
                <span
                  className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded ml-auto',
                    PRIORITY_COLORS[card.priority] || 'bg-muted text-muted-foreground',
                  )}
                >
                  {card.priority}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}

/**
 * Kanban board with drag-and-drop support.
 *
 * Data shape (initialData / onStateChange):
 * {
 *   columnOrder: string[],
 *   columns: Record<string, { id, title, cardIds: string[], color?: { header, dot } }>,
 *   cards:   Record<string, { id, title, tag?, priority? }>,
 * }
 *
 * @param {{
 *   initialData?: object,
 *   onStateChange?: (state: object) => void,
 *   onAddCard?: (columnId: string) => void,
 *   columnColors?: Record<string, { header: string, dot: string }>,
 *   className?: string,
 * }} props
 */
export default function KanbanBoard({
  initialData = DEFAULT_DATA,
  onStateChange,
  onAddCard,
  columnColors = DEFAULT_COLUMN_COLORS,
  className,
}) {
  const [state, setState] = useState(initialData);

  const applyState = (next) => {
    setState(next);
    onStateChange?.(next);
  };

  const onDragEnd = ({ source, destination, draggableId }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const srcCol = state.columns[source.droppableId];
    const dstCol = state.columns[destination.droppableId];

    if (srcCol === dstCol) {
      const ids = Array.from(srcCol.cardIds);
      ids.splice(source.index, 1);
      ids.splice(destination.index, 0, draggableId);
      applyState({
        ...state,
        columns: { ...state.columns, [srcCol.id]: { ...srcCol, cardIds: ids } },
      });
    } else {
      const srcIds = Array.from(srcCol.cardIds);
      srcIds.splice(source.index, 1);
      const dstIds = Array.from(dstCol.cardIds);
      dstIds.splice(destination.index, 0, draggableId);
      applyState({
        ...state,
        columns: {
          ...state.columns,
          [srcCol.id]: { ...srcCol, cardIds: srcIds },
          [dstCol.id]: { ...dstCol, cardIds: dstIds },
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={cn('flex gap-4 overflow-x-auto pb-4', className)}>
        {state.columnOrder.map((colId) => {
          const col = state.columns[colId];
          if (!col) return null;
          const colors = col.color ?? columnColors[colId] ?? FALLBACK_COLOR;
          return (
            <div key={colId} className="flex-shrink-0 w-64 flex flex-col gap-2">
              <div
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm',
                  colors.header,
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', colors.dot)} />
                {col.title}
                <span className="ml-auto text-xs opacity-70">{col.cardIds.length}</span>
              </div>
              <Droppable droppableId={colId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'flex flex-col gap-2 min-h-[120px] rounded-lg p-2 transition-colors',
                      snapshot.isDraggingOver && 'bg-primary/5 ring-1 ring-primary/20',
                    )}
                  >
                    {col.cardIds.map((id, idx) => (
                      <KanbanCard key={id} card={state.cards[id]} index={idx} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground gap-1.5 justify-start"
                onClick={() => onAddCard?.(colId)}
              >
                <Plus className="h-3.5 w-3.5" /> Adicionar cartão
              </Button>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
