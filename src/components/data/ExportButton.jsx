import React from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function toCSV(rows, columns) {
  const header = columns.map((c) => c.label).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const val = row[c.key] ?? '';
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(','),
    )
    .join('\n');
  return `${header}\n${body}`;
}

function toJSON(rows, columns) {
  return JSON.stringify(
    rows.map((row) => Object.fromEntries(columns.map((c) => [c.key, row[c.key] ?? '']))),
    null,
    2,
  );
}

function download(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportButton({
  rows = [],
  allRows = [],
  columns = [],
  filename = 'export',
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5">
          <Download className="h-4 w-4" /> Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => download(toCSV(rows, columns), `${filename}.csv`, 'text/csv')}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" /> CSV (filtrado)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => download(toCSV(allRows, columns), `${filename}-completo.csv`, 'text/csv')}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" /> CSV (completo)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => download(toJSON(rows, columns), `${filename}.json`, 'application/json')}
        >
          <FileText className="h-4 w-4 mr-2" /> JSON (filtrado)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
