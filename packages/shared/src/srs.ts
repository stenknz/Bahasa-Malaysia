import type { Grade } from "./types";

export interface SrsCard {
  repetitions: number;
  easeFactor: number;
  interval: number;
}

export function calculateSrs(card: SrsCard, grade: Grade): SrsCard {
  let { repetitions, easeFactor, interval } = card;

  if (grade < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 6;
    else interval = Math.round(interval * (easeFactor / 100));
  }

  const ef = easeFactor / 100;
  const newEf = ef + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  easeFactor = Math.round(Math.max(1.3, newEf) * 100);

  return { repetitions, easeFactor, interval };
}

export function getNextReviewDate(interval: number): string {
  const date = new Date();
  date.setDate(date.getDate() + interval);
  return date.toISOString().split("T")[0];
}

export function getStatus(repetitions: number, interval: number): "new" | "learning" | "familiar" | "mastered" {
  if (repetitions === 0) return "new";
  if (repetitions < 3) return "learning";
  if (interval < 21) return "familiar";
  return "mastered";
}
