"use client";

import { QuarterData } from "@/types";
import { questions } from "@/lib/questions";
import { getScoreLevel, SCORE_COLORS, CATEGORY_COLORS } from "@/lib/scoring";
import { TableProperties } from "lucide-react";

interface Props {
  data: QuarterData[];
}

export default function CategoryTable({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-dark/6">
        <TableProperties size={16} className="text-navy" />
        <div>
          <h3 className="text-dark font-bold text-sm">カテゴリ別スコア詳細</h3>
          <p className="text-dark/40 text-[11px] mt-0.5">四半期ごとの各カテゴリスコア（0〜100）</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-dark/[0.025]">
              <th className="text-left px-6 py-3 text-[11px] font-bold text-dark/50 tracking-wider uppercase whitespace-nowrap">
                カテゴリ
              </th>
              {data.map((qd) => (
                <th
                  key={qd.quarter}
                  className="text-center px-4 py-3 text-[11px] font-bold text-dark/50 tracking-wider whitespace-nowrap font-outfit"
                >
                  {qd.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {questions.map((q, qi) => (
              <tr key={q.id} className="border-t border-dark/[0.04] hover:bg-dark/[0.015] transition-colors">
                <td className="px-6 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[qi] }}
                    />
                    <span className="text-dark/70 text-[13px]">
                      {q.icon} {q.category}
                    </span>
                  </div>
                </td>
                {data.map((qd) => {
                  const score = qd.categoryScores[q.id] ?? 0;
                  const level = getScoreLevel(score);
                  const color = SCORE_COLORS[level];
                  return (
                    <td key={qd.quarter} className="px-4 py-3 text-center">
                      <div className="inline-flex items-center justify-center">
                        <span
                          className="font-bold text-[13px] font-outfit px-2.5 py-0.5 rounded-lg"
                          style={{
                            color,
                            backgroundColor: `${color}15`,
                          }}
                        >
                          {score}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Total row */}
            <tr className="border-t-2 border-dark/10 bg-dark/[0.025]">
              <td className="px-6 py-3 font-bold text-dark text-[13px]">
                総合スコア
              </td>
              {data.map((qd) => {
                const level = getScoreLevel(qd.totalScore);
                const color = SCORE_COLORS[level];
                return (
                  <td key={qd.quarter} className="px-4 py-3 text-center">
                    <span
                      className="font-bold text-sm font-outfit px-3 py-1 rounded-lg"
                      style={{ color, backgroundColor: `${color}18` }}
                    >
                      {qd.totalScore}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Turnover row */}
            <tr className="border-t border-dark/[0.04] bg-danger/[0.015]">
              <td className="px-6 py-3 text-dark/70 text-[13px]">
                離職率
              </td>
              {data.map((qd) => (
                <td key={qd.quarter} className="px-4 py-3 text-center">
                  <span className="text-danger font-bold text-[13px] font-outfit">
                    {qd.turnoverRate.toFixed(1)}%
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
