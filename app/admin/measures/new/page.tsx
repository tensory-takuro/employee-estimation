"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MeasureCategory,
  MeasureCost,
  MEASURE_CATEGORY_LABELS,
  MEASURE_COST_LABELS,
} from "@/types/measure";
import { QUARTERS } from "@/lib/dummyData";
import { MEASURE_CATEGORY_ICONS } from "@/lib/measureAnalysis";
import { QuarterKey } from "@/types";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewMeasurePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "management" as MeasureCategory,
    startQuarter: "FY26_2Q" as QuarterKey,
    endQuarter: "" as QuarterKey | "",
    targetScore: "",
    targetTurnoverRate: "",
    owner: "",
    cost: "medium" as MeasureCost,
  });
  const [saving, setSaving] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.name || !form.owner) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    router.push("/admin/measures");
  }

  const isValid = form.name.trim() && form.owner.trim();

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-8 animate-fade-up">
        <Link
          href="/admin/measures"
          className="w-9 h-9 rounded-xl bg-dark/6 flex items-center justify-center hover:bg-dark/10 transition-colors"
        >
          <ArrowLeft size={16} className="text-dark/60" />
        </Link>
        <div>
          <h1 className="text-dark text-xl font-bold">新規施策を登録</h1>
          <p className="text-dark/45 text-xs">施策情報を入力してください</p>
        </div>
      </div>

      <div className="space-y-5 animate-fade-up stagger-1">
        {/* 施策名 */}
        <Field label="施策名" required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="例：メンタリング制度の導入"
            className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-white text-dark text-sm focus:outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/10 transition-all"
          />
        </Field>

        {/* 施策概要 */}
        <Field label="施策概要">
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="施策の目的・内容・対象を簡潔に記述してください"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-white text-dark text-sm focus:outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/10 transition-all resize-none"
          />
        </Field>

        {/* カテゴリ */}
        <Field label="主カテゴリ" required>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.keys(MEASURE_CATEGORY_LABELS) as MeasureCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => update("category", cat)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[12px] font-medium transition-all ${
                  form.category === cat
                    ? "bg-dark text-white border-dark"
                    : "bg-white text-dark/50 border-dark/10 hover:border-dark/25"
                }`}
              >
                <span>{MEASURE_CATEGORY_ICONS[cat]}</span>
                <span className="truncate">{MEASURE_CATEGORY_LABELS[cat]}</span>
              </button>
            ))}
          </div>
        </Field>

        {/* 実施期間 */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="開始四半期" required>
            <select
              value={form.startQuarter}
              onChange={(e) => update("startQuarter", e.target.value as QuarterKey)}
              className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-white text-dark text-sm focus:outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/10 transition-all"
            >
              {QUARTERS.map((q) => (
                <option key={q.key} value={q.key}>{q.label}</option>
              ))}
            </select>
          </Field>
          <Field label="終了四半期（未定の場合は空欄）">
            <select
              value={form.endQuarter}
              onChange={(e) => update("endQuarter", e.target.value as QuarterKey | "")}
              className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-white text-dark text-sm focus:outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/10 transition-all"
            >
              <option value="">継続中</option>
              {QUARTERS.map((q) => (
                <option key={q.key} value={q.key}>{q.label}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* 目標値 */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="目標満足度スコア（任意）">
            <input
              type="number"
              value={form.targetScore}
              onChange={(e) => update("targetScore", e.target.value)}
              placeholder="例：75"
              min={0} max={100}
              className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-white text-dark text-sm focus:outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/10 transition-all"
            />
          </Field>
          <Field label="目標離職率（任意）">
            <input
              type="number"
              value={form.targetTurnoverRate}
              onChange={(e) => update("targetTurnoverRate", e.target.value)}
              placeholder="例：5.0"
              step="0.1" min={0} max={100}
              className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-white text-dark text-sm focus:outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/10 transition-all"
            />
          </Field>
        </div>

        {/* 担当者・コスト */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="担当者" required>
            <input
              type="text"
              value={form.owner}
              onChange={(e) => update("owner", e.target.value)}
              placeholder="例：人事部 田中部長"
              className="w-full px-4 py-3 rounded-xl border border-dark/10 bg-white text-dark text-sm focus:outline-none focus:border-navy/50 focus:ring-2 focus:ring-navy/10 transition-all"
            />
          </Field>
          <Field label="コスト感">
            <div className="flex gap-2">
              {(["low", "medium", "high"] as MeasureCost[]).map((c) => (
                <button
                  key={c}
                  onClick={() => update("cost", c)}
                  className={`flex-1 py-3 rounded-xl border text-[12px] font-bold transition-all ${
                    form.cost === c
                      ? "bg-dark text-white border-dark"
                      : "bg-white text-dark/50 border-dark/10 hover:border-dark/25"
                  }`}
                >
                  {MEASURE_COST_LABELS[c]}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* 保存ボタン */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={!isValid || saving}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
              isValid
                ? "bg-dark text-white hover:bg-navy shadow-xl shadow-dark/15"
                : "bg-dark/10 text-dark/35 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "登録中..." : "施策を登録する"}
          </button>
          <p className="text-center text-dark/30 text-xs mt-3">
            ※ 現在はダミーデータでの確認用です。実APIに接続すると保存されます。
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-dark/60 text-[12px] font-bold tracking-wider uppercase mb-2">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
