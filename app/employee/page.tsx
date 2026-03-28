import SurveyForm from "@/components/survey/SurveyForm";
import { ClipboardList } from "lucide-react";

export const metadata = {
  title: "従業員アンケート | ES Manager",
};

export default function EmployeePage() {
  return (
    <div className="min-h-screen main-content-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-dark/8 border border-dark/8 mb-4">
            <ClipboardList size={26} className="text-navy" />
          </div>
          <h1 className="text-dark text-2xl font-bold tracking-tight mb-2">
            従業員満足度アンケート
          </h1>
          <p className="text-dark/50 text-sm leading-relaxed max-w-md mx-auto">
            職場環境の改善のため、率直なご意見をお聞かせください。
            回答は匿名で集計され、個人が特定されることはありません。
          </p>
        </div>

        {/* Form */}
        <SurveyForm />
      </div>
    </div>
  );
}
