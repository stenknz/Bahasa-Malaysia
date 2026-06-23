# Real AI Integration — Phase 3 Design

## Overview

Replace placeholder/canned responses in 4 API routes with real LLM calls. Primary provider: OpenCode Go API. Fallback: Ollama (local). Both use the OpenAI-compatible `/v1/chat/completions` endpoint format.

## Architecture

```
API Route (Next.js)
  → Per-agent service module
    → createAgentClient(agentName)
      → OpenAI SDK (provider selected by env vars)
        → POST /v1/chat/completions
    → Parse response, return to route
  → Return JSON to client
```

No BullMQ queue in the critical path — direct calls from API routes. Worker process is left unused for now; can be adopted later if async processing is needed.

## Implementation

### 1. packages/shared/src/ai/ — Shared LLM Foundation

**`types.ts`:**
```typescript
export type AIAgentName = "grammar_tutor" | "cultural_guide" | "conversation_partner" | "pronunciation_coach";

export type LLMProvider = "opencode-go" | "ollama";

export interface AgentResponse<T = string> {
  success: boolean;
  data?: T;
  error?: string;
}
```

**`agents.ts`** — Move agent configs from `apps/worker/src/config/agents.ts` here:
```typescript
interface AgentConfig {
  model: string;
  providerPriority: (LLMProvider)[];
}

export const agentConfigs: Record<AIAgentName, AgentConfig> = {
  grammar_tutor: { model: "deepseek-v4-pro", providerPriority: ["opencode-go", "ollama"] },
  cultural_guide: { model: "deepseek-v4-pro", providerPriority: ["opencode-go", "ollama"] },
  conversation_partner: { model: "deepseek-v4-pro", providerPriority: ["opencode-go", "ollama"] },
  pronunciation_coach: { model: "deepseek-v4-flash", providerPriority: ["opencode-go", "ollama"] },
};
```

**`client.ts`** — Provider selection + OpenAI client creation:
```typescript
export function createAgentClient(agentName: AIAgentName): OpenAI { ... }
```
- Reads `OPCODE_GO_API_URL` / `OPCODE_GO_API_KEY` for primary
- Falls back to `OLLAMA_BASE_URL` (no API key needed)
- Constructs OpenAI SDK with `baseURL` pointing to `/v1` and appropriate `apiKey`

**`prompts.ts`** — System prompts per agent:
- `grammar_tutor`: "You are a patient Malay language grammar teacher. Explain grammar clearly at the student's level."
- `cultural_guide`: "You are a knowledgeable Malaysian cultural expert. Answer questions about Malaysian culture, customs, and etiquette."
- `conversation_partner`: "You are a native Malay speaker. Respond naturally at the user's language level. Use simple Malay for beginners, more complex for advanced."
- `pronunciation_coach`: "You are a Malay pronunciation coach. Analyze the user's attempt and give specific feedback."

### 2. apps/web/src/lib/ai/ — Per-Agent Services

Four modules, each exporting a single function. All return `AgentResponse`.

**`grammar-tutor.ts`:**
```typescript
export async function explainGrammar(question: string, level: string): Promise<AgentResponse<string>>
```
- Calls `grammar_tutor` agent
- Prompt: system prompt + user's question + their level

**`cultural-guide.ts`:**
```typescript
export async function askCulture(question: string): Promise<AgentResponse<string>>
```
- Calls `cultural_guide` agent with user's question

**`conversation-partner.ts`:**
```typescript
export async function generateReply(params: {
  scenario: string;
  level: string;
  history: ConversationMessage[];
  userMessage: string;
}): Promise<AgentResponse<string>>
```
- Calls `conversation_partner` agent
- Builds context: scenario description + level + message history
- Sends as messages array for proper conversation context

**`pronunciation-coach.ts`:**
```typescript
export async function analyzePronunciation(targetWord: string, userAttempt: string): Promise<AgentResponse<{accuracy: number; feedback: string}>>
```
- Calls `pronunciation_coach` agent
- Requests JSON response with accuracy score + feedback text

### 3. API Route Changes

| Route | Change |
|---|---|
| `POST /api/ai/cultural-qa` | Replace keyword dict with `askCulture(question)` |
| `POST /api/ai/grammar-explain` | Replace keyword dict with `explainGrammar(question, level)` |
| `POST /api/conversation/message` | Replace static string with `generateReply({scenario, level, history, userMessage})` |
| `POST /api/audio/pronunciation` | Replace random score with `analyzePronunciation(word, attempt)` |
| All routes | Add error handler returning `{ answer: "Sorry, I'm having trouble thinking. Please try again." }` on LLM failure |

### 4. Environment Variables

Add to `.env.example` and `.env.local`:
```
OPCODE_GO_API_URL=https://opencode.ai/zen/go/v1
OPCODE_GO_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434/v1
```

The `OPCODE_GO_API_URL` must point to the `/v1` base (not the full chat completions path). The OpenAI SDK appends `/chat/completions`.

### 5. Dependencies

- `apps/web/package.json`: add `openai` (latest version)
- `packages/shared/package.json`: add `openai` (latest version) — needed for types/imports

## Error Handling

All agent calls wrapped in try/catch. On error:
1. Log the error (console.error with agent name + error message)
2. Return `{ success: false, error: "LLM call failed" }`
3. API route responds with graceful fallback message

## Out of Scope

- Pronunciation scoring — `pronunciation_coach` gives text feedback only; audio waveform analysis not included
- Worker process — BullMQ queues remain defined but unused
- Streaming — all responses are full-text, no SSE/streaming
- Conversation session ending — the `endedAt` field not automatically set
- AI agent logs database table — not created; errors logged to console only
