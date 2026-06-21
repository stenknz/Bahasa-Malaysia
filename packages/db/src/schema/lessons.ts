import { pgTable, text, timestamp, integer, uuid, json, boolean } from "drizzle-orm/pg-core";

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  topic: text("topic").notNull(),
  imageUrl: text("imageUrl"),
  xpReward: integer("xpReward").default(50).notNull(),
  isPremium: boolean("isPremium").default(false).notNull(),
  sections: json("sections").$type<Array<{ type: "vocab" | "grammar" | "dialogue" | "exercise" | "listening" | "speaking"; content: Record<string, unknown>; order: number }>>().default([]).notNull(),
  status: text("status", { enum: ["draft", "published"] }).default("draft").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});
