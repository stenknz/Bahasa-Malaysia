"use client";

import { useState } from "react";
import { AudioPlayer } from "@/components/lesson/audio-player";

const challenges = [
  { malay: "Di mana tandas?", answer: "Where is the toilet?", options: ["Where is the toilet?", "What time is it?", "How are you?", "Where are you going?"] },
  { malay: "Berapa harga ini?", answer: "How much is this?", options: ["How much is this?", "What is this?", "Where is this?", "Who is this?"] },
  { malay: "Saya mahu makan.", answer: "I want to eat.", options: ["I want to drink.", "I want to eat.", "I want to go.", "I want to sleep."] },
];

export default function ListeningPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const challenge = challenges[index];

  function submitAnswer() {
    setSubmitted(true);
  }

  function next() {
    setSelected(null);
    setSubmitted(false);
    setIndex((i) => (i + 1) % challenges.length);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Listening Challenges</h1>
      <p className="text-sm text-slate-500">Listen to the audio and choose the correct translation.</p>

      <div className="rounded-xl border border-slate-200 p-8 text-center dark:border-slate-700">
        <p className="text-sm text-slate-400">Challenge {index + 1} of {challenges.length}</p>
        <div className="mt-6 flex justify-center">
          <AudioPlayer text={challenge.malay} />
        </div>

        <div className="mt-6 space-y-2">
          {challenge.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => !submitted && setSelected(i)}
              className={`block w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                submitted
                  ? i === challenge.options.indexOf(challenge.answer)
                    ? "border-green-500 bg-green-50 text-green-700"
                    : selected === i
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 dark:border-slate-700"
                  : selected === i
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {!submitted ? (
            <button onClick={submitAnswer} disabled={selected === null} className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50">
              Check Answer
            </button>
          ) : (
            <button onClick={next} className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white hover:bg-primary-700">
              Next Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
