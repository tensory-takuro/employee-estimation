"use client";

import { QUARTER_DATA } from "@/lib/dummyData";
import { MEASURES, MEASURE_EFFECTS, SAMPLE_AI_REPORT } from "@/lib/measureData";
import { estimateTurnoverImpact } from "@/lib/measureAnalysis";
import { IMPACT_COLORS } from "@/lib/measureAnalysis";
import MeasureTimeline from "@/components/admin/MeasureTimeline";
import CorrelationHeatmap from "@/components/admin/CorrelationHeatmap";
import {
  FlaskConical, Sparkles, TrendingDown,
  AlertTriangle, CheckCircle2, ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function AnalysisPage() {
  // 離職率推計
  const scoreDiff = QUARTER_DATA[QUARTER_DATA.length - 1].totalScore
    - QUARTER_DATA[0].totalScore;
  const regression = estimateTurnoverImpact(QUARTER_DATA, scoreDiff);

  const report = SAMPLE_AI_REPORT;

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-2 animate-fade-up">
        <div className="w-10 h-10 rounded-xl bg-dark/8 flex items-center justify-center">
          <FlaskConical size={20} className="text-navy" />
        </div>
        <div>
          <h1 className="text-dark text-xl font-bold">施策影響分析</h1>
          <p className="text-dark/45 text-xs">
            施策と従業員満足度・離職率の相関を多角的に分析
          </p>
        </div>
      </div>

      {/* 施策タイムライン */}
      <div className="animate-fade-up stagger-1">
        <MeasureTimeline data={QUARTER_DATA} measures={MEASURES} />
      </div>

      {/* 相関ヒートマップ */}
      <div className="animate-fade-up stagger-2">
        <CorrelationHeatmap measures={MEASURES} effects={MEASURE_EFFECTS} />
      </div>

      {/* 離職率推計 */}
      <div className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm animate-fade-up stagger-3">
        <div className="flex items-center gap-2 mb-5">
          <TrendingDown size={16} className="text-danger" />
          <h3 className="text-dark font-bold text-base">離職率への影響推計（線形回帰）</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-dark/[0.025] rounded-xl p-4 text-center">
            <p className="text-dark/40 text-[11px] mb-1">満足度スコア改善幅</p>
            <p className="text-dark text-3xl font-bold font-outfit">
              +{scoreDiff}<span className="text-sm text-dark/40 ml-1">pt</span>
            </p>
            <p className="text-dark/30 text-[10px] mt-1">FY25 1Q → FY26 2Q</p>
          </div>
          <div className="bg-dark/[0.025] rounded-xl p-4 text-center">
            <p className="text-dark/40 text-[11px] mb-1">推計離職率低下</p>
            <p className="text-danger text-3xl font-bold font-outfit">
              {regression.estimated}
              <span className="text-sm text-dark/40 ml-1">%</span>
            </p>
            <p className="text-dark/30 text-[10px] mt-1">
              回帰係数: {regression.coefficient} / R²: {regression.r2}
            </p>
          </div>
          <div className="bg-dark/[0.025] rounded-xl p-4 text-center">
            <p className="text-dark/40 text-[11px] mb-1">実測値との乖離</p>
            <p className="text-caution text-3xl font-bold font-outfit">
              {(
                (QUARTER_DATA[QUARTER_DATA.length - 1].turnoverRate -
                  QUARTER_DATA[0].turnoverRate) -
                regression.estimated
              ).toFixed(2)}
              <span className="text-sm text-dark/40 ml-1">%</span>
            </p>
            <p className="text-dark/30 text-[10px] mt-1">外部要因の影響分</p>
          </div>
        </div>
        <p className="text-dark/35 text-[11px] mt-4 bg-dark/[0.02] rounded-xl p-3 leading-relaxed">
          ⚠️ 線形回帰による統計的推計です。相関関係を示すものであり、因果関係を証明するものではありません。
          景気変動・競合採用状況など外部要因は考慮されていません。
        </p>
      </div>

      {/* AI総合レポート */}
      <div className="bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden animate-fade-up stagger-4">
        <div className="bg-gradient-to-r from-dark to-navy p-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center">
              <Sparkles size={16} className="text-gold" />
            </div>
            <h3 className="text-white font-bold text-base">AI 総合推察レポート</h3>
          </div>
          <p className="text-white/40 text-[11px]">
            Gemini による施策効果の総合分析（サンプルデータ）
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* 総合評価 */}
          <div>
            <p className="text-dark/40 text-[11px] font-bold tracking-wider uppercase mb-2">
              総合評価
            </p>
            <p className="text-dark/75 text-sm leading-relaxed bg-dark/[0.02] rounded-xl p-4">
              {report.overallAssessment}
            </p>
          </div>

          {/* 施策別評価 */}
          <div>
            <p className="text-dark/40 text-[11px] font-bold tracking-wider uppercase mb-3">
              施策別影響評価
            </p>
            <div className="space-y-3">
              {report.measureInsights.map((insight) => {
                const measure = MEASURES.find((m) => m.id === insight.measureId);
                if (!measure) return null;
                const color = IMPACT_COLORS[insight.impact];
                return (
                  <Link
                    key={insight.measureId}
                    href={`/admin/measures/${insight.measureId}`}
                    className="flex items-start gap-3 p-4 rounded-xl border border-dark/6 hover:border-dark/15 hover:bg-dark/[0.015] transition-all group"
                  >
                    <span className="text-lg mt-0.5 flex-shrink-0">
                      {measure ? measure.name[0] : "?"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-dark font-bold text-[13px]">
                          {measure?.name}
                        </span>
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
                          style={{ color, backgroundColor: `${color}18` }}
                        >
                          影響度:{" "}
                          {insight.impact === "high"     ? "高"
                           : insight.impact === "medium" ? "中"
                           : insight.impact === "low"    ? "低"
                           : "不確実"}
                        </span>
                      </div>
                      <p className="text-dark/55 text-[12px] leading-relaxed mb-1">
                        {insight.summary}
                      </p>
                      <p className="text-navy text-[11px] font-medium">{insight.evidence}</p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-dark/25 group-hover:text-dark/50 mt-1 flex-shrink-0 transition-colors"
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 推奨施策 */}
          <div>
            <p className="text-dark/40 text-[11px] font-bold tracking-wider uppercase mb-3">
              次期推奨施策
            </p>
            <div className="space-y-2">
              {report.recommendations.map((rec) => (
                <div
                  key={rec.priority}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark/[0.025]"
                >
                  <div className="w-7 h-7 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-gold font-bold text-[13px] font-outfit">
                      {rec.priority}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-dark font-bold text-[13px]">{rec.action}</p>
                    <p className="text-dark/45 text-[11px]">
                      対象: {rec.targetCategory} ／ 期待効果: {rec.expectedEffect}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* リスク */}
          <div>
            <p className="text-dark/40 text-[11px] font-bold tracking-wider uppercase mb-3">
              注意すべきリスク
            </p>
            <div className="space-y-2">
              {report.risks.map((risk, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-warning/[0.06]">
                  <AlertTriangle size={13} className="text-warning mt-0.5 flex-shrink-0" />
                  <p className="text-dark/65 text-[12px] leading-relaxed">{risk}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
