"use client";

import { useState } from "react";
import { VocabImage } from "@/components/vocab-image";
import { getCultureImageUrl } from "@/lib/image-utils";

const topics = [
  {
    title: "Greetings & Etiquette",
    slug: "greetings-etiquette",
    content: "In Malaysia, greetings are generally warm but respectful. A handshake with both hands (touching your chest with your right hand after) is common among men. Women may nod with a smile rather than shake hands. Address elders with 'Encik' (Mr), 'Puan' (Mrs), or 'Cik' (Miss) followed by their first name. Remove shoes before entering homes and some places of worship.",
  },
  {
    title: "Festivals",
    slug: "festivals",
    content: "Malaysia's multicultural society celebrates many festivals. Hari Raya Aidilfitri marks the end of Ramadan with open houses serving traditional cookies and rendang. Chinese New Year features lion dances, ang pow (red packets), and reunion dinners. Deepavali (Festival of Lights) is celebrated with oil lamps, kolam decorations, and sweet treats. Christmas, Vesak Day, and Gawai are also widely celebrated.",
  },
  {
    title: "Food Culture",
    slug: "food-culture",
    content: "Malaysian food is a vibrant fusion of Malay, Chinese, and Indian cuisines. Rice is a staple at every meal. Eating with your right hand is traditional, but utensils are common. When invited to someone's home for a meal, it's polite to try a bit of everything and compliment the host. Common dishes: Nasi Lemak (national dish), Satay, Roti Canai, Laksa, and Teh Tarik.",
  },
  {
    title: "Business Etiquette",
    slug: "business-etiquette",
    content: "Business relationships in Malaysia are built on trust and respect. Punctuality is appreciated but not always expected. Business cards should be presented and received with both hands. The concept of 'face' (maintaining dignity and respect) is important. Avoid public criticism or confrontation. Meetings often begin with casual conversation before getting down to business.",
  },
];

export default function CulturePage() {
  const [activeTopic, setActiveTopic] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const current = topics[activeTopic];

  async function askCulture() {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/cultural-qa", {
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
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Malaysian Culture</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Learn about Malaysian customs, festivals, food, and etiquette to enhance your language learning.
      </p>

      <div className="flex gap-2 overflow-x-auto">
        {topics.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveTopic(i)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${
              i === activeTopic
                ? "bg-primary-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <VocabImage
          src={getCultureImageUrl(current.slug)}
          alt={current.title}
          className="h-48 w-full"
        />
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{current.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{current.content}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Ask the Cultural Guide</h2>
        <p className="mt-1 text-sm text-slate-500">Ask any question about Malaysian culture.</p>
        <div className="mt-4 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askCulture()}
            placeholder="e.g., What should I wear to a festival?"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          />
          <button
            onClick={askCulture}
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
