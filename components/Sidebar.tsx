"use client";

import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Menu, X, ShieldCheck, Lightbulb, FlaskConical } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin/measures",  label: "施策管理",        icon: Lightbulb },
  { href: "/admin/analysis",  label: "影響分析",        icon: FlaskConical },
  { href: "/admin",           label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/admin/responses", label: "回答一覧",       icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNav(href: string) {
    router.push(href);
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-dark flex items-center px-5 z-50 shadow-lg">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/80 hover:text-white transition-colors"
          aria-label="メニュー"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="flex items-center gap-2.5 ml-4">
          <div className="w-7 h-7 rounded-lg bg-gold/20 flex items-center justify-center">
            <ShieldCheck size={14} className="text-gold" strokeWidth={1.5} />
          </div>
          <span className="text-white font-bold text-base tracking-widest font-outfit">
            ガバスコ施策管理
          </span>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 bottom-0 w-[260px]
          bg-gradient-to-b from-dark to-[#081225]
          sidebar-grain
          flex flex-col z-40
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="relative z-10 p-7 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gold/15 flex items-center justify-center border border-gold/25 shadow-lg shadow-gold/5">
              <ShieldCheck size={22} className="text-gold" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-white font-bold text-[18px] leading-tight tracking-[0.1em] font-outfit">
                ガバスコ施策管理
              </div>
              <div className="text-gold/60 font-medium text-[10px] leading-tight tracking-[0.2em] uppercase mt-0.5">
                Governance × Measure
              </div>
            </div>
          </div>
        </div>

        {/* Gold accent divider */}
        <div className="relative z-10 mx-7 h-px bg-gradient-to-r from-gold/50 via-gold/15 to-transparent" />

        {/* Navigation */}
        <nav className="relative z-10 flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium
                  transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  }
                `}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gold rounded-r-full" />
                )}
                <Icon size={17} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="relative z-10 mx-7 h-px bg-white/[0.06]" />

        {/* Employee link */}
        <div className="relative z-10 px-4 py-4">
          <button
            onClick={() => handleNav("/employee")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[12px] font-medium text-white/35 hover:text-white/60 hover:bg-white/[0.04] transition-all duration-200"
          >
            <Users size={15} strokeWidth={1.5} />
            <span>従業員アンケート画面</span>
          </button>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-7 py-5 border-t border-white/[0.06]">
          <div className="text-white/25 text-[11px] font-medium tracking-wider">
            Accel Partners, Inc.
          </div>
          <div className="text-white/15 text-[10px] mt-0.5">© 2026</div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
