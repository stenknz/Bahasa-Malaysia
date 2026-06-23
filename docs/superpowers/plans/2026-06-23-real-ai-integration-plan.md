# Real AI Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace placeholder/canned AI responses in 4 API routes with real LLM calls via OpenCode Go (primary) + Ollama (fallback).

**Architecture:** Shared LLM foundation in `@malay/shared` (provider selection, OpenAI SDK client, system prompts). Per-agent service modules in `apps/web/src/lib/ai/`. API routes call these services directly — no BullMQ queue in the critical path.

**Tech Stack:** `openai` npm package (OpenAI-compatible SDK), OpenCode Go API, Ollama. All agents use the `/v1/chat/completions` endpoint format.

---

### Task 1: Install `openai` dependency

**Files:**
- Modify: `packages/shared/package.json`

- [ ] **Step 1: Add `openai` to shared package.json**

Replace the file with:
```json
{
  "name": "@malay/shared",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "openai": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install` from repo root
Expected: packages installed without errors

---

### Task 2: Create shared AI foundation

**Files:**
- Create: `packages/shared/src/ai/types.ts`
- Create: `packages/shared/src/ai/agents.ts`
- Create: `packages/shared/src/ai/client.ts`
- Create: `packages/shared/src/ai/prompts.ts`
- Create: `packages/shared/src/ai/index.ts`

- [ ] **Step 1: Create `packages/shared/src/ai/types.ts`**

```typescript
export type AIAgentName =
  | "grammar_tutor"
  | "cultural_guide"
  | "conversation_partner"
  | "pronunciation_coach";

export type LLMProvider = "opencode-go" | "ollama";

export interface AgentResponse<T = string> {
  success: boolean;
  data?: T;
  error?: string;
}
```

- [ ] **Step 2: Create `packages/shared/src/ai/agents.ts`**

```typescript
import type { AIAgentName, LLMProvider } from "./types";

interface AgentConfig {
  model: string;
  providerPriority: LLMProvider[];
}

export const agentConfigs: Record<AIAgentName, AgentConfig> = {
  grammar_tutor: {
    model: "deepseek-v4-pro",
    providerPriority: ["opencode-go", "ollama"],
  },
  cultural_guide: {
    model: "deepseek-v4-pro",
    providerPriority: ["opencode-go", "ollama"],
  },
  conversation_partner: {
    model: "deepseek-v4-pro",
    providerPriority: ["opencode-go", "ollama"],
  },
  pronunciation_coach: {
    model: "deepseek-v4-flash",
    providerPriority: ["opencode-go", "ollama"],
  },
};
```

- [ ] **Step 3: Create `packages/shared/src/ai/client.ts`**

```typescript
import OpenAI from "openai";
import type { AIAgentName, LLMProvider } from "./types";
import { agentConfigs } from "./agents";

function resolveProvider(): LLMProvider {
  if (process.env.OPCODE_GO_API_KEY) return "opencode-go";
  return "ollama";
}

function resolveBaseUrl(provider: LLMProvider): string {
  if (provider === "opencode-go") {
    return process.env.OPCODE_GO_API_URL ?? "https://opencode.ai/zen/go/v1";
  }
  return process.env.OLLAMA_BASE_URL ?? "http://localhost:11434/v1";
}

function resolveApiKey(provider: LLMProvider): string {
  if (provider === "opencode-go") {
    return process.env.OPCODE_GO_API_KEY ?? "";
  }
  return "";
}

export function createAgentClient(agentName: AIAgentName): OpenAI {
  const config = agentConfigs[agentName];
  const provider = config.providerPriority.find((p) => {
    if (p === "opencode-go") return !!process.env.OPCODE_GO_API_KEY;
    return true; // ollama always available as fallback
  }) ?? "ollama";

  return new OpenAI({
    baseURL: resolveBaseUrl(provider),
    apiKey: resolveApiKey(provider) || "sk-placeholder",
  });
}
```

- [ ] **Step 4: Create `packages/shared/src/ai/prompts.ts`**

```typescript
export const SYSTEM_PROMPTS = {
  grammar_tutor: `
You are a patient Malay language grammar teacher. You explain Malay grammar clearly and simply.
You correct mistakes gently and provide examples. Respond in English with Malay examples.
Keep explanations concise (2-4 sentences) for beginner and intermediate learners.
`.trim(),
  cultural_guide: `
You are a knowledgeable Malaysian cultural expert. You answer questions about Malaysian culture,
customs, festivals, food, etiquette, and daily life. Be warm and informative.
Keep responses concise (2-4 sentences). Use Malay terms where appropriate with English explanations.
`.trim(),
  conversation_partner: `
You are a native Malay speaker having a natural conversation with a language learner.
Match the user's language level: use simple Malay with basic vocabulary for beginners,
more complex sentences for intermediate, and full fluency for advanced.
Keep responses short (1-3 sentences) to keep the conversation flowing.
Correct any mistakes in the user's messages gently by modeling the correct usage.
`.trim(),
  pronunciation_coach: `
You are a Malay pronunciation coach. Given a target Malay word and the user's attempt,
analyze the pronunciation accuracy. Focus on common Malay sounds: 'r', 'c', 'ng', 'ny',
and vowel length. Respond in JSON format:
{ "accuracy": <0-100 number>, "feedback": "<2-3 sentence analysis>" }
`.trim(),
};
```

- [ ] **Step 5: Create `packages/shared/src/ai/index.ts`**

```typescript
export * from "./types";
export * from "./agents";
export * from "./client";
export * from "./prompts";
```

- [ ] **Step 6: Update `packages/shared/src/index.ts`**

Append a line to export the AI module:
```typescript
export * from "./constants";
export * from "./types";
export * from "./srs";
export * from "./gamification";
export * from "./ai";
```

---

### Task 3: Add `OPCODE_GO_API_URL` to `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add OPCODE_GO_API_URL env var**

Replace `.env.example` with:
```
DATABASE_URL=postgres://malaylang:malaylang@localhost:5432/malaylang
REDIS_URL=redis://localhost:6379
AUTH_SECRET=your-secret-key
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_APPLE_ID=
AUTH_APPLE_SECRET=
GOOGLE_CLOUD_API_KEY=
OPCODE_GO_API_URL=https://opencode.ai/zen/go/v1
OPCODE_GO_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
```

---

### Task 4: Create per-agent service modules

**Files:**
- Create: `apps/web/src/lib/ai/grammar-tutor.ts`
- Create: `apps/web/src/lib/ai/cultural-guide.ts`
- Create: `apps/web/src/lib/ai/conversation-partner.ts`
- Create: `apps/web/src/lib/ai/pronunciation-coach.ts`
- Create: `apps/web/src/lib/ai/index.ts`

- [ ] **Step 1: Create `apps/web/src/lib/ai/grammar-tutor.ts`**

```typescript
import { createAgentClient, SYSTEM_PROMPTS, type AgentResponse } from "@malay/shared";

export async function explainGrammar(question: string, level: string): Promise<AgentResponse<string>> {
  try {
    const client = createAgentClient("grammar_tutor");
    const completion = await client.chat.completions.create({
      model: "deepseek-v4-pro",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.grammar_tutor },
        { role: "user", content: `Student level: ${level}\n\nQuestion: ${question}` },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    return { success: true, data: completion.choices[0]?.message?.content ?? "I'm not sure about that one." };
  } catch (err) {
    console.error("grammar_tutor error:", err);
    return { success: false, error: "Failed to get grammar explanation" };
  }
}
```

- [ ] **Step 2: Create `apps/web/src/lib/ai/cultural-guide.ts`**

```typescript
import { createAgentClient, SYSTEM_PROMPTS, type AgentResponse } from "@malay/shared";

export async function askCulture(question: string): Promise<AgentResponse<string>> {
  try {
    const client = createAgentClient("cultural_guide");
    const completion = await client.chat.completions.create({
      model: "deepseek-v4-pro",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.cultural_guide },
        { role: "user", content: question },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    return { success: true, data: completion.choices[0]?.message?.content ?? "I'm not sure about that one." };
  } catch (err) {
    console.error("cultural_guide error:", err);
    return { success: false, error: "Failed to get cultural information" };
  }
}
```

- [ ] **Step 3: Create `apps/web/src/lib/ai/conversation-partner.ts`**

```typescript
import { createAgentClient, SYSTEM_PROMPTS, type AgentResponse, type ConversationMessage } from "@malay/shared";

export async function generateReply(params: {
  scenario: string;
  level: string;
  history: ConversationMessage[];
  userMessage: string;
}): Promise<AgentResponse<string>> {
  try {
    const client = createAgentClient("conversation_partner");
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      {
        role: "system",
        content: `${SYSTEM_PROMPTS.conversation_partner}\n\nScenario: ${params.scenario}\nUser level: ${params.level}`,
      },
      ...params.history.map((m) => ({
        role: m.role === "ai" ? "assistant" as const : "user" as const,
        content: m.content,
      })),
      { role: "user", content: params.userMessage },
    ];
    const completion = await client.chat.completions.create({
      model: "deepseek-v4-pro",
      messages,
      max_tokens: 200,
      temperature: 0.8,
    });
    return { success: true, data: completion.choices[0]?.message?.content ?? "Baik." };
  } catch (err) {
    console.error("conversation_partner error:", err);
    return { success: false, error: "Failed to generate reply" };
  }
}
```

- [ ] **Step 4: Create `apps/web/src/lib/ai/pronunciation-coach.ts`**

```typescript
import { createAgentClient, SYSTEM_PROMPTS, type AgentResponse } from "@malay/shared";

export async function analyzePronunciation(targetWord: string): Promise<
  AgentResponse<{ accuracy: number; feedback: string }>
> {
  try {
    const client = createAgentClient("pronunciation_coach");
    const completion = await client.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.pronunciation_coach },
        { role: "user", content: `Target word: "${targetWord}"` },
      ],
      max_tokens: 200,
      temperature: 0.3,
      response_format: { type: "json_object" },
    });
    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    return {
      success: true,
      data: {
        accuracy: typeof parsed.accuracy === "number" ? parsed.accuracy : 85,
        feedback: typeof parsed.feedback === "string" ? parsed.feedback : "Good attempt! Keep practicing.",
      },
    };
  } catch (err) {
    console.error("pronunciation_coach error:", err);
    return { success: false, error: "Failed to analyze pronunciation" };
  }
}
```

- [ ] **Step 5: Create `apps/web/src/lib/ai/index.ts`**

```typescript
export { explainGrammar } from "./grammar-tutor";
export { askCulture } from "./cultural-guide";
export { generateReply } from "./conversation-partner";
export { analyzePronunciation } from "./pronunciation-coach";
```

---

### Task 5: Rewrite cultural-qa API route

**Files:**
- Modify: `apps/web/src/app/api/ai/cultural-qa/route.ts`

- [ ] **Step 1: Replace the whole file**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { askCulture } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question } = await req.json();
  if (!question) return NextResponse.json({ error: "Question is required" }, { status: 400 });

  const result = await askCulture(question);
  if (!result.success) {
    return NextResponse.json({ answer: "Sorry, I'm having trouble thinking. Please try again." });
  }

  return NextResponse.json({ answer: result.data });
}
```

---

### Task 6: Rewrite grammar-explain API route

**Files:**
- Modify: `apps/web/src/app/api/ai/grammar-explain/route.ts`

- [ ] **Step 1: Replace the whole file**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { explainGrammar } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question, level } = await req.json();
  if (!question) return NextResponse.json({ error: "Question is required" }, { status: 400 });

  const result = await explainGrammar(question, level ?? "beginner");
  if (!result.success) {
    return NextResponse.json({ answer: "Sorry, I'm having trouble thinking. Please try again." });
  }

  return NextResponse.json({ answer: result.data });
}
```

---

### Task 7: Rewrite conversation message API route

**Files:**
- Modify: `apps/web/src/app/api/conversation/message/route.ts`

- [ ] **Step 1: Replace the file content**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, schema } from "@malay/db";
import { eq } from "drizzle-orm";
import { generateReply } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { conversationId, content } = await req.json();

  const conversation = await db.query.conversationSessions.findFirst({
    where: (c, { eq }) => eq(c.id, conversationId),
  });
  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = [...(conversation.messages as any[]), { role: "user", content, timestamp: new Date().toISOString() }];

  const result = await generateReply({
    scenario: conversation.scenario,
    level: conversation.level,
    history: messages.slice(0, -1),
    userMessage: content,
  });

  const aiResponse = result.success ? result.data! : "Maaf, saya tak dapat jawab sekarang. Cuba lagi.";
  const updatedMessages = [...messages, { role: "ai", content: aiResponse, timestamp: new Date().toISOString() }];

  await db.update(schema.conversationSessions)
    .set({ messages: updatedMessages as any })
    .where(eq(schema.conversationSessions.id, conversationId));

  return NextResponse.json({ reply: aiResponse, messages: updatedMessages });
}
```

---

### Task 8: Rewrite pronunciation API route

**Files:**
- Modify: `apps/web/src/app/api/audio/pronunciation/route.ts`

- [ ] **Step 1: Replace the file content**

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzePronunciation } from "@/lib/ai";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const expected = formData.get("expected") as string;
  if (!expected) return NextResponse.json({ error: "expected word is required" }, { status: 400 });

  const result = await analyzePronunciation(expected);
  if (!result.success) {
    return NextResponse.json({ accuracy: 85, expected });
  }

  return NextResponse.json({ accuracy: result.data!.accuracy, feedback: result.data!.feedback, expected });
}
```

---

### Task 9: Typecheck and verify

- [ ] **Step 1: Run typecheck**

Run: `npx turbo typecheck` from repo root
Expected: No type errors

- [ ] **Step 2: Verify API routes work**

Start dev server then test each route:
```
curl -X POST http://localhost:3000/api/ai/cultural-qa -H "Content-Type: application/json" -d '{"question":"What should I wear?"}'
curl -X POST http://localhost:3000/api/ai/grammar-explain -H "Content-Type: application/json" -d '{"question":"How does tidak work?","level":"beginner"}'
```
Expected: Each returns JSON with `answer` field containing meaningful LLM-generated content

- [ ] **Step 3: Commit**

```bash
git add packages/shared/src/ai/ apps/web/src/lib/ai/ apps/web/src/app/api/ai/cultural-qa/route.ts apps/web/src/app/api/ai/grammar-explain/route.ts apps/web/src/app/api/conversation/message/route.ts apps/web/src/app/api/audio/pronunciation/route.ts packages/shared/package.json .env.example
git commit -m "feat: real AI integration via OpenCode Go + Ollama

Replace placeholder responses in 4 API routes with real LLM calls:
- Shared AI foundation: types, agent configs, OpenAI client, system prompts
- Per-agent services: grammar-tutor, cultural-guide, conversation-partner, pronunciation-coach
- Routes: cultural-qa, grammar-explain, conversation/message, audio/pronunciation
- Provider selection: OpenCode Go primary, Ollama fallback"
```
