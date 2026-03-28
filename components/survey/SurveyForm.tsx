"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { questions, MAX_TOTAL_SCORE } from "@/lib/questions";
import { normalize } from "@/lib/scoring";
import QuestionCard from "./QuestionCard";
import { Send, AlertCircle } from "lucide-react";

export default function SurveyForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, number | null>>(
    Object.fromEntries(questions.map((q) => [q.id, null]))
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const answered = Object.values(answers).filter((v) => v !== null).length;
  const total = questions.length;
  const progress = (answered / total) * 100;
  const allAnswered = answered === total;

  function setAnswer(questionId: string, score: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
    setError(false);
  }

  async function handleSubmit() {
    if (!allAnswered) {
      setError(true);
      const firstUnanswered = questions.find((q) => answers[q.id] === null);
      if (firstUnanswered) {
        document.getElementById(`q-${firstUnanswered.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setSubmitting(true);
    // ダミー送信（実際のAPIが実装されたら差し替え）
    await new Promise((r) => setTimeout(r, 800));
    const rawScore = Object.values(answers).reduce((s: number, v) => s + (v ?? 0), 0);
    const score = normalize(rawScore, MAX_TOTAL_SCORE);
    router.push(`/employee/complete?score=${score}`);
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-dark/8 p-5 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-dark/60 text-sm font-medium">回答進捗</span>
          <span className="text-dark font-bold text-sm font-outfit">
            {answered} / {total}
          </span>
        </div>
        <div className="h-2 bg-dark/6 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-navy to-mblue rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-warning text-xs mt-2 font-medium">
            <AlertCircle size={13} />
            未回答の質問があります。すべての質問に回答してください。
          </p>
        )}
      </div>

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={q.id} id={`q-${q.id}`} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
          <QuestionCard
            question={q}
            index={i}
            value={answers[q.id]}
            onChange={(score) => setAnswer(q.id, score)}
          />
        </div>
      ))}

      {/* Submit */}
      <div className="pt-2 pb-8">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`
            w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all duration-300
            ${
              allAnswered
                ? "bg-dark text-white hover:bg-navy shadow-xl shadow-dark/20 hover:scale-[1.01]"
                : "bg-dark/10 text-dark/35 cursor-not-allowed"
            }
          `}
        >
          {submitting ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={18} />
          )}
          {submitting ? "送信中..." : "アンケートを送信する"}
        </button>
        <p className="text-center text-dark/35 text-xs mt-3">
          回答は匿名で処理されます。所要時間：約3〜5分
        </p>
      </div>
    </div>
  );
}
