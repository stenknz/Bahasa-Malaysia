import { pgTable, text, integer, date, uuid, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { users } from "./users";

export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon"),
  criteria: json("criteria").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementId: uuid("achievementId").notNull().references(() => achievements.id, { onDelete: "cascade" }),
  unlockedAt: timestamp("unlockedAt", { mode: "date" }).defaultNow().notNull(),
});

export const dailyChallenges = pgTable("daily_challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: text("type", { enum: ["vocabulary", "listening", "speaking", "conversation"] }).notNull(),
  difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  content: json("content").$type<{ question: string; expectedAnswer: string; options?: string[]; audioKey?: string }>().default({ question: "", expectedAnswer: "" }),
  xpReward: integer("xpReward").default(150).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const userDailyChallenges = pgTable("user_daily_challenges", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeId: uuid("challengeId").notNull().references(() => dailyChallenges.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  completed: boolean("completed").default(false).notNull(),
  score: integer("score"),
});

export const dailyActivity = pgTable("daily_activity", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  xpEarned: integer("xpEarned").default(0).notNull(),
  lessonsCompleted: integer("lessonsCompleted").default(0).notNull(),
  wordsReviewed: integer("wordsReviewed").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
