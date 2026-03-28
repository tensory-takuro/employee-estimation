"use client";

import { Question } from "@/types";
import { SCORE_LABELS } from "@/lib/questions";

interface Props {
  question: Question;
  index: number;
  value: number | null;
  onChange: (score: number) => void;
}

export default function QuestionCard({ question, index, value, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-dark/8 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Number + Icon */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <div className="w-9 h-9 rounded-xl bg-dark/6 flex items-center justify-center">
            <span className="text-base">{question.icon}</span>
          </div>
          <span className="text-[10px] font-bold text-dark/30 font-outfit">Q{index + 1}</span>
        </div>

        {/* Question */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-navy/60 tracking-wider uppercase mb-1.5">
            {question.category}
          </div>
          <p className="text-dark text-[15px] font-medium leading-relaxed mb-5">
            {question.text}
          </p>

          {/* Score buttons */}
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => onChange(score)}
                className={`
                  flex-1 min-w-[52px] flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-[12px] font-medium transition-all duration-200
                  ${
                    value === score
                      ? "bg-dark text-white border-dark shadow-md shadow-dark/20 scale-[1.04]"
                      : "bg-white text-dark/50 border-dark/10 hover:border-dark/30 hover:text-dark hover:bg-dark/[0.03]"
                  }
                `}
              >
                <span className="font-outfit font-bold text-base leading-none">{score}</span>
                <span className="text-[10px] leading-none opacity-70 hidden sm:block">{SCORE_LABELS[score]}</span>
              </button>
            ))}
          </div>
          {value && (
            <p className="text-[11px] text-navy mt-2 font-medium">
              選択中: {value} — {SCORE_LABELS[value]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
