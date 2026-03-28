"use client";

import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { QuarterData } from "@/types";
import { Measure } from "@/types/measure";
import { MEASURE_CATEGORY_ICONS } from "@/lib/measureAnalysis";

interface Props {
  data: QuarterData[];
  measures: Measure[];
}

export default function MeasureTimeline({ data, measures }: Props) {
  const chartData = data.map((qd) => ({
    name: qd.label,
    満足度スコア: qd.totalScore,
    離職率: qd.turnoverRate,
    activeMeasures: qd.activeMeasures,
  }));

  // 施策が開始した四半期のラベルを収集
  const measureStartMap: Record<string, Measure[]> = {};
  measures.forEach((m) => {
    const label = data.find((d) => d.quarter === m.startQuarter)?.label;
    if (label) {
      measureStartMap[label] = [...(measureStartMap[label] ?? []), m];
    }
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const activeMeasures: string[] = payload[0]?.payload?.activeMeasures ?? [];
    const activeNames = activeMeasures
      .map((id) => measures.find((m) => m.id === id)?.name)
      .filter(Boolean);

    return (
      <div className="bg-dark/95 border border-white/10 rounded-xl p-4 shadow-2xl text-xs max-w-[200px]">
        <p className="text-white font-bold mb-2 font-outfit">{label}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-white/70">{p.dataKey}</span>
            </div>
            <span className="text-white font-bold font-outfit">
              {p.dataKey === "離職率" ? `${p.value}%` : p.value}
            </span>
          </div>
        ))}
        {activeNames.length > 0 && (
          <div className="border-t border-white/10 mt-2 pt-2">
            <p className="text-gold/70 text-[10px] mb-1">実施中の施策:</p>
            {activeNames.map((name, i) => (
              <p key={i} className="text-white/60 text-[10px]">・{name}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-dark font-bold text-base">施策タイムライン × 満足度推移</h3>
        <p className="text-dark/40 text-xs mt-0.5">
          ▼ は施策開始タイミング。ホバーで実施中施策を確認できます。
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#0D1B3E10" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#0D1B3E70", fontFamily: "Outfit, sans-serif", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="score"
            orientation="left"
            domain={[50, 100]}
            tick={{ fontSize: 11, fill: "#0D1B3E50" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="turnover"
            orientation="right"
            domain={[0, 12]}
            tick={{ fontSize: 11, fill: "#CC000060" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} iconType="circle" iconSize={8} />

          {/* 施策開始の参照ライン */}
          {Object.entries(measureStartMap).map(([label, ms]) => (
            <ReferenceLine
              key={label}
              yAxisId="score"
              x={label}
              stroke="#C8A951"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{
                value: ms.map((m) => MEASURE_CATEGORY_ICONS[m.category]).join(""),
                position: "top",
                fontSize: 13,
              }}
            />
          ))}

          {/* 目標ライン */}
          <ReferenceLine
            yAxisId="score"
            y={70}
            stroke="#1E3A5F"
            strokeDasharray="6 3"
            strokeOpacity={0.3}
            label={{ value: "目標70", position: "right", fontSize: 10, fill: "#1E3A5F80" }}
          />

          <Line
            yAxisId="score"
            type="monotone"
            dataKey="満足度スコア"
            stroke="#1E3A5F"
            strokeWidth={2.5}
            dot={{ r: 5, fill: "#1E3A5F", stroke: "white", strokeWidth: 2 }}
            activeDot={{ r: 7 }}
          />
          <Line
            yAxisId="turnover"
            type="monotone"
            dataKey="離職率"
            stroke="#CC0000"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 4, fill: "#CC0000", stroke: "white", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* 施策凡例 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {measures.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-1.5 bg-dark/[0.03] rounded-lg px-2.5 py-1.5 text-[11px] text-dark/60"
          >
            <span>{MEASURE_CATEGORY_ICONS[m.category]}</span>
            <span>{m.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
