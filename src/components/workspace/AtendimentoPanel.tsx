import { useState, useEffect } from 'react';
import {
  X,
  ClipboardList,
  Clock,
  Loader2,
  CheckCircle2,
  User,
  Tag,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Phone,
  Monitor,
  Mail,
  Users,
  Globe,
  Play,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useWorkspace } from './WorkspaceContext';
import type { IconComponent } from './WorkspaceContext';

export interface AtendimentoData {
  area: string;
  assunto: string;
  descricao: string;
  resposta: string;
  canal: string;
  prioridade: string;
  estado: string;
  utilizador_contacto: string;
  duracao_minutos: number | string;
  notas_internas: string;
  hora_inicio: string | null;
}

interface PrioridadeConfig {
  label: string;
  color: string;
}

export interface AtendimentoPanelProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: AtendimentoData) => Promise<void>;
  locale?: string;
  areas?: string[];
  canais?: Array<{ label: string; icon: IconComponent }>;
  prioridades?: PrioridadeConfig[];
  estados?: string[];
}

const DEFAULT_AREAS = [
  'Recursos Humanos',
  'Tecnologia',
  'Financeiro',
  'Jurídico',
  'Comercial',
  'Operações',
  'Suporte',
  'Outro',
];
const DEFAULT_CANAIS: Array<{ label: string; icon: IconComponent }> = [
  { label: 'Presencial', icon: Users },
  { label: 'Telefone', icon: Phone },
  { label: 'Email', icon: Mail },
  { label: 'Chat', icon: MessageSquare },
  { label: 'Portal', icon: Globe },
];
const DEFAULT_PRIORIDADES: PrioridadeConfig[] = [
  { label: 'Baixa', color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30' },
  { label: 'Normal', color: 'bg-blue-500/15 text-blue-600 border-blue-500/30' },
  { label: 'Alta', color: 'bg-amber-500/15 text-amber-600 border-amber-500/30' },
  { label: 'Urgente', color: 'bg-red-500/15 text-red-600 border-red-500/30' },
];
const DEFAULT_ESTADOS = ['Aberto', 'Em Progresso', 'Resolvido', 'Escalado', 'Fechado'];

const STEPS = [
  { id: 'hora', label: 'Hora', icon: Clock },
  { id: 'identificacao', label: 'Identificação', icon: User },
  { id: 'assunto', label: 'Assunto', icon: Tag },
  { id: 'resposta', label: 'Resposta', icon: MessageSquare },
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function AtendimentoPanel({
  open,
  onClose,
  onSave,
  locale = 'pt-PT',
  areas = DEFAULT_AREAS,
  canais = DEFAULT_CANAIS,
  prioridades = DEFAULT_PRIORIDADES,
  estados = DEFAULT_ESTADOS,
}: AtendimentoPanelProps) {
  const { atendimento, updateAtendimento, resetAtendimento } = useWorkspace();
  const { started, startTime, step, form } = atendimento;

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const now = useClock();
  const elapsed = startTime
    ? Math.round((now.getTime() - new Date(startTime).getTime()) / 60000)
    : 0;

  useEffect(() => {
    if (open && !form) {
      updateAtendimento({
        form: {
          area: '',
          assunto: '',
          descricao: '',
          resposta: '',
          canal: canais[0]?.label ?? '',
          prioridade: prioridades[1]?.label ?? prioridades[0]?.label ?? '',
          estado: estados[0] ?? '',
          utilizador_contacto: '',
          duracao_minutos: '',
          notas_internas: '',
        },
      });
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key: string, val: string) => updateAtendimento({ form: { ...form!, [key]: val } });
  const setStep = (val: number | ((prev: number) => number)) =>
    updateAtendimento({ step: typeof val === 'function' ? val(step) : val });

  const handleStart = () =>
    updateAtendimento({ started: true, startTime: new Date().toISOString() });

  const canNext = () => {
    if (step === 0 && !started) return false;
    if (step === 1 && !form?.utilizador_contacto) return false;
    if (step === 2 && (!form?.area || !form?.assunto)) return false;
    return true;
  };

  const handleSave = async () => {
    if (!form?.area || !form?.assunto) return;
    setSaving(true);
    try {
      await onSave?.({
        ...form,
        duracao_minutos: form.duracao_minutos ? Number(form.duracao_minutos) : elapsed,
        hora_inicio: startTime ?? null,
      } as AtendimentoData);
    } finally {
      setSaving(false);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
      resetAtendimento();
    }, 1800);
  };

  const isLast = step === STEPS.length - 1;
  const fmt = (d: string | Date, opts: Intl.DateTimeFormatOptions) =>
    new Date(d).toLocaleTimeString(locale, opts);
  const fmtDate = (d: string | Date, opts: Intl.DateTimeFormatOptions) =>
    new Date(d).toLocaleDateString(locale, opts);

  if (!form && open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="Registar Atendimento"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-card border border-border border-b-0 rounded-t-xl z-50 flex flex-col shadow-2xl"
            style={{ maxHeight: '90vh' }}
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="flex items-center justify-between px-5 h-14 border-b border-border shrink-0 bg-muted/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">Registar Atendimento</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                    {started && startTime
                      ? `Iniciado às ${fmt(startTime, { hour: '2-digit', minute: '2-digit' })}`
                      : 'Aguarda início'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted border border-border">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-mono tabular-nums">
                    {started ? `${elapsed} min` : '— min'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onClose}
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="px-5 pt-4 pb-3 shrink-0">
              <div className="flex items-center gap-1">
                {STEPS.map((s, i) => {
                  const done = i < step;
                  const active = i === step;
                  const Icon = s.icon;
                  return (
                    <span key={s.id} className="contents">
                      <button
                        onClick={() => i < step && setStep(i)}
                        aria-current={active ? 'step' : undefined}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all',
                          active
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : done
                              ? 'text-primary cursor-pointer hover:bg-primary/10'
                              : 'text-muted-foreground cursor-default',
                        )}
                      >
                        {done ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                        <span className="hidden sm:inline">{s.label}</span>
                      </button>
                      {i < STEPS.length - 1 && (
                        <div
                          className={cn('flex-1 h-px', i < step ? 'bg-primary/40' : 'bg-border')}
                        />
                      )}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto workspace-scroll px-5 pb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="space-y-4"
                >
                  {step === 0 && !started && (
                    <div className="flex flex-col items-center justify-center py-10 gap-6 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <ClipboardList className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <p className="text-base font-semibold">Pronto para iniciar?</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Clica em <strong>Iniciar</strong> para começar a contar o tempo do
                          atendimento.
                        </p>
                      </div>
                      <div className="text-3xl font-mono font-bold tabular-nums text-muted-foreground">
                        {fmt(now, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <Button size="lg" className="gap-2 px-8" onClick={handleStart}>
                        <Play className="w-4 h-4" />
                        Iniciar Atendimento
                      </Button>
                    </div>
                  )}

                  {step === 0 && started && (
                    <StepShell
                      icon={Clock}
                      title="Hora do Atendimento"
                      description="Atendimento em curso. Avança quando estiveres pronto."
                    >
                      <div className="flex items-center justify-center py-6">
                        <div className="text-center">
                          <p className="text-4xl font-mono font-bold tabular-nums tracking-tight">
                            {fmt(now, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 capitalize">
                            {fmtDate(now, {
                              weekday: 'long',
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            Em atendimento há {elapsed} {elapsed === 1 ? 'minuto' : 'minutos'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Canal de Contacto</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {canais.map(({ label, icon: Icon }) => (
                            <button
                              key={label}
                              onClick={() => set('canal', label)}
                              className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                                form!.canal === label
                                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                  : 'border-border hover:border-primary/50 hover:bg-muted',
                              )}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Duração real (min) — opcional
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          placeholder={`${elapsed} min (automático)`}
                          value={form!.duracao_minutos}
                          onChange={(e) => set('duracao_minutos', e.target.value)}
                          className="mt-1.5 h-9 text-sm"
                        />
                      </div>
                    </StepShell>
                  )}

                  {step === 1 && (
                    <StepShell
                      icon={User}
                      title="Identificação"
                      description="Quem foi atendido e qual a área responsável?"
                    >
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Utilizador / Contacto *
                        </Label>
                        <Input
                          autoFocus
                          placeholder="Nome ou email do utilizador atendido"
                          value={form!.utilizador_contacto}
                          onChange={(e) => set('utilizador_contacto', e.target.value)}
                          className="mt-1.5 h-9 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Área *</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1.5">
                          {areas.map((a) => (
                            <button
                              key={a}
                              onClick={() => set('area', a)}
                              className={cn(
                                'text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                                form!.area === a
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'border-border hover:border-primary/50 hover:bg-muted',
                              )}
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                      </div>
                    </StepShell>
                  )}

                  {step === 2 && (
                    <StepShell
                      icon={Tag}
                      title="Assunto"
                      description="Classifica o assunto e descreve o pedido."
                    >
                      <div>
                        <Label className="text-xs text-muted-foreground">Assunto *</Label>
                        <Input
                          autoFocus
                          placeholder="Resumo do assunto"
                          value={form!.assunto}
                          onChange={(e) => set('assunto', e.target.value)}
                          className="mt-1.5 h-9 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Prioridade</Label>
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          {prioridades.map(({ label, color }) => (
                            <button
                              key={label}
                              onClick={() => set('prioridade', label)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                                form!.prioridade === label
                                  ? color + ' shadow-sm'
                                  : 'border-border hover:bg-muted',
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Descrição do pedido</Label>
                        <Textarea
                          placeholder="Descreve o pedido ou ocorrência em detalhe..."
                          value={form!.descricao}
                          onChange={(e) => set('descricao', e.target.value)}
                          className="mt-1.5 text-sm resize-none"
                          rows={4}
                        />
                      </div>
                    </StepShell>
                  )}

                  {step === 3 && (
                    <StepShell
                      icon={MessageSquare}
                      title="Resposta"
                      description="Regista a resolução e define o estado final."
                    >
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Resposta / Resolução
                        </Label>
                        <Textarea
                          autoFocus
                          placeholder="Resposta dada ou ação tomada para resolver o pedido..."
                          value={form!.resposta}
                          onChange={(e) => set('resposta', e.target.value)}
                          className="mt-1.5 text-sm resize-none"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Estado</Label>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {estados.map((e) => (
                            <button
                              key={e}
                              onClick={() => set('estado', e)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                                form!.estado === e
                                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                  : 'border-border hover:border-primary/50 hover:bg-muted',
                              )}
                            >
                              {e}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Notas Internas (opcional)
                        </Label>
                        <Textarea
                          placeholder="Notas visíveis apenas para atendedores..."
                          value={form!.notas_internas}
                          onChange={(e) => set('notas_internas', e.target.value)}
                          className="mt-1.5 text-sm resize-none text-muted-foreground"
                          rows={2}
                        />
                      </div>
                      <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Resumo
                        </p>
                        <SummaryRow
                          label="Hora início"
                          value={
                            startTime ? fmt(startTime, { hour: '2-digit', minute: '2-digit' }) : '—'
                          }
                        />
                        <SummaryRow label="Duração" value={`${elapsed} min`} />
                        <SummaryRow label="Contacto" value={form!.utilizador_contacto || '—'} />
                        <SummaryRow label="Área" value={form!.area || '—'} />
                        <SummaryRow label="Assunto" value={form!.assunto || '—'} />
                        <SummaryRow label="Canal" value={form!.canal} />
                        <SummaryRow label="Prioridade" value={form!.prioridade} />
                        <SummaryRow label="Estado" value={form!.estado} />
                      </div>
                    </StepShell>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="px-5 py-3 border-t border-border bg-muted/30 shrink-0 flex items-center gap-2">
              {step > 0 && !saved && (
                <Button
                  variant="outline"
                  className="h-9 gap-1.5"
                  onClick={() => setStep((s) => s - 1)}
                >
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </Button>
              )}
              {!isLast ? (
                <Button
                  className="flex-1 h-9 gap-1.5"
                  disabled={!canNext()}
                  onClick={() => setStep((s) => s + 1)}
                >
                  Seguinte <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  className="flex-1 h-9"
                  disabled={!form?.area || !form?.assunto || saving || saved}
                  onClick={handleSave}
                >
                  {saved ? (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Atendimento Registado!
                    </motion.span>
                  ) : saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />A guardar...
                    </>
                  ) : (
                    'Registar Atendimento'
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface StepShellProps {
  icon: IconComponent;
  title: string;
  description: string;
  children: React.ReactNode;
}

function StepShell({ icon: Icon, title, description, children }: StepShellProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-start gap-3 pb-2 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium truncate max-w-[200px] text-right">{value}</span>
    </div>
  );
}
