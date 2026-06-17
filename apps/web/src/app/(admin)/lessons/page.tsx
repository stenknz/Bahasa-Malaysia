"use client";

import { useEffect, useState } from "react";

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/lessons").then((r) => r.json()).then(setLessons);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Lessons</h1>
      </div>
      <div className="overflow-x-auto rounded-lg border dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Level</th>
              <th className="px-4 py-2 font-medium">Topic</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-700">
            {lessons.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-2 font-medium">{l.title}</td>
                <td className="px-4 py-2 capitalize">{l.level}</td>
                <td className="px-4 py-2">{l.topic}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${l.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button className="text-primary-600 hover:text-primary-800 text-xs font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
