"use client";

import { useEffect, useState } from "react";

export default function AdminVocabularyPage() {
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/vocabulary").then((r) => r.json()).then(setWords);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Vocabulary</h1>
      </div>
      <div className="overflow-x-auto rounded-lg border dark:border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left dark:bg-slate-800">
            <tr>
              <th className="px-4 py-2 font-medium">Malay</th>
              <th className="px-4 py-2 font-medium">English</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Difficulty</th>
              <th className="px-4 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-700">
            {words.map((w) => (
              <tr key={w.id}>
                <td className="px-4 py-2 font-medium">{w.malay}</td>
                <td className="px-4 py-2">{w.english}</td>
                <td className="px-4 py-2">{w.category}</td>
                <td className="px-4 py-2 capitalize">{w.difficulty}</td>
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
