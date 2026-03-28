"use client";

import { QUARTERS } from "@/lib/dummyData";
import { QuarterKey } from "@/types";
import { CalendarDays } from "lucide-react";

interface Props {
  selected: QuarterKey[];
  onChange: (selected: QuarterKey[]) => void;
}

export default function QuarterSelector({ selected, onChange }: Props) {
  function toggle(key: QuarterKey) {
    if (selected.includes(key)) {
      if (selected.length === 1) return; // 最低1つは選択
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key].sort((a, b) =>
        QUARTERS.findIndex((q) => q.key === a) - QUARTERS.findIndex((q) => q.key === b)
      ));
    }
  }

  function selectAll() {
    onChange(QUARTERS.map((q) => q.key));
  }

  return (
    <div className="bg-white rounded-2xl border border-dark/8 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-navy" />
          <span className="text-dark font-semibold text-sm">表示期間を選択</span>
        </div>
        <button
          onClick={selectAll}
          className="text-[11px] text-navy/60 hover:text-navy font-medium underline underline-offset-2 transition-colors"
        >
          すべて選択
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUARTERS.map((q) => {
          const isSelected = selected.includes(q.key);
          return (
            <button
              key={q.key}
              onClick={() => toggle(q.key)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-medium border transition-all duration-200
                ${
                  isSelected
                    ? "bg-dark text-white border-dark shadow-md shadow-dark/15"
                    : "bg-white text-dark/50 border-dark/10 hover:border-dark/25 hover:text-dark"
                }
              `}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  isSelected ? "bg-gold" : "bg-dark/15"
                }`}
              />
              <span className="font-outfit font-semibold">{q.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-dark/35 text-[11px] mt-3">
        選択中: {selected.length}四半期 /{" "}
        {selected.map((k) => QUARTERS.find((q) => q.key === k)?.label).join(", ")}
      </p>
    </div>
  );
}
