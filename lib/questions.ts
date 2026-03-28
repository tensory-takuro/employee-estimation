import { Question } from "@/types";

export const questions: Question[] = [
  {
    id: "work_life_balance",
    category: "ワークライフバランス",
    text: "仕事と私生活のバランスは保てていますか？",
    icon: "⚖️",
  },
  {
    id: "career_growth",
    category: "キャリア成長",
    text: "成長・スキルアップの機会が十分にありますか？",
    icon: "📈",
  },
  {
    id: "relationships",
    category: "職場の人間関係",
    text: "同僚・チームとの関係は良好ですか？",
    icon: "🤝",
  },
  {
    id: "fulfillment",
    category: "仕事のやりがい",
    text: "現在の仕事にやりがいを感じていますか？",
    icon: "✨",
  },
  {
    id: "compensation",
    category: "給与・待遇",
    text: "給与・福利厚生に満足していますか？",
    icon: "💰",
  },
  {
    id: "culture",
    category: "企業文化",
    text: "会社のビジョン・文化に共感できますか？",
    icon: "🏢",
  },
  {
    id: "management",
    category: "マネジメント",
    text: "上司・マネジメントのサポートに満足していますか？",
    icon: "👥",
  },
  {
    id: "recognition",
    category: "評価・承認",
    text: "自分の成果や努力が適切に評価されていますか？",
    icon: "🏆",
  },
  {
    id: "environment",
    category: "職場環境",
    text: "職場の物理的・心理的な環境は快適ですか？",
    icon: "🌿",
  },
  {
    id: "communication",
    category: "コミュニケーション",
    text: "組織内の情報共有・コミュニケーションは円滑ですか？",
    icon: "💬",
  },
];

export const SCORE_LABELS: Record<number, string> = {
  1: "非常に不満",
  2: "やや不満",
  3: "どちらでもない",
  4: "やや満足",
  5: "非常に満足",
};

export const MAX_TOTAL_SCORE = questions.length * 5; // 50
