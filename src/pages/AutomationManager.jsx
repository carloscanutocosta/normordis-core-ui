import React, { useState } from "react";
import { Plus, Zap, Settings, FlaskConical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import AutomationRuleCard from "../components/automation/AutomationRuleCard";
import AutomationRuleForm from "../components/automation/AutomationRuleForm";
import TaskDemoPanel from "../components/automation/TaskDemoPanel";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "rules",  label: "Regras",         icon: Settings },
  { id: "demo",   label: "Testar",          icon: FlaskConical },
];

export default function AutomationManager() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("rules");
  const [formOpen, setFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["automation-rules"],
    queryFn: () => base44.entities.AutomationRule.list("-created_date"),
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editingRule
        ? base44.entities.AutomationRule.update(editingRule.id, data)
        : base44.entities.AutomationRule.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automation-rules"] });
      setFormOpen(false);
      setEditingRule(null);
      toast({ title: editingRule ? "Regra actualizada" : "Regra criada com sucesso" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (rule) => base44.entities.AutomationRule.update(rule.id, { is_active: !rule.is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["automation-rules"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AutomationRule.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["automation-rules"] });
      setDeletingId(null);
      toast({ title: "Regra eliminada" });
    },
  });

  const activeCount = rules.filter((r) => r.is_active).length;
  const totalSent   = rules.reduce((s, r) => s + (Number(r.trigger_count) || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <Zap className="h-5 w-5 text-amber-500" />
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">Automações de Email</h1>
              <p className="text-xs text-muted-foreground">{activeCount} regras activas · {totalSent} emails enviados</p>
            </div>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => { setEditingRule(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Nova regra
          </Button>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-1 pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-all",
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

        {/* ── RULES TAB ──────────────────────────────────────────────── */}
        {activeTab === "rules" && (
          <>
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : rules.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto">
                  <Zap className="h-7 w-7 text-amber-500" />
                </div>
                <p className="font-semibold text-foreground">Sem regras de automação</p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Crie regras para enviar emails automáticos quando registos são criados ou tarefas concluídas.
                </p>
                <Button size="sm" className="gap-1.5 mt-2" onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4" /> Criar primeira regra
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rules.map((rule) => (
                  <AutomationRuleCard
                    key={rule.id}
                    rule={rule}
                    onEdit={(r) => { setEditingRule(r); setFormOpen(true); }}
                    onDelete={(r) => {
                      if (deletingId === r.id) {
                        deleteMutation.mutate(r.id);
                      } else {
                        setDeletingId(r.id);
                        setTimeout(() => setDeletingId(null), 3000);
                      }
                    }}
                    onToggle={(r) => toggleMutation.mutate(r)}
                  />
                ))}
              </div>
            )}

            {/* Info banner */}
            {rules.length > 0 && (
              <div className="mt-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex gap-3 items-start">
                <Zap className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <div className="text-xs text-amber-800 space-y-0.5">
                  <p className="font-semibold">Como funciona</p>
                  <p>As regras são executadas no browser sempre que um registo é criado ou o estado de uma tarefa muda para "Concluído". Use o separador <strong>Testar</strong> para simular eventos e verificar os envios em tempo real.</p>
                  <p className="text-amber-600 mt-1">⚠ O SendEmail só envia para utilizadores registados na app.</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── DEMO TAB ──────────────────────────────────────────────── */}
        {activeTab === "demo" && (
          <div className="space-y-5">
            <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 flex gap-3 items-start">
              <FlaskConical className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-0.5">Painel de testes</p>
                <p>Crie tarefas ou altere o estado para "Concluído" para disparar as automações em tempo real. Certifique-se de que tem regras activas no separador <strong>Regras</strong>.</p>
              </div>
            </div>
            <TaskDemoPanel />
          </div>
        )}
      </div>

      {/* Rule form modal */}
      {formOpen && (
        <AutomationRuleForm
          rule={editingRule}
          onSave={(data) => saveMutation.mutate(data)}
          onClose={() => { setFormOpen(false); setEditingRule(null); }}
        />
      )}
    </div>
  );
}