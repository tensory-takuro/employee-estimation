import { Quarter, QuarterData, SurveySubmission, QuarterKey } from "@/types";

export const QUARTERS: Quarter[] = [
  { key: "FY25_1Q", label: "FY25 1Q", period: "2024年4〜6月" },
  { key: "FY25_2Q", label: "FY25 2Q", period: "2024年7〜9月" },
  { key: "FY25_3Q", label: "FY25 3Q", period: "2024年10〜12月" },
  { key: "FY25_4Q", label: "FY25 4Q", period: "2025年1〜3月" },
  { key: "FY26_1Q", label: "FY26 1Q", period: "2025年4〜6月" },
  { key: "FY26_2Q", label: "FY26 2Q", period: "2025年7〜9月" },
];

// カテゴリ別スコア（各 0-100）
// data-visualization ガイドラインに従い、推移が読み取れるリアルなダミーデータ
export const QUARTER_DATA: QuarterData[] = [
  {
    quarter: "FY25_1Q",
    label: "FY25 1Q",
    period: "2024年4〜6月",
    totalScore: 62,
    turnoverRate: 8.2,
    respondents: 112,
    categoryScores: {
      work_life_balance: 58,
      career_growth:     55,
      relationships:     70,
      fulfillment:       65,
      compensation:      50,
      culture:           68,
      management:        60,
      recognition:       55,
      environment:       72,
      communication:     63,
    },
  },
  {
    quarter: "FY25_2Q",
    label: "FY25 2Q",
    period: "2024年7〜9月",
    totalScore: 65,
    turnoverRate: 7.8,
    respondents: 118,
    categoryScores: {
      work_life_balance: 62,
      career_growth:     58,
      relationships:     72,
      fulfillment:       68,
      compensation:      52,
      culture:           70,
      management:        63,
      recognition:       58,
      environment:       74,
      communication:     66,
    },
  },
  {
    quarter: "FY25_3Q",
    label: "FY25 3Q",
    period: "2024年10〜12月",
    totalScore: 68,
    turnoverRate: 7.2,
    respondents: 124,
    categoryScores: {
      work_life_balance: 65,
      career_growth:     62,
      relationships:     75,
      fulfillment:       70,
      compensation:      55,
      culture:           72,
      management:        66,
      recognition:       62,
      environment:       76,
      communication:     69,
    },
  },
  {
    quarter: "FY25_4Q",
    label: "FY25 4Q",
    period: "2025年1〜3月",
    totalScore: 71,
    turnoverRate: 6.8,
    respondents: 130,
    categoryScores: {
      work_life_balance: 68,
      career_growth:     66,
      relationships:     78,
      fulfillment:       73,
      compensation:      58,
      culture:           75,
      management:        70,
      recognition:       65,
      environment:       78,
      communication:     72,
    },
  },
  {
    quarter: "FY26_1Q",
    label: "FY26 1Q",
    period: "2025年4〜6月",
    totalScore: 74,
    turnoverRate: 6.1,
    respondents: 135,
    categoryScores: {
      work_life_balance: 72,
      career_growth:     70,
      relationships:     81,
      fulfillment:       76,
      compensation:      62,
      culture:           78,
      management:        73,
      recognition:       68,
      environment:       80,
      communication:     75,
    },
  },
  {
    quarter: "FY26_2Q",
    label: "FY26 2Q",
    period: "2025年7〜9月",
    totalScore: 76,
    turnoverRate: 5.5,
    respondents: 140,
    categoryScores: {
      work_life_balance: 75,
      career_growth:     73,
      relationships:     83,
      fulfillment:       78,
      compensation:      65,
      culture:           80,
      management:        76,
      recognition:       71,
      environment:       82,
      communication:     77,
    },
  },
];

// ダミー個別回答データ
const departments = ["営業部", "開発部", "マーケティング部", "人事部", "経理部"];
const names = [
  "田中 太郎", "佐藤 花子", "鈴木 一郎", "高橋 美咲", "伊藤 健太",
  "渡辺 さくら", "山本 大輔", "中村 由美", "小林 浩二", "加藤 あや",
  "吉田 雄介", "山田 麻衣", "松本 誠", "井上 愛", "木村 翔",
];

function genAnswers(baseScore: number): { questionId: string; score: number }[] {
  const ids = [
    "work_life_balance", "career_growth", "relationships", "fulfillment",
    "compensation", "culture", "management", "recognition", "environment", "communication",
  ];
  return ids.map((id) => ({
    questionId: id,
    score: Math.min(5, Math.max(1, Math.round(baseScore / 20 + (Math.random() - 0.5)))),
  }));
}

export const DUMMY_SUBMISSIONS: SurveySubmission[] = QUARTER_DATA.flatMap((qd, qi) =>
  Array.from({ length: 15 }, (_, i) => {
    const base = qd.totalScore;
    const variance = Math.floor((Math.random() - 0.5) * 30);
    const score = Math.min(100, Math.max(20, base + variance));
    const answers = genAnswers(score);
    const rawScore = answers.reduce((s, a) => s + a.score, 0);
    return {
      id: `sub_${qi}_${i}`,
      employeeId: `EMP${String(100 + qi * 15 + i).padStart(4, "0")}`,
      employeeName: names[i % names.length],
      department: departments[i % departments.length],
      quarter: qd.quarter as QuarterKey,
      submittedAt: new Date(
        2024 + Math.floor(qi / 4),
        (qi % 4) * 3 + Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 28) + 1
      ).toISOString().split("T")[0],
      answers,
      totalScore: Math.round((rawScore / 50) * 100),
    };
  })
);
