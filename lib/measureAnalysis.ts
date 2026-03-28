import { QuarterData } from "@/types";
import { Measure, MeasureEffect } from "@/types/measure";
import { QUARTERS } from "./dummyData";

// ─── 施策の前後差分を計算 ──────────────────────────────────────────────────
export function calcMeasureEffect(
  measure: Measure,
  quarterData: QuarterData[],
  allMeasures: Measure[]
): MeasureEffect {
  const startIdx = quarterData.findIndex((q) => q.quarter === measure.startQuarter);
  const baselineIdx = Math.max(0, startIdx - 1);
  const latestIdx = quarterData.length - 1;

  const baseline = quarterData[baselineIdx];
  const latest = quarterData[latestIdx];

  const categoryDiffs = Object.fromEntries(
    Object.keys(baseline.categoryScores).map((cat) => [
      cat,
      (latest.categoryScores[cat] ?? 0) - (baseline.categoryScores[cat] ?? 0),
    ])
  );

  // 交絡因子（同時期に実施されていた他施策）
  const confounding = quarterData
    .slice(baselineIdx + 1)
    .flatMap((q) => (q as any).activeMeasures ?? [])
    .filter((id: string) => id !== measure.id);
  const uniqueConfounding = [...new Set(confounding)] as string[];

  const confidence: MeasureEffect["confidence"] =
    uniqueConfounding.length === 0 ? "high" :
    uniqueConfounding.length <= 2  ? "medium" : "low";

  return {
    measureId: measure.id,
    evaluationQuarter: latest.quarter,
    baselineQuarter: baseline.quarter,
    overallScoreDiff: latest.totalScore - baseline.totalScore,
    categoryDiffs,
    turnoverRateDiff: latest.turnoverRate - baseline.turnoverRate,
    confidence,
    confoundingMeasures: uniqueConfounding,
    aiComment: null,
  };
}

// ─── 施策×カテゴリ 相関マトリクスを生成 ──────────────────────────────────
export function buildCorrelationMatrix(
  effects: MeasureEffect[],
  measures: Measure[]
): { measureName: string; diffs: Record<string, number> }[] {
  return measures.map((m) => {
    const effect = effects.find((e) => e.measureId === m.id);
    return {
      measureName: m.name,
      diffs: effect?.categoryDiffs ?? {},
    };
  });
}

// ─── 離職率への影響推計（線形回帰） ──────────────────────────────────────
export function estimateTurnoverImpact(
  historicalData: QuarterData[],
  scoreDiff: number
): { estimated: number; coefficient: number; r2: number } {
  const n = historicalData.length;
  if (n < 2) return { estimated: 0, coefficient: 0, r2: 0 };

  const xs = historicalData.map((d) => d.totalScore);
  const ys = historicalData.map((d) => d.turnoverRate);
  const xMean = xs.reduce((a, b) => a + b, 0) / n;
  const yMean = ys.reduce((a, b) => a + b, 0) / n;

  const ssXY = xs.reduce((s, x, i) => s + (x - xMean) * (ys[i] - yMean), 0);
  const ssXX = xs.reduce((s, x) => s + Math.pow(x - xMean, 2), 0);
  const ssYY = ys.reduce((s, y) => s + Math.pow(y - yMean, 2), 0);

  const a = ssXX !== 0 ? ssXY / ssXX : 0;
  const b = yMean - a * xMean;
  const r2 = ssXX !== 0 && ssYY !== 0 ? Math.pow(ssXY, 2) / (ssXX * ssYY) : 0;

  return {
    estimated: parseFloat((a * scoreDiff).toFixed(2)),
    coefficient: parseFloat(a.toFixed(4)),
    r2: parseFloat(r2.toFixed(3)),
  };
}

// ─── ウォーターフォールチャート用データ生成 ──────────────────────────────
export function buildWaterfallData(
  categoryDiffs: Record<string, number>,
  categoryLabels: Record<string, string>
): { name: string; value: number; fill: string }[] {
  return Object.entries(categoryDiffs)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      name: categoryLabels[key] ?? key,
      value,
      fill: value >= 8 ? "#16A34A"
          : value >= 4 ? "#5DADE2"
          : value >= 0 ? "#C8A951"
          : "#CC0000",
    }));
}

// ─── 施策ステータス色 ─────────────────────────────────────────────────────
export const MEASURE_STATUS_COLORS = {
  planning:  { bg: "#1E3A5F18", text: "#1E3A5F", dot: "#1E3A5F" },
  active:    { bg: "#16A34A15", text: "#16A34A", dot: "#16A34A" },
  completed: { bg: "#D9770615", text: "#D97706", dot: "#D97706" },
  suspended: { bg: "#CC000015", text: "#CC0000", dot: "#CC0000" },
};

// ─── 施策の影響度カラー ───────────────────────────────────────────────────
export const IMPACT_COLORS = {
  high:      "#16A34A",
  medium:    "#D97706",
  low:       "#5DADE2",
  uncertain: "#94A3B8",
};

// ─── 施策カテゴリアイコン（絵文字） ──────────────────────────────────────
export const MEASURE_CATEGORY_ICONS: Record<string, string> = {
  work_life_balance: "⚖️",
  career_growth:     "📈",
  relationships:     "🤝",
  fulfillment:       "✨",
  compensation:      "💰",
  culture:           "🏢",
  management:        "👥",
  recognition:       "🏆",
  environment:       "🌿",
  communication:     "💬",
  cross:             "🔗",
};

// ─── 四半期ラベルから表示用 period を取得 ────────────────────────────────
export function getQuarterLabel(key: string): string {
  return QUARTERS.find((q) => q.key === key)?.label ?? key;
}
