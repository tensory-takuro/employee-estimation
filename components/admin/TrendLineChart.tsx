"use client";

import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { QuarterData } from "@/types";

interface Props {
  data: QuarterData[];
}

// data-visualization: 満足度（折れ線）と離職率（折れ線）を1つのチャートに
// 2つのY軸は混乱を招くため、値のレンジを合わせて単一Y軸で表示
// 参考ライン（目標スコア70）を追加しストーリーを伝える
export default function TrendLineChart({ data }: Props) {
  const chartData = data.map((qd) => ({
    name: qd.label,
    period: qd.period,
    満足度スコア: qd.totalScore,
    離職率: qd.turnoverRate,
    respondents: qd.respondents,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-dark/95 border border-white/10 rounded-xl p-4 shadow-2xl text-xs">
        <p className="text-white font-bold mb-1 font-outfit">{label}</p>
        <p className="text-white/40 mb-3 text-[10px]">
          {data.find((d) => d.label === label)?.period}
        </p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-6 mb-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
              <span className="text-white/70">{p.dataKey}</span>
            </div>
            <span className="text-white font-bold font-outfit">
              {p.dataKey === "離職率" ? `${p.value}%` : p.value}
            </span>
          </div>
        ))}
        <p className="text-white/25 text-[10px] mt-2">
          回答者: {data.find((d) => d.label === label)?.respondents}名
        </p>
      </div>
    );
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    const isLatest = payload.name === chartData[chartData.length - 1]?.name;
    const color = dataKey === "満足度スコア" ? "#1E3A5F" : "#CC0000";
    return (
      <g key={`dot-${dataKey}-${payload.name}`}>
        <circle cx={cx} cy={cy} r={isLatest ? 6 : 4} fill={color} stroke="white" strokeWidth={2} />
      </g>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-dark font-bold text-base">満足度スコアと離職率の推移</h3>
        <p className="text-dark/45 text-xs mt-0.5">
          満足度向上に伴い離職率が低下する相関に注目（目標ライン: スコア70）
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#0D1B3E50" }}
            axisLine={false}
            tickLine={false}
            label={{
              value: "満足度スコア",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fontSize: 10, fill: "#0D1B3E50" },
            }}
          />
          <YAxis
            yAxisId="turnover"
            orientation="right"
            domain={[0, 15]}
            tick={{ fontSize: 11, fill: "#CC000070" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            label={{
              value: "離職率",
              angle: 90,
              position: "insideRight",
              offset: 10,
              style: { fontSize: 10, fill: "#CC000070" },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
            iconType="circle"
            iconSize={8}
          />
          {/* 目標ライン */}
          <ReferenceLine
            yAxisId="score"
            y={70}
            stroke="#C8A951"
            strokeDasharray="6 3"
            label={{ value: "目標 70", position: "right", fontSize: 10, fill: "#C8A951" }}
          />
          {/* 満足度スコア */}
          <Line
            yAxisId="score"
            type="monotone"
            dataKey="満足度スコア"
            stroke="#1E3A5F"
            strokeWidth={2.5}
            dot={<CustomDot dataKey="満足度スコア" />}
            activeDot={{ r: 7, fill: "#1E3A5F", stroke: "white", strokeWidth: 2 }}
          />
          {/* 離職率 */}
          <Line
            yAxisId="turnover"
            type="monotone"
            dataKey="離職率"
            stroke="#CC0000"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={<CustomDot dataKey="離職率" />}
            activeDot={{ r: 6, fill: "#CC0000", stroke: "white", strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
