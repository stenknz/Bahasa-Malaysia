import {
  pgTable, text, timestamp, integer, date, json, uuid, boolean
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).default("beginner").notNull(),
  totalXp: integer("totalXp").default(0).notNull(),
  currentStreak: integer("currentStreak").default(0).notNull(),
  longestStreak: integer("longestStreak").default(0).notNull(),
  lastActivityDate: date("lastActivityDate"),
  subscriptionTier: text("subscriptionTier", { enum: ["free", "premium", "enterprise"] }).default("free").notNull(),
  subscriptionStatus: text("subscriptionStatus"),
  subscriptionEnd: timestamp("subscriptionEnd", { mode: "date" }),
  preferences: json("preferences").$type<{ theme: "light" | "dark"; textSize: "sm" | "md" | "lg" }>().default({ theme: "light", textSize: "md" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const authenticators = pgTable("authenticators", {
  credentialID: text("credentialID").notNull().unique(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: boolean("credentialBackedUp").notNull(),
  transports: text("transports"),
});
