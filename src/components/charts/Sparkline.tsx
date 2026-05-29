import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SparklineProps {
  data?: number[] | Record<string, unknown>[];
  dataKey?: string;
  color?: string;
  width?: number;
  height?: number;
  showTrend?: boolean;
  className?: string;
}

export default function Sparkline({
  data = [],
  dataKey = 'value',
  color,
  width = 80,
  height = 32,
  showTrend = false,
  className,
}: SparklineProps) {
  const values = data.map((d) => (typeof d === 'number' ? d : (d[dataKey] ?? 0)));
  const trend = values.length > 1 ? values[values.length - 1] - values[0] : 0;
  const auto =
    trend > 0
      ? 'hsl(var(--chart-2))'
      : trend < 0
        ? 'hsl(var(--destructive))'
        : 'hsl(var(--muted-foreground))';
  const stroke = color || auto;
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;

  const chartData = values.map((v, i) => ({ i, v }));

  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      <ResponsiveContainer width={width} height={height}>
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {showTrend && <TrendIcon className="h-3.5 w-3.5" style={{ color: stroke }} />}
    </span>
  );
}
