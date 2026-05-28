import { useState, useEffect } from 'react';
import { WorkspaceProvider, useWorkspace } from './WorkspaceContext';
import AtendimentoPanel from './AtendimentoPanel';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FORM_DEFAULTS = {
  area: '',
  assunto: '',
  descricao: '',
  resposta: '',
  canal: 'Telefone',
  prioridade: 'Normal',
  estado: 'Aberto',
  utilizador_contacto: '',
  duracao_minutos: '',
  notas_internas: '',
};

const FORM_FILLED = {
  area: 'Tecnologia',
  assunto: 'Problema de acesso ao sistema',
  descricao: 'O utilizador não consegue aceder à aplicação após a actualização.',
  resposta: 'Credenciais repostas e acesso verificado com sucesso.',
  canal: 'Telefone',
  prioridade: 'Alta',
  estado: 'Resolvido',
  utilizador_contacto: 'João Silva',
  duracao_minutos: '',
  notas_internas: 'Caso recorrente — verificar permissões no AD.',
};

// Seeds the WorkspaceContext with an atendimento state patch
function AtendimentoSeeder({ patch }) {
  const { updateAtendimento } = useWorkspace();
  useEffect(() => {
    updateAtendimento(patch);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

// Provides context + open/close toggle so closing the panel shows a reopen button
function PanelShell({ patch, children, ...panelProps }) {
  return (
    <WorkspaceProvider apps={[]}>
      {patch && <AtendimentoSeeder patch={patch} />}
      <PanelInner patch={patch} {...panelProps}>
        {children}
      </PanelInner>
    </WorkspaceProvider>
  );
}

function PanelInner({ children: _children, ...panelProps }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <AtendimentoPanel open={open} onClose={() => setOpen(false)} {...panelProps} />
      {!open && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
          <p className="text-sm">Painel fechado.</p>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            Reabrir painel
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Workspace/AtendimentoPanel',
  component: AtendimentoPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Painel de registo de atendimentos em 4 passos: Hora → Identificação → Assunto → Resposta. Abre como bottom-sheet e persiste o estado no WorkspaceContext (sobrevive a recarregamentos de página).',
      },
    },
  },
};

// ─── Stories ──────────────────────────────────────────────────────────────────

export const ReadyToStart = {
  name: 'Passo 1 — pronto para iniciar',
  render: () => (
    <PanelShell patch={{ started: false, startTime: null, step: 0, form: FORM_DEFAULTS }} />
  ),
};

export const InProgress = {
  name: 'Passo 1 — em atendimento (relógio a correr)',
  render: () => (
    <PanelShell
      patch={{
        started: true,
        startTime: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
        step: 0,
        form: { ...FORM_DEFAULTS, canal: 'Presencial' },
      }}
    />
  ),
};

export const StepIdentification = {
  name: 'Passo 2 — identificação',
  render: () => (
    <PanelShell
      patch={{
        started: true,
        startTime: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        step: 1,
        form: { ...FORM_DEFAULTS, canal: 'Email' },
      }}
    />
  ),
};

export const StepSubject = {
  name: 'Passo 3 — assunto',
  render: () => (
    <PanelShell
      patch={{
        started: true,
        startTime: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
        step: 2,
        form: {
          ...FORM_DEFAULTS,
          utilizador_contacto: 'Ana Costa',
          area: 'Recursos Humanos',
          canal: 'Presencial',
        },
      }}
    />
  ),
};

export const StepResponse = {
  name: 'Passo 4 — resposta e resumo',
  render: () => (
    <PanelShell
      patch={{
        started: true,
        startTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        step: 3,
        form: FORM_FILLED,
      }}
    />
  ),
};

export const CustomOptions = {
  name: 'Opções personalizadas pelo consumidor',
  parameters: {
    docs: {
      description: {
        story:
          'As áreas, canais, prioridades e estados podem ser substituídos pelo consumidor do SDK.',
      },
    },
  },
  render: () => (
    <PanelShell
      patch={{
        started: true,
        startTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        step: 0,
        form: { ...FORM_DEFAULTS, canal: 'Balcão' },
      }}
      areas={['Atendimento ao Público', 'Licenciamento', 'Urbanismo', 'Ambiente', 'Fiscalização']}
      canais={[
        { label: 'Balcão', icon: () => null },
        { label: 'Telefone', icon: () => null },
        { label: 'Email', icon: () => null },
      ]}
      prioridades={[
        { label: 'Rotina', color: 'bg-slate-500/15 text-slate-600 border-slate-500/30' },
        { label: 'Urgente', color: 'bg-red-500/15 text-red-600 border-red-500/30' },
      ]}
      estados={['Recebido', 'Em análise', 'Deferido', 'Indeferido']}
    />
  ),
};

export const WithSaveCallback = {
  name: 'Com callback onSave (log na consola)',
  parameters: {
    docs: {
      description: {
        story:
          'No passo 4, ao clicar "Registar Atendimento", o `onSave` é invocado com todos os dados preenchidos. Abre a consola do browser para ver o output.',
      },
    },
  },
  render: () => (
    <PanelShell
      patch={{
        started: true,
        startTime: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
        step: 3,
        form: FORM_FILLED,
      }}
      onSave={async (data) => {
        console.log('[AtendimentoPanel] onSave →', data);
        await new Promise((r) => setTimeout(r, 800));
      }}
    />
  ),
};
