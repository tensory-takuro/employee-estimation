import { QuarterKey } from "./index";

export type MeasureCategory =
  | "work_life_balance"
  | "career_growth"
  | "relationships"
  | "fulfillment"
  | "compensation"
  | "culture"
  | "management"
  | "recognition"
  | "environment"
  | "communication"
  | "cross";

export const MEASURE_CATEGORY_LABELS: Record<MeasureCategory, string> = {
  work_life_balance: "ワークライフバランス",
  career_growth:     "キャリア成長",
  relationships:     "職場の人間関係",
  fulfillment:       "仕事のやりがい",
  compensation:      "給与・待遇",
  culture:           "企業文化",
  management:        "マネジメント",
  recognition:       "評価・承認",
  environment:       "職場環境",
  communication:     "コミュニケーション",
  cross:             "横断的施策",
};

export type MeasureStatus = "planning" | "active" | "completed" | "suspended";

export const MEASURE_STATUS_LABELS: Record<MeasureStatus, string> = {
  planning:  "計画中",
  active:    "実施中",
  completed: "完了",
  suspended: "中断",
};

export type MeasureCost = "low" | "medium" | "high";

export const MEASURE_COST_LABELS: Record<MeasureCost, string> = {
  low:    "低",
  medium: "中",
  high:   "高",
};

export interface Measure {
  id: string;
  name: string;
  description: string;
  category: MeasureCategory;
  relatedCategories: MeasureCategory[];
  startQuarter: QuarterKey;
  endQuarter: QuarterKey | null;
  targetScore: number | null;
  targetTurnoverRate: number | null;
  status: MeasureStatus;
  owner: string;
  cost: MeasureCost;
  createdAt: string;
}

export interface MeasureEffect {
  measureId: string;
  evaluationQuarter: QuarterKey;
  baselineQuarter: QuarterKey;
  overallScoreDiff: number;
  categoryDiffs: Record<string, number>;
  turnoverRateDiff: number;
  confidence: "low" | "medium" | "high";
  confoundingMeasures: string[];
  aiComment: string | null;
}

export interface MeasureInsight {
  measureId: string;
  impact: "high" | "medium" | "low" | "uncertain";
  summary: string;
  evidence: string;
}

export interface MeasureRecommendation {
  priority: number;
  action: string;
  targetCategory: MeasureCategory;
  expectedEffect: string;
}

export interface MeasureAnalysisReport {
  generatedAt: string;
  quarters: QuarterKey[];
  overallAssessment: string;
  measureInsights: MeasureInsight[];
  recommendations: MeasureRecommendation[];
  risks: string[];
}
