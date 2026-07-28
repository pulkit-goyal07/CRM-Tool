"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { OPPORTUNITY_STAGE_LABELS } from "@/lib/labels";
import { formatCurrency } from "@/lib/format";

export function PipelineChart({
  data,
}: {
  data: { stage: string; amount: number; count: number }[];
}) {
  const chartData = data.map((d) => ({
    stage: OPPORTUNITY_STAGE_LABELS[d.stage] ?? d.stage,
    amount: d.amount,
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis
          dataKey="stage"
          tick={{ fontSize: 11 }}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={50}
        />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatCurrency(v)} />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value ?? 0))}
          labelStyle={{ color: "#0f172a" }}
        />
        <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
