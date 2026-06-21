"use client";

import { useEffect, useState } from "react";

interface Activity {
  type: string;
  description: string;
  date: string;
  xp: number;
}

export function ActivityTimeline() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/activity/recent")
      .then((r) => r.json())
      .then((d) => setActivities(d.activities));
  }, []);

  if (activities.length === 0) return null;

  const icons: Record<string, string> = { lesson: "📖", vocabulary: "📝" };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
      <div className="mt-3 space-y-3">
        {activities.slice(0, 6).map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="mt-0.5 text-base">{icons[a.type] ?? "📌"}</span>
            <div className="flex-1">
              <p className="text-sm text-slate-900 dark:text-white">{a.description}</p>
              <p className="text-xs text-slate-400">
                {new Date(a.date).toLocaleDateString("en", { month: "short", day: "numeric" })}
              </p>
            </div>
            <span className="text-xs font-medium text-primary-600">+{a.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
