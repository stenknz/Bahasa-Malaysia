import { pgTable, text, integer, date, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { vocabulary } from "./vocabulary";

export const srsData = pgTable("srs_data", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  vocabularyId: uuid("vocabularyId").notNull().references(() => vocabulary.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["new", "learning", "familiar", "mastered"] }).default("new").notNull(),
  repetitions: integer("repetitions").default(0).notNull(),
  easeFactor: integer("easeFactor").default(250).notNull(),
  interval: integer("interval").default(0).notNull(),
  lastReviewDate: date("lastReviewDate"),
  nextReviewDate: date("nextReviewDate"),
  lastGrade: integer("lastGrade"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
