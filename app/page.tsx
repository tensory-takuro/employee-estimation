import Link from "next/link";
import { ShieldCheck, Users, Lightbulb, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen hero-pattern flex items-center justify-center px-4">
      <div className="w-full max-w-2xl animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-12">
          {/* アイコン：ガバナンス（ShieldCheck）＋ 施策管理（Lightbulb）の組み合わせ */}
          <div className="inline-flex items-center justify-center mb-5 relative">
            <div className="w-20 h-20 rounded-3xl bg-gold/15 border border-gold/25 shadow-2xl shadow-gold/10 flex items-center justify-center">
              <ShieldCheck size={38} className="text-gold" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-mblue/20 border border-mblue/30 flex items-center justify-center shadow-lg">
              <Lightbulb size={15} className="text-mblue" strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-white text-[28px] font-bold tracking-[0.15em] mb-1.5 font-outfit">
            ガバスコ施策管理
          </h1>
          <p className="text-white/45 text-sm tracking-wider">
            Governance × Measure Management
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Employee Card */}
          <Link
            href="/employee"
            className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 block animate-fade-up stagger-1"
          >
            <div className="w-12 h-12 rounded-xl bg-mblue/15 flex items-center justify-center border border-mblue/20 mb-4">
              <Users size={22} className="text-mblue" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">従業員</h2>
            <p className="text-white/45 text-sm leading-relaxed mb-5">
              アンケートに回答して、職場環境の改善に貢献しましょう。
            </p>
            <div className="flex items-center gap-2 text-mblue text-sm font-medium">
              <span>アンケートへ</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Admin Card */}
          <Link
            href="/admin"
            className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-7 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 block animate-fade-up stagger-2"
          >
            <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center border border-gold/20 mb-4">
              <ShieldCheck size={22} className="text-gold" strokeWidth={1.5} />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">管理者</h2>
            <p className="text-white/45 text-sm leading-relaxed mb-5">
              施策管理・満足度ダッシュボード・AI影響分析を一元管理。
            </p>
            <div className="flex items-center gap-2 text-gold text-sm font-medium">
              <span>ダッシュボードへ</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          Accel Partners, Inc. © 2026
        </p>
      </div>
    </div>
  );
}
