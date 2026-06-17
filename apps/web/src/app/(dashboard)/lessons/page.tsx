"use client";

import { useEffect, useState } from "react";
import { LessonCard } from "@/components/lesson/lesson-card";

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

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLevel, setActiveLevel] = useState<string>("beginner");

  useEffect(() => {
    fetch(`/api/lessons?level=${activeLevel}`)
      .then((r) => r.json())
      .then(setLessons);
  }, [activeLevel]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lessons</h1>
        <div className="flex gap-2">
          {["beginner", "intermediate", "advanced"].map((l) => (
            <button
              key={l}
              onClick={() => setActiveLevel(l)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${
                activeLevel === l
                  ? "bg-primary-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
