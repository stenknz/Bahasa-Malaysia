# Phase 3: Advanced Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add AI-powered learning features, gamification, progress tracking with charts, conversation simulator, and grammar tutor.

**Architecture:** BullMQ worker process for AI agent calls (OpenCode Go + Ollama). Redis for job queuing. Drizzle aggregation queries for progress stats. Server-sent events for real-time conversation.

**Tech Stack:** OpenCode Go API, Ollama, BullMQ, Redis, Chart.js (client-side), Drizzle aggregation queries

---

### Task 1: Worker Process Setup

**Files:**
- Create: `apps/worker/package.json`
- Create: `apps/worker/tsconfig.json`
- Create: `apps/worker/src/index.ts`
- Create: `apps/worker/src/config/agents.ts`

- [ ] **Step 1: Create worker package.json**

```json
{
  "name": "@malay/worker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "tsx src/index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@malay/db": "*",
    "@malay/shared": "*",
    "bullmq": "^5.0.0",
    "ioredis": "^5.4.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "tsx": "^4.19.0"
  }
}
```

- [ ] **Step 2: Create AI agent config**

```typescript
// apps/worker/src/config/agents.ts
export interface AgentConfig {
  endpoint: string;
  model: string;
  apiKey: string;
}

export const agentConfigs: Record<string, AgentConfig> = {
  lesson_creator: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-flash",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  pronunciation_coach: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-flash",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  grammar_tutor: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-pro",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  conversation_partner: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-pro",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  progress_coach: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-flash",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
  cultural_guide: {
    endpoint: process.env.OPCODE_GO_API_URL ?? process.env.OLLAMA_BASE_URL ?? "https://opencode.ai/zen/go/v1/chat/completions",
    model: "deepseek-v4-pro",
    apiKey: process.env.OPCODE_GO_API_KEY ?? "",
  },
};
```

- [ ] **Step 3: Create worker entry point**

```typescript
// apps/worker/src/index.ts
import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", { maxRetriesPerRequest: null });

export const audioQueue = new Queue("audio", { connection });
export const aiQueue = new Queue("ai-agents", { connection });

console.log("Worker process started. Queues: audio, ai-agents");

// Listen for jobs (handlers will be added in subsequent tasks)
// Placeholder: worker will be expanded in Phase 3 tasks
```

- [ ] **Step 4: Add worker to docker-compose.yml**

Add to docker-compose.yml:
```yaml
  worker:
    build: ./apps/worker
    environment:
      DATABASE_URL: postgres://malaylang:malaylang@postgres:5432/malaylang
      REDIS_URL: redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
```

- [ ] **Step 5: Verify typecheck**

Run: `npx turbo typecheck`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: worker process setup with BullMQ and AI agent config"
```

---

### Task 2: AI Conversation Partner

**Files:**
- Create: `apps/web/src/app/api/conversation/start/route.ts`
- Create: `apps/web/src/app/api/conversation/message/route.ts`
- Create: `apps/web/src/app/api/conversation/history/route.ts`
- Create: `apps/web/src/app/(dashboard)/conversation/page.tsx`
- Create: `apps/web/src/app/(dashboard)/conversation/[id]/page.tsx`
- Add `conversation_sessions` table to schema

- [ ] **Step 1: Add conversation_sessions table**

```typescript
// packages/db/src/schema/conversation.ts
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
```

- [ ] **Step 2: Create conversation start API**

```typescript
// apps/web/src/app/api/conversation/start/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";

const scenarios = {
  restaurant: "You are a waiter at a Malaysian restaurant. The user is a customer. Greet them and take their order.",
  airport: "You are an airport staff member. Help the user check in for their flight.",
  hotel: "You are a hotel receptionist. The user wants to check in.",
  shopping: "You are a shopkeeper. The user wants to buy something.",
  general: "You are a friendly Malaysian helping a foreigner practice Bahasa Malaysia.",
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { scenario = "general", level = "beginner" } = await req.json();
  const prompt = scenarios[scenario as keyof typeof scenarios] ?? scenarios.general;

  const [conversation] = await db.insert(schema.conversationSessions).values({
    userId: session.user.id!,
    scenario,
    level,
    messages: [],
  }).returning();

  return NextResponse.json({ id: conversation.id, prompt });
}
```

- [ ] **Step 3: Create conversation message API**

```typescript
// apps/web/src/app/api/conversation/message/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { conversationId, content } = await req.json();

  const conversation = await db.query.conversationSessions.findFirst({
    where: (c, { eq }) => eq(c.id, conversationId),
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = [...(conversation.messages as any[]), { role: "user", content, timestamp: new Date().toISOString() }];

  // TODO: Call LLM via worker for AI response
  // For now, return a placeholder response
  const aiResponse = "Baik. Saya faham. Mari kita teruskan.";

  const updatedMessages = [...messages, { role: "ai", content: aiResponse, timestamp: new Date().toISOString() }];

  await db.update(schema.conversationSessions)
    .set({ messages: updatedMessages as any })
    .where(eq(schema.conversationSessions.id, conversationId));

  return NextResponse.json({ reply: aiResponse, messages: updatedMessages });
}
```

- [ ] **Step 4: Create conversation pages**

(Full chat UI with message bubbles, send input, scenario context)

- [ ] **Step 5: Verify build**

Run: `npx turbo build`
Run: `npx turbo typecheck`

- [ ] **Step 6: Commit**

```bash
git commit -m "feat: conversation partner API and chat UI"
```

---

### Task 3: Gamification (XP, Streaks, Achievements)

**Files:**
- Create: `apps/web/src/app/api/progress/dashboard/route.ts`
- Create: `apps/web/src/app/api/progress/streak/route.ts`
- Create: `apps/web/src/app/api/xp/route.ts`
- Create: `apps/web/src/app/api/achievements/route.ts`
- Create: `packages/shared/src/gamification.ts`
- Add achievements tables to schema

- [ ] **Step 1: Add gamification tables to schema**

Create `packages/db/src/schema/gamification.ts` (achievements, user_achievements tables, daily_challenges, user_daily_challenges)

- [ ] **Step 2: Create gamification logic**

XP calculation, streak tracking, achievement unlocking logic in `packages/shared/src/gamification.ts`

- [ ] **Step 3: Create dashboard/streak/XP/achievements API routes**

- [ ] **Step 4: Update dashboard UI to show real stats**

- [ ] **Step 5: Verify build**

- [ ] **Step 6: Commit**

---

### Task 4: Progress Dashboard with Charts

**Files:**
- Create: `apps/web/src/app/(dashboard)/progress/page.tsx`
- Add chart components

- [ ] **Step 1: Add chart component (using simple CSS charts, no heavy dependencies)**

- [ ] **Step 2: Create progress page with vocabulary mastery, XP over time, lesson completion**

- [ ] **Step 3: Verify build**

- [ ] **Step 4: Commit**

---

### Task 5: Grammar Tutor + Daily Challenges

**Files:**
- Create: `apps/web/src/app/(dashboard)/grammar/page.tsx`
- Create: `apps/web/src/app/api/ai/grammar-explain/route.ts`
- Create: `apps/web/src/app/(dashboard)/listening/page.tsx`
- Create: `apps/web/src/app/api/daily-challenge/claim/route.ts`

- [ ] **Step 1: Create grammar reference pages with explanations**

- [ ] **Step 2: Create grammar tutor API (calls LLM)**

- [ ] **Step 3: Create listening challenge pages**

- [ ] **Step 4: Create daily challenge API**

- [ ] **Step 5: Verify build**

- [ ] **Step 6: Commit**

---

### Task 6: Cultural Content Pages

**Files:**
- Create: `apps/web/src/app/(dashboard)/culture/page.tsx`
- Create: `apps/web/src/app/api/ai/cultural-qa/route.ts`

- [ ] **Step 1: Create culture pages with Malaysian customs, festivals, food, etiquette**

- [ ] **Step 2: Create cultural guide API (calls LLM)**

- [ ] **Step 3: Verify build**

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: Phase 3 complete - AI agents, gamification, progress, grammar, culture"
```
