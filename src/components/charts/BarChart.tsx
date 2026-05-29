import React from 'react';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

const SAMPLE = [
  { dept: 'Design', q1: 42, q2: 55, q3: 61 },
  { dept: 'Dev', q1: 78, q2: 82, q3: 90 },
  { dept: 'Marketing', q1: 35, q2: 48, q3: 52 },
  { dept: 'Suporte', q1: 28, q2: 31, q3: 40 },
  { dept: 'Gestão', q1: 15, q2: 18, q3: 22 },
];

const PALETTE = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
];

interface BarChartProps {
  data?: Record<string, unknown>[];
  dataKeys?: string[];
  xKey?: string;
  height?: number;
  horizontal?: boolean;
  stacked?: boolean;
  className?: string;
}

export default function BarChartComponent({
  data = SAMPLE,
  dataKeys,
  xKey = 'dept',
  height = 280,
  horizontal = false,
  stacked = false,
  className,
}: BarChartProps) {
  const keys = dataKeys || Object.keys(data[0] || {}).filter((k) => k !== xKey);
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          {horizontal ? (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey={xKey}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={70}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {keys.map((k, i) => (
            <Bar
              key={k}
              dataKey={k}
              stackId={stacked ? 'a' : undefined}
              fill={PALETTE[i % PALETTE.length]}
              radius={stacked ? 0 : [3, 3, 0, 0]}
            />
          ))}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}
