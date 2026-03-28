import { ScoreLevel } from "@/types";
import { MAX_TOTAL_SCORE } from "./questions";

export function normalize(rawScore: number, maxScore = MAX_TOTAL_SCORE): number {
  return Math.round((rawScore / maxScore) * 100);
}

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 80) return "good";
  if (score >= 60) return "caution";
  if (score >= 40) return "warning";
  return "danger";
}

export const SCORE_COLORS: Record<ScoreLevel, string> = {
  good: "#16A34A",
  caution: "#D97706",
  warning: "#EA580C",
  danger: "#CC0000",
};

export const SCORE_LABELS_LEVEL: Record<ScoreLevel, string> = {
  good: "良好",
  caution: "注意",
  warning: "警告",
  danger: "危険",
};

export const CATEGORY_COLORS: string[] = [
  "#3B82F6", // ワークライフバランス - blue
  "#8B5CF6", // キャリア成長 - purple
  "#10B981", // 職場の人間関係 - emerald
  "#F59E0B", // 仕事のやりがい - amber
  "#EF4444", // 給与・待遇 - red
  "#06B6D4", // 企業文化 - cyan
  "#EC4899", // マネジメント - pink
  "#84CC16", // 評価・承認 - lime
  "#F97316", // 職場環境 - orange
  "#6366F1", // コミュニケーション - indigo
];
