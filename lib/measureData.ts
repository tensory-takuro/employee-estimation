import { Measure, MeasureEffect, MeasureAnalysisReport } from "@/types/measure";

// ─── 施策サンプルデータ（FY25 1Q〜FY26 2Q） ───────────────────────────────
export const MEASURES: Measure[] = [
  {
    id: "m001",
    name: "フレックスタイム制度導入",
    description:
      "コアタイム（10〜15時）を設け、始業・終業を柔軟化。通勤混雑の回避と育児・介護との両立を支援する。",
    category: "work_life_balance",
    relatedCategories: ["fulfillment", "environment"],
    startQuarter: "FY25_1Q",
    endQuarter: null,
    targetScore: 70,
    targetTurnoverRate: 7.0,
    status: "active",
    owner: "人事部 田中部長",
    cost: "low",
    createdAt: "2024-04-01",
  },
  {
    id: "m002",
    name: "1on1ミーティング制度化",
    description:
      "全マネージャーと部下が隔週30分の1on1を実施。キャリア相談・業務課題・コンディション確認を目的とする。",
    category: "management",
    relatedCategories: ["communication", "recognition", "career_growth"],
    startQuarter: "FY25_2Q",
    endQuarter: null,
    targetScore: 75,
    targetTurnoverRate: 6.5,
    status: "active",
    owner: "組織開発室 佐藤マネージャー",
    cost: "low",
    createdAt: "2024-07-01",
  },
  {
    id: "m003",
    name: "社内勉強会・ナレッジシェア制度",
    description:
      "月2回の社内勉強会を制度化。業務スキル・業界知識・ツール活用など、従業員が講師役を担うLT形式で実施。",
    category: "career_growth",
    relatedCategories: ["communication", "relationships", "culture"],
    startQuarter: "FY25_2Q",
    endQuarter: "FY25_4Q",
    targetScore: 72,
    targetTurnoverRate: null,
    status: "completed",
    owner: "人事部 鈴木担当",
    cost: "low",
    createdAt: "2024-07-01",
  },
  {
    id: "m004",
    name: "オフィス環境リニューアル",
    description:
      "集中ブース・コラボスペース・リラックスゾーンの3エリアに執務空間を再編。スタンディングデスク導入。",
    category: "environment",
    relatedCategories: ["work_life_balance", "relationships"],
    startQuarter: "FY25_3Q",
    endQuarter: "FY25_3Q",
    targetScore: 78,
    targetTurnoverRate: null,
    status: "completed",
    owner: "総務部 高橋担当",
    cost: "high",
    createdAt: "2024-10-01",
  },
  {
    id: "m005",
    name: "評価制度の透明化・MBO導入",
    description:
      "目標管理制度（MBO）を全社導入。評価基準をドキュメント化・公開し、半期ごとに評価フィードバックを実施する。",
    category: "recognition",
    relatedCategories: ["compensation", "career_growth", "management"],
    startQuarter: "FY25_4Q",
    endQuarter: null,
    targetScore: 75,
    targetTurnoverRate: 6.0,
    status: "active",
    owner: "人事部 田中部長",
    cost: "medium",
    createdAt: "2025-01-01",
  },
  {
    id: "m006",
    name: "ミッション・バリュー策定・浸透活動",
    description:
      "全社でミッション・ビジョン・バリューを再定義。月次の全社会議・オンボーディングでの浸透活動を継続実施。",
    category: "culture",
    relatedCategories: ["fulfillment", "communication", "relationships"],
    startQuarter: "FY26_1Q",
    endQuarter: null,
    targetScore: 80,
    targetTurnoverRate: 5.5,
    status: "active",
    owner: "CEO室 伊藤担当",
    cost: "medium",
    createdAt: "2025-04-01",
  },
];

// ─── activeMeasures（四半期ごとの実施中施策IDリスト） ─────────────────────
export const ACTIVE_MEASURES_BY_QUARTER: Record<string, string[]> = {
  FY25_1Q: ["m001"],
  FY25_2Q: ["m001", "m002", "m003"],
  FY25_3Q: ["m001", "m002", "m004"],
  FY25_4Q: ["m001", "m002", "m005"],
  FY26_1Q: ["m001", "m002", "m005", "m006"],
  FY26_2Q: ["m001", "m002", "m005", "m006"],
};

// ─── 施策効果サンプルデータ（実測ベース差分） ──────────────────────────────
export const MEASURE_EFFECTS: MeasureEffect[] = [
  // m001: フレックスタイム → FY25_2Q 時点で評価（ベースライン: FY25_1Q前の想定値）
  {
    measureId: "m001",
    evaluationQuarter: "FY25_2Q",
    baselineQuarter: "FY25_1Q",
    overallScoreDiff: 3,
    categoryDiffs: {
      work_life_balance: +8,
      fulfillment:       +4,
      environment:       +3,
      career_growth:     +1,
      relationships:     +2,
      compensation:      +1,
      culture:           +1,
      management:        +1,
      recognition:       +1,
      communication:     +2,
    },
    turnoverRateDiff: -0.4,
    confidence: "medium",
    confoundingMeasures: ["m002", "m003"],
    aiComment:
      "フレックス導入はワークライフバランス（+8pt）への影響が最も顕著です。同時期に1on1やナレッジシェアも開始されており、満足度全体の底上げへの単独寄与度は中程度と推察されます。",
  },
  // m002: 1on1制度 → FY26_2Q 時点（ベースライン: FY25_1Q）
  {
    measureId: "m002",
    evaluationQuarter: "FY26_2Q",
    baselineQuarter: "FY25_1Q",
    overallScoreDiff: 9,
    categoryDiffs: {
      management:        +16,
      communication:     +14,
      recognition:       +13,
      career_growth:     +15,
      relationships:     +11,
      fulfillment:       +11,
      culture:           +10,
      work_life_balance: +10,
      environment:       +8,
      compensation:      +9,
    },
    turnoverRateDiff: -1.7,
    confidence: "medium",
    confoundingMeasures: ["m001", "m003", "m004", "m005", "m006"],
    aiComment:
      "1on1制度の継続実施はマネジメント（+16pt）・コミュニケーション（+14pt）・評価（+13pt）の3カテゴリで特に大きな改善と相関しています。FY25 2Q〜FY26 2Qにかけての離職率1.7pt低下との関連が最も強く示唆される施策です。",
  },
  // m004: オフィスリニューアル（単発施策）
  {
    measureId: "m004",
    evaluationQuarter: "FY25_4Q",
    baselineQuarter: "FY25_2Q",
    overallScoreDiff: 3,
    categoryDiffs: {
      environment:       +6,
      work_life_balance: +4,
      relationships:     +4,
      fulfillment:       +3,
      communication:     +3,
      management:        +2,
      career_growth:     +2,
      compensation:      +2,
      culture:           +3,
      recognition:       +2,
    },
    turnoverRateDiff: -0.3,
    confidence: "low",
    confoundingMeasures: ["m001", "m002", "m005"],
    aiComment:
      "環境改善施策（+6pt）の即効性は高いものの、同時期に1on1・評価制度改革も進行しており、単独効果の分離は困難です。物理的環境への投資は心理的安全性にも波及する可能性があります。",
  },
  // m005: 評価制度透明化
  {
    measureId: "m005",
    evaluationQuarter: "FY26_2Q",
    baselineQuarter: "FY25_3Q",
    overallScoreDiff: 5,
    categoryDiffs: {
      recognition:       +9,
      compensation:      +10,
      career_growth:     +7,
      management:        +8,
      fulfillment:       +6,
      culture:           +6,
      communication:     +5,
      work_life_balance: +4,
      relationships:     +4,
      environment:       +3,
    },
    turnoverRateDiff: -0.9,
    confidence: "medium",
    confoundingMeasures: ["m001", "m002", "m006"],
    aiComment:
      "MBO導入後、給与・待遇（+10pt）と評価・承認（+9pt）が大きく改善しました。「評価の透明性」が確保されたことで、金銭的報酬以上に心理的公平性への満足が高まったと推察されます。",
  },
];

// ─── AIレポートサンプルデータ ──────────────────────────────────────────────
export const SAMPLE_AI_REPORT: MeasureAnalysisReport = {
  generatedAt: "2025-09-30T09:00:00Z",
  quarters: ["FY25_1Q", "FY25_2Q", "FY25_3Q", "FY25_4Q", "FY26_1Q", "FY26_2Q"],
  overallAssessment:
    "FY25 1Q〜FY26 2Qにかけて総合満足度は62→76点（+14pt）、離職率は8.2→5.5%（-2.7pt）と継続的に改善しています。特に1on1制度・評価制度透明化の2施策が高い相関を示しており、「関係性の質」と「公平感」への投資が離職抑止に有効だったと推察されます。一方、給与・待遇カテゴリは全期間を通じて最低スコアにとどまっており、次期の重点施策候補です。",
  measureInsights: [
    {
      measureId: "m002",
      impact: "high",
      summary:
        "全6施策中で最も広範なカテゴリに正の影響を与えた施策。マネジメント・コミュニケーション・評価の3カテゴリで+13〜16ptの改善と強く相関。",
      evidence: "FY25 2Q→FY26 2Q: マネジメント 63→76 (+13pt)、離職率 7.8→5.5% (-2.3pt)",
    },
    {
      measureId: "m005",
      impact: "high",
      summary:
        "評価・承認と給与・待遇の両カテゴリで顕著な改善。透明性の向上が心理的公平感を高め、離職意向の低下に寄与したと推察。",
      evidence: "FY25 4Q→FY26 2Q: 評価 65→71 (+6pt)、給与 58→65 (+7pt)",
    },
    {
      measureId: "m001",
      impact: "medium",
      summary:
        "ワークライフバランスへの即効性は高い。継続施策として全期間通じて底上げ効果を発揮しているが、単独効果の定量化は困難。",
      evidence: "FY25 1Q→FY26 2Q: WLBスコア 58→75 (+17pt)",
    },
    {
      measureId: "m006",
      impact: "low",
      summary:
        "FY26 1Qからの開始で観察期間が短く、現時点での評価は限定的。企業文化スコアの改善傾向は確認できる。",
      evidence: "FY26 1Q→FY26 2Q: 企業文化 78→80 (+2pt)",
    },
    {
      measureId: "m004",
      impact: "low",
      summary:
        "単発施策のため持続効果は限定的。環境スコアは即時改善したが、以降の維持は他施策依存となっている。",
      evidence: "FY25 3Q: 環境スコア 76 (FY25 2Q比+2pt)",
    },
    {
      measureId: "m003",
      impact: "medium",
      summary:
        "実施期間中（FY25 2Q〜4Q）のキャリア成長スコアの改善と相関。完了後もスコアは維持されており、文化的な知識共有習慣が定着した可能性。",
      evidence: "FY25 2Q→FY25 4Q: キャリア成長 58→66 (+8pt)",
    },
  ],
  recommendations: [
    {
      priority: 1,
      action: "報酬水準の見直し・ベンチマーク調査",
      targetCategory: "compensation",
      expectedEffect: "給与満足度の底上げ・離職率-1pt",
    },
    {
      priority: 2,
      action: "キャリアパス制度の明文化",
      targetCategory: "career_growth",
      expectedEffect: "成長実感・エンゲージメント向上",
    },
    {
      priority: 3,
      action: "部署横断チームプロジェクト制度化",
      targetCategory: "relationships",
      expectedEffect: "部門間関係性の強化",
    },
  ],
  risks: [
    "給与・待遇スコアが全カテゴリ最低水準（65点）を継続しており放置すると優秀人材流出リスク",
    "施策数が増加しており従業員・管理者の施策疲れが生じる可能性",
    "1on1制度はマネージャーの質に依存するため個人差が大きい",
  ],
};
