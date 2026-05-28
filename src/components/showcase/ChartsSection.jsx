import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AreaChartComponent from '../charts/AreaChart';
import LineChartComponent from '../charts/LineChart';
import BarChartComponent from '../charts/BarChart';
import PieChartComponent from '../charts/PieChart';
import Heatmap from '../charts/Heatmap';
import Sparkline from '../charts/Sparkline';
import { Badge } from '@/components/ui/badge';

const sparkData = [12, 18, 14, 22, 19, 28, 24, 31, 27, 35];

export default function ChartsSection() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Area Chart</CardTitle>
          <CardDescription>Gráfico de área — simples e empilhado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Simples
            </p>
            <AreaChartComponent />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Empilhado
            </p>
            <AreaChartComponent stacked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Line Chart</CardTitle>
          <CardDescription>Gráfico de linhas com múltiplas séries</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChartComponent />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bar Chart</CardTitle>
          <CardDescription>Gráfico de barras — vertical, horizontal e empilhado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Vertical
            </p>
            <BarChartComponent />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Horizontal
            </p>
            <BarChartComponent horizontal />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Empilhado
            </p>
            <BarChartComponent stacked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pie / Donut Chart</CardTitle>
          <CardDescription>Gráfico circular e em anel</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Pie
            </p>
            <PieChartComponent />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Donut
            </p>
            <PieChartComponent donut />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Heatmap</CardTitle>
          <CardDescription>Grelha de intensidade por dia/hora</CardDescription>
        </CardHeader>
        <CardContent>
          <Heatmap />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sparkline</CardTitle>
          <CardDescription>Mini-gráfico inline para tabelas e cartões</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Receita', trend: +12.4, color: 'hsl(var(--chart-2))' },
              { label: 'Visitas', trend: +5.2, color: 'hsl(var(--chart-1))' },
              { label: 'Erros', trend: -3.1, color: 'hsl(var(--destructive))' },
              { label: 'Latência', trend: +0, color: 'hsl(var(--muted-foreground))' },
            ].map(({ label, trend, color }) => (
              <div
                key={label}
                className="flex items-center gap-4 py-2 border-b border-border last:border-0"
              >
                <span className="text-sm text-foreground w-24">{label}</span>
                <Sparkline
                  data={sparkData.map((v, i) => ({ value: v + i * (trend > 0 ? 1 : -0.5) }))}
                  dataKey="value"
                  color={color}
                  showTrend
                />
                <Badge
                  className={
                    trend > 0
                      ? 'bg-green-100 text-green-700'
                      : trend < 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-muted text-muted-foreground'
                  }
                >
                  {trend > 0 ? '+' : ''}
                  {trend}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
