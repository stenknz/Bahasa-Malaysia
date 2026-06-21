"use client";

import { useEffect, useState } from "react";

interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string | null;
  icon: string | null;
  unlocked: boolean;
  unlockedAt: string | null;
}

const ACHIEVEMENT_ICONS: Record<string, string> = {
  first_lesson: "🎓",
  streak_7: "🔥",
  streak_30: "💪",
  vocabulary_50: "📚",
  vocabulary_100: "📖",
  perfect_lesson: "⭐",
  conversation_start: "💬",
  early_bird: "🌅",
};

export function AchievementShowcase() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    fetch("/api/achievements")
      .then((r) => r.json())
      .then(setAchievements);
  }, []);

  const unlocked = achievements.filter((a) => a.unlocked).slice(0, 3);

  if (unlocked.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Achievements</h3>
        <p className="mt-2 text-xs text-slate-400">Complete lessons to unlock achievements!</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Achievements</h3>
      <div className="mt-3 space-y-2">
        {unlocked.map((a) => (
          <div key={a.id} className="flex items-center gap-3 rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
            <span className="text-xl">{ACHIEVEMENT_ICONS[a.key] ?? "🏆"}</span>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{a.title}</p>
              {a.unlockedAt && (
                <p className="text-xs text-slate-400">
                  {new Date(a.unlockedAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
