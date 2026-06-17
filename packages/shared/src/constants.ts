export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

export const TOPICS = {
  beginner: ["Greetings", "Introductions", "Numbers", "Colours", "Family", "Food", "Directions", "Shopping", "Weather", "Time"],
  intermediate: ["Daily Life", "Travel", "Hotels", "Restaurants", "Transport", "Workplace", "Social Situations", "Emergencies"],
  advanced: ["Business Language", "Formal Communication", "News", "Government", "Culture", "Idioms", "Native Speech"],
} as const;

export const SECTION_TYPES = ["vocab", "grammar", "dialogue", "exercise", "listening", "speaking"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export const SRS_STATUSES = ["new", "learning", "familiar", "mastered"] as const;
export type SrsStatus = (typeof SRS_STATUSES)[number];

export const XP_REWARDS = {
  completeLesson: { base: 50, max: 200 },
  perfectSection: 50,
  reviewTenWords: 30,
  dailyLogin: 10,
  streakDay: { normal: 10, extended: 50 },
  conversation: 100,
  pronunciation: 20,
  dailyChallenge: 150,
} as const;

export const SUBSCRIPTION_TIERS = ["free", "premium", "enterprise"] as const;
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];
