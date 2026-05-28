import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  SlidersHorizontal,
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
import ExportButton from './ExportButton.jsx';
import FilterPanel from './FilterPanel';

const PAGE_SIZES = [5, 10, 20];

// InlineSelect: dropdown inline para edição rápida de células com opções
function InlineSelect({ value, options, onCommit, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return (
    <select
      ref={ref}
      defaultValue={value}
      onBlur={(e) => onCommit(e.target.value)}
      onChange={(e) => onCommit(e.target.value)}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      className="w-full rounded border border-primary bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

export default function DataTable({
  rows = [],
  columns = [],
  pageSize: defaultPageSize = 5,
  onRowAction,
  onCellEdit, // (rowId, key, newValue) => void  — opcional
  filename = 'tabela',
  filterDefs = [], // Array<{ key, label, type, options? }>
  className,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [panelOpen, setPanelOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [editingCell, setEditingCell] = useState(null); // { rowId, key }

  const handleFilterChange = (key, value) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const handleFilterReset = () => {
    setFilterValues({});
    setPage(1);
  };

  const activeFilterCount = filterDefs.filter(({ key }) => {
    const v = filterValues[key];
    if (!v) return false;
    if (typeof v === 'object') return v.from || v.to;
    return v !== '';
  }).length;

  const filtered = useMemo(() => {
    let result = rows.filter((row) => {
      // Global search
      const matchesSearch = columns.some((col) =>
        String(row[col.key] ?? '')
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
      if (!matchesSearch) return false;

      // Panel filters
      for (const { key, type } of filterDefs) {
        const val = filterValues[key];
        if (!val) continue;
        if (type === 'date-range') {
          const rowDate = row[key] ? new Date(row[key]) : null;
          if (val.from && rowDate && rowDate < new Date(val.from)) return false;
          if (val.to && rowDate && rowDate > new Date(val.to)) return false;
        } else {
          if (
            !String(row[key] ?? '')
              .toLowerCase()
              .includes(String(val).toLowerCase())
          )
            return false;
        }
      }
      return true;
    });

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
      });
    }
    return result;
  }, [rows, search, sortKey, sortDir, columns, filterDefs, filterValues]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key) => {
    setPage(1);
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
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

  return (
    <div className={cn('space-y-3', className)}>
      {/* Filter panel */}
      {filterDefs.length > 0 && (
        <FilterPanel
          filterDefs={filterDefs}
          values={filterValues}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      )}

      {/* Search + page size + export + filter toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 h-9"
            placeholder="Pesquisar..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <select
          value={pageSize}
          aria-label="Resultados por página"
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s} / pág.
            </option>
          ))}
        </select>
        {filterDefs.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'h-9 gap-1.5 relative',
              activeFilterCount > 0 && 'border-primary text-primary',
            )}
            onClick={() => setPanelOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}
        <ExportButton rows={filtered} allRows={rows} columns={columns} filename={filename} />
      </div>

      {/* Table */}
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none"
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label} <SortIcon col={col} />
                  </span>
                </th>
              ))}
              {onRowAction && <th className="px-2 py-2.5 w-10" />}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onRowAction ? 1 : 0)}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Sem resultados.
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                >
                  {columns.map((col) => {
                    const isEditing =
                      editingCell?.rowId === (row.id ?? i) && editingCell?.key === col.key;
                    const isInlineEditable = onCellEdit && col.inlineOptions;
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          'px-4 py-2.5 text-foreground',
                          isInlineEditable && 'cursor-pointer',
                        )}
                        title={isInlineEditable ? 'Clique para editar' : undefined}
                        onClick={() =>
                          isInlineEditable &&
                          !isEditing &&
                          setEditingCell({ rowId: row.id ?? i, key: col.key })
                        }
                      >
                        {isEditing ? (
                          <InlineSelect
                            value={row[col.key]}
                            options={col.inlineOptions}
                            onCommit={(val) => {
                              setEditingCell(null);
                              if (val !== row[col.key]) onCellEdit(row.id ?? i, col.key, val);
                            }}
                            onCancel={() => setEditingCell(null)}
                          />
                        ) : col.render ? (
                          col.render(row[col.key], row)
                        ) : (
                          (row[col.key] ?? '—')
                        )}
                      </td>
                    );
                  })}
                  {onRowAction && (
                    <td className="px-2 py-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onRowAction('view', row)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onRowAction('edit', row)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onRowAction('delete', row)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {filtered.length} resultado(s) · página {currentPage} de {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            className="h-7 w-7"
            disabled={currentPage === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-1">
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === currentPage ? 'default' : 'outline'}
                  size="icon"
                  className="h-7 w-7 text-xs"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ),
            )}
          <Button
            variant="outline"
            size="icon"
            aria-label="Página seguinte"
            className="h-7 w-7"
            disabled={currentPage === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
