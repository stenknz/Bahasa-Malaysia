"use client";

import { useEffect, useState } from "react";

const plans = [
  { name: "Free", price: "$0", tier: "free", features: ["First 10 lessons", "5 SRS reviews/day", "1 conversation/week", "Basic audio"] },
  { name: "Premium", price: "$10/mo", tier: "premium", features: ["All lessons", "Unlimited SRS reviews", "Unlimited conversations", "Male + Female voices", "Pronunciation scoring", "Offline downloads", "Daily challenges"] },
  { name: "Enterprise", price: "Custom", tier: "enterprise", features: ["Everything in Premium", "Team management", "Custom content", "Priority support"] },
];

export default function SubscriptionPage() {
  const [currentTier, setCurrentTier] = useState<string>("free");

  useEffect(() => {
    fetch("/api/user/subscription").then((r) => r.json()).then((d) => setCurrentTier(d.tier));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subscription</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Choose the plan that fits your learning journey.</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.tier === currentTier;
          return (
            <div key={plan.tier} className={`rounded-xl border p-6 ${isCurrent ? "border-primary-500 ring-2 ring-primary-500" : "border-slate-200 dark:border-slate-700"}`}>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold text-primary-600">{plan.price}</p>
              {isCurrent && <span className="mt-2 inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">Current Plan</span>}
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent}
                className="mt-6 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:bg-slate-300 disabled:text-slate-500 dark:disabled:bg-slate-700"
              >
                {isCurrent ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
