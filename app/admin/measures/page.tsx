"use client";

import { useState } from "react";
import Link from "next/link";
import { MEASURES } from "@/lib/measureData";
import { MeasureStatus, MEASURE_STATUS_LABELS } from "@/types/measure";
import MeasureCard from "@/components/measures/MeasureCard";
import { Lightbulb, Plus, Filter } from "lucide-react";

const STATUS_FILTERS: { label: string; value: MeasureStatus | "all" }[] = [
  { label: "すべて", value: "all" },
  { label: "実施中", value: "active" },
  { label: "計画中", value: "planning" },
  { label: "完了",   value: "completed" },
  { label: "中断",   value: "suspended" },
];

export default function MeasuresPage() {
  const [statusFilter, setStatusFilter] = useState<MeasureStatus | "all">("all");

  const filtered = statusFilter === "all"
    ? MEASURES
    : MEASURES.filter((m) => m.status === statusFilter);

  const counts = {
    all:       MEASURES.length,
    active:    MEASURES.filter((m) => m.status === "active").length,
    planning:  MEASURES.filter((m) => m.status === "planning").length,
    completed: MEASURES.filter((m) => m.status === "completed").length,
    suspended: MEASURES.filter((m) => m.status === "suspended").length,
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6 animate-fade-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark/8 flex items-center justify-center">
            <Lightbulb size={20} className="text-navy" />
          </div>
          <div>
            <h1 className="text-dark text-xl font-bold">施策管理</h1>
            <p className="text-dark/45 text-xs">
              従業員満足度改善のための施策を管理・追跡
            </p>
          </div>
        </div>
        <Link
          href="/admin/measures/new"
          className="flex items-center gap-2 bg-dark text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-navy transition-colors shadow-md shadow-dark/15"
        >
          <Plus size={16} />
          新規施策を登録
        </Link>
      </div>

      {/* フィルター */}
      <div className="bg-white rounded-2xl border border-dark/8 p-4 shadow-sm mb-6 animate-fade-up stagger-1">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={14} className="text-navy" />
          <span className="text-dark/60 text-sm font-medium">ステータスフィルター</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium border transition-all ${
                statusFilter === f.value
                  ? "bg-dark text-white border-dark"
                  : "bg-white text-dark/50 border-dark/10 hover:border-dark/25"
              }`}
            >
              {f.label}
              <span
                className={`text-[11px] font-outfit font-bold px-1.5 py-0.5 rounded-md ${
                  statusFilter === f.value
                    ? "bg-white/20 text-white"
                    : "bg-dark/8 text-dark/50"
                }`}
              >
                {counts[f.value]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 施策カードグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((measure, i) => (
          <MeasureCard key={measure.id} measure={measure} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-dark/30">
          <Lightbulb size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">該当する施策がありません</p>
        </div>
      )}
    </div>
  );
}
