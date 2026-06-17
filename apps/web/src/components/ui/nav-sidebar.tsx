"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◉" },
  { href: "/dashboard/lessons", label: "Lessons", icon: "◎" },
  { href: "/dashboard/vocabulary", label: "Vocabulary", icon: "◈" },
  { href: "/dashboard/conversation", label: "Practice", icon: "◆" },
  { href: "/dashboard/progress", label: "Progress", icon: "◇" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 md:flex">
      <div className="flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-700">
        <Link href="/dashboard" className="text-lg font-bold text-primary-600">
          BM Mastery
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
