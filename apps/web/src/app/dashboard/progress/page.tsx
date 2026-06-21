"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lessonsCompleted: number;
  vocabularyLearned: number;
  vocabularyMastered: number;
}

interface VocabStats {
  new: number;
  learning: number;
  familiar: number;
  mastered: number;
  total: number;
  dueToday: number;
}

export default function ProgressPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [vocabStats, setVocabStats] = useState<VocabStats | null>(null);

  useEffect(() => {
    fetch("/api/progress/dashboard").then((r) => r.json()).then(setStats);
    fetch("/api/vocabulary/stats").then((r) => r.json()).then(setVocabStats);
  }, []);

  if (!stats || !vocabStats) return <div className="p-6 text-slate-500">Loading progress...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Your Progress</h1>

      {/* Overview cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricCard label="Level" value={stats.level.toString()} />
        <MetricCard label="Total XP" value={stats.totalXp.toLocaleString()} />
        <MetricCard label="Streak" value={`${stats.currentStreak} days`} />
        <MetricCard label="Best Streak" value={`${stats.longestStreak} days`} />
      </div>

      {/* Vocabulary mastery bar */}
      <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vocabulary Mastery</h2>
        <p className="text-sm text-slate-500">{vocabStats.total} words total · {vocabStats.dueToday} due for review</p>
        <div className="mt-4 flex h-6 overflow-hidden rounded-lg">
          {vocabStats.new > 0 && (
            <div className="bg-slate-300 text-xs text-white transition-all" style={{ width: `${(vocabStats.new / vocabStats.total) * 100}%` }} title={`New: ${vocabStats.new}`} />
          )}
          {vocabStats.learning > 0 && (
            <div className="bg-amber-400 text-xs text-white transition-all" style={{ width: `${(vocabStats.learning / vocabStats.total) * 100}%` }} title={`Learning: ${vocabStats.learning}`} />
          )}
          {vocabStats.familiar > 0 && (
            <div className="bg-blue-400 text-xs text-white transition-all" style={{ width: `${(vocabStats.familiar / vocabStats.total) * 100}%` }} title={`Familiar: ${vocabStats.familiar}`} />
          )}
          {vocabStats.mastered > 0 && (
            <div className="bg-green-500 text-xs text-white transition-all" style={{ width: `${(vocabStats.mastered / vocabStats.total) * 100}%` }} title={`Mastered: ${vocabStats.mastered}`} />
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
          <span><span className="inline-block h-2 w-2 rounded bg-slate-300" /> New ({vocabStats.new})</span>
          <span><span className="inline-block h-2 w-2 rounded bg-amber-400" /> Learning ({vocabStats.learning})</span>
          <span><span className="inline-block h-2 w-2 rounded bg-blue-400" /> Familiar ({vocabStats.familiar})</span>
          <span><span className="inline-block h-2 w-2 rounded bg-green-500" /> Mastered ({vocabStats.mastered})</span>
        </div>
      </div>

      {/* Learning stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Lessons</h2>
          <p className="mt-2 text-3xl font-bold text-primary-600">{stats.lessonsCompleted}</p>
          <p className="text-sm text-slate-500">completed</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vocabulary</h2>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.vocabularyMastered}</p>
          <p className="text-sm text-slate-500">words mastered ({stats.vocabularyLearned} learned)</p>
        </div>
      </div>

      {/* Due for review */}
      {vocabStats.dueToday > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            {vocabStats.dueToday} words due for review today
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-700">
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}
