import { NavSidebar } from "@/components/ui/nav-sidebar";
import { TopBar } from "@/components/ui/top-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <NavSidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main id="main-content" className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
