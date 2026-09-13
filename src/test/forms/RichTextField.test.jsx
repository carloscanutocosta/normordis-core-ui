import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import RichTextField from '@/components/forms/RichTextField';

// Regressão: RichTextField usa react-quill-new (fork sem ReactDOM.findDOMNode,
// removido no React 19 — o react-quill original quebrava ao montar). Ver
// CHANGELOG.md. Sem este teste, a suite completa passava mesmo com o editor
// a rebentar em runtime, porque nenhum teste montava o componente.
describe('RichTextField — render', () => {
  it('monta sem lançar erro sob a versão de React instalada', () => {
    render(<RichTextField label="Descrição" value="" onChange={vi.fn()} />);
    expect(screen.getByText('Descrição')).toBeInTheDocument();
  });

  it('renderiza o editor Quill com o valor inicial', () => {
    const { container } = render(
      <RichTextField label="Notas" value="<p>Olá</p>" onChange={vi.fn()} />,
    );
    expect(container.querySelector('.ql-editor')).toBeInTheDocument();
    expect(container.textContent).toContain('Olá');
  });

  it('define o placeholder no editor quando vazio', () => {
    // O Quill renderiza o placeholder via CSS (::before em .ql-blank), não
    // como texto no DOM — verificamos o atributo que o alimenta.
    const { container } = render(
      <RichTextField label="Notas" value="" onChange={vi.fn()} placeholder="Escreve aqui" />,
    );
    expect(container.querySelector('.ql-editor')).toHaveAttribute(
      'data-placeholder',
      'Escreve aqui',
    );
  });

  it('associa erro ao grupo do editor via aria-invalid', () => {
    const { container } = render(
      <RichTextField label="Notas" value="" onChange={vi.fn()} error="Campo obrigatório" />,
    );
    expect(container.querySelector('[role="group"][aria-invalid="true"]')).toBeInTheDocument();
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });
});
