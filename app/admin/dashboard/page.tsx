"use client";

import { useState } from "react";
import { QUARTER_DATA, QUARTERS } from "@/lib/dummyData";
import { QuarterKey } from "@/types";
import QuarterSelector from "@/components/admin/QuarterSelector";
import SummaryCards from "@/components/admin/SummaryCards";
import StackedBarChart from "@/components/admin/StackedBarChart";
import TrendLineChart from "@/components/admin/TrendLineChart";
import CategoryTable from "@/components/admin/CategoryTable";
import { BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const [selectedQuarters, setSelectedQuarters] = useState<QuarterKey[]>(
    QUARTERS.map((q) => q.key)
  );

  const filteredData = QUARTER_DATA.filter((d) =>
    selectedQuarters.includes(d.quarter)
  );

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2 animate-fade-up">
        <div className="w-10 h-10 rounded-xl bg-dark/8 flex items-center justify-center">
          <BarChart3 size={20} className="text-navy" />
        </div>
        <div>
          <h1 className="text-dark text-xl font-bold">ダッシュボード</h1>
          <p className="text-dark/45 text-xs">従業員満足度の四半期推移を確認</p>
        </div>
      </div>

      <div className="animate-fade-up stagger-1">
        <QuarterSelector
          selected={selectedQuarters}
          onChange={setSelectedQuarters}
        />
      </div>

      <SummaryCards data={filteredData} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="animate-fade-up stagger-3">
          <StackedBarChart data={filteredData} />
        </div>
        <div className="animate-fade-up stagger-4">
          <TrendLineChart data={filteredData} />
        </div>
      </div>

      <div className="animate-fade-up stagger-5">
        <CategoryTable data={filteredData} />
      </div>
    </div>
  );
}
