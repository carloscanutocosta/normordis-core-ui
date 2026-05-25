import { useCallback, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plus, Trash2, X } from "lucide-react";
import { $applyNodeReplacement, $getNodeByKey, DecoratorNode } from "lexical";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function createEmptyRows(rowCount, columnCount) {
  return Array.from({ length: rowCount }, () =>
    Array.from({ length: columnCount }, () => "")
  );
}

function autoResizeTextarea(el) {
  if (!el) return;
  // Reset to 0 antes de ler scrollHeight para que o atributo rows não imponha
  // um mínimo superior à altura real do conteúdo.
  el.style.height = "0px";
  el.style.height = `${el.scrollHeight}px`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ColActions({ colIndex, totalColumns, onAdd, onRemove }) {
  return (
    <div className="absolute right-0 top-0 z-10 hidden items-center gap-px rounded-bl bg-muted/90 px-0.5 py-0.5 group-hover/cell:flex">
      <button
        type="button"
        aria-label={`Adicionar coluna à direita da coluna ${colIndex + 1}`}
        onMouseDown={(e) => { e.preventDefault(); onAdd(colIndex); }}
        className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Plus className="h-3 w-3" aria-hidden="true" />
      </button>
      {totalColumns > 1 && (
        <button
          type="button"
          aria-label={`Apagar coluna ${colIndex + 1}`}
          onMouseDown={(e) => { e.preventDefault(); onRemove(colIndex); }}
          className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function RowActions({ rowIndex, totalRows, onAdd, onRemove }) {
  return (
    <td className="w-9 border-none p-0 align-top" aria-hidden="true">
      <div className="flex flex-col items-center gap-px p-0.5 opacity-0 transition-opacity group-hover/row:opacity-100">
        <button
          type="button"
          tabIndex={-1}
          aria-label={`Adicionar linha abaixo da linha ${rowIndex + 1}`}
          onMouseDown={(e) => { e.preventDefault(); onAdd(rowIndex); }}
          className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Plus className="h-3 w-3" aria-hidden="true" />
        </button>
        {totalRows > 1 && (
          <button
            type="button"
            tabIndex={-1}
            aria-label={`Apagar linha ${rowIndex + 1}`}
            onMouseDown={(e) => { e.preventDefault(); onRemove(rowIndex); }}
            className="inline-flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        )}
      </div>
    </td>
  );
}

// ---------------------------------------------------------------------------
// Main table component
// ---------------------------------------------------------------------------

function SimpleTableComponent({ columns, includeHeader, nodeKey, rows }) {
  const [editor] = useLexicalComposerContext();
  const cellRefs = useRef({});

  const updateNode = useCallback(
    (updater) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isSimpleTableNode(node)) updater(node);
      });
    },
    [editor, nodeKey]
  );

  const updateCell = useCallback(
    (ri, ci, value) => updateNode((node) => node.setCellValue(ri, ci, value)),
    [updateNode]
  );

  const addRowAfter = useCallback(
    (ri) => updateNode((node) => node.addRow(ri)),
    [updateNode]
  );

  const removeRow = useCallback(
    (ri) => updateNode((node) => node.removeRow(ri)),
    [updateNode]
  );

  const addColumnAfter = useCallback(
    (ci) => updateNode((node) => node.addColumn(ci)),
    [updateNode]
  );

  const removeColumn = useCallback(
    (ci) => updateNode((node) => node.removeColumn(ci)),
    [updateNode]
  );

  const deleteTable = useCallback(
    () => updateNode((node) => node.remove()),
    [updateNode]
  );

  // Tab / Shift+Tab navigation between cells
  const handleCellKeyDown = useCallback(
    (e, ri, ci) => {
      if (e.key !== "Tab") return;
      e.preventDefault();

      let nextRi = ri;
      let nextCi = ci + (e.shiftKey ? -1 : 1);

      if (nextCi >= columns) { nextCi = 0; nextRi = ri + 1; }
      else if (nextCi < 0) { nextCi = columns - 1; nextRi = ri - 1; }

      const target = cellRefs.current[`${nextRi}-${nextCi}`];
      if (target) {
        target.focus();
        target.setSelectionRange(target.value.length, target.value.length);
      }
    },
    [columns]
  );

  // Auto-resize on mount and on change
  const setCellRef = useCallback(
    (el, ri, ci) => {
      cellRefs.current[`${ri}-${ci}`] = el;
      autoResizeTextarea(el);
    },
    []
  );

  return (
    <figure className="my-3 overflow-hidden rounded-md border border-border bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-2 py-1">
        <span className="text-xs font-medium text-muted-foreground">Tabela</span>
        <button
          type="button"
          aria-label="Apagar tabela"
          onMouseDown={(e) => { e.preventDefault(); deleteTable(); }}
          className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {rows.map((row, ri) => {
              const isHeaderRow = includeHeader && ri === 0;
              const isFirstRow = ri === 0;

              return (
                <tr key={ri} className="group/row">
                  {Array.from({ length: columns }).map((_, ci) => {
                    const Cell = isHeaderRow ? "th" : "td";
                    return (
                      <Cell
                        key={ci}
                        className={cn(
                          "relative border border-border p-0 align-top group/cell",
                          isHeaderRow && "bg-muted"
                        )}
                      >
                        {/* Column controls — shown on first row hover regardless of header */}
                        {isFirstRow && (
                          <ColActions
                            colIndex={ci}
                            totalColumns={columns}
                            onAdd={addColumnAfter}
                            onRemove={removeColumn}
                          />
                        )}
                        <textarea
                          ref={(el) => setCellRef(el, ri, ci)}
                          aria-label={`Linha ${ri + 1}, coluna ${ci + 1}`}
                          value={row[ci] ?? ""}
                          rows={1}
                          onChange={(e) => {
                            updateCell(ri, ci, e.target.value);
                            autoResizeTextarea(e.target);
                          }}
                          onKeyDown={(e) => handleCellKeyDown(e, ri, ci)}
                          className={cn(
                            "w-full resize-none overflow-hidden bg-transparent px-2 py-0.5 text-sm leading-normal text-foreground outline-none",
                            "focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring",
                            isHeaderRow && "font-semibold"
                          )}
                        />
                      </Cell>
                    );
                  })}

                  {/* Row controls */}
                  <RowActions
                    rowIndex={ri}
                    totalRows={rows.length}
                    onAdd={addRowAfter}
                    onRemove={removeRow}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add row */}
      <div className="border-t border-border">
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); addRowAfter(rows.length - 1); }}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Adicionar linha
        </button>
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Lexical Node
// ---------------------------------------------------------------------------

export class SimpleTableNode extends DecoratorNode {
  __columns;
  __includeHeader;
  __rows;

  static getType() {
    return "simple-table";
  }

  static clone(node) {
    return new SimpleTableNode(
      node.__rows,
      node.__columns,
      node.__includeHeader,
      node.__key
    );
  }

  static importJSON(serializedNode) {
    return $createSimpleTableNode({
      columns: serializedNode.columns,
      includeHeader: serializedNode.includeHeader,
      rows: serializedNode.rows,
    });
  }

  constructor(rows, columns, includeHeader = true, key) {
    super(key);
    this.__rows = Array.isArray(rows) ? rows : createEmptyRows(3, 3);
    this.__columns = Number(columns) || this.__rows[0]?.length || 3;
    this.__includeHeader = Boolean(includeHeader);
  }

  createDOM() {
    const element = document.createElement("div");
    element.className = "normordis-editor-simple-table";
    return element;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return (
      <SimpleTableComponent
        columns={this.__columns}
        includeHeader={this.__includeHeader}
        nodeKey={this.getKey()}
        rows={this.__rows}
      />
    );
  }

  exportJSON() {
    return {
      columns: this.__columns,
      includeHeader: this.__includeHeader,
      rows: this.__rows,
      type: "simple-table",
      version: 1,
    };
  }

  isInline() {
    return false;
  }

  // ---------------------------------------------------------------------------
  // Mutations — all return `this` for chaining
  // ---------------------------------------------------------------------------

  setCellValue(rowIndex, columnIndex, value) {
    const writable = this.getWritable();
    const rows = writable.__rows.map((row) => [...row]);
    rows[rowIndex][columnIndex] = value;
    writable.__rows = rows;
  }

  addRow(afterIndex) {
    const writable = this.getWritable();
    const newRow = Array.from({ length: writable.__columns }, () => "");
    const rows = [...writable.__rows];
    const insertAt =
      typeof afterIndex === "number" ? afterIndex + 1 : rows.length;
    rows.splice(insertAt, 0, newRow);
    writable.__rows = rows;
  }

  removeRow(rowIndex) {
    const writable = this.getWritable();
    if (writable.__rows.length <= 1) return;
    writable.__rows = writable.__rows.filter((_, i) => i !== rowIndex);
  }

  addColumn(afterIndex) {
    const writable = this.getWritable();
    const insertAt =
      typeof afterIndex === "number" ? afterIndex + 1 : writable.__columns;
    writable.__rows = writable.__rows.map((row) => {
      const newRow = [...row];
      newRow.splice(insertAt, 0, "");
      return newRow;
    });
    writable.__columns = writable.__columns + 1;
  }

  removeColumn(colIndex) {
    const writable = this.getWritable();
    if (writable.__columns <= 1) return;
    writable.__rows = writable.__rows.map((row) =>
      row.filter((_, i) => i !== colIndex)
    );
    writable.__columns = writable.__columns - 1;
  }
}

// ---------------------------------------------------------------------------
// Factory helpers
// ---------------------------------------------------------------------------

export function $createSimpleTableNode({
  columns = 3,
  includeHeader = true,
  rows = 3,
}) {
  const columnCount = Math.min(Math.max(Number(columns) || 3, 1), 12);
  const rowData = Array.isArray(rows)
    ? rows
    : createEmptyRows(
        Math.min(Math.max(Number(rows) || 3, 1), 20),
        columnCount
      );

  return $applyNodeReplacement(
    new SimpleTableNode(rowData, columnCount, includeHeader)
  );
}

export function $isSimpleTableNode(node) {
  return node instanceof SimpleTableNode;
}
