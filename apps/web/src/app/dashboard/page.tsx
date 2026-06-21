"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XpBar } from "./_components/xp-bar";
import { ActivityChart } from "./_components/activity-chart";
import { MasteryChart } from "./_components/mastery-chart";
import { ActivityTimeline } from "./_components/activity-timeline";
import { AchievementShowcase } from "./_components/achievement-showcase";

interface DashboardStats {
  totalXp: number;
  level: number;
  currentStreak: number;
  lessonsCompleted: number;
  vocabularyLearned: number;
  vocabularyMastered: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dueToday, setDueToday] = useState(0);

  useEffect(() => {
    fetch("/api/progress/dashboard")
      .then((r) => r.json())
      .then(setStats);
    fetch("/api/vocabulary/stats")
      .then((r) => r.json())
      .then((d) => setDueToday(d.dueToday));
  }, []);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back{stats ? `!` : `...`}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {stats
            ? `You've completed ${stats.lessonsCompleted} lessons and learned ${stats.vocabularyLearned} words.`
            : `Loading your progress...`}
        </p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-medium text-slate-500">Current Streak</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {stats?.currentStreak ?? 0}<span className="text-lg font-normal text-slate-400"> days</span>
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-medium text-slate-500">Lessons Done</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats?.lessonsCompleted ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-medium text-slate-500">Words Learned</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stats?.vocabularyLearned ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-medium text-slate-500">Due for Review</p>
          <p className="mt-1 text-2xl font-bold text-amber-500">{dueToday}</p>
        </div>
      </div>

      {/* XP Bar */}
      <XpBar />

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityChart />
        <MasteryChart />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => router.push("/dashboard/lessons")}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
        >
          Continue Learning
        </button>
        <button
          onClick={() => router.push("/dashboard/practice")}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Pronunciation Practice
        </button>
        <button
          onClick={() => router.push("/dashboard/conversation")}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Conversation Practice
        </button>
      </div>

      {/* Bottom Row: Activity + Achievements */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityTimeline />
        <AchievementShowcase />
      </div>
    </div>
  );
}
