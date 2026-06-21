"use client";

import { useState } from "react";

const grammarTopics = [
  {
    title: "Sentence Structure",
    description: "Bahasa Malaysia follows Subject-Verb-Object (SVO) word order, similar to English.",
    examples: [
      { malay: "Saya makan nasi.", english: "I eat rice." },
      { malay: "Dia minum air.", english: "He/She drinks water." },
    ],
  },
  {
    title: "Pronouns",
    description: "Pronouns in Malay are simpler than English. 'Saya' is formal, 'Aku' is informal.",
    examples: [
      { malay: "Saya", english: "I/me/my (formal)" },
      { malay: "Awak / Kamu", english: "You (informal)" },
      { malay: "Dia", english: "He/she/it" },
      { malay: "Kami", english: "We (excluding you)" },
      { malay: "Kita", english: "We (including you)" },
    ],
  },
  {
    title: "Question Formation",
    description: "Add 'kah' to the end of a sentence to form a yes/no question. Use 'apa' (what), 'siapa' (who), 'bila' (when), 'mana' (where), 'kenapa' (why), 'berapa' (how many).",
    examples: [
      { malay: "Apa nama awak?", english: "What is your name?" },
      { malay: "Dari mana awak?", english: "Where are you from?" },
      { malay: "Berapa harga ini?", english: "How much is this?" },
    ],
  },
  {
    title: "Negation",
    description: "Use 'tidak' or 'tak' to negate verbs and adjectives. Use 'bukan' to negate nouns.",
    examples: [
      { malay: "Saya tidak mahu.", english: "I don't want." },
      { malay: "Ini bukan buku saya.", english: "This is not my book." },
    ],
  },
];

export default function GrammarPage() {
  const [topic, setTopic] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const current = grammarTopics[topic];

  async function askGrammar() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/grammar-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch {
      setAnswer("Sorry, I couldn't process that question.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Grammar Reference</h1>

      <div className="flex gap-2 overflow-x-auto">
        {grammarTopics.map((t, i) => (
          <button
            key={i}
            onClick={() => setTopic(i)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${
              i === topic
                ? "bg-primary-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{current.title}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{current.description}</p>
        <div className="mt-4 space-y-2">
          {current.examples.map((ex, i) => (
            <div key={i} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="font-medium text-slate-900 dark:text-white">{ex.malay}</p>
              <p className="text-sm text-slate-500">{ex.english}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Ask the Grammar Tutor</h2>
        <p className="mt-1 text-sm text-slate-500">Ask any question about Malay grammar.</p>
        <div className="mt-4 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askGrammar()}
            placeholder="e.g., Why is 'tidak' used here?"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
          <button
            onClick={askGrammar}
            disabled={loading}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
          >
            Ask
          </button>
        </div>
        {answer && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-sm text-slate-700 dark:text-slate-200">{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
