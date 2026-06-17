"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    currentStreak: 0,
    totalXp: 0,
    level: 0,
    lessonsCompleted: 0,
    vocabularyLearned: 0,
    vocabularyMastered: 0,
  });

  useEffect(() => {
    fetch("/api/progress/dashboard")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Streak" value={`${stats.currentStreak} days`} />
        <StatCard label="Total XP" value={`${stats.totalXp} (Lv.${stats.level})`} />
        <StatCard label="Lessons Completed" value={`${stats.lessonsCompleted}`} />
        <StatCard label="Vocabulary" value={`${stats.vocabularyLearned} (${stats.vocabularyMastered} mastered)`} />
      </div>
      <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">Continue Learning</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {stats.lessonsCompleted === 0
            ? "Start your first lesson to begin tracking your progress."
            : "Keep up the great work!"}
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
