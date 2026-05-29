import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DataGrid({ rows: initialRows = [], columns = [], className }) {
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState(null); // { rowId, colKey }
  const [draft, setDraft] = useState('');

  const startEdit = (row, col) => {
    if (col.editable === false) return;
    setEditing({ rowId: row.id, colKey: col.key });
    setDraft(String(row[col.key] ?? ''));
  };

  const commit = () => {
    if (!editing) return;
    setRows((rs) =>
      rs.map((r) => (r.id === editing.rowId ? { ...r, [editing.colKey]: draft } : r)),
    );
    setEditing(null);
  };

  const cancel = () => setEditing(null);

  const isEditing = (row, col) => editing?.rowId === row.id && editing?.colKey === col.key;

  return (
    <div className={cn('rounded-md border border-border overflow-hidden text-sm', className)}>
      <table className="w-full">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-3 py-2 text-left text-xs font-medium text-muted-foreground"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={row.id ?? ri}
              className="border-b border-border last:border-0 hover:bg-muted/10"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    'px-3 py-2 text-foreground',
                    col.editable !== false && 'cursor-pointer hover:bg-primary/5 group',
                  )}
                  onClick={() => startEdit(row, col)}
                >
                  {isEditing(row, col) ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commit();
                          if (e.key === 'Escape') cancel();
                        }}
                        className="w-full bg-transparent border-b border-primary outline-none text-sm text-foreground"
                      />
                      <button onClick={commit}>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                      </button>
                      <button onClick={cancel}>
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <span className="group-hover:text-primary transition-colors">
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
