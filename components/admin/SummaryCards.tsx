"use client";

import { QuarterData } from "@/types";
import { getScoreLevel, SCORE_COLORS, SCORE_LABELS_LEVEL } from "@/lib/scoring";
import { TrendingUp, TrendingDown, Minus, Users, AlertTriangle } from "lucide-react";

interface Props {
  data: QuarterData[];
}

export default function SummaryCards({ data }: Props) {
  if (data.length === 0) return null;

  const latest = data[data.length - 1];
  const prev = data.length >= 2 ? data[data.length - 2] : null;
  const scoreLevel = getScoreLevel(latest.totalScore);
  const scoreDiff = prev ? latest.totalScore - prev.totalScore : null;
  const turnoverDiff = prev ? latest.turnoverRate - prev.turnoverRate : null;

  const cards = [
    {
      label: "直近の満足度スコア",
      value: `${latest.totalScore}`,
      unit: "/ 100",
      sublabel: SCORE_LABELS_LEVEL[scoreLevel],
      color: SCORE_COLORS[scoreLevel],
      diff: scoreDiff,
      icon: TrendingUp,
      quarter: latest.label,
    },
    {
      label: "前四半期比",
      value: scoreDiff !== null ? `${scoreDiff > 0 ? "+" : ""}${scoreDiff}` : "—",
      unit: "pt",
      sublabel: scoreDiff !== null ? (scoreDiff > 0 ? "改善" : scoreDiff < 0 ? "悪化" : "変化なし") : "データなし",
      color: scoreDiff === null ? "#94A3B8" : scoreDiff > 0 ? "#16A34A" : scoreDiff < 0 ? "#CC0000" : "#D97706",
      icon: scoreDiff === null ? Minus : scoreDiff > 0 ? TrendingUp : TrendingDown,
      quarter: prev ? `${prev.label} → ${latest.label}` : "—",
    },
    {
      label: "直近の離職率",
      value: `${latest.turnoverRate.toFixed(1)}`,
      unit: "%",
      sublabel: turnoverDiff !== null
        ? (turnoverDiff < 0 ? `${Math.abs(turnoverDiff).toFixed(1)}pt 改善` : `${turnoverDiff.toFixed(1)}pt 上昇`)
        : "データなし",
      color: latest.turnoverRate <= 5 ? "#16A34A" : latest.turnoverRate <= 7 ? "#D97706" : "#CC0000",
      icon: AlertTriangle,
      quarter: latest.label,
    },
    {
      label: "回答者数（直近）",
      value: `${latest.respondents}`,
      unit: "名",
      sublabel: "全従業員対象",
      color: "#1E3A5F",
      icon: Users,
      quarter: latest.label,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white rounded-2xl border border-dark/8 p-5 shadow-sm animate-fade-up"
            style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark/50 text-[11px] font-semibold tracking-wider uppercase leading-tight">{card.label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}18` }}>
                <Icon size={14} style={{ color: card.color }} />
              </div>
            </div>
            <div className="flex items-baseline gap-1 mb-1 animate-count-up" style={{ animationDelay: `${i * 0.07 + 0.2}s`, opacity: 0 }}>
              <span className="text-3xl font-bold text-dark font-outfit leading-none">{card.value}</span>
              <span className="text-dark/40 text-sm font-medium">{card.unit}</span>
            </div>
            <p className="text-[11px] font-semibold" style={{ color: card.color }}>{card.sublabel}</p>
            <p className="text-dark/25 text-[10px] mt-1">{card.quarter}</p>
          </div>
        );
      })}
    </div>
  );
}
