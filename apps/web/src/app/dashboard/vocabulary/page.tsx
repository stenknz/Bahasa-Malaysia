"use client";

import { useEffect, useState } from "react";
import { VocabImage } from "@/components/vocab-image";
import { AudioPlayer } from "@/components/lesson/audio-player";
import { getVocabImageUrl } from "@/lib/image-utils";

interface VocabWord {
  id: string;
  malay: string;
  english: string;
  category: string;
  difficulty: string;
  imageUrl: string | null;
}

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabWord[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/vocabulary")
      .then((r) => r.json())
      .then((data: VocabWord[]) => {
        setWords(data);
        const cats = [...new Set(data.map((w) => w.category))].sort();
        setCategories(cats);
      });
  }, []);

  const filtered = filter === "all" ? words : words.filter((w) => w.category === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vocabulary</h1>
      <p className="text-sm text-slate-500">Browse all vocabulary words with images.</p>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
            filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${
              filter === cat
                ? "bg-primary-600 text-white"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {cat.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((word) => (
          <div
            key={word.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
          >
            <VocabImage
              src={word.imageUrl || getVocabImageUrl(word.malay, word.english)}
              alt={word.english}
              className="h-40 w-full"
            />
            <div className="space-y-1 p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-900 dark:text-white">{word.malay}</span>
                <AudioPlayer text={word.malay} />
              </div>
              <p className="text-sm text-slate-500">{word.english}</p>
              <span className="inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 capitalize dark:bg-slate-700 dark:text-slate-400">
                {word.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
