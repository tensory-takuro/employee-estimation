"use client";

import { Measure, MEASURE_CATEGORY_LABELS } from "@/types/measure";
import { MeasureEffect } from "@/types/measure";
import { questions } from "@/lib/questions";
import { MEASURE_CATEGORY_ICONS } from "@/lib/measureAnalysis";

interface Props {
  measures: Measure[];
  effects: MeasureEffect[];
}

function getHeatColor(value: number): { bg: string; text: string } {
  if (value >= 12) return { bg: "#16A34A", text: "white" };
  if (value >= 8)  return { bg: "#4ADE80", text: "#14532D" };
  if (value >= 4)  return { bg: "#BBF7D0", text: "#166534" };
  if (value >= 1)  return { bg: "#DCFCE7", text: "#166534" };
  if (value === 0) return { bg: "#F1F5F9", text: "#94A3B8" };
  return { bg: "#FEE2E2", text: "#CC0000" };
}

export default function CorrelationHeatmap({ measures, effects }: Props) {
  const measuresWithEffects = measures.filter((m) =>
    effects.some((e) => e.measureId === m.id)
  );

  if (measuresWithEffects.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-dark font-bold text-base">施策 × カテゴリ 相関ヒートマップ</h3>
        <p className="text-dark/40 text-xs mt-0.5">
          各施策の前後でスコアが何pt変化したか。濃い緑ほど改善幅が大きい。
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left pr-3 py-2 text-dark/40 font-bold tracking-wider uppercase text-[10px] whitespace-nowrap w-36">
                施策 ↓ / カテゴリ →
              </th>
              {questions.map((q) => (
                <th
                  key={q.id}
                  className="px-1 py-2 text-center text-dark/50 font-medium whitespace-nowrap"
                  style={{ minWidth: "52px" }}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-base leading-none">{q.icon}</span>
                    <span className="text-[9px] leading-tight max-w-[44px] text-center">
                      {q.category.length > 6 ? q.category.slice(0, 6) + "…" : q.category}
                    </span>
                  </div>
                </th>
              ))}
              <th className="px-2 py-2 text-center text-dark/50 font-bold text-[10px]">
                総合
              </th>
            </tr>
          </thead>
          <tbody>
            {measuresWithEffects.map((m) => {
              const effect = effects.find((e) => e.measureId === m.id)!;
              const rowMax = Math.max(...Object.values(effect.categoryDiffs));
              return (
                <tr key={m.id} className="border-t border-dark/[0.04]">
                  <td className="pr-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{MEASURE_CATEGORY_ICONS[m.category]}</span>
                      <span className="text-dark/70 font-medium text-[11px] leading-tight">
                        {m.name.length > 12 ? m.name.slice(0, 11) + "…" : m.name}
                      </span>
                    </div>
                  </td>
                  {questions.map((q) => {
                    const val = effect.categoryDiffs[q.id] ?? 0;
                    const { bg, text } = getHeatColor(val);
                    const isMax = val === rowMax && val > 0;
                    return (
                      <td key={q.id} className="px-1 py-2 text-center">
                        <div
                          className={`inline-flex items-center justify-center w-10 h-8 rounded-lg font-bold font-outfit text-[12px] transition-transform ${
                            isMax ? "scale-110 shadow-sm" : ""
                          }`}
                          style={{ backgroundColor: bg, color: text }}
                          title={`${m.name} × ${q.category}: ${val > 0 ? "+" : ""}${val}pt`}
                        >
                          {val > 0 ? `+${val}` : val}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-2 py-2 text-center">
                    <div
                      className="inline-flex items-center justify-center w-12 h-8 rounded-lg font-bold font-outfit text-[13px]"
                      style={{ backgroundColor: getHeatColor(effect.overallScoreDiff).bg, color: getHeatColor(effect.overallScoreDiff).text }}
                    >
                      {effect.overallScoreDiff > 0 ? `+${effect.overallScoreDiff}` : effect.overallScoreDiff}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* カラーレジェンド */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-dark/35 text-[10px]">スコア変化:</span>
        {[
          { label: "12pt+", bg: "#16A34A", text: "white" },
          { label: "8-11", bg: "#4ADE80", text: "#14532D" },
          { label: "4-7", bg: "#BBF7D0", text: "#166534" },
          { label: "1-3", bg: "#DCFCE7", text: "#166534" },
          { label: "0", bg: "#F1F5F9", text: "#94A3B8" },
          { label: "マイナス", bg: "#FEE2E2", text: "#CC0000" },
        ].map((l) => (
          <div
            key={l.label}
            className="flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ backgroundColor: l.bg, color: l.text }}
          >
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}
