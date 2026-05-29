import React, { ReactNode, useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ListViewColumn {
  key: string;
  label: string;
  render?: (v: unknown, row: Record<string, unknown>) => ReactNode;
}

interface ListViewProps {
  items?: Record<string, unknown>[];
  columns?: ListViewColumn[];
  selectable?: boolean;
  onSelectionChange?: (ids: (string | number)[]) => void;
  onRowAction?: (action: 'view' | 'edit' | 'delete', row: Record<string, unknown>) => void;
  filename?: string;
  className?: string;
}

export default function ListView({
  items = [],
  columns = [],
  selectable = false,
  onSelectionChange,
  onRowAction,
  filename = 'lista',
  className,
}: ListViewProps) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [selected, setSelected] = useState(new Set());

  const filtered = useMemo(() => {
    let result = items.filter((item) =>
      columns.some((col) =>
        String(item[col.key] ?? '')
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    );
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
      });
    }
    return result;
  }, [items, search, sortKey, sortDir, columns]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    onSelectionChange?.(Array.from(next) as (string | number)[]);
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col.key)
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-primary" />
    );
  };

  const gridCols = `${selectable ? '2rem ' : ''}${columns.map(() => '1fr').join(' ')}${onRowAction ? ' 2.5rem' : ''}`;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 h-9"
            placeholder="Filtrar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border border-border overflow-hidden">
        {/* Header */}
        <div
          className="grid bg-muted/50 border-b border-border"
          style={{ gridTemplateColumns: gridCols }}
        >
          {selectable && <div className="px-3 py-2" />}
          {columns.map((col) => (
            <button
              key={col.key}
              type="button"
              onClick={() => toggleSort(col.key)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground text-left"
            >
              {col.label} <SortIcon col={col} />
            </button>
          ))}
          {onRowAction && <div className="px-2 py-2" />}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">Sem resultados.</div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id as React.Key}
              onClick={() => selectable && toggleSelect(item.id)}
              className={cn(
                'grid border-b border-border last:border-0 transition-colors items-center',
                selectable && 'cursor-pointer',
                selectable && selected.has(item.id) ? 'bg-primary/5' : 'hover:bg-muted/30',
              )}
              style={{ gridTemplateColumns: gridCols }}
            >
              {selectable && (
                <div className="flex items-center justify-center px-1">
                  <div
                    className={cn(
                      'h-4 w-4 rounded border border-input flex items-center justify-center transition-colors',
                      selected.has(item.id) && 'bg-primary border-primary',
                    )}
                  >
                    {selected.has(item.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                </div>
              )}
              {columns.map((col) => (
                <div key={col.key} className="px-3 py-2.5 text-sm text-foreground truncate">
                  {col.render
                    ? col.render(item[col.key], item)
                    : ((item[col.key] as React.ReactNode) ?? '—')}
                </div>
              ))}
              {onRowAction && (
                <div
                  className="px-1 flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onRowAction('view', item)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRowAction('edit', item)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onRowAction('delete', item)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {filtered.length} resultado(s)
        {selectable && selected.size > 0 && ` · ${selected.size} selecionado(s)`}
      </p>
    </div>
  );
}
