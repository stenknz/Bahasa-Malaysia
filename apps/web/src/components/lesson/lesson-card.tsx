import Link from "next/link";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: string;
  topic: string;
  order: number;
  xpReward: number;
  isPremium: boolean;
}

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link
      href={`/dashboard/lessons/${lesson.slug}`}
      className="rounded-xl border border-slate-200 p-4 transition-all hover:border-primary-300 hover:shadow-sm dark:border-slate-700 dark:hover:border-primary-600"
    >
      <div className="flex items-start justify-between">
        <span className="rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
          {lesson.topic}
        </span>
        {lesson.isPremium && (
          <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            Premium
          </span>
        )}
      </div>
      <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{lesson.title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lesson.description}</p>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <span>+{lesson.xpReward} XP</span>
      </div>
    </Link>
  );
}
