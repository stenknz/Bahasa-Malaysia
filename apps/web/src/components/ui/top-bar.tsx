"use client";

import { signOut, useSession } from "next-auth/react";

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {session?.user?.name || session?.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
