import type { Level, SectionType, SrsStatus, SubscriptionTier } from "./constants";

export interface LessonSection {
  type: SectionType;
  content: Record<string, unknown>;
  order: number;
}

export interface UserPreferences {
  theme: "light" | "dark";
  textSize: "sm" | "md" | "lg";
}

export interface PronunciationScore {
  accuracy: number;
  fluency: number;
  clarity: number;
  wordScores: Array<{ word: string; correct: boolean; confidence: number }>;
}

export interface ConversationMessage {
  role: "user" | "ai";
  content: string;
  audioUrl?: string;
  timestamp: string;
}

export interface SrsReviewResult {
  vocabularyId: string;
  grade: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
}
