import { pgTable, text, timestamp, integer, uuid, json, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { lessons } from "./lessons";

export const userProgress = pgTable("user_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  lessonId: uuid("lessonId").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false).notNull(),
  score: integer("score"),
  timeSpent: integer("timeSpent"),
  sectionProgress: json("sectionProgress").$type<Record<string, { completed: boolean; score: number }>>().default({}),
  attempts: integer("attempts").default(1),
  completedAt: timestamp("completedAt", { mode: "date" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
