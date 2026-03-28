"use client";

import Link from "next/link";
import { Measure } from "@/types/measure";
import {
  MEASURE_CATEGORY_LABELS,
  MEASURE_STATUS_LABELS,
} from "@/types/measure";
import {
  MEASURE_STATUS_COLORS,
  MEASURE_CATEGORY_ICONS,
} from "@/lib/measureAnalysis";
import { MEASURE_EFFECTS } from "@/lib/measureData";
import { QUARTERS } from "@/lib/dummyData";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  measure: Measure;
  index: number;
}

export default function MeasureCard({ measure, index }: Props) {
  const effect = MEASURE_EFFECTS.find((e) => e.measureId === measure.id);
  const statusStyle = MEASURE_STATUS_COLORS[measure.status];
  const icon = MEASURE_CATEGORY_ICONS[measure.category];
  const endLabel = measure.endQuarter
    ? QUARTERS.find((q) => q.key === measure.endQuarter)?.label
    : "継続中";

  return (
    <Link
      href={`/admin/measures/${measure.id}`}
      className="group block bg-white rounded-2xl border border-dark/8 p-5 shadow-sm hover:shadow-md hover:border-dark/15 transition-all duration-200 animate-fade-up"
      style={{ animationDelay: `${index * 0.06}s`, opacity: 0 }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark/5 flex items-center justify-center text-lg flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-dark font-bold text-[14px] leading-snug group-hover:text-navy transition-colors">
              {measure.name}
            </h3>
            <p className="text-dark/40 text-[11px] mt-0.5">
              {MEASURE_CATEGORY_LABELS[measure.category]}
            </p>
          </div>
        </div>
        {/* ステータスバッジ */}
        <span
          className="flex-shrink-0 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg"
          style={{ color: statusStyle.text, backgroundColor: statusStyle.bg }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: statusStyle.dot }}
          />
          {MEASURE_STATUS_LABELS[measure.status]}
        </span>
      </div>

      <p className="text-dark/50 text-[12px] leading-relaxed line-clamp-2 mb-4">
        {measure.description}
      </p>

      {/* 期間・担当 */}
      <div className="flex items-center gap-4 mb-4 text-[11px] text-dark/40">
        <span>
          📅{" "}
          {QUARTERS.find((q) => q.key === measure.startQuarter)?.label} →{" "}
          {endLabel}
        </span>
        <span>👤 {measure.owner.split(" ")[1]}</span>
      </div>

      {/* 効果サマリー */}
      {effect ? (
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-dark/6">
          <EffectStat
            label="総合スコア"
            value={effect.overallScoreDiff}
            unit="pt"
          />
          <EffectStat
            label="主カテゴリ"
            value={
              effect.categoryDiffs[measure.category] ??
              Math.max(...Object.values(effect.categoryDiffs))
            }
            unit="pt"
          />
          <EffectStat
            label="離職率"
            value={effect.turnoverRateDiff}
            unit="pt"
            invert
          />
        </div>
      ) : (
        <div className="pt-3 border-t border-dark/6">
          <p className="text-dark/30 text-[11px]">効果データ集計中...</p>
        </div>
      )}

      <div className="flex justify-end mt-3">
        <span className="flex items-center gap-1 text-[11px] text-navy/50 group-hover:text-navy transition-colors">
          詳細を見る
          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

function EffectStat({
  label,
  value,
  unit,
  invert = false,
}: {
  label: string;
  value: number;
  unit: string;
  invert?: boolean;
}) {
  const isPositive = invert ? value < 0 : value > 0;
  const isNegative = invert ? value > 0 : value < 0;
  const color = isPositive ? "#16A34A" : isNegative ? "#CC0000" : "#94A3B8";
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className="text-center">
      <p className="text-dark/35 text-[10px] mb-0.5">{label}</p>
      <div className="flex items-center justify-center gap-0.5">
        <Icon size={11} style={{ color }} />
        <span className="font-bold text-[13px] font-outfit" style={{ color }}>
          {value > 0 ? "+" : ""}
          {value}
          {unit}
        </span>
      </div>
    </div>
  );
}
