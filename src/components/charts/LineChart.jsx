import React from "react";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const SAMPLE = [
  { week:"S1", visitas:320, conversoes:24 },
  { week:"S2", visitas:410, conversoes:31 },
  { week:"S3", visitas:390, conversoes:28 },
  { week:"S4", visitas:510, conversoes:45 },
  { week:"S5", visitas:480, conversoes:39 },
  { week:"S6", visitas:620, conversoes:58 },
];

const PALETTE = ["hsl(var(--chart-1))","hsl(var(--chart-2))","hsl(var(--chart-3))"];

export default function LineChartComponent({ data = SAMPLE, dataKeys, xKey = "week", height = 280, className }) {
  const keys = dataKeys || Object.keys(data[0] || {}).filter((k) => k !== xKey);
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <ReLineChart data={data} margin={{ top:5, right:20, left:0, bottom:5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey={xKey} tick={{ fontSize:12, fill:"hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize:12, fill:"hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background:"hsl(var(--card))", border:"1px solid hsl(var(--border))", borderRadius:8, fontSize:12 }} />
          <Legend wrapperStyle={{ fontSize:12 }} />
          {keys.map((k, i) => (
            <Line key={k} type="monotone" dataKey={k} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={{ r:4 }} activeDot={{ r:6 }} />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}