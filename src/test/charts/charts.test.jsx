import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import AreaChartComponent from '@/components/charts/AreaChart';
import BarChartComponent from '@/components/charts/BarChart';
import LineChartComponent from '@/components/charts/LineChart';
import PieChartComponent from '@/components/charts/PieChart';
import Heatmap from '@/components/charts/Heatmap';
import Sparkline from '@/components/charts/Sparkline';

expect.extend(toHaveNoViolations);

// ResponsiveContainer has no layout in jsdom — provide a fixed-size wrapper
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children, height }) => (
      <div style={{ width: 400, height: height ?? 280 }}>{children}</div>
    ),
  };
});

const MONTHLY = [
  { month: 'Jan', receita: 4200, despesa: 2800 },
  { month: 'Fev', receita: 5100, despesa: 3100 },
  { month: 'Mar', receita: 4800, despesa: 2900 },
];

const DEPT = [
  { dept: 'Design', q1: 42, q2: 55 },
  { dept: 'Dev', q1: 78, q2: 82 },
];

const WEEKLY = [
  { week: 'S1', visitas: 320, conversoes: 24 },
  { week: 'S2', visitas: 410, conversoes: 31 },
];

const PIE_DATA = [
  { name: 'Direto', value: 34 },
  { name: 'Orgânico', value: 28 },
  { name: 'Social', value: 18 },
];

// ── AreaChart ──────────────────────────────────────────────────────────────────

describe('AreaChart — render', () => {
  it('renders without crashing', () => {
    const { container } = render(<AreaChartComponent data={MONTHLY} xKey="month" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with default sample data', () => {
    const { container } = render(<AreaChartComponent />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders stacked variant', () => {
    const { container } = render(<AreaChartComponent data={MONTHLY} xKey="month" stacked />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('AreaChart — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<AreaChartComponent data={MONTHLY} xKey="month" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── BarChart ───────────────────────────────────────────────────────────────────

describe('BarChart — render', () => {
  it('renders without crashing', () => {
    const { container } = render(<BarChartComponent data={DEPT} xKey="dept" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders horizontal variant', () => {
    const { container } = render(<BarChartComponent data={DEPT} xKey="dept" horizontal />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders stacked variant', () => {
    const { container } = render(<BarChartComponent data={DEPT} xKey="dept" stacked />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with default sample data', () => {
    const { container } = render(<BarChartComponent />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('BarChart — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<BarChartComponent data={DEPT} xKey="dept" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── LineChart ──────────────────────────────────────────────────────────────────

describe('LineChart — render', () => {
  it('renders without crashing', () => {
    const { container } = render(<LineChartComponent data={WEEKLY} xKey="week" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with default sample data', () => {
    const { container } = render(<LineChartComponent />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('LineChart — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<LineChartComponent data={WEEKLY} xKey="week" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── PieChart ───────────────────────────────────────────────────────────────────

describe('PieChart — render', () => {
  it('renders without crashing', () => {
    const { container } = render(<PieChartComponent data={PIE_DATA} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders donut variant', () => {
    const { container } = render(<PieChartComponent data={PIE_DATA} donut />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders with default sample data', () => {
    const { container } = render(<PieChartComponent />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('PieChart — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<PieChartComponent data={PIE_DATA} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── Heatmap ────────────────────────────────────────────────────────────────────

describe('Heatmap — render', () => {
  it('renders with default data', () => {
    const { container } = render(<Heatmap />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders day and hour labels', () => {
    const { getByText } = render(<Heatmap />);
    expect(getByText('Seg')).toBeInTheDocument();
    expect(getByText('00h')).toBeInTheDocument();
  });
});

describe('Heatmap — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Heatmap />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

// ── Sparkline ──────────────────────────────────────────────────────────────────

describe('Sparkline — render', () => {
  it('renders without crashing', () => {
    const { container } = render(<Sparkline data={[10, 20, 15, 30, 25]} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders trend icon when showTrend is true', () => {
    const { container } = render(<Sparkline data={[10, 20, 30]} showTrend />);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders with object data and dataKey', () => {
    const data = [{ value: 10 }, { value: 20 }, { value: 15 }];
    const { container } = render(<Sparkline data={data} dataKey="value" />);
    expect(container.firstChild).toBeTruthy();
  });

  it('renders empty data without crashing', () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe('Sparkline — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<Sparkline data={[10, 20, 15, 30]} showTrend />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
