import { db, schema } from "@malay/db";
import { count } from "drizzle-orm";

export default async function AdminDashboardPage() {
  const [userCount] = await db.select({ count: count() }).from(schema.users);
  const [lessonCount] = await db.select({ count: count() }).from(schema.lessons);
  const [vocabCount] = await db.select({ count: count() }).from(schema.vocabulary);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm text-slate-500">Users</p>
          <p className="mt-1 text-3xl font-bold">{userCount.count}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm text-slate-500">Lessons</p>
          <p className="mt-1 text-3xl font-bold">{lessonCount.count}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <p className="text-sm text-slate-500">Vocabulary Words</p>
          <p className="mt-1 text-3xl font-bold">{vocabCount.count}</p>
        </div>
      </div>
    </div>
  );
}
