"use client";

import { useState } from "react";
import { DUMMY_SUBMISSIONS, QUARTERS } from "@/lib/dummyData";
import { QuarterKey } from "@/types";
import { getScoreLevel, SCORE_COLORS, SCORE_LABELS_LEVEL } from "@/lib/scoring";
import { Users, Filter } from "lucide-react";

export default function ResponsesPage() {
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterKey | "all">("all");

  const filtered =
    selectedQuarter === "all"
      ? DUMMY_SUBMISSIONS
      : DUMMY_SUBMISSIONS.filter((s) => s.quarter === selectedQuarter);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <div className="w-10 h-10 rounded-xl bg-dark/8 flex items-center justify-center">
          <Users size={20} className="text-navy" />
        </div>
        <div>
          <h1 className="text-dark text-xl font-bold">回答一覧</h1>
          <p className="text-dark/45 text-xs">全従業員の回答データ</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-dark/8 p-5 shadow-sm mb-6 animate-fade-up stagger-1">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-navy" />
          <span className="text-dark/60 text-sm font-medium">四半期フィルター</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedQuarter("all")}
            className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-all ${
              selectedQuarter === "all"
                ? "bg-dark text-white border-dark"
                : "bg-white text-dark/50 border-dark/10 hover:border-dark/25"
            }`}
          >
            すべて
          </button>
          {QUARTERS.map((q) => (
            <button
              key={q.key}
              onClick={() => setSelectedQuarter(q.key)}
              className={`px-4 py-2 rounded-xl text-[13px] font-medium border transition-all font-outfit ${
                selectedQuarter === q.key
                  ? "bg-dark text-white border-dark"
                  : "bg-white text-dark/50 border-dark/10 hover:border-dark/25"
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>
        <p className="text-dark/35 text-[11px] mt-3">{filtered.length}件の回答を表示中</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-dark/8 shadow-sm overflow-hidden animate-fade-up stagger-2">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-dark/[0.025] border-b border-dark/6">
                {["従業員ID", "氏名", "部署", "四半期", "総合スコア", "評価", "回答日"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11px] font-bold text-dark/50 tracking-wider uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => {
                const level = getScoreLevel(sub.totalScore);
                const color = SCORE_COLORS[level];
                const quarter = QUARTERS.find((q) => q.key === sub.quarter);
                return (
                  <tr
                    key={sub.id}
                    className="border-t border-dark/[0.04] hover:bg-dark/[0.015] transition-colors"
                    style={{ animationDelay: `${i * 0.02}s` }}
                  >
                    <td className="px-5 py-3 text-dark/50 text-[12px] font-outfit">{sub.employeeId}</td>
                    <td className="px-5 py-3 text-dark font-medium text-[13px]">{sub.employeeName}</td>
                    <td className="px-5 py-3 text-dark/60 text-[12px]">{sub.department}</td>
                    <td className="px-5 py-3">
                      <span className="text-[12px] font-bold text-dark/70 font-outfit bg-dark/5 px-2 py-0.5 rounded-lg">
                        {quarter?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 max-w-[80px] h-1.5 bg-dark/6 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${sub.totalScore}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="font-bold text-[13px] font-outfit" style={{ color }}>
                          {sub.totalScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
                        style={{ color, backgroundColor: `${color}15` }}
                      >
                        {SCORE_LABELS_LEVEL[level]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-dark/40 text-[12px] font-outfit">{sub.submittedAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
