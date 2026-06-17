# Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the monorepo, set up Docker Compose with PostgreSQL and Redis, define the database schema with Drizzle ORM, configure Auth.js with email/Google/Apple login, build the landing page and auth pages, and create a dashboard shell with sidebar navigation.

**Architecture:** Turborepo monorepo with `apps/web` (Next.js App Router + API routes), `packages/db` (Drizzle schema/migrations), and `packages/shared` (types/constants). Docker Compose for local dev with PostgreSQL 16 and Redis 7. Auth.js handles authentication with credentials, Google, and Apple providers.

**Tech Stack:** Next.js 15, TypeScript, TailwindCSS, Drizzle ORM, PostgreSQL 16, Redis 7, Auth.js (next-auth v5), Turborepo, Docker Compose

---

### Task 1: Initialize Turborepo Monorepo

**Files:**
- Create: `package.json`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/postcss.config.js`
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/db/package.json`
- Create: `packages/db/tsconfig.json`
- Create: `packages/db/drizzle.config.ts`

- [ ] **Step 1: Create root package.json**

```json
{
  "name": "malay-lang",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck"
  },
  "packageManager": "npm@10.8.0",
  "workspaces": ["apps/*", "packages/*"]
}
```

- [ ] **Step 2: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {},
    "typecheck": {}
  }
}
```

- [ ] **Step 3: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 4: Create .gitignore**

```
node_modules/
.next/
dist/
turbo/
*.tsbuildinfo
.env
.env.local
.superpowers/
pgdata/
```

- [ ] **Step 5: Create .env.example**

```
DATABASE_URL=postgres://malaylang:malaylang@localhost:5432/malaylang
REDIS_URL=redis://localhost:6379
AUTH_SECRET=your-secret-key
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_APPLE_ID=
AUTH_APPLE_SECRET=
GOOGLE_CLOUD_API_KEY=
OPCODE_GO_API_KEY=
OLLAMA_BASE_URL=http://localhost:11434
```

- [ ] **Step 6: Create apps/web/package.json**

```json
{
  "name": "@malay/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "5.0.0-beta.25",
    "@auth/drizzle-adapter": "^1.7.0",
    "clsx": "^2.1.0",
    "drizzle-orm": "^0.36.0",
    "@malay/db": "*",
    "@malay/shared": "*"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@tailwindcss/postcss": "^4.0.0"
  }
}
```

- [ ] **Step 7: Create apps/web/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 8: Create apps/web/next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@malay/shared", "@malay/db"],
};

export default nextConfig;
```

- [ ] **Step 9: Create apps/web/tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
```

- [ ] **Step 10: Create apps/web/postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 11: Create packages/shared/package.json**

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
  "devDependencies": {
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 12: Create packages/shared/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "./dist" },
  "include": ["src"]
}
```

- [ ] **Step 13: Create packages/db/package.json**

```json
{
  "name": "@malay/db",
  "version": "0.1.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:seed": "tsx src/seed.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "drizzle-orm": "^0.36.0",
    "postgres": "^3.4.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.28.0",
    "typescript": "^5.6.0",
    "tsx": "^4.19.0"
  }
}
```

- [ ] **Step 14: Create packages/db/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "./dist" },
  "include": ["src"]
}
```

- [ ] **Step 15: Create packages/db/drizzle.config.ts**

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/*.ts",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 16: Install dependencies and verify build**

```bash
npm install; if ($?) { npx turbo build }
```

Expected: All packages build without errors.

---

### Task 2: Drizzle Schema — Users, Lessons, Vocabulary

**Files:**
- Create: `packages/db/src/schema/users.ts`
- Create: `packages/db/src/schema/lessons.ts`
- Create: `packages/db/src/schema/vocabulary.ts`
- Create: `packages/db/src/schema/index.ts`
- Create: `packages/db/src/index.ts`

- [ ] **Step 1: Create users schema**

```typescript
// packages/db/src/schema/users.ts
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
```

- [ ] **Step 2: Create Auth.js adapter tables**

```typescript
// Add to packages/db/src/schema/users.ts
export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const authenticators = pgTable("authenticators", {
  id: uuid("id").defaultRandom().primaryKey(),
  credentialId: text("credentialId").notNull().unique(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: boolean("credentialBackedUp").notNull(),
  transports: text("transports"),
});
```

- [ ] **Step 3: Create lessons schema**

```typescript
// packages/db/src/schema/lessons.ts
import { pgTable, text, timestamp, integer, uuid, json, boolean } from "drizzle-orm/pg-core";

export const lessons = pgTable("lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  level: text("level", { enum: ["beginner", "intermediate", "advanced"] }).notNull(),
  topic: text("topic").notNull(),
  xpReward: integer("xpReward").default(50).notNull(),
  isPremium: boolean("isPremium").default(false).notNull(),
  sections: json("sections").$type<Array<{ type: "vocab" | "grammar" | "dialogue" | "exercise" | "listening" | "speaking"; content: Record<string, unknown>; order: number }>>().default([]).notNull(),
  status: text("status", { enum: ["draft", "published"] }).default("draft").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});
```

- [ ] **Step 4: Create vocabulary schema**

```typescript
// packages/db/src/schema/vocabulary.ts
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
```

- [ ] **Step 5: Create schema index**

```typescript
// packages/db/src/schema/index.ts
export * from "./users";
export * from "./lessons";
export * from "./vocabulary";
```

- [ ] **Step 6: Create db client**

```typescript
// packages/db/src/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
export { schema };
```

- [ ] **Step 7: Generate initial migration**

Run: `npx turbo db:generate`
Expected: Creates migration files in `packages/db/src/migrations/`

---

### Task 3: Auth.js Configuration

**Files:**
- Create: `apps/web/src/lib/auth.ts`
- Create: `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- Create: `apps/web/src/middleware.ts`

- [ ] **Step 1: Create Auth.js config**

```typescript
// apps/web/src/lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db, schema } from "@malay/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: schema.users,
    accountsTable: schema.accounts,
    sessionsTable: schema.sessions,
    verificationTokensTable: schema.verificationTokens,
    authenticatorsTable: schema.authenticators,
  }),
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.email, credentials.email as string),
        });
        if (!user) return null;
        // In production, use bcrypt to verify password
        // For now, placeholder for password hashing
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID!,
      clientSecret: process.env.AUTH_APPLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
      }
      return session;
    },
  },
});
```

- [ ] **Step 2: Create Auth.js route handler**

```typescript
// apps/web/src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Create middleware**

```typescript
// apps/web/src/middleware.ts
export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
};
```

---

### Task 4: Landing Page Layout

**Files:**
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`

- [ ] **Step 1: Create global CSS**

```css
/* apps/web/src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
  }
  body {
    @apply bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-50;
  }
}
```

- [ ] **Step 2: Create root layout with theme provider**

```typescript
// apps/web/src/app/layout.tsx
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bahasa Malaysia Mastery",
  description: "Learn to speak, understand, read, and write Bahasa Malaysia",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create landing page**

```typescript
// apps/web/src/app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-bold text-primary-600">BM Mastery</span>
          <nav className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Master Bahasa Malaysia
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Audio-first language learning designed for English speakers. Speak with confidence from day one.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/auth/register"
              className="rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white hover:bg-primary-700"
            >
              Start Learning Free
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border border-slate-300 px-6 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sign In
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { title: "Audio-First", desc: "Native pronunciation with male and female voices" },
              { title: "AI-Powered", desc: "Personalized conversation practice and feedback" },
              { title: "Proven Method", desc: "Spaced repetition for long-term retention" },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 p-6 text-left dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
```

---

### Task 5: Auth Pages (Login + Register)

**Files:**
- Create: `apps/web/src/app/(auth)/layout.tsx`
- Create: `apps/web/src/app/(auth)/login/page.tsx`
- Create: `apps/web/src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Create auth layout**

```typescript
// apps/web/src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Create login page with Google + Apple buttons**

```typescript
// apps/web/src/app/(auth)/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Sign In</h1>
      <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-400">
        Continue your learning journey
      </p>

      <div className="mt-8 space-y-3">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <button
          onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/></svg>
          Continue with Apple
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-300 dark:border-slate-600" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-500 dark:bg-slate-900">or</span></div>
        </div>

        <form onSubmit={handleCredentials} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create register page**

```typescript
// apps/web/src/app/(auth)/register/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Registration API will be implemented in Phase 2
    // For now, redirect to login
    router.push("/auth/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Get Started</h1>
      <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-400">
        Create your account and start learning
      </p>

      <div className="mt-8 space-y-3">
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <button
          onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/></svg>
          Continue with Apple
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-300 dark:border-slate-600" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-slate-500 dark:bg-slate-900">or</span></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            required
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
          >
            Create Account
          </button>
          <p className="text-center text-xs text-slate-500">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}
```

---

### Task 6: Dashboard Shell with Navigation

**Files:**
- Create: `apps/web/src/app/(dashboard)/layout.tsx`
- Create: `apps/web/src/app/(dashboard)/page.tsx`
- Create: `apps/web/src/components/ui/nav-sidebar.tsx`
- Create: `apps/web/src/components/ui/top-bar.tsx`

- [ ] **Step 1: Create NavSidebar component**

```typescript
// apps/web/src/components/ui/nav-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◉" },
  { href: "/dashboard/lessons", label: "Lessons", icon: "◎" },
  { href: "/dashboard/vocabulary", label: "Vocabulary", icon: "◈" },
  { href: "/dashboard/conversation", label: "Practice", icon: "◆" },
  { href: "/dashboard/progress", label: "Progress", icon: "◇" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
      <div className="flex h-16 items-center border-b border-slate-200 px-4 dark:border-slate-700">
        <Link href="/dashboard" className="text-lg font-bold text-primary-600">
          BM Mastery
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Create TopBar component**

```typescript
// apps/web/src/components/ui/top-bar.tsx
"use client";

import { signOut, useSession } from "next-auth/react";

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-700">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600 dark:text-slate-300">
          {session?.user?.name || session?.user?.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create utils (cn function)**

```typescript
// apps/web/src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}
```

Note: Install clsx: `npm install clsx`

- [ ] **Step 4: Create dashboard layout**

```typescript
// apps/web/src/app/(dashboard)/layout.tsx
import { NavSidebar } from "@/components/ui/nav-sidebar";
import { TopBar } from "@/components/ui/top-bar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <NavSidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create dashboard home page**

```typescript
// apps/web/src/app/(dashboard)/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
        { label: "Current Streak", value: "0 days" },
        { label: "Total XP", value: "0" },
          { label: "Lessons Completed", value: "0" },
          { label: "Vocabulary Learned", value: "0" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 p-6 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white">Continue Learning</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Start your first lesson to begin tracking your progress.
        </p>
      </div>
    </div>
  );
}
```

---

### Task 7: Docker Compose Setup

**Files:**
- Create: `docker-compose.yml`
- Create: `docker-compose.dev.yml`
- Create: `apps/web/Dockerfile`

- [ ] **Step 1: Create production docker-compose.yml**

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: malaylang
      POSTGRES_PASSWORD: malaylang
      POSTGRES_DB: malaylang
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U malaylang"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://malaylang:malaylang@postgres:5432/malaylang
      REDIS_URL: redis://redis:6379
      AUTH_SECRET: ${AUTH_SECRET}
      AUTH_GOOGLE_ID: ${AUTH_GOOGLE_ID}
      AUTH_GOOGLE_SECRET: ${AUTH_GOOGLE_SECRET}
      AUTH_APPLE_ID: ${AUTH_APPLE_ID}
      AUTH_APPLE_SECRET: ${AUTH_APPLE_SECRET}
      NEXTAUTH_URL: http://localhost:3000
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  pgdata:
```

- [ ] **Step 2: Create dev docker-compose.dev.yml**

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: malaylang
      POSTGRES_PASSWORD: malaylang
      POSTGRES_DB: malaylang
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

- [ ] **Step 3: Create Dockerfile for Next.js**

```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

- [ ] **Step 4: Verify Docker setup**

Run: `docker compose -f docker-compose.dev.yml up -d`
Expected: PostgreSQL on 5432, Redis on 6377, containers healthy.

Run: `docker compose down`

---

### Task 8: Shared Package — Types + Constants

**Files:**
- Create: `packages/shared/src/constants.ts`
- Create: `packages/shared/src/types.ts`
- Create: `packages/shared/src/index.ts`

- [ ] **Step 1: Create constants**

```typescript
// packages/shared/src/constants.ts
export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

export const TOPICS = {
  beginner: ["Greetings", "Introductions", "Numbers", "Colours", "Family", "Food", "Directions", "Shopping", "Weather", "Time"],
  intermediate: ["Daily Life", "Travel", "Hotels", "Restaurants", "Transport", "Workplace", "Social Situations", "Emergencies"],
  advanced: ["Business Language", "Formal Communication", "News", "Government", "Culture", "Idioms", "Native Speech"],
} as const;

export const SECTION_TYPES = ["vocab", "grammar", "dialogue", "exercise", "listening", "speaking"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export const SRS_STATUSES = ["new", "learning", "familiar", "mastered"] as const;
export type SrsStatus = (typeof SRS_STATUSES)[number];

export const XP_REWARDS = {
  completeLesson: { base: 50, max: 200 },
  perfectSection: 50,
  reviewTenWords: 30,
  dailyLogin: 10,
  streakDay: { normal: 10, extended: 50 },
  conversation: 100,
  pronunciation: 20,
  dailyChallenge: 150,
} as const;

export const SUBSCRIPTION_TIERS = ["free", "premium", "enterprise"] as const;
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];
```

- [ ] **Step 2: Create types**

```typescript
// packages/shared/src/types.ts
import type { Level, SectionType, SrsStatus, SubscriptionTier } from "./constants";

export interface LessonSection {
  type: SectionType;
  content: Record<string, unknown>;
  order: number;
}

export interface UserPreferences {
  theme: "light" | "dark";
  textSize: "sm" | "md" | "lg";
}

export interface PronunciationScore {
  accuracy: number;
  fluency: number;
  clarity: number;
  wordScores: Array<{ word: string; correct: boolean; confidence: number }>;
}

export interface ConversationMessage {
  role: "user" | "ai";
  content: string;
  audioUrl?: string;
  timestamp: string;
}

export interface SrsReviewResult {
  vocabularyId: string;
  grade: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
}
```

- [ ] **Step 3: Create index**

```typescript
// packages/shared/src/index.ts
export * from "./constants";
export * from "./types";
```

---

### Task 9: Seed Data — First Beginner Lessons

**Files:**
- Create: `packages/db/src/seed.ts`

- [ ] **Step 1: Create seed script**

```typescript
// packages/db/src/seed.ts
import { db } from "./index";
import { schema } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Vocabulary
  const greetings = [
    { malay: "Selamat pagi", english: "Good morning", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Selamat petang", english: "Good afternoon", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Selamat malam", english: "Good night", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Apa khabar", english: "How are you", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Terima kasih", english: "Thank you", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Sama-sama", english: "You're welcome", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Selamat tinggal", english: "Goodbye", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Jumpa lagi", english: "See you again", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "phrase" as const },
    { malay: "Ya", english: "Yes", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "interjection" as const },
    { malay: "Tidak", english: "No", category: "Greetings", difficulty: "beginner" as const, partOfSpeech: "interjection" as const },
  ];

  for (const word of greetings) {
    await db.insert(schema.vocabulary).values(word).onConflictDoNothing();
  }

  // Lesson: Greetings
  await db.insert(schema.lessons).values({
    slug: "greetings",
    title: "Greetings",
    description: "Learn common Malaysian greetings and polite expressions",
    order: 1,
    level: "beginner",
    topic: "Greetings",
    xpReward: 100,
    sections: [
      { type: "vocab", order: 1, content: { words: ["Selamat pagi", "Apa khabar", "Terima kasih"] } },
      { type: "grammar", order: 2, content: { explanation: "Selamat means 'safe' or 'peaceful'. Used in all time-based greetings." } },
      { type: "dialogue", order: 3, content: { lines: [
        { speaker: "A", malay: "Selamat pagi! Apa khabar?", english: "Good morning! How are you?" },
        { speaker: "B", malay: "Selamat pagi! Khabar baik.", english: "Good morning! I'm fine." },
      ]} },
      { type: "exercise", order: 4, content: { questions: [
        { malay: "Apa khabar", options: ["How are you", "Good morning", "Thank you"], correct: 0 },
      ]} },
    ],
    status: "published",
  }).onConflictDoNothing();

  // Lesson: Introductions
  await db.insert(schema.lessons).values({
    slug: "introductions",
    title: "Introductions",
    description: "Introduce yourself and ask others about themselves",
    order: 2,
    level: "beginner",
    topic: "Introductions",
    xpReward: 100,
    sections: [
      { type: "vocab", order: 1, content: { words: ["Saya", "Nama", "Dari"] } },
      { type: "dialogue", order: 2, content: { lines: [
        { speaker: "A", malay: "Nama saya Ali. Nama awak?", english: "My name is Ali. What's your name?" },
        { speaker: "B", malay: "Saya Betty. Saya dari Amerika.", english: "I'm Betty. I'm from America." },
      ]} },
      { type: "exercise", order: 3, content: { questions: [
        { malay: "Nama saya...", options: ["My name is...", "Your name is...", "His name is..."], correct: 0 },
      ]} },
    ],
    status: "published",
  }).onConflictDoNothing();

  console.log("Seed complete!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
```

- [ ] **Step 2: Run migration and seed**

Run: `docker compose -f docker-compose.dev.yml up -d`

Wait for Postgres to be healthy, then:
Run: `npx turbo db:push`
Run: `npx turbo db:seed`

Expected: No errors, seed data inserted.

---

### Task 10: Verify Everything Works

- [ ] **Step 1: Run dev server**

Run: `npx turbo dev`
Expected: Next.js starts on port 3000, landing page renders.

- [ ] **Step 2: Verify typecheck**

Run: `npx turbo typecheck`
Expected: No TypeScript errors.

- [ ] **Step 3: Verify lint**

Run: `npx turbo lint`
Expected: No lint errors.

- [ ] **Step 4: Commit**

```bash
git init
git add .
git commit -m "feat: phase 1 foundation - monorepo, auth, landing, dashboard shell, Docker, seed data"
```
