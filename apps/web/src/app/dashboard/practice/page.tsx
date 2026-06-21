"use client";

import { useState } from "react";
import { SpeakButton } from "@/components/practice/speak-button";
import { AudioPlayer } from "@/components/lesson/audio-player";

const practiceWords = [
  { malay: "Selamat pagi", english: "Good morning" },
  { malay: "Terima kasih", english: "Thank you" },
  { malay: "Apa khabar", english: "How are you" },
  { malay: "Sama-sama", english: "You're welcome" },
  { malay: "Nama saya", english: "My name is" },
];

export default function PracticePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState<{ accuracy: number } | null>(null);

  const currentWord = practiceWords[currentIndex];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pronunciation Practice</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Listen and repeat. Speak the word or phrase aloud.
      </p>

      <div className="rounded-xl border border-slate-200 p-8 text-center dark:border-slate-700">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Word {currentIndex + 1} of {practiceWords.length}
        </p>
        <h2 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
          {currentWord.malay}
        </h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{currentWord.english}</p>

        <div className="mt-6 flex justify-center gap-4">
          <AudioPlayer text={currentWord.malay} />
          <SpeakButton
            expected={currentWord.malay}
            onResult={(result) => setScore(result)}
          />
        </div>

        {score && (
          <div className="mt-6 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 dark:bg-green-900/20">
              <span className="text-2xl font-bold text-green-600">{score.accuracy}%</span>
              <span className="text-sm text-green-600">accuracy</span>
            </div>
            <button
              onClick={() => { setScore(null); setCurrentIndex((i) => (i + 1) % practiceWords.length); }}
              className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Next Word
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
