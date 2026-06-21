"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AudioPlayer } from "@/components/lesson/audio-player";

interface LessonSection {
  type: string;
  order: number;
  content: Record<string, unknown>;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  sections: LessonSection[];
  xpReward: number;
}

export default function LessonPlayerPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState<Record<string, { completed: boolean; score: number }>>({});

  useEffect(() => {
    fetch(`/api/lessons/${slug}`)
      .then((r) => r.json())
      .then(setLesson);
  }, [slug]);

  if (!lesson) return <div className="p-6 text-slate-500">Loading lesson...</div>;

  const sections = [...lesson.sections].sort((a, b) => a.order - b.order);
  const current = sections[activeSection];

  function renderSection(section: LessonSection) {
    switch (section.type) {
      case "vocab":
        return <VocabSection content={section.content as any} />;
      case "grammar":
        return <GrammarSection content={section.content as any} />;
      case "dialogue":
        return <DialogueSection content={section.content as any} />;
      case "exercise":
        return <ExerciseSection content={section.content as any} />;
      default:
        return <p className="text-slate-500">Unknown section type: {section.type}</p>;
    }
  }

  function markComplete() {
    setSectionProgress((prev) => ({
      ...prev,
      [`${current.type}-${current.order}`]: { completed: true, score: 100 },
    }));
  }

  async function finishLesson() {
    await fetch(`/api/lessons/${slug}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: 100,
        timeSpent: 0,
        sectionProgress,
      }),
    });
    router.push("/dashboard/lessons");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{lesson.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Section {activeSection + 1} of {sections.length}
          </p>
        </div>
        <span className="text-sm font-medium text-primary-600">+{lesson.xpReward} XP</span>
      </div>

      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-2 rounded-full bg-primary-500 transition-all"
          style={{ width: `${((activeSection + 1) / sections.length) * 100}%` }}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {sections.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveSection(i)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium capitalize ${
              i === activeSection
                ? "bg-primary-600 text-white"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {s.type}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
        {renderSection(current)}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
          disabled={activeSection === 0}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50 dark:border-slate-600"
        >
          Previous
        </button>
        {activeSection < sections.length - 1 ? (
          <div className="flex gap-3">
            <button
              onClick={markComplete}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-600"
            >
              Mark Complete
            </button>
            <button
              onClick={() => setActiveSection(activeSection + 1)}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Next
            </button>
          </div>
        ) : (
          <button
            onClick={finishLesson}
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Finish Lesson
          </button>
        )}
      </div>
    </div>
  );
}

function VocabSection({ content }: { content: { words?: string[] } }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">Vocabulary</h3>
      <div className="space-y-2">
        {content.words?.map((word) => (
          <div key={word} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
            <span className="font-medium text-slate-900 dark:text-white">{word}</span>
            <AudioPlayer text={word} />
          </div>
        ))}
      </div>
    </div>
  );
}

function GrammarSection({ content }: { content: { explanation?: string } }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">Grammar</h3>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{content.explanation}</p>
    </div>
  );
}

function DialogueSection({ content }: { content: { lines?: Array<{ speaker: string; malay: string; english: string }> } }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">Dialogue</h3>
      <div className="space-y-3">
        {content.lines?.map((line, i) => (
          <div key={i} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary-600">{line.speaker}</span>
              <AudioPlayer text={line.malay} />
            </div>
            <p className="mt-1 text-slate-900 dark:text-white">{line.malay}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{line.english}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExerciseSection({ content }: { content: { questions?: Array<{ malay: string; options: string[]; correct: number }> } }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const correctCount = content.questions?.filter((q, i) => answers[i] === q.correct).length ?? 0;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">Exercise</h3>
      <div className="space-y-4">
        {content.questions?.map((q, i) => (
          <div key={i} className="space-y-2">
            <p className="font-medium text-slate-900 dark:text-white">{q.malay}</p>
            <div className="space-y-1">
              {q.options.map((opt, j) => (
                <button
                  key={j}
                  onClick={() => !submitted && setAnswers((a) => ({ ...a, [i]: j }))}
                  className={`block w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    submitted
                      ? j === q.correct
                        ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20"
                        : answers[i] === j
                          ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20"
                          : "border-slate-200 dark:border-slate-700"
                      : answers[i] === j
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Check Answers
        </button>
      ) : (
        <p className="text-sm font-medium text-green-600">
          {correctCount} / {content.questions?.length} correct
        </p>
      )}
    </div>
  );
}
