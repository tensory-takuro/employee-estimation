"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { QuarterData } from "@/types";
import { questions } from "@/lib/questions";
import { CATEGORY_COLORS } from "@/lib/scoring";

interface Props {
  data: QuarterData[];
}

// data-visualization: 積み上げ棒グラフはカテゴリ別 part-of-whole の比較に最適
// Y軸は 0 から開始（棒グラフの鉄則）、カテゴリ別に色分け（最大10色）
export default function StackedBarChart({ data }: Props) {
  const chartData = data.map((qd) => ({
    name: qd.label,
    period: qd.period,
    ...Object.fromEntries(
      questions.map((q) => [q.category, qd.categoryScores[q.id] ?? 0])
    ),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    const total = payload.reduce((s: number, p: any) => s + (p.value ?? 0), 0);
    return (
      <div className="bg-dark/95 border border-white/10 rounded-xl p-4 shadow-2xl text-xs">
        <p className="text-white font-bold mb-2 font-outfit">{label}</p>
        <p className="text-white/40 mb-3 text-[10px]">
          {data.find((d) => d.label === label)?.period}
        </p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill }} />
              <span className="text-white/70">{p.dataKey}</span>
            </div>
            <span className="text-white font-bold font-outfit">{p.value}</span>
          </div>
        ))}
        <div className="border-t border-white/10 mt-2 pt-2 flex items-center justify-between">
          <span className="text-white/50">平均スコア</span>
          <span className="text-gold font-bold font-outfit">{Math.round(total / payload.length)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-dark font-bold text-base">カテゴリ別満足度スコア推移</h3>
        <p className="text-dark/45 text-xs mt-0.5">各カテゴリのスコア（0〜100）を四半期ごとに比較</p>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={data.length > 4 ? 36 : 52}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0D1B3E10" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#0D1B3E70", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#0D1B3E50" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#0D1B3E05" }} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "16px" }}
            iconType="circle"
            iconSize={8}
          />
          {questions.map((q, i) => (
            <Bar
              key={q.id}
              dataKey={q.category}
              stackId="stack"
              fill={CATEGORY_COLORS[i]}
              radius={i === questions.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
