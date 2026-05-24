import React, { useState } from "react";
import { X, Save, Zap, Mail, Variable } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TRIGGERS = [
  { id: "record_created",   label: "Novo registo criado",            description: "Dispara quando um novo registo é adicionado" },
  { id: "status_completed", label: "Estado alterado para Concluído", description: "Dispara quando status muda para 'completed'" },
];

const VARIABLES = ["{{title}}", "{{status}}", "{{assigned_to}}", "{{priority}}", "{{due_date}}", "{{created_date}}", "{{id}}"];

const DEFAULT_SUBJECTS = {
  record_created:   "Novo registo criado: {{title}}",
  status_completed: "Tarefa concluída: {{title}}",
};

const DEFAULT_BODIES = {
  record_created: `Olá,\n\nFoi criado um novo registo:\n\n• Título: {{title}}\n• Prioridade: {{priority}}\n• Responsável: {{assigned_to}}\n• Data: {{created_date}}\n\nAceda à plataforma para mais detalhes.\n\nCumprimentos`,
  status_completed: `Olá,\n\nA seguinte tarefa foi marcada como Concluída:\n\n• Título: {{title}}\n• Responsável: {{assigned_to}}\n• Data de entrega: {{due_date}}\n\nObrigado pelo trabalho realizado.\n\nCumprimentos`,
};

export default function AutomationRuleForm({ rule, onSave, onClose }) {
  const [form, setForm] = useState({
    name: rule?.name ?? "",
    trigger: rule?.trigger ?? "record_created",
    entity_name: rule?.entity_name ?? "TaskRecord",
    recipient_emails: rule?.recipient_emails ?? "",
    subject_template: rule?.subject_template ?? DEFAULT_SUBJECTS["record_created"],
    body_template: rule?.body_template ?? DEFAULT_BODIES["record_created"],
    is_active: rule?.is_active ?? true,
  });

  const set = (key) => (e) => {
    const val = e?.target ? e.target.value : e;
    if (key === "trigger") {
      setForm((f) => ({
        ...f,
        trigger: val,
        subject_template: DEFAULT_SUBJECTS[val] ?? f.subject_template,
        body_template: DEFAULT_BODIES[val] ?? f.body_template,
      }));
    } else {
      setForm((f) => ({ ...f, [key]: val }));
    }
  };

  const insertVar = (v) => {
    setForm((f) => ({ ...f, body_template: f.body_template + v }));
  };

  const valid = form.name && form.recipient_emails && form.subject_template && form.body_template;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-semibold text-foreground">
              {rule ? "Editar regra" : "Nova regra de automação"}
            </h2>
          </div>
          <button onClick={onClose} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nome da regra</label>
            <Input value={form.name} onChange={set("name")} placeholder="Ex: Notificar equipa ao criar tarefa" />
          </div>

          {/* Trigger */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Gatilho</label>
            <div className="grid grid-cols-1 gap-2">
              {TRIGGERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => set("trigger")(t.id)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                    form.trigger === t.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className={cn("h-4 w-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                    form.trigger === t.id ? "border-primary" : "border-muted-foreground"
                  )}>
                    {form.trigger === t.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium", form.trigger === t.id ? "text-primary" : "text-foreground")}>{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipients */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Mail className="h-4 w-4" /> Destinatários
            </label>
            <Input
              value={form.recipient_emails}
              onChange={set("recipient_emails")}
              placeholder="email@exemplo.com, outro@exemplo.com"
            />
            <p className="text-xs text-muted-foreground">Separe múltiplos emails por vírgula. Apenas utilizadores registados na app.</p>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Assunto do email</label>
            <Input
              value={form.subject_template}
              onChange={set("subject_template")}
              placeholder="Ex: Nova tarefa criada: {{title}}"
            />
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Corpo da mensagem</label>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {VARIABLES.map((v) => (
                <button
                  key={v}
                  onClick={() => insertVar(v)}
                  className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors border border-border"
                >
                  <Variable className="h-2.5 w-2.5" />{v}
                </button>
              ))}
            </div>
            <textarea
              value={form.body_template}
              onChange={set("body_template")}
              rows={7}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none font-mono"
              placeholder="Corpo da mensagem..."
            />
            <p className="text-xs text-muted-foreground">Use os botões acima para inserir variáveis dinâmicas do registo.</p>
          </div>

          {/* Active toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
              className={cn("relative h-5 w-9 rounded-full transition-colors", form.is_active ? "bg-primary" : "bg-muted")}
            >
              <div className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform", form.is_active ? "translate-x-4" : "translate-x-0.5")} />
            </div>
            <span className="text-sm font-medium text-foreground">Regra activa</span>
          </label>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>Cancelar</Button>
          <Button size="sm" className="gap-1.5" disabled={!valid} onClick={() => onSave(form)}>
            <Save className="h-4 w-4" /> Guardar regra
          </Button>
        </div>
      </div>
    </div>
  );
}