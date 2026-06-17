# Bahasa Malaysia Mastery — System Design Specification

## Overview

A modern, production-quality language learning platform teaching English speakers to speak, understand, read, and write Bahasa Malaysia through audio-first learning. Targets complete beginners through advanced learners, including travelers, business professionals, and expats.

## Technology Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript + TailwindCSS |
| Backend | Next.js API routes + BullMQ background worker |
| Database | PostgreSQL 16 (via Drizzle ORM) |
| Cache/Queue | Redis 7 |
| Auth | Auth.js (NextAuth) — Email, Google, Apple |
| Audio | Google Cloud TTS/STT (Bahasa Malaysia `ms-MY`) |
| AI | OpenCode Go (primary) + Ollama (local fallback) |
| Monorepo | Turborepo |
| Deployment | Docker Compose |

## Project Structure

```
malay-lang/
├── apps/
│   ├── web/                 # Next.js App Router (frontend + API routes)
│   │   ├── app/
│   │   │   ├── (auth)/      # Login, register, OAuth callbacks
│   │   │   ├── (dashboard)/ # Main app after login
│   │   │   │   ├── vocabulary/
│   │   │   │   ├── lessons/
│   │   │   │   ├── conversation/
│   │   │   │   ├── listening/
│   │   │   │   ├── practice/
│   │   │   │   ├── grammar/
│   │   │   │   ├── culture/
│   │   │   │   ├── progress/
│   │   │   │   ├── settings/
│   │   │   │   └── subscription/
│   │   │   ├── (admin)/     # Admin panel
│   │   │   │   ├── lessons/
│   │   │   │   ├── vocabulary/
│   │   │   │   ├── users/
│   │   │   │   ├── analytics/
│   │   │   │   └── ai-logs/
│   │   │   └── api/         # All API routes
│   │   ├── components/      # Shared UI components (AudioPlayer, SpeakButton, ProgressRing, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Client-side utilities
│   └── worker/              # BullMQ background worker
│       └── src/
│           ├── jobs/        # AI generation, audio processing, SRS
│           ├── agents/      # AI agent implementations
│           └── config/
│               └── agents.ts # LLM routing config
├── packages/
│   ├── shared/              # Zod schemas, constants, types
│   ├── db/                  # Drizzle schema, migrations, seeds
│   └── audio/               # TTS/STT/pronunciation pipeline
├── docker-compose.yml
├── docker-compose.dev.yml
├── turbo.json
└── package.json
```

## Database Schema

### Core Tables

**users**
- `id` UUID PK
- `name`, `email`, `image` — profile
- `role` enum (user, admin)
- `level` enum (beginner, intermediate, advanced)
- `totalXp` int, `currentStreak` int, `longestStreak` int
- `lastActivityDate` date — streak tracking
- `subscriptionTier` enum (free, premium, enterprise)
- `subscriptionStatus`, `subscriptionEnd` — Stripe integration
- `preferences` JSON (theme: dark|light, textSize, language)

**Auth.js tables** — Account, Session, VerificationToken, Authenticator

**lessons**
- `id` UUID PK
- `slug` unique, `title`, `description`, `order`
- `level` enum, `topic` — references topics (Greetings, Food, etc.)
- `xpReward` int
- `isPremium` boolean
- `sections` JSON array — each: `{ type: vocab|grammar|dialogue|exercise|listening|speaking, content, order }`
- `status` enum (draft, published)
- `createdAt`, `updatedAt`

**lesson_audio** — Pre-generated audio for lesson content
- `id` UUID PK
- `lessonSectionId` — references lesson section
- `text` — original text
- `voice` enum (male, female)
- `speed` enum (normal, slow)
- `audioUrl` text
- `durationMs` int

**vocabulary**
- `id` UUID PK
- `malay` text, `english` text
- `pronunciation` text (phonetic guide)
- `partOfSpeech` enum
- `category` enum (food, greetings, numbers, etc.)
- `difficulty` enum (beginner, intermediate, advanced)
- `exampleSentenceMalay`, `exampleSentenceEnglish`
- `audioKey` text — TTS cache lookup
- `frequency` int — usage frequency rank

**user_progress**
- `id` UUID PK
- `userId` FK → users
- `lessonId` FK → lessons
- `completed` boolean
- `score` float (0-100)
- `timeSpent` int (seconds)
- `sectionProgress` JSON — per-section completion/score
- `attempts` int
- `completedAt` timestamp

**srs_data** — Spaced Repetition per user per word
- `id` UUID PK
- `userId` FK → users
- `vocabularyId` FK → vocabulary
- `status` enum (new, learning, familiar, mastered)
- `repetitions` int
- `easeFactor` float (default 2.5)
- `interval` int (days)
- `lastReviewDate` date
- `nextReviewDate` date
- `lastGrade` int (1-5)

**achievements**
- `id` UUID PK
- `key` text unique (e.g., "first_words", "streak_master")
- `title`, `description`, `icon`
- `criteria` JSON — conditions to unlock

**user_achievements**
- `userId` FK → users
- `achievementId` FK → achievements
- `unlockedAt` timestamp

**daily_challenges** — Template definitions
- `id` UUID PK
- `type` enum (vocabulary, listening, speaking, conversation)
- `difficulty` enum
- `content` JSON (question, expected_answer, options, audioKey)
- `xpReward` int

**user_daily_challenges** — Per-user completion tracking
- `userId` FK → users
- `challengeId` FK → daily_challenges
- `date` date
- `completed` boolean, `score` float

**conversation_sessions**
- `id` UUID PK
- `userId` FK → users
- `scenario` enum (restaurant, airport, hotel, shopping, etc.)
- `level` enum
- `messages` JSON array — `{ role: user|ai, content, audioUrl, timestamp }`
- `scores` JSON — pronunciation, fluency, accuracy
- `duration` int (seconds)
- `startedAt`, `endedAt`

**ai_agent_logs**
- `id` UUID PK
- `userId` FK → users
- `agent` enum (lesson_creator, pronunciation_coach, grammar_tutor, conversation_partner, progress_coach, cultural_guide)
- `prompt` text, `response` text
- `model` text — which LLM was used
- `latencyMs` int
- `feedback` enum (positive, negative) — user thumbs up/down
- `createdAt` timestamp

**audio_cache**
- `id` UUID PK
- `textHash` text — SHA256 of normalized text
- `voice` enum, `speed` enum
- `audioData` bytea or `audioUrl` text
- `generatedAt` timestamp, `expiresAt` timestamp
- `usageCount` int

### Spaced Repetition (SM-2)

```
Grade scale: 1=complete fail, 2=fail, 3=hard, 4=good, 5=perfect

Perfect (5):   interval *= easeFactor,  repetitions++
Good (4):      interval *= easeFactor * 0.9,  repetitions++
Hard (3):      interval unchanged,  repetitions unchanged
Fail (1-2):    interval = 1 day,  repetitions = 0

Ease Factor: EF' = EF + (0.1 - (5-grade) * (0.08 + (5-grade) * 0.02))
Min EF: 1.3

Status:
  New → Learning (reps >= 3) → Familiar (reps >= 3 && interval < 21) → Mastered (reps >= 3 && interval >= 21)
```

## API Routes

### Auth (Auth.js)
```
GET    /api/auth/session
POST   /api/auth/callback/credentials
POST   /api/auth/callback/google
POST   /api/auth/callback/apple
POST   /api/auth/signout
```

### Lessons
```
GET    /api/lessons                           — list (filter by level/topic)
GET    /api/lessons/[slug]                    — single lesson with sections
POST   /api/lessons/[slug]/progress           — save progress
GET    /api/lessons/[slug]/audio              — all lesson audio
```

### Vocabulary & SRS
```
GET    /api/vocabulary                        — list (filter by level/category)
GET    /api/vocabulary/[id]                   — word detail + audio
POST   /api/vocabulary/[id]/review            — submit SRS review (grade, correct/incorrect)
GET    /api/vocabulary/review                 — due words for today
GET    /api/vocabulary/stats                  — mastery by category
```

### Audio
```
POST   /api/audio/speak                       — generate TTS (text, voice, speed)
POST   /api/audio/transcribe                  — upload → text
POST   /api/audio/pronunciation               — analyze (audio + expected text)
```

### Conversation
```
POST   /api/conversation/start                — begin scenario
POST   /api/conversation/message              — send message, get AI reply
POST   /api/conversation/[id]/evaluate        — score entire session
GET    /api/conversation/history              — past sessions
```

### Progress & Gamification
```
GET    /api/progress/dashboard                — all stats
GET    /api/progress/streak                   — streak data
GET    /api/xp                                — XP history + level
GET    /api/achievements                      — unlocked + locked
POST   /api/daily-challenge/claim             — earn reward
```

### User & Subscription
```
GET    /api/user/profile
PUT    /api/user/profile                      — update preferences
GET    /api/user/subscription
POST   /api/user/subscription                 — change tier
```

### Admin
```
POST   /api/admin/lessons                     — create
PUT    /api/admin/lessons/[id]                — update
DELETE /api/admin/lessons/[id]                — delete
POST   /api/admin/vocabulary                  — add word
GET    /api/admin/analytics                   — user stats
GET    /api/admin/users                       — user list
```

### AI Agents
```
POST   /api/ai/lesson-creator                — generate lesson outline
POST   /api/ai/grammar-explain               — explain grammar point
POST   /api/ai/progress-advice               — recommended next steps
POST   /api/ai/cultural-qa                   — ask about Malaysian culture
```

## Audio Pipeline

### TTS Flow
1. Lesson content hashed → check Redis/Postgres cache
2. Cache miss → BullMQ job → Google Cloud TTS (Neural2, `ms-MY`)
3. Audio stored in Cloud Storage or local filesystem
4. Each word/sentence cached for: male voice, female voice, normal speed, slow speed
5. Cache hit → return audio URL immediately
6. Pre-generation: audio generated at lesson creation time, not on first user access

### STT Flow (Pronunciation)
1. User presses Speak → browser records via MediaRecorder API (WebM/Opus)
2. Audio blob → `POST /api/audio/transcribe` → Google Cloud STT
3. Transcribed text compared to expected phrase (word-level alignment)
4. Score: accuracy (word match), fluency (timing), clarity (confidence)
5. Mispronounced words highlighted in red

## AI Agent Architecture

### Agents

| Agent | Model Tier | Trigger | Output |
|---|---|---|---|
| Lesson Creator | Cheap/fast | Admin creates lesson | JSON lesson structure |
| Pronunciation Coach | Medium | User submits audio | Per-word accuracy, tips |
| Grammar Tutor | Capable | User asks "why?" | Structured explanation |
| Conversation Partner | Capable | User starts scenario | Natural roleplay replies |
| Progress Coach | Cheap/fast | Dashboard load | Personalized plan |
| Cultural Guide | Medium | User opens culture topic | Rich explanation |

### Shared Context
- PostgreSQL stores user conversation history, SRS stats, completed lessons
- Each agent call includes: `{ userLevel, recentMistakes, knownVocabulary, currentLesson, conversationContext }`
- Agents reference each other's outputs via context (e.g., Conversation Partner flags errors → Grammar Tutor explains post-session)

### LLM Routing
- Configurable per-agent in `apps/worker/src/config/agents.ts`
- Supports: `opencode-go/{model}` (OpenAI-compatible) or Ollama (local)
- Different agents can use different models

## UI Page Structure

```
/                               → Landing page
/auth/login                     → Email + social login
/auth/register                  → Registration
/dashboard                      → Main dashboard (streak, daily challenge, continue)
/dashboard/vocabulary           → Word list + SRS review
/dashboard/vocabulary/[id]      → Word detail
/dashboard/lessons              → Lesson browser
/dashboard/lessons/[slug]       → Lesson player
/dashboard/conversation         → Scenario picker
/dashboard/conversation/[id]    → Live conversation
/dashboard/listening            → Listening challenges
/dashboard/practice             → Pronunciation practice
/dashboard/grammar              → Grammar reference
/dashboard/culture              → Malaysian culture
/dashboard/progress             → Stats + charts
/dashboard/settings             → Account, theme, preferences
/dashboard/subscription         → Plan management
/admin                          → Admin dashboard
/admin/lessons                  → Lesson CRUD
/admin/vocabulary               → Word manager
/admin/users                    → User management
/admin/analytics                → Charts & metrics
/admin/ai-logs                  → Agent prompt/response review
```

### Shared Components
- `AudioPlayer` — play/pause/slow/loop, waveform visualization
- `SpeakButton` — record → STT → pronunciation score
- `ProgressRing` — circular indicator
- `StreakBadge` — fire icon + count
- `LevelBadge` — level display
- `LessonCard` — lesson grid/list card
- `WordCard` — flashcard-style vocabulary card
- `ScoreMeter` — animated score bar (accuracy, fluency, clarity)
- `NavSidebar` — collapsible sidebar
- `TopBar` — search, notifications, profile

Design: Clean, professional, adult-oriented. Dark/light mode toggle. Mobile-first responsive.

## Gamification

### XP Rewards
| Action | XP |
|---|---|
| Complete lesson | 50-200 |
| Perfect section score | +50 |
| Review 10 SRS words | 30 |
| Daily login | 10 |
| Streak (days 1-6) | 10/day |
| Streak (day 7+) | 50/day |
| Conversation practice | 100/session |
| Pronunciation exercise | 20/word |
| Daily challenge | 150 |

### Levels
`Level = floor(sqrt(totalXP / 100))` — no cap.

### Achievements
First Words, Streak Master (7 days), Perfect Lesson, Speaking Up (10 pronunciations), Conversationalist (5 convos), Dedicated Learner (30-day streak), Vocabulary Builder (500 mastered), Polyglot (all beginner lessons).

### Streaks
- Tracked by `lastActivityDate`. Miss one day → reset to 0.
- Freeze option: 1/week, costs 200 XP.

### Daily Challenges
One per day (vocab quiz, listening, speaking prompt). 7 in a week → +500 XP bonus.

## Offline Mode (PWA)

- Service Worker caches lessons, audio, vocabulary, static assets
- Download lesson → IndexedDB (content) + Cache API (audio)
- Offline: full lesson playback, vocabulary review, pronunciation practice (record → queue)
- Online sync: push queued progress + SRS reviews. Server timestamp wins conflicts.
- Cache-first: 5 most recent lessons per level. Audio max 200MB.

## Premium Tiers

| Feature | Free | Premium | Enterprise |
|---|---|---|---|
| Lessons | First 10 | All | All |
| SRS reviews | 5/day | Unlimited | Unlimited |
| Conversations | 1/week | Unlimited | Unlimited |
| AI Grammar Tutor | No | Yes | Yes |
| Voices | Male, normal | Male+Female, normal+slow | Full |
| Pronunciation scoring | Basic | Per-word | Per-word |
| Daily challenges | No | Yes | Yes |
| Offline downloads | No | Yes | Yes |
| Team management | No | No | Yes |
| Custom content | No | No | Yes |

## Phased Implementation

### Phase 1 — Foundation (Week 1-2)
- Turborepo scaffold: `apps/web`, `packages/shared`, `packages/db`
- Docker Compose: PostgreSQL, Redis, Next.js
- Drizzle schema: users, lessons, vocabulary, user_progress
- Auth.js: Email + Google + Apple
- Landing page + Login/Register
- Dashboard shell

### Phase 2 — Core Learning (Week 3-4)
- Lesson data model + CRUD API
- Lesson player UI with section navigation
- Audio pipeline: TTS cache, Google Cloud integration
- Vocabulary system + SRS implementation
- Seed 3 beginner lessons (Greetings, Introductions, Numbers)
- Pronunciation practice UI

### Phase 3 — Advanced Features (Week 5-6)
- AI worker + LLM routing (OpenCode Go + Ollama)
- Conversation simulator
- Grammar tutor
- Gamification: XP, levels, streaks, achievements
- Progress dashboard with charts
- Daily challenges

### Phase 4 — Polish & Launch (Week 7-8)
- PWA + offline mode
- Admin CRUD system
- Premium feature flags
- Dark/light mode + accessibility audit
- Cultural content pages
- E2E tests + load testing
- Docker production build

## Testing Strategy

- **Unit:** Vitest — SRS algorithm, XP calc, pronunciation scoring
- **Integration:** Supertest on API routes, mock Google Cloud, PGlite in-memory Postgres
- **E2E:** Playwright — login → start lesson → complete → review vocabulary
- **Visual:** Playwright screenshot comparisons for major UI
- **AI:** Snapshot test prompts, mock LLM responses, test parsing
- **Accessibility:** axe-core via Playwright, keyboard nav, screen reader labels, color contrast

## Docker Deployment

```yaml
services:
  nextjs:
    build: apps/web
    ports: ["3000:3000"]
    depends_on: [postgres, redis]
    env_file: .env.production
  worker:
    build: apps/worker
    depends_on: [postgres, redis]
    env_file: .env.production
  postgres:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
  redis:
    image: redis:7-alpine
```

Dev mode: `docker compose -f docker-compose.dev.yml` with volume mounts + hot reload.
