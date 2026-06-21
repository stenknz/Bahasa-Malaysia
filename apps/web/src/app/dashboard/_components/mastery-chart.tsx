"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface MasteryData {
  new: number;
  learning: number;
  familiar: number;
  mastered: number;
  total: number;
}

const COLORS = ["#94a3b8", "#f59e0b", "#3b82f6", "#22c55e"];
const LABELS = ["New", "Learning", "Familiar", "Mastered"];

export function MasteryChart() {
  const [data, setData] = useState<MasteryData | null>(null);

  useEffect(() => {
    fetch("/api/vocabulary/stats").then((r) => r.json()).then(setData);
  }, []);

  if (!data || data.total === 0) return null;

  const chartData = [
    { name: "New", value: data.new },
    { name: "Learning", value: data.learning },
    { name: "Familiar", value: data.familiar },
    { name: "Mastered", value: data.mastered },
  ].filter((d) => d.value > 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Vocabulary Mastery</h3>
      <div className="mt-2 flex items-center gap-4">
        <div className="h-28 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[chartData.map((c) => c.name).indexOf(_.name)]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5">
          {LABELS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-slate-500">{label}</span>
              <span className="font-medium text-slate-900 dark:text-white">{data[["new", "learning", "familiar", "mastered"][i] as keyof MasteryData]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
