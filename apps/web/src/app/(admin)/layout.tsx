import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
        <h2 className="mb-4 text-lg font-bold text-primary-600">Admin</h2>
        <nav className="space-y-1">
          <a href="/admin" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Dashboard</a>
          <a href="/admin/lessons" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Lessons</a>
          <a href="/admin/vocabulary" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Vocabulary</a>
          <a href="/admin/analytics" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">Analytics</a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
