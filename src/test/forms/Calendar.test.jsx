import { describe, it, expect, vi } from 'vitest';
import { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Calendar } from '@/components/ui/calendar';

// Calendar é controlado — sem estado próprio, um clique não volta a
// renderizar com o novo `selected`. Este wrapper simula o consumidor real.
function ControlledCalendar({ onSelect }) {
  const [selected, setSelected] = useState(undefined);
  return (
    <Calendar
      mode="single"
      selected={selected}
      onSelect={(date) => {
        setSelected(date);
        onSelect(date);
      }}
    />
  );
}

// Regressão: o react-day-picker aplica aria-selected e as classes de
// modificador (selected/today/range_*) ao <td> ("day"), não a um
// descendente — só o <button> ("day_button") é filho direto. Um seletor
// `:has([aria-selected])` no "day" nunca corresponde a nada nessa estrutura;
// estes testes fixam a estrutura real, para detectar se a lib voltar a mudar.
//
// Usamos apenas `aria-selected` (não `data-selected`/`data-today`): estes
// `data-*` por-dia só existem a partir de uma versão posterior ao mínimo
// `>=9.0.0` anunciado em peerDependencies — confirmado testando contra esse
// mínimo exato, onde `getDataAttributes` (v9.0.0) não os inclui. `aria-*` e
// as classes de modificador são as únicas garantias estáveis entre versões.
// Ver CHANGELOG.md e src/components/ui/calendar.tsx.
describe('Calendar — estrutura de seleção (react-day-picker)', () => {
  it('marca aria-selected na célula (<td>), não no botão', () => {
    const onSelect = vi.fn();
    const { container } = render(<ControlledCalendar onSelect={onSelect} />);

    const cellNotOutside = container.querySelector(
      'td[role="gridcell"]:not([data-outside]):not([data-disabled]):not([data-hidden])',
    );
    expect(cellNotOutside).toBeTruthy();
    const dayButton = cellNotOutside.querySelector('button');
    expect(dayButton).toBeTruthy();
    fireEvent.click(dayButton);

    expect(onSelect).toHaveBeenCalledTimes(1);

    const cell = dayButton.closest('td');
    expect(cell).toHaveAttribute('aria-selected', 'true');
    // O botão em si nunca recebe aria-selected diretamente.
    expect(dayButton).not.toHaveAttribute('aria-selected');

    // A classe que aplica o fundo do dia selecionado vive na célula e visa o
    // botão filho via `[&>button]`, não `:has(...)` (que não corresponderia).
    expect(cell.className).toContain('[&>button]:bg-primary');
  });

  it('aplica a classe de "hoje" a exatamente uma célula do mês', () => {
    const { container } = render(<Calendar mode="single" selected={undefined} />);
    // "today" é a única classe de modificador que combina texto accent com
    // cantos normais (distingue de "range_middle", que também usa
    // text-accent-foreground mas soma `rounded-none`).
    const cells = Array.from(container.querySelectorAll('td[role="gridcell"]')).filter(
      (td) =>
        td.className.includes('[&>button]:text-accent-foreground') &&
        !td.className.includes('rounded-none'),
    );
    expect(cells).toHaveLength(1);
    expect(cells[0].className).toContain('[&>button]:bg-accent');
  });
});
