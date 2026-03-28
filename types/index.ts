export type QuarterKey =
  | "FY25_1Q"
  | "FY25_2Q"
  | "FY25_3Q"
  | "FY25_4Q"
  | "FY26_1Q"
  | "FY26_2Q";

export interface Quarter {
  key: QuarterKey;
  label: string;
  period: string;
}

export interface Question {
  id: string;
  category: string;
  text: string;
  icon: string;
}

export interface CategoryScore {
  category: string;
  score: number; // 0-100
}

export interface QuarterData {
  quarter: QuarterKey;
  label: string;
  period: string;
  totalScore: number; // 0-100
  turnoverRate: number; // %
  respondents: number;
  categoryScores: Record<string, number>; // category id -> 0-100
  activeMeasures: string[]; // 実施中の施策IDリスト
}

export interface SurveyAnswer {
  questionId: string;
  score: number; // 1-5
}

export interface SurveySubmission {
  id: string;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  quarter: QuarterKey;
  submittedAt: string;
  answers: SurveyAnswer[];
  totalScore: number;
}

export type ScoreLevel = "good" | "caution" | "warning" | "danger";
