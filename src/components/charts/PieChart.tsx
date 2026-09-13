import React from 'react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

const SAMPLE = [
  { name: 'Direto', value: 34 },
  { name: 'Orgânico', value: 28 },
  { name: 'Referência', value: 18 },
  { name: 'Email', value: 12 },
  { name: 'Social', value: 8 },
];

const PALETTE = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const CustomLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  innerRadius = 0,
  outerRadius = 0,
  percent = 0,
}) => {
  const rad = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + rad * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + rad * Math.sin((-midAngle * Math.PI) / 180);
  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="#fff"
      fontSize={11}
      fontWeight={600}
    >
      {`${Math.round(percent * 100)}%`}
    </text>
  ) : null;
};

interface PieChartProps {
  data?: { name: string; value: number }[];
  donut?: boolean;
  height?: number;
  className?: string;
}

export default function PieChartComponent({
  data = SAMPLE,
  donut = false,
  height = 280,
  className,
}: PieChartProps) {
  const innerR = donut ? 60 : 0;
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RePieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerR}
            outerRadius={100}
            labelLine={false}
            label={CustomLabel}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}
