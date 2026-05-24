import React from "react";
import { Zap, Mail, Edit2, Trash2, ToggleLeft, ToggleRight, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TRIGGER_LABELS = {
  record_created:   "Novo registo criado",
  status_completed: "Estado → Concluído",
};

export default function AutomationRuleCard({ rule, onEdit, onDelete, onToggle }) {
  const emails = String(rule.recipient_emails ?? "").split(",").map((e) => e.trim()).filter(Boolean);

  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 space-y-3 transition-all",
      rule.is_active ? "border-border" : "border-dashed border-border opacity-60"
    )}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", rule.is_active ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground")}>
            <Zap className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">{rule.name}</p>
            <Badge className={cn("text-[10px] mt-0.5", rule.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground")}>
              {rule.is_active ? "Activa" : "Inactiva"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onToggle(rule)}>
            {rule.is_active
              ? <ToggleRight className="h-4 w-4 text-primary" />
              : <ToggleLeft className="h-4 w-4 text-muted-foreground" />
            }
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(rule)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(rule)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Trigger + entity */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-0.5 font-medium">
          <Zap className="h-3 w-3" />{TRIGGER_LABELS[rule.trigger] ?? rule.trigger}
        </span>
        {rule.entity_name && (
          <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5">
            {rule.entity_name}
          </span>
        )}
      </div>

      {/* Subject preview */}
      <div className="bg-muted/40 rounded-lg px-3 py-2">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Assunto</p>
        <p className="text-xs text-foreground font-mono truncate">{rule.subject_template}</p>
      </div>

      {/* Recipients */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        {emails.slice(0, 3).map((e) => (
          <span key={e} className="text-[10px] bg-secondary text-secondary-foreground rounded-full px-2 py-0.5 truncate max-w-[140px]">{e}</span>
        ))}
        {emails.length > 3 && <span className="text-[10px] text-muted-foreground">+{emails.length - 3} mais</span>}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 pt-1 border-t border-border text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><Send className="h-3 w-3" /> {rule.trigger_count ?? 0} envios</span>
        {rule.last_triggered_at && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Último: {new Date(rule.last_triggered_at).toLocaleString("pt-PT", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}