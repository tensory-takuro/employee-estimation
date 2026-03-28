import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Measure, MeasureEffect, MeasureAnalysisReport } from "@/types/measure";
import { QuarterData } from "@/types";
import { MEASURE_CATEGORY_LABELS } from "@/types/measure";
import { QUARTERS } from "@/lib/dummyData";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const {
      measures,
      effects,
      quarterData,
    }: {
      measures: Measure[];
      effects: MeasureEffect[];
      quarterData: QuarterData[];
    } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
あなたは組織心理学と人事マネジメントの専門家コンサルタントです。
以下のデータをもとに、施策が従業員満足度・離職率に与えた影響を分析し、
推察・示唆をJSONで出力してください。

【分析対象施策（${measures.length}件）】
${measures
  .map(
    (m) => `
施策ID: ${m.id}
施策名: ${m.name}
カテゴリ: ${MEASURE_CATEGORY_LABELS[m.category]}
実施期間: ${QUARTERS.find((q) => q.key === m.startQuarter)?.label} 〜 ${
      m.endQuarter
        ? QUARTERS.find((q) => q.key === m.endQuarter)?.label
        : "継続中"
    }
概要: ${m.description}`
  )
  .join("\n")}

【四半期別 満足度・離職率推移】
${quarterData
  .map(
    (qd) => `
${qd.label}（${qd.period}）
  総合スコア: ${qd.totalScore}/100
  離職率: ${qd.turnoverRate}%
  実施中の施策: ${
    qd.activeMeasures.length > 0
      ? qd.activeMeasures
          .map((id) => measures.find((m) => m.id === id)?.name ?? id)
          .join(", ")
      : "なし"
  }`
  )
  .join("")}

【施策効果サマリー（前後差分）】
${effects
  .map((e) => {
    const m = measures.find((x) => x.id === e.measureId);
    const topCats = Object.entries(e.categoryDiffs)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k, v]) => `${k}:${v > 0 ? "+" : ""}${v}pt`)
      .join(", ");
    return `
施策「${m?.name}」
  ベースライン→評価四半期: ${e.baselineQuarter} → ${e.evaluationQuarter}
  総合スコア変化: ${e.overallScoreDiff > 0 ? "+" : ""}${e.overallScoreDiff}pt
  主な変化カテゴリ（上位3）: ${topCats}
  離職率変化: ${e.turnoverRateDiff > 0 ? "+" : ""}${e.turnoverRateDiff}%
  交絡因子（同時期施策数）: ${e.confoundingMeasures.length}件`;
  })
  .join("")}

【重要な注意事項】
- 因果関係ではなく「推察・可能性・相関」として記述してください
- 数値を根拠として必ず明示してください
- 交絡因子（他施策の同時実施）について言及してください
- 日本語で回答してください

以下のJSONスキーマで出力してください:
{
  "overallAssessment": "総合評価（3〜5文）",
  "measureInsights": [
    {
      "measureId": "施策ID",
      "impact": "high | medium | low | uncertain",
      "summary": "この施策の影響についての推察（2〜3文）",
      "evidence": "根拠となる具体的な数値（1文）"
    }
  ],
  "recommendations": [
    {
      "priority": 1,
      "action": "次期推奨施策（30文字以内）",
      "targetCategory": "対象カテゴリキー",
      "expectedEffect": "期待効果（25文字以内）"
    }
  ],
  "risks": ["注意すべきリスク（各30文字以内）"]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data: Omit<MeasureAnalysisReport, "generatedAt" | "quarters"> =
      JSON.parse(text);

    const report: MeasureAnalysisReport = {
      ...data,
      generatedAt: new Date().toISOString(),
      quarters: quarterData.map((q) => q.quarter),
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: "AI分析中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
