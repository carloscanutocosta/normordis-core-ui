import React from "react";
import { AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const SAMPLE = [
  { month:"Jan", receita:4200, despesa:2800 },
  { month:"Fev", receita:5100, despesa:3100 },
  { month:"Mar", receita:4800, despesa:2900 },
  { month:"Abr", receita:6200, despesa:3500 },
  { month:"Mai", receita:5900, despesa:3200 },
  { month:"Jun", receita:7100, despesa:3800 },
];

const PALETTE = ["hsl(var(--chart-1))","hsl(var(--chart-2))","hsl(var(--chart-3))"];

export default function AreaChartComponent({ data = SAMPLE, dataKeys, xKey = "month", height = 280, stacked = false, className }) {
  const keys = dataKeys || Object.keys(data[0] || {}).filter((k) => k !== xKey);
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ReAreaChart data={data} margin={{ top:5, right:20, left:0, bottom:5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xKey} tick={{ fontSize:12, fill:"hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize:12, fill:"hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))", borderRadius:8, fontSize:12 }} />
          <Legend wrapperStyle={{ fontSize:12 }} />
          {keys.map((k, i) => (
            <Area key={k} type="monotone" dataKey={k} stackId={stacked ? "a" : undefined}
              stroke={PALETTE[i % PALETTE.length]} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.15} strokeWidth={2} />
          ))}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
}