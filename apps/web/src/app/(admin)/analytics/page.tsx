"use client";

import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [users, setUsers] = useState(0);
  const [lessons, setLessons] = useState(0);
  const [vocab, setVocab] = useState(0);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/analytics").then((r) => r.json()),
    ]).then(([data]) => {
      setUsers(data.users ?? 0);
      setLessons(data.lessons ?? 0);
      setVocab(data.vocabulary ?? 0);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-sm text-slate-500">Platform overview and usage statistics.</p>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border p-4 dark:border-slate-700"><p className="text-sm text-slate-500">Total Users</p><p className="text-3xl font-bold">{users}</p></div>
        <div className="rounded-xl border p-4 dark:border-slate-700"><p className="text-sm text-slate-500">Lessons Published</p><p className="text-3xl font-bold">{lessons}</p></div>
        <div className="rounded-xl border p-4 dark:border-slate-700"><p className="text-sm text-slate-500">Vocabulary Words</p><p className="text-3xl font-bold">{vocab}</p></div>
      </div>
    </div>
  );
}
