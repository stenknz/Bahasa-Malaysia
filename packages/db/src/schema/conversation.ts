import { pgTable, text, timestamp, integer, uuid, json } from "drizzle-orm/pg-core";
import { users } from "./users";

export const conversationSessions = pgTable("conversation_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  scenario: text("scenario", { enum: ["restaurant", "airport", "hotel", "shopping", "general"] }).notNull(),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  messages: json("messages").$type<Array<{ role: "user" | "ai"; content: string; timestamp: string }>>().default([]).notNull(),
  scores: json("scores").$type<{ pronunciation?: number; fluency?: number; accuracy?: number }>(),
  duration: integer("duration"),
  startedAt: timestamp("startedAt", { mode: "date" }).defaultNow().notNull(),
  endedAt: timestamp("endedAt", { mode: "date" }),
});
