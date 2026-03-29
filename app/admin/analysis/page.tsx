"use client";

import { useState } from "react";
import { QUARTER_DATA } from "@/lib/dummyData";
import { MEASURES, MEASURE_EFFECTS, SAMPLE_AI_REPORT } from "@/lib/measureData";
import { estimateTurnoverImpact, IMPACT_COLORS } from "@/lib/measureAnalysis";
import { MeasureAnalysisReport } from "@/types/measure";
import CorrelationHeatmap from "@/components/admin/CorrelationHeatmap";
import {
  FlaskConical, Sparkles, TrendingDown,
  AlertTriangle, ChevronRight, RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function AnalysisPage() {
  const scoreDiff = QUARTER_DATA[QUARTER_DATA.length - 1].totalScore
    - QUARTER_DATA[0].totalScore;
  const regression = estimateTurnoverImpact(QUARTER_DATA, scoreDiff);

  const [report, setReport] = useState<MeasureAnalysisReport>(SAMPLE_AI_REPORT);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  async function runAiAnalysis() {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/measure-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measures: MEASURES,
          effects: MEASURE_EFFECTS,
          quarterData: QUARTER_DATA,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data: MeasureAnalysisReport = await res.json();
      setReport(data);
      setIsAiGenerated(true);
    } catch {
      setAiError("AI分析でエラーが発生しました。APIキーを確認してください。");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-2 animate-fade-up">
        <div className="w-10 h-10 rounded-xl bg-dark/8 flex items-center justify-center">
          <FlaskConical size={20} className="text-navy" />
        </div>
        <div>
          <h1 className="text-dark text-xl font-bold">施策影響分析</h1>
          <p className="text-dark/45 text-xs">施策と従業員満足度・離職率の相関を多角的に分析</p>
        </div>
      </div>

      {/* 相関ヒートマップ */}
      <div className="animate-fade-up stagger-1">
        <CorrelationHeatmap measures={MEASURES} effects={MEASURE_EFFECTS} />
      </div>

      {/* 離職率推計 */}
      <div className="bg-white rounded-2xl border border-dark/8 p-5 shadow-sm animate-fade-up stagger-2">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown size={15} className="text-danger" />
          <h3 className="text-dark font-bold text-sm">離職率への影響推計（線形回帰）</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark/[0.025] rounded-xl p-3 text-center">
            <p className="text-dark/40 text-[10px] mb-1">満足度改善幅</p>
            <p className="text-dark text-2xl font-bold font-outfit">+{scoreDiff}<span className="text-xs text-dark/40 ml-1">pt</span></p>
            <p className="text-dark/30 text-[10px] mt-0.5">FY25 1Q → FY26 2Q</p>
          </div>
          <div className="bg-dark/[0.025] rounded-xl p-3 text-center">
            <p className="text-dark/40 text-[10px] mb-1">推計離職率低下</p>
            <p className="text-danger text-2xl font-bold font-outfit">{regression.estimated}<span className="text-xs text-dark/40 ml-1">%</span></p>
            <p className="text-dark/30 text-[10px] mt-0.5">R²: {regression.r2}</p>
          </div>
          <div className="bg-dark/[0.025] rounded-xl p-3 text-center">
            <p className="text-dark/40 text-[10px] mb-1">外部要因による乖離</p>
            <p className="text-caution text-2xl font-bold font-outfit">
              {((QUARTER_DATA[QUARTER_DATA.length - 1].turnoverRate - QUARTER_DATA[0].turnoverRate) - regression.estimated).toFixed(2)}
              <span className="text-xs text-dark/40 ml-1">%</span>
            </p>
            <p className="text-dark/30 text-[10px] mt-0.5">実測値との差</p>
          </div>
        </div>
        <p className="text-dark/30 text-[10px] mt-3">⚠️ 統計的推計。相関を示すものであり因果関係の証明ではありません。</p>
      </div>

      {/* AI総合レポート */}
      <div className="bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden animate-fade-up stagger-3">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-dark to-navy px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gold/20 flex items-center justify-center">
              <Sparkles size={14} className="text-gold" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">AI 総合推察レポート</h3>
              <p className="text-white/40 text-[10px]">
                {isAiGenerated ? "Gemini 最新分析" : "サンプル表示中"}
              </p>
            </div>
          </div>
          <button
            onClick={runAiAnalysis}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {aiLoading
              ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <RefreshCw size={11} />}
            {aiLoading ? "分析中..." : isAiGenerated ? "再分析" : "AI分析を実行"}
          </button>
        </div>

        {aiError && (
          <div className="flex items-center gap-2 mx-5 mt-3 bg-danger/8 rounded-xl px-3 py-2">
            <AlertTriangle size={12} className="text-danger flex-shrink-0" />
            <p className="text-danger text-[11px]">{aiError}</p>
          </div>
        )}
        {aiLoading && (
          <div className="flex items-center gap-2 px-5 py-3">
            <div className="w-3.5 h-3.5 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="text-dark/40 text-[11px]">Gemini が全施策データを統合分析中...</p>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* 総合評価（1行サマリー） */}
          <p className="text-dark/70 text-[13px] leading-relaxed border-l-2 border-gold pl-3">
            {report.overallAssessment}
          </p>

          {/* 施策別影響（コンパクト一覧） */}
          <div>
            <p className="text-dark/40 text-[10px] font-bold tracking-wider uppercase mb-2">施策別影響度</p>
            <div className="divide-y divide-dark/[0.04]">
              {report.measureInsights.map((insight) => {
                const measure = MEASURES.find((m) => m.id === insight.measureId);
                if (!measure) return null;
                const color = IMPACT_COLORS[insight.impact];
                return (
                  <Link
                    key={insight.measureId}
                    href={`/admin/measures/${insight.measureId}`}
                    className="flex items-center gap-3 py-2.5 hover:bg-dark/[0.015] -mx-1 px-1 rounded-lg transition-colors group"
                  >
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 w-8 text-center"
                      style={{ color, backgroundColor: `${color}15` }}
                    >
                      {insight.impact === "high" ? "高" : insight.impact === "medium" ? "中" : insight.impact === "low" ? "低" : "?"}
                    </span>
                    <span className="text-dark font-medium text-[12px] flex-shrink-0 w-36 truncate">{measure.name}</span>
                    <span className="text-dark/50 text-[11px] leading-snug flex-1 min-w-0 truncate">{insight.evidence}</span>
                    <ChevronRight size={12} className="text-dark/20 group-hover:text-dark/40 flex-shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 次期推奨施策 + リスク（横並び） */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <p className="text-dark/40 text-[10px] font-bold tracking-wider uppercase mb-2">次期推奨施策</p>
              <div className="space-y-1.5">
                {report.recommendations.map((rec) => (
                  <div key={rec.priority} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-gold/15 text-gold font-bold text-[10px] font-outfit flex items-center justify-center flex-shrink-0">{rec.priority}</span>
                    <p className="text-dark/70 text-[12px]">{rec.action}
                      <span className="text-dark/35 ml-1">— {rec.expectedEffect}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-dark/40 text-[10px] font-bold tracking-wider uppercase mb-2">注意リスク</p>
              <div className="space-y-1.5">
                {report.risks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <AlertTriangle size={11} className="text-warning mt-0.5 flex-shrink-0" />
                    <p className="text-dark/55 text-[11px] leading-snug">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
