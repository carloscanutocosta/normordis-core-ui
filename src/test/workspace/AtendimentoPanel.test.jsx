import { describe, it, expect, vi } from 'vitest';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { WorkspaceProvider, useWorkspace } from '@/components/workspace/WorkspaceContext';
import AtendimentoPanel from '@/components/workspace/AtendimentoPanel';

expect.extend(toHaveNoViolations);

vi.mock('@/lib/theme', () => ({
  applyTheme: vi.fn(),
  getStoredTheme: vi.fn(() => 'light'),
}));

const APPS = [{ id: 'app1', label: 'App One', icon: null, category: 'core' }];

// Seeds WorkspaceContext with a specific atendimento patch
function Seeder({ patch }) {
  const { updateAtendimento } = useWorkspace();
  useEffect(() => { updateAtendimento(patch); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function renderPanel(patch, panelProps = {}) {
  return render(
    <WorkspaceProvider apps={APPS}>
      <Seeder patch={patch} />
      <AtendimentoPanel open={true} onClose={vi.fn()} {...panelProps} />
    </WorkspaceProvider>,
  );
}

const BASE_FORM = {
  area: '', assunto: '', descricao: '', resposta: '',
  canal: 'Telefone', prioridade: 'Normal', estado: 'Aberto',
  utilizador_contacto: '', duracao_minutos: '', notas_internas: '',
};

const STARTED_PATCH = {
  started: true,
  startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  step: 0,
  form: BASE_FORM,
};

describe('AtendimentoPanel — step 0 (hora)', () => {
  it('shows "Registar Atendimento" heading', async () => {
    renderPanel(STARTED_PATCH);
    await waitFor(() => {
      // This text appears in the panel header (unique across UI)
      expect(screen.getByText('Registar Atendimento')).toBeInTheDocument();
    });
  });

  it('renders "Iniciar Atendimento" button when session not yet started', async () => {
    renderPanel({ started: false, startTime: null, step: 0, form: BASE_FORM });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /iniciar atendimento/i })).toBeInTheDocument();
    });
  });

  it('shows elapsed time indicator when started', async () => {
    renderPanel(STARTED_PATCH);
    await waitFor(() => {
      // The header clock badge is the only element with this specific text pattern
      const spans = screen.getAllByText(/\d+ min$/);
      expect(spans.length).toBeGreaterThan(0);
    });
  });

  it('has a close button', async () => {
    renderPanel(STARTED_PATCH);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /fechar/i })).toBeInTheDocument();
    });
  });

  it('shows the step navigation with Hora step active', async () => {
    renderPanel(STARTED_PATCH);
    await waitFor(() => {
      // The step indicator button with aria-current="step" is the active step
      expect(screen.getByRole('button', { name: /hora/i })).toHaveAttribute('aria-current', 'step');
    });
  });
});

describe('AtendimentoPanel — step 1 (identificação)', () => {
  it('renders the identification step description', async () => {
    renderPanel({ ...STARTED_PATCH, step: 1 });
    await waitFor(() => {
      // The StepShell description is unique text not repeated in the nav
      expect(screen.getByText(/quem foi atendido/i)).toBeInTheDocument();
    });
  });
});

describe('AtendimentoPanel — step 2 (assunto)', () => {
  it('renders the subject step description', async () => {
    renderPanel({
      ...STARTED_PATCH, step: 2,
      form: { ...BASE_FORM, utilizador_contacto: 'Ana' },
    });
    await waitFor(() => {
      expect(screen.getByText(/classifica o assunto/i)).toBeInTheDocument();
    });
  });
});

describe('AtendimentoPanel — step 3 (resposta)', () => {
  it('renders the response step with the save button', async () => {
    renderPanel({
      ...STARTED_PATCH, step: 3,
      form: { ...BASE_FORM, utilizador_contacto: 'Ana', area: 'TI', assunto: 'Acesso' },
    });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /registar atendimento/i })).toBeInTheDocument();
    });
  });
});

describe('AtendimentoPanel — custom options', () => {
  it('renders custom areas in step 2', async () => {
    renderPanel(
      { ...STARTED_PATCH, step: 1, form: { ...BASE_FORM, utilizador_contacto: 'Ana' } },
      { areas: ['Urbanismo', 'Fiscalização'] },
    );
    await waitFor(() => {
      expect(screen.getByText('Urbanismo')).toBeInTheDocument();
      expect(screen.getByText('Fiscalização')).toBeInTheDocument();
    });
  });
});

describe('AtendimentoPanel — accessibility', () => {
  it('has no axe violations on step 0', async () => {
    const { container } = renderPanel(STARTED_PATCH);
    await waitFor(() => screen.getByText('Registar Atendimento'));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
