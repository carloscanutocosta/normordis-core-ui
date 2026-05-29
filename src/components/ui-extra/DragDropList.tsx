import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const SAMPLE = [
  { id: '1', text: 'Completar levantamento de requisitos' },
  { id: '2', text: 'Rever mockups com o cliente' },
  { id: '3', text: 'Implementar autenticação' },
  { id: '4', text: 'Escrever testes de integração' },
  { id: '5', text: 'Preparar apresentação final' },
];

interface DragDropItem {
  id: string;
  text: string;
}

interface DragDropListProps {
  initialItems?: DragDropItem[];
  onReorder?: (items: DragDropItem[]) => void;
  removable?: boolean;
  className?: string;
}

export default function DragDropList({
  initialItems = SAMPLE,
  onReorder,
  removable = true,
  className,
}: DragDropListProps) {
  const [items, setItems] = useState(initialItems);

  const onDragEnd = ({ source, destination }) => {
    if (!destination || source.index === destination.index) return;
    const next = Array.from(items);
    const [moved] = next.splice(source.index, 1);
    next.splice(destination.index, 0, moved);
    setItems(next);
    onReorder?.(next);
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn('space-y-1.5', className)}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(prov, snapshot) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground select-none',
                      snapshot.isDragging && 'shadow-lg ring-2 ring-primary/30 rotate-1',
                    )}
                  >
                    <span
                      {...prov.dragHandleProps}
                      className="text-muted-foreground cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <span className="flex-1">{item.text}</span>
                    <span className="text-xs text-muted-foreground/50 tabular-nums w-5 text-right">
                      {index + 1}
                    </span>
                    {removable && (
                      <button
                        onClick={() => remove(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
