import React, { useState } from "react";
import { Plus, CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { notifyRecordCreated, notifyStatusCompleted } from "./AutomationService";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STATUS_LABELS = { pending:"Pendente", in_progress:"Em progresso", completed:"Concluído", cancelled:"Cancelado" };
const STATUS_COLORS = {
  pending:     "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed:   "bg-green-100 text-green-700",
  cancelled:   "bg-red-100 text-red-700",
};

export default function TaskDemoPanel() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [sending, setSending] = useState(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["task-records"],
    queryFn: () => base44.entities.TaskRecord.list("-created_date", 20),
  });

  // Create task + trigger automation
  const createMutation = useMutation({
    mutationFn: async (title) => {
      const record = await base44.entities.TaskRecord.create({ title, status: "pending", priority: "medium" });
      return record;
    },
    onSuccess: async (record) => {
      qc.invalidateQueries({ queryKey: ["task-records"] });
      setNewTitle("");
      setSending(record.id);
      const { sent, errors } = await notifyRecordCreated(record);
      setSending(null);
      if (sent > 0) {
        toast({ title: `✉️ ${sent} notificação(ões) enviada(s)`, description: `Registo criado: "${record.title}"` });
      } else if (errors.length) {
        toast({ title: "Registo criado", description: "Nenhuma regra activa ou erro no envio.", variant: "destructive" });
      } else {
        toast({ title: "Registo criado", description: "Sem regras de automação activas para este gatilho." });
      }
    },
  });

  // Update status + trigger automation if completed
  const updateMutation = useMutation({
    mutationFn: async ({ id, status, record }) => {
      const updated = await base44.entities.TaskRecord.update(id, { status });
      return { updated, previous: record };
    },
    onSuccess: async ({ updated, previous }) => {
      qc.invalidateQueries({ queryKey: ["task-records"] });
      if (updated.status === "completed" && previous.status !== "completed") {
        setSending(updated.id);
        const { sent } = await notifyStatusCompleted(updated);
        setSending(null);
        if (sent > 0) {
          toast({ title: `✉️ ${sent} notificação(ões) enviada(s)`, description: `Tarefa concluída: "${updated.title}"` });
        } else {
          toast({ title: "Estado actualizado", description: "Sem regras de automação activas para 'Concluído'." });
        }
      } else {
        toast({ title: "Estado actualizado" });
      }
    },
  });

  return (
    <div className="space-y-4">
      {/* Add task */}
      <div className="flex gap-2">
        <Input
          placeholder="Título da nova tarefa..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && newTitle.trim() && createMutation.mutate(newTitle.trim())}
          className="flex-1"
        />
        <Button
          size="sm"
          className="gap-1.5 shrink-0"
          disabled={!newTitle.trim() || createMutation.isPending}
          onClick={() => createMutation.mutate(newTitle.trim())}
        >
          {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Criar e notificar
        </Button>
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          Sem tarefas. Crie uma para testar as automações.
        </div>
      ) : (
        <div className="space-y-1.5">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium truncate", task.status === "completed" && "line-through text-muted-foreground")}>
                  {task.title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(task.created_date).toLocaleString("pt-PT", { day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit" })}
                </p>
              </div>

              {sending === task.id && (
                <span className="flex items-center gap-1 text-xs text-primary animate-pulse">
                  <Send className="h-3.5 w-3.5" /> A enviar…
                </span>
              )}

              <Badge className={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Badge>

              {/* Quick status buttons */}
              {task.status !== "completed" && task.status !== "cancelled" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1 shrink-0 text-green-700 border-green-200 hover:bg-green-50"
                  disabled={updateMutation.isPending || sending === task.id}
                  onClick={() => updateMutation.mutate({ id: task.id, status: "completed", record: task })}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Concluir
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}