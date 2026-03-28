import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";

export const metadata = {
  title: "回答完了 | ES Manager",
};

interface Props {
  searchParams: Promise<{ score?: string }>;
}

export default async function CompletePage({ searchParams }: Props) {
  const params = await searchParams;
  const score = params.score ? parseInt(params.score, 10) : null;

  return (
    <div className="min-h-screen hero-pattern flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center animate-fade-up">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-good/15 border border-good/25 mb-6 shadow-2xl shadow-good/10">
          <CheckCircle2 size={40} className="text-good" />
        </div>

        <h1 className="text-white text-3xl font-bold mb-3">
          ご回答ありがとうございます
        </h1>
        <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          皆様のフィードバックは四半期ごとに集計され、
          職場環境の継続的な改善に活用されます。
        </p>

        {score !== null && (
          <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 mb-8 animate-fade-up stagger-2">
            <p className="text-white/40 text-xs tracking-wider uppercase mb-2">あなたの今回のスコア</p>
            <div className="text-white text-5xl font-bold font-outfit mb-1">{score}</div>
            <div className="text-white/30 text-sm">/ 100点</div>
          </div>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200"
        >
          <Home size={16} />
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
