"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MEASURES, MEASURE_EFFECTS } from "@/lib/measureData";
import { QUARTER_DATA, QUARTERS } from "@/lib/dummyData";
import { questions } from "@/lib/questions";
import {
  MEASURE_CATEGORY_LABELS,
  MEASURE_STATUS_LABELS,
  MEASURE_COST_LABELS,
  MeasureAnalysisReport,
} from "@/types/measure";
import {
  MEASURE_STATUS_COLORS,
  MEASURE_CATEGORY_ICONS,
  IMPACT_COLORS,
  buildWaterfallData,
} from "@/lib/measureAnalysis";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import {
  ArrowLeft, TrendingUp, TrendingDown, AlertTriangle,
  Clock, User, DollarSign, Target, Sparkles, RefreshCw,
} from "lucide-react";

export default function MeasureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const measure = MEASURES.find((m) => m.id === id);
  if (!measure) notFound();

  const effect = MEASURE_EFFECTS.find((e) => e.measureId === id);
  const statusStyle = MEASURE_STATUS_COLORS[measure.status];

  // AI分析の状態管理
  const [aiReport, setAiReport] = useState<MeasureAnalysisReport | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function runAiAnalysis() {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/measure-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measures: [measure],
          effects: effect ? [effect] : [],
          quarterData: QUARTER_DATA,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data: MeasureAnalysisReport = await res.json();
      setAiReport(data);
    } catch (e) {
      setAiError("AI分析でエラーが発生しました。APIキーを確認してください。");
    } finally {
      setAiLoading(false);
    }
  }

  const aiInsight = aiReport?.measureInsights.find((i) => i.measureId === id);

  // ウォーターフォール用データ
  const categoryLabels = Object.fromEntries(
    questions.map((q) => [q.id, q.category])
  );
  const waterfallData = effect
    ? buildWaterfallData(effect.categoryDiffs, categoryLabels)
    : [];

  // 期間中の四半期データ
  const startIdx = QUARTER_DATA.findIndex((q) => q.quarter === measure.startQuarter);
  const endKey = measure.endQuarter ?? "FY26_2Q";
  const endIdx = QUARTER_DATA.findIndex((q) => q.quarter === endKey);
  const periodData = QUARTER_DATA.slice(
    Math.max(0, startIdx - 1),
    endIdx + 1
  );

  // 関連カテゴリのスコア推移
  const trendData = periodData.map((qd) => ({
    name: qd.label,
    [measure.category]: qd.categoryScores[measure.category],
    総合: qd.totalScore,
    離職率: qd.turnoverRate,
  }));

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* 戻るボタン */}
      <Link
        href="/admin/measures"
        className="inline-flex items-center gap-2 text-dark/45 hover:text-dark text-sm mb-6 transition-colors animate-fade-up"
      >
        <ArrowLeft size={15} />
        施策一覧に戻る
      </Link>

      {/* ヘッダー */}
      <div className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm mb-6 animate-fade-up stagger-1">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-dark/5 flex items-center justify-center text-2xl">
              {MEASURE_CATEGORY_ICONS[measure.category]}
            </div>
            <div>
              <h1 className="text-dark text-2xl font-bold mb-1">{measure.name}</h1>
              <p className="text-dark/45 text-sm">
                {MEASURE_CATEGORY_LABELS[measure.category]}
              </p>
            </div>
          </div>
          <span
            className="flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-xl"
            style={{ color: statusStyle.text, backgroundColor: statusStyle.bg }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusStyle.dot }} />
            {MEASURE_STATUS_LABELS[measure.status]}
          </span>
        </div>

        <p className="text-dark/55 text-sm leading-relaxed mt-4 mb-5">
          {measure.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <InfoChip icon={<Clock size={13} />} label="実施期間">
            {QUARTERS.find((q) => q.key === measure.startQuarter)?.label} →{" "}
            {measure.endQuarter
              ? QUARTERS.find((q) => q.key === measure.endQuarter)?.label
              : "継続中"}
          </InfoChip>
          <InfoChip icon={<User size={13} />} label="担当者">
            {measure.owner}
          </InfoChip>
          <InfoChip icon={<DollarSign size={13} />} label="コスト感">
            {MEASURE_COST_LABELS[measure.cost]}
          </InfoChip>
          <InfoChip icon={<Target size={13} />} label="目標スコア">
            {measure.targetScore ?? "—"}{measure.targetScore ? " pt" : ""}
          </InfoChip>
        </div>
      </div>

      {/* 効果サマリーカード */}
      {effect && (
        <div className="grid grid-cols-3 gap-4 mb-6 animate-fade-up stagger-2">
          <EffectCard
            label="総合スコア変化"
            value={effect.overallScoreDiff}
            unit="pt"
            sub={`${QUARTERS.find((q) => q.key === effect.baselineQuarter)?.label} → ${QUARTERS.find((q) => q.key === effect.evaluationQuarter)?.label}`}
          />
          <EffectCard
            label={`${MEASURE_CATEGORY_LABELS[measure.category]}スコア変化`}
            value={effect.categoryDiffs[measure.category] ?? 0}
            unit="pt"
            sub="主カテゴリ"
          />
          <EffectCard
            label="離職率変化"
            value={effect.turnoverRateDiff}
            unit="%"
            invert
            sub={`信頼度: ${effect.confidence === "high" ? "高" : effect.confidence === "medium" ? "中" : "低"}`}
          />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* カテゴリ別スコア変化（ウォーターフォール） */}
        {waterfallData.length > 0 && (
          <div className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm animate-fade-up stagger-3">
            <h3 className="text-dark font-bold text-sm mb-1">
              カテゴリ別スコア変化
            </h3>
            <p className="text-dark/40 text-xs mb-4">
              施策前後の差分（+ = 改善 / - = 悪化）
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={waterfallData}
                layout="vertical"
                margin={{ top: 0, right: 40, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#0D1B3E08" horizontal={false} />
                <XAxis
                  type="number"
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tick={{ fontSize: 11, fill: "#0D1B3E50" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#0D1B3E70" }}
                  axisLine={false}
                  tickLine={false}
                  width={88}
                />
                <ReferenceLine x={0} stroke="#0D1B3E20" />
                <Tooltip
                  formatter={(v) => [`${Number(v) > 0 ? "+" : ""}${v} pt`, "変化"]}
                  contentStyle={{
                    backgroundColor: "#0D1B3Ef5",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "white",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                  {waterfallData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI推察レポート */}
        <div className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm animate-fade-up stagger-4">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center">
                <Sparkles size={15} className="text-gold" />
              </div>
              <div>
                <h3 className="text-dark font-bold text-sm">AI 推察レポート</h3>
                <p className="text-dark/35 text-[10px]">Gemini による施策効果の分析</p>
              </div>
            </div>
            <button
              onClick={runAiAnalysis}
              disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold bg-dark text-white hover:bg-navy transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-dark/15"
            >
              {aiLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <RefreshCw size={12} />
              )}
              {aiLoading ? "分析中..." : aiReport ? "再分析" : "AI分析を実行"}
            </button>
          </div>

          {aiLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <p className="text-dark/40 text-xs">Gemini が施策データを分析中...</p>
            </div>
          )}

          {aiError && !aiLoading && (
            <div className="flex items-start gap-2 bg-danger/8 rounded-xl p-4">
              <AlertTriangle size={14} className="text-danger mt-0.5 flex-shrink-0" />
              <p className="text-danger text-[12px] leading-relaxed">{aiError}</p>
            </div>
          )}

          {!aiLoading && !aiError && aiInsight && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-dark/50 text-xs">影響度評価:</span>
                <span
                  className="text-[12px] font-bold px-3 py-1 rounded-lg"
                  style={{
                    color: IMPACT_COLORS[aiInsight.impact],
                    backgroundColor: `${IMPACT_COLORS[aiInsight.impact]}18`,
                  }}
                >
                  {aiInsight.impact === "high"     ? "高"
                   : aiInsight.impact === "medium" ? "中"
                   : aiInsight.impact === "low"    ? "低"
                   : "不確実"}
                </span>
              </div>
              <div className="bg-dark/[0.025] rounded-xl p-4">
                <p className="text-dark/70 text-sm leading-relaxed">{aiInsight.summary}</p>
              </div>
              <div>
                <p className="text-dark/40 text-[11px] font-bold tracking-wider uppercase mb-1.5">根拠となる数値</p>
                <p className="text-navy text-[12px] font-medium">{aiInsight.evidence}</p>
              </div>
              {aiReport?.recommendations && aiReport.recommendations.length > 0 && (
                <div>
                  <p className="text-dark/40 text-[11px] font-bold tracking-wider uppercase mb-2">次期推奨施策</p>
                  {aiReport.recommendations.slice(0, 2).map((r) => (
                    <div key={r.priority} className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-md bg-gold/15 text-gold font-bold text-[10px] font-outfit flex items-center justify-center flex-shrink-0">{r.priority}</span>
                      <p className="text-dark/65 text-[12px]">{r.action}</p>
                    </div>
                  ))}
                </div>
              )}
              {effect && effect.confoundingMeasures.length > 0 && (
                <div className="flex items-start gap-2 bg-caution/8 rounded-xl p-3">
                  <AlertTriangle size={14} className="text-caution mt-0.5 flex-shrink-0" />
                  <p className="text-caution text-[11px] leading-relaxed">
                    同時期に{effect.confoundingMeasures.length}件の施策が並行実施されているため、単独効果の切り分けには不確実性があります。
                  </p>
                </div>
              )}
            </div>
          )}

          {!aiLoading && !aiError && !aiReport && (
            <div className="text-center py-8">
              <Sparkles size={28} className="mx-auto mb-3 text-gold/30" />
              <p className="text-dark/40 text-sm font-medium mb-1">「AI分析を実行」でGeminiが施策効果を分析します</p>
              <p className="text-dark/25 text-xs">施策データ・満足度推移・離職率変化を総合的に推察</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoChip({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-dark/[0.025] rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-dark/40 text-[10px] font-bold tracking-wider uppercase mb-1">
        {icon}
        {label}
      </div>
      <p className="text-dark text-[12px] font-medium">{children}</p>
    </div>
  );
}

function EffectCard({
  label,
  value,
  unit,
  sub,
  invert = false,
}: {
  label: string;
  value: number;
  unit: string;
  sub?: string;
  invert?: boolean;
}) {
  const isPositive = invert ? value < 0 : value > 0;
  const color = isPositive ? "#16A34A" : value === 0 ? "#94A3B8" : "#CC0000";
  const Icon = isPositive ? TrendingUp : value === 0 ? Clock : TrendingDown;

  return (
    <div className="bg-white rounded-2xl border border-dark/8 p-5 shadow-sm text-center">
      <p className="text-dark/45 text-[11px] font-semibold mb-2 leading-tight">{label}</p>
      <div className="flex items-center justify-center gap-1 mb-1">
        <Icon size={16} style={{ color }} />
        <span className="font-bold text-2xl font-outfit" style={{ color }}>
          {value > 0 ? "+" : ""}{value}{unit}
        </span>
      </div>
      {sub && <p className="text-dark/30 text-[10px]">{sub}</p>}
    </div>
  );
}
