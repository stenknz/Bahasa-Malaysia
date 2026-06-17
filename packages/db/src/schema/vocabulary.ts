import { pgTable, text, integer, uuid, timestamp } from "drizzle-orm/pg-core";

export const vocabulary = pgTable("vocabulary", {
  id: uuid("id").defaultRandom().primaryKey(),
  malay: text("malay").notNull(),
  english: text("english").notNull(),
  pronunciation: text("pronunciation"),
  partOfSpeech: text("partOfSpeech", { enum: ["noun", "verb", "adjective", "adverb", "pronoun", "preposition", "conjunction", "interjection"] }),
  category: text("category").notNull(),
  difficulty: text("difficulty", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  exampleSentenceMalay: text("exampleSentenceMalay"),
  exampleSentenceEnglish: text("exampleSentenceEnglish"),
  audioKey: text("audioKey"),
  frequency: integer("frequency").default(0),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
