"use client";

import { signOut, useSession } from "next-auth/react";

export function TopBar() {
  const { data: session, update } = useSession();

  const handleLevelChange = async (level: string) => {
    await fetch("/api/user/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level }),
    });
    await update();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h2>
      <div className="flex items-center gap-4">
        <select
          value={(session?.user as any)?.level ?? "beginner"}
          onChange={(e) => handleLevelChange(e.target.value)}
          className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
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
