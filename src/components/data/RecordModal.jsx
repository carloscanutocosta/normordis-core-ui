import React, { useState } from "react";
import { X, Edit2, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// ── Modal shell ────────────────────────────────────────────────────────────
function ModalShell({ title, subtitle, onClose, actions, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {actions && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// ── View mode: renders key-value pairs ────────────────────────────────────
function ViewFields({ record, fields }) {
  return (
    <dl className="space-y-4">
      {fields.map(({ key, label, render }) => (
        <div key={key} className="grid grid-cols-3 gap-2">
          <dt className="text-sm font-medium text-muted-foreground col-span-1">{label}</dt>
          <dd className="text-sm text-foreground col-span-2 break-words">
            {render ? render(record[key], record) : (record[key] ?? <span className="text-muted-foreground">—</span>)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

// ── Edit mode: renders controlled text inputs ──────────────────────────────
function EditFields({ draft, fields, onChange }) {
  return (
    <div className="space-y-4">
      {fields.map(({ key, label, editable = true, type = "text" }) => (
        <div key={key} className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {editable ? (
            <Input
              type={type}
              value={draft[key] ?? ""}
              onChange={(e) => onChange(key, e.target.value)}
              className="h-9"
            />
          ) : (
            <p className="text-sm text-muted-foreground px-3 py-2 rounded-md bg-muted/40">{draft[key] ?? "—"}</p>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main RecordModal ───────────────────────────────────────────────────────
/**
 * RecordModal
 *
 * Props:
 *  - record      : object   — the data row/item to show
 *  - fields      : Array<{ key, label, editable?, type?, render? }>
 *  - mode        : "view" | "edit"   (default "view")
 *  - title       : string
 *  - subtitle    : string (optional)
 *  - onClose     : () => void
 *  - onSave      : (updatedRecord) => void  (optional, enables save button)
 *  - onDelete    : (record) => void         (optional, enables delete button)
 */
export default function RecordModal({
  record,
  fields = [],
  mode: initialMode = "view",
  title = "Detalhes",
  subtitle,
  onClose,
  onSave,
  onDelete,
}) {
  const [mode, setMode] = useState(initialMode);
  const [draft, setDraft] = useState({ ...record });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();

  const handleChange = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const handleSave = () => {
    onSave?.(draft);
    toast({ title: "Guardado com sucesso", description: `"${title}" foi actualizado.` });
    onClose();
  };

  const handleDelete = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    onDelete?.(record);
    toast({ title: "Registo eliminado", description: `"${title}" foi removido.`, variant: "destructive" });
    onClose();
  };

  const actions = (
    <>
      {/* Delete */}
      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          className={cn("mr-auto gap-1.5", confirmDelete && "border-destructive text-destructive hover:bg-destructive/10")}
          onClick={handleDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {confirmDelete ? "Confirmar eliminação" : "Eliminar"}
        </Button>
      )}

      {mode === "view" && onSave && (
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setMode("edit")}>
          <Edit2 className="h-3.5 w-3.5" /> Editar
        </Button>
      )}

      {mode === "edit" && (
        <>
          <Button variant="outline" size="sm" onClick={() => { setMode("view"); setDraft({ ...record }); setConfirmDelete(false); }}>
            Cancelar
          </Button>
          <Button size="sm" className="gap-1.5" onClick={handleSave}>
            <Save className="h-3.5 w-3.5" /> Guardar
          </Button>
        </>
      )}

      {mode === "view" && !onSave && (
        <Button variant="outline" size="sm" onClick={onClose}>Fechar</Button>
      )}
    </>
  );

  return (
    <ModalShell
      title={mode === "edit" ? `Editar — ${title}` : title}
      subtitle={subtitle}
      onClose={onClose}
      actions={actions}
    >
      {mode === "view"
        ? <ViewFields record={record} fields={fields} />
        : <EditFields draft={draft} fields={fields} onChange={handleChange} />
      }
    </ModalShell>
  );
}