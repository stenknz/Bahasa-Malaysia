"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface HistoryDay {
  date: string;
  xp: number;
  lessons: number;
  words: number;
}

export function ActivityChart() {
  const [data, setData] = useState<HistoryDay[]>([]);

  useEffect(() => {
    fetch("/api/progress/history")
      .then((r) => r.json())
      .then((d) => setData(d.history));
  }, []);

  if (data.length === 0) return null;

  const formatted = data.map((d) => ({
    ...d,
    day: new Date(d.date).toLocaleDateString("en", { month: "short", day: "numeric" }),
  }));

  const hasXp = data.some((d) => d.xp > 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">XP Activity (30 days)</h3>
      {hasXp ? (
        <div className="mt-3 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatted}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval="preserveStartEnd" tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                formatter={(value: number) => [`${value} XP`]}
              />
              <Line type="monotone" dataKey="xp" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-400">No activity yet. Start a lesson to track your progress!</p>
      )}
    </div>
  );
}
