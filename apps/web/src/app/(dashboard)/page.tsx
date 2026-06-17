export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Current Streak", value: "0 days" },
          { label: "Total XP", value: "0" },
          { label: "Lessons Completed", value: "0" },
          { label: "Vocabulary Learned", value: "0" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">Continue Learning</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Start your first lesson to begin tracking your progress.
        </p>
      </div>
    </div>
  );
}
