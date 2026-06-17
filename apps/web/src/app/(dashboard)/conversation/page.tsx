"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const scenarios = [
  { id: "restaurant", label: "Restaurant", desc: "Order food and interact with waitstaff" },
  { id: "airport", label: "Airport", desc: "Check in and navigate the airport" },
  { id: "hotel", label: "Hotel", desc: "Check in and request services" },
  { id: "shopping", label: "Shopping", desc: "Browse and buy items at a shop" },
  { id: "general", label: "General", desc: "Casual conversation practice" },
];

export default function ConversationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function startScenario(scenario: string) {
    setLoading(scenario);
    const res = await fetch("/api/conversation/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, level: "beginner" }),
    });
    const data = await res.json();
    router.push(`/dashboard/conversation/${data.id}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Conversation Practice</h1>
      <p className="text-sm text-slate-500">Choose a scenario to practice your Bahasa Malaysia conversation skills.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() => startScenario(s.id)}
            disabled={loading === s.id}
            className="rounded-xl border border-slate-200 p-6 text-left transition-all hover:border-primary-300 hover:shadow-sm disabled:opacity-50 dark:border-slate-700"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white">{s.label}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
