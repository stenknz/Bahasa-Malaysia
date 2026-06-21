"use client";

import { useEffect, useState } from "react";

interface XpData {
  totalXp: number;
  level: number;
  xpForNextLevel: number;
}

export function XpBar() {
  const [data, setData] = useState<XpData | null>(null);

  useEffect(() => {
    fetch("/api/xp").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return null;

  const prevLevelXp = data.level > 0 ? data.level * data.level * 100 : 0;
  const progress = data.xpForNextLevel > 0 ? ((data.totalXp - prevLevelXp) / (data.xpForNextLevel - prevLevelXp)) * 100 : 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-900 dark:text-white">Level {data.level}</span>
        <span className="text-slate-500">{data.totalXp} XP</span>
      </div>
      <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-2.5 rounded-full bg-primary-500 transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-400">
        {Math.round(progress)}% to Level {data.level + 1}
      </p>
    </div>
  );
}
