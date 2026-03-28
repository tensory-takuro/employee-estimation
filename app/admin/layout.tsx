import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "管理者ダッシュボード | ES Manager",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen main-content-bg">
      <Sidebar />
      {/* Main content - offset by sidebar width */}
      <div className="lg:ml-[260px] pt-16 lg:pt-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}
