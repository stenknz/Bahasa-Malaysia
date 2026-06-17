# Phase 4: Polish & Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Production-ready polish — PWA offline mode, admin CRUD system, premium subscription feature flags, dark/light mode toggle, accessibility compliance, full test suite, and production Docker deployment.

**Architecture:** Service Worker for PWA caching. Role-based middleware for admin routes. Feature flags via subscription tier check. Playwright for E2E. axe-core for accessibility.

**Tech Stack:** Service Workers, IndexedDB, Playwright, Vitest, axe-core, Docker Compose production config

---

### Task 1: PWA Offline Mode

**Files:**
- Create: `apps/web/public/manifest.json`
- Create: `apps/web/src/app/manifest.ts`
- Create/modify: `apps/web/src/app/layout.tsx` — add meta tags
- Create: `apps/web/src/lib/sw.ts` — service worker registration
- Add lesson download functionality

- [ ] **Step 1: Create PWA manifest**

```json
// apps/web/public/manifest.json
{
  "name": "Bahasa Malaysia Mastery",
  "short_name": "BM Mastery",
  "description": "Learn Bahasa Malaysia with audio-first lessons",
  "start_url": "/dashboard",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

- [ ] **Step 2: Create service worker for offline caching**

- [ ] **Step 3: Create lesson download API and UI**

Add download button to lesson player. Store downloaded lessons in IndexedDB.

- [ ] **Step 4: Verify offline mode works**

- [ ] **Step 5: Commit**

---

### Task 2: Admin System

**Files:**
- Create: `apps/web/src/app/(admin)/layout.tsx`
- Create: `apps/web/src/app/(admin)/page.tsx`
- Create: `apps/web/src/app/(admin)/lessons/page.tsx`
- Create: `apps/web/src/app/(admin)/vocabulary/page.tsx`
- Create: `apps/web/src/app/(admin)/analytics/page.tsx`
- Create admin CRUD API routes

- [ ] **Step 1: Create admin layout with role check**

Admin layout checks `session.user.role === "admin"` and redirects non-admins.

- [ ] **Step 2: Create lesson CRUD admin pages**

Form for creating/editing lessons with section builder (add vocab, grammar, dialogue blocks).

- [ ] **Step 3: Create vocabulary manager page**

Grid with add/edit/delete. Batch import via CSV.

- [ ] **Step 4: Create analytics dashboard page**

Charts for DAU/MAU, lesson completion rates, pronunciation scores.

- [ ] **Step 5: Commit**

---

### Task 3: Premium Subscription Feature Flags

**Files:**
- Create: `apps/web/src/lib/subscription.ts`
- Create: `apps/web/src/app/(dashboard)/subscription/page.tsx`
- Create: `apps/web/src/app/api/user/subscription/route.ts`

- [ ] **Step 1: Create subscription check utilities**

```typescript
// apps/web/src/lib/subscription.ts
import { auth } from "./auth";

export type Tier = "free" | "premium" | "enterprise";

interface FeatureAccess {
  maxLessons: number;
  maxSrsReviewsPerDay: number;
  maxConversationsPerWeek: number;
  hasGrammarTutor: boolean;
  hasOfflineDownloads: boolean;
  hasPronunciationScoring: boolean;
  hasDailyChallenges: boolean;
}

const features: Record<Tier, FeatureAccess> = {
  free: { maxLessons: 10, maxSrsReviewsPerDay: 5, maxConversationsPerWeek: 1, hasGrammarTutor: false, hasOfflineDownloads: false, hasPronunciationScoring: false, hasDailyChallenges: false },
  premium: { maxLessons: Infinity, maxSrsReviewsPerDay: Infinity, maxConversationsPerWeek: Infinity, hasGrammarTutor: true, hasOfflineDownloads: true, hasPronunciationScoring: true, hasDailyChallenges: true },
  enterprise: { maxLessons: Infinity, maxSrsReviewsPerDay: Infinity, maxConversationsPerWeek: Infinity, hasGrammarTutor: true, hasOfflineDownloads: true, hasPronunciationScoring: true, hasDailyChallenges: true },
};

export async function getUserTier(): Promise<Tier> {
  const session = await auth();
  return (session?.user as any)?.subscriptionTier ?? "free";
}

export function getFeatureAccess(tier: Tier): FeatureAccess {
  return features[tier];
}
```

- [ ] **Step 2: Create subscription page**

Show current plan, feature comparison table, upgrade CTA.

- [ ] **Step 3: Integrate feature checks into lesson/vocabulary/conversation APIs**

- [ ] **Step 4: Commit**

---

### Task 4: Dark/Light Mode Toggle

**Files:**
- Create: `apps/web/src/components/ui/theme-toggle.tsx`
- Create: `apps/web/src/lib/theme.ts`
- Update layout to support theme with cookie persistence

- [ ] **Step 1: Create theme toggle component**

- [ ] **Step 2: Implement theme with localStorage persistence + system preference detection**

- [ ] **Step 3: Add toggle to TopBar + Settings page**

- [ ] **Step 4: Verify both themes render correctly**

- [ ] **Step 5: Commit**

---

### Task 5: Accessibility Audit

**Files:**
- Create: `tests/accessibility/axe.spec.ts` (Playwright)

- [ ] **Step 1: Run accessibility checks on all major pages**

- [ ] **Step 2: Fix issues: keyboard navigation, screen reader labels, color contrast, focus states**

- [ ] **Step 3: Add aria labels to all interactive elements**

- [ ] **Step 4: Verify with axe-core**

- [ ] **Step 5: Commit**

---

### Task 6: Testing Suite

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/unit/srs.test.ts`
- Create: `tests/unit/gamification.test.ts`
- Create: `tests/e2e/lesson-flow.spec.ts` (Playwright)
- Create: `tests/integration/api-lessons.test.ts`

- [ ] **Step 1: Set up Vitest config**

- [ ] **Step 2: Write SRS algorithm unit tests**

- [ ] **Step 3: Write gamification logic tests**

- [ ] **Step 4: Write Playwright E2E tests (login → browse lessons → complete → review)**

- [ ] **Step 5: Run full test suite and fix failures**

- [ ] **Step 6: Commit**

---

### Task 7: Production Docker & Deployment

**Files:**
- Modify: `docker-compose.yml` — production-ready config
- Create: `apps/worker/Dockerfile`
- Create: `.dockerignore`
- Create: `docker-compose.prod.yml`

- [ ] **Step 1: Create worker Dockerfile**

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json turbo.json ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
COPY packages/audio/package.json ./packages/audio/
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx turbo build --filter=@malay/worker

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/apps/worker/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

- [ ] **Step 2: Create production docker-compose.prod.yml**

With proper secrets management, health checks, restart policies.

- [ ] **Step 3: Build and test Docker images**

```bash
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

- [ ] **Step 4: Verify all services start and are healthy**

- [ ] **Step 5: Final commit and tag**

```bash
git tag v1.0.0
git commit -m "feat: Phase 4 complete - PWA, admin, premium, accessibility, tests, Docker production"
```
