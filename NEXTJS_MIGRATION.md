# Next.js Migration Plan

Comprehensive plan to migrate from React + Vite SPA to Next.js App Router with Firestore dynamic data and admin CMS.

## Table of Contents

- [Decision Summary](#decision-summary)
- [Tech Stack: Current vs Target](#tech-stack-current-vs-target)
- [Target Project Structure](#target-project-structure)
- [Phase 1: Project Scaffold & Core Configuration](#phase-1-project-scaffold--core-configuration)
- [Phase 2: Firestore Data Layer](#phase-2-firestore-data-layer)
- [Phase 3: Internationalization (next-intl)](#phase-3-internationalization-next-intl)
- [Phase 4: Theme System Migration](#phase-4-theme-system-migration)
- [Phase 5: Layout & Navigation Migration](#phase-5-layout--navigation-migration)
- [Phase 6: Page & Section Migration](#phase-6-page--section-migration)
- [Phase 7: Component Migration](#phase-7-component-migration)
- [Phase 8: SEO Migration](#phase-8-seo-migration)
- [Phase 9: Authentication & Admin Panel](#phase-9-authentication--admin-panel)
- [Phase 10: Firestore Security Rules](#phase-10-firestore-security-rules)
- [Phase 11: Testing Migration](#phase-11-testing-migration)
- [Phase 12: Performance Optimization](#phase-12-performance-optimization)
- [Phase 13: Deployment (Vercel)](#phase-13-deployment-vercel)
- [Migration Mapping: File by File](#migration-mapping-file-by-file)
- [Rendering Strategy per Route](#rendering-strategy-per-route)
- [Dependency Changes](#dependency-changes)
- [Environment Variables](#environment-variables)
- [Risk Register](#risk-register)

---

## Decision Summary

Decisions based on user requirements (not assumptions):

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Next.js Router | App Router | User choice |
| Next.js Version | 16.x (latest stable) | User choice: stable version |
| Package Manager | npm | User choice |
| Hosting | Vercel | User choice |
| Gemini API | Remove | User confirmed not needed |
| Firestore Data | Projects, Blogs, Experience, Skills (NOT Phrases) | User choice: all dynamic except phrases |
| Blog Content | Firestore (dynamic markdown) | User choice |
| Admin Panel | Simple CMS for Firestore | User choice |
| Auth | Firebase Auth for admin | User choice |
| i18n | next-intl | User choice |
| Animation | motion/react (keep) | User choice, performance-optimized |
| SkyForce Game | Keep as-is, performance enhancements only | User choice |
| Tailwind CSS | v4 with `@tailwindcss/postcss` | Most supported + high performance (70% smaller CSS than v3) |
| SEO | Next.js Metadata API (`generateMetadata`) | User choice, replaces react-helmet-async |
| Firebase Environments | Single project | User choice |
| Data Fetching | Fetch on load (no real-time) | User choice, focus on performance/speed |
| Rendering | SSG + ISR (details per route below) | Most efficient for performance goal |

---

## Tech Stack: Current vs Target

| Category | Current (Vite SPA) | Target (Next.js) |
|----------|-------------------|-------------------|
| Framework | React 19 + Vite 6 | Next.js 16.x (React 19) |
| Routing | react-router-dom 7 | Next.js App Router (file-based) |
| i18n | Custom (LanguageContext, translations/*.ts) | next-intl (with `[locale]` routing) |
| SEO | react-helmet-async | Next.js Metadata API (`generateMetadata`) |
| CSS | Tailwind v4 (`@tailwindcss/vite`) | Tailwind v4 (`@tailwindcss/postcss`) |
| Animation | motion/react 12.x | motion/react 12.x (keep) |
| Icons | lucide-react | lucide-react (keep) |
| Markdown | react-markdown 10 | react-markdown 10 (keep) |
| Data | Static (`constants.ts` + translation files) | Firestore (firebase 12.x + firebase-admin) |
| Auth | None | Firebase Auth + next-firebase-auth-edge |
| Testing | Vitest + @testing-library/react | Vitest + @testing-library/react (keep) |
| Deployment | AI Studio / manual | Vercel |
| AI | @google/genai | Removed |
| Server | express (unused) | Removed (Next.js server built-in) |
| Env | dotenv + vite define | Next.js built-in env (NEXT_PUBLIC_ prefix) |

---

## Target Project Structure

```
portfolio-v5/
+-- next.config.ts                # Next.js configuration
+-- postcss.config.mjs            # PostCSS with @tailwindcss/postcss
+-- tsconfig.json                 # TypeScript config
+-- package.json                  # Dependencies and scripts
+-- vitest.config.ts              # Vitest config (kept from current)
+-- .env.local                    # Environment variables (gitignored)
+-- .env.example                  # Template for env vars
+-- .gitignore
+-- README.md
+-- public/
|   +-- robots.txt                # SEO
+-- docs/                         # Keep existing docs as-is
+-- firestore.rules               # Firestore security rules
+-- src/
    +-- app/
    |   +-- globals.css            # Migrated from index.css (Tailwind + theme vars)
    |   +-- layout.tsx             # Root layout (html, body, ThemeProvider)
    |   +-- not-found.tsx          # Global 404 page
    |   +-- sitemap.ts             # Dynamic sitemap generation
    |   +-- robots.ts              # Dynamic robots.txt generation
    |   +-- [locale]/
    |   |   +-- layout.tsx         # Locale layout (NextIntlClientProvider, Navbar, Footer, etc.)
    |   |   +-- page.tsx           # HomePage (SSG + ISR)
    |   |   +-- blog/
    |   |   |   +-- page.tsx       # BlogListPage (SSG + ISR)
    |   |   |   +-- [slug]/
    |   |   |       +-- page.tsx   # BlogDetailsPage (SSG + ISR)
    |   |   +-- projects/
    |   |   |   +-- page.tsx       # ProjectListPage (SSG + ISR)
    |   |   +-- admin/
    |   |       +-- layout.tsx     # Admin layout (auth guard)
    |   |       +-- page.tsx       # Admin dashboard
    |   |       +-- login/
    |   |       |   +-- page.tsx   # Admin login page
    |   |       +-- projects/
    |   |       |   +-- page.tsx   # Manage projects
    |   |       +-- blogs/
    |   |       |   +-- page.tsx   # Manage blogs
    |   |       |   +-- [slug]/
    |   |       |       +-- page.tsx # Edit blog
    |   |       +-- experience/
    |   |       |   +-- page.tsx   # Manage experience
    |   |       +-- skills/
    |   |           +-- page.tsx   # Manage skills
    +-- i18n/
    |   +-- routing.ts             # next-intl: defineRouting({ locales, defaultLocale })
    |   +-- navigation.ts          # next-intl: createNavigation(routing)
    |   +-- request.ts             # next-intl: getRequestConfig
    +-- messages/
    |   +-- en.json                # English translations (migrated from en.ts)
    |   +-- id.json                # Indonesian translations (migrated from id.ts)
    +-- lib/
    |   +-- firebase.ts            # Firebase client SDK init (client components)
    |   +-- firebase-admin.ts      # Firebase Admin SDK init (server components/actions)
    |   +-- firestore.ts           # Firestore data fetching functions (server-side)
    |   +-- auth.ts                # Auth helpers and session management
    +-- components/
    |   +-- layout/
    |   |   +-- Navbar.tsx         # Navigation (client component)
    |   |   +-- Footer.tsx         # Footer (server component where possible)
    |   +-- sections/
    |   |   +-- Hero.tsx           # Hero section (client - typewriter, animations)
    |   |   +-- About.tsx          # About section (client - animations)
    |   |   +-- Skills.tsx         # Skills section (client - animations)
    |   |   +-- Experience.tsx     # Experience section (client - animations)
    |   |   +-- Projects.tsx       # Projects section (client - animations)
    |   |   +-- Blog.tsx           # Blog section (client - animations)
    |   |   +-- Contact.tsx        # Contact section (client - form + animations)
    |   +-- ui/
    |   |   +-- Reveal.tsx         # Scroll animation wrapper (client)
    |   |   +-- CodeText.tsx       # Code mode text wrapper (client)
    |   |   +-- CustomCursor.tsx   # Custom cursor (client)
    |   |   +-- ScrollProgress.tsx # Scroll progress bar (client)
    |   |   +-- ScrollToTop.tsx    # Scroll to top rocket (client)
    |   |   +-- GameRocket.tsx     # SVG rocket (client)
    |   |   +-- HireMeBanner.tsx   # CTA banner (client)
    |   +-- game/
    |   |   +-- SkyForceGame.tsx   # Canvas game (client, dynamic import)
    |   +-- gimmicks/
    |   |   +-- SystemGimmick.tsx
    |   |   +-- ArchitectureSchematicGimmick.tsx
    |   |   +-- KernelSubstrateGimmick.tsx
    |   |   +-- LogStreamGimmick.tsx
    |   |   +-- MobileMenuGimmick.tsx
    |   |   +-- NetworkTopologyGimmick.tsx
    |   |   +-- NeuralBridgeGimmick.tsx
    |   |   +-- QuantumSyncGimmick.tsx
    |   |   +-- ServiceClusterGimmick.tsx
    |   |   +-- TacticalTrajectoryGimmick.tsx
    |   +-- admin/
    |       +-- AdminSidebar.tsx   # Admin navigation
    |       +-- DataTable.tsx      # Reusable data table
    |       +-- MarkdownEditor.tsx # Blog content editor
    |       +-- FormField.tsx      # Reusable form input
    +-- context/
    |   +-- ThemeContext.tsx        # Theme provider (client, keep logic)
    |   +-- AuthContext.tsx         # Auth provider (client, Firebase Auth state)
    +-- actions/
    |   +-- projects.ts            # Server actions: CRUD projects
    |   +-- blogs.ts               # Server actions: CRUD blogs
    |   +-- experience.ts          # Server actions: CRUD experience
    |   +-- skills.ts              # Server actions: CRUD skills
    |   +-- revalidate.ts          # On-demand revalidation triggers
    +-- types/
    |   +-- index.ts               # Shared TypeScript types (Project, Blog, Experience, Skill)
    +-- constants.ts               # Static-only data: PHRASES (kept from current)
    +-- proxy.ts                   # next-intl middleware (Next.js 16 convention)
    +-- test/
        +-- setup.ts               # Test setup (migrated)
        +-- test-utils.tsx          # Test utilities (migrated for Next.js)
```

---

## Phase 1: Project Scaffold & Core Configuration [COMPLETED]

> **Status**: Done. In-place migration applied to `portfolio-v4/` directory.
> - Next.js 16.2.6 boots successfully with Turbopack
> - Tailwind v4 with `@tailwindcss/postcss` working
> - `next/font` self-hosting Inter, JetBrains Mono, Playfair Display
> - Theme hydration script prevents FOUC
> - React Compiler enabled (`reactCompiler: true`)
> - All 168 existing tests pass (7/7 test files)
> - `src/pages/` renamed to `src/_pages/` to avoid Next.js Pages Router conflict
> - Legacy source files excluded from Next.js type-checking via tsconfig `exclude`
> - ESLint skipped (using `tsc --noEmit` only)

### 1.1 Initialize Next.js Project

In-place transformation was used instead of creating a new project. Manual setup was performed:
- Added `next`, `@tailwindcss/postcss`, `postcss`, `vite-tsconfig-paths`, `babel-plugin-react-compiler`
- Removed `@google/genai`, `@tailwindcss/vite`, `dotenv`, `express`, `vite` (as dependency), `@types/express`, `autoprefixer`, `tsx`
- Kept `react-router-dom` and `react-helmet-async` temporarily (still used by legacy code until Phase 5-7)

### 1.2 next.config.ts [IMPLEMENTED]

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion/react'],
  },
};

export default nextConfig;
```

> **Note**: `output: 'standalone'` removed (not needed for Vercel). `withNextIntl` plugin will be added in Phase 3. `images.remotePatterns` not needed yet.

### 1.3 Tailwind CSS v4 Setup [IMPLEMENTED]

**postcss.config.mjs** created. **globals.css** migrated with these changes:
- Removed Google Fonts `@import url(...)` (replaced by `next/font` in layout.tsx)
- Updated `@theme` font references to use CSS variables from `next/font`:
  - `--font-sans: var(--font-inter), ui-sans-serif, ...`
  - `--font-mono: var(--font-jetbrains-mono), ui-monospace, ...`
  - `--font-serif: var(--font-playfair-display), serif`
- Removed `body` rule from `@layer base` (handled via `<body className="...">` in layout.tsx)
- All other CSS (`:root`, `.dark`, custom utilities, keyframes, scrollbar) kept identical

### 1.4 TypeScript Configuration [IMPLEMENTED]

Next.js auto-modified `tsconfig.json` during first build to add: `esModuleInterop: true`, `resolveJsonModule: true`, `jsx: "react-jsx"`, and `.next/dev/types/**/*.ts` to include.

Legacy source files (components, pages, i18n, context) are excluded from type-checking to prevent build failures until they are migrated in later phases.

**Path alias**: `@/*` now maps to `./src/*`. Current codebase uses zero `@/` imports (all relative), so no existing imports break.

### 1.5 Package.json Scripts [IMPLEMENTED]

```json
{
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

> **Note**: Turbopack is default in Next.js 16 (no `--turbopack` flag needed). `lint` uses `tsc --noEmit` instead of ESLint per user preference.

---

## Phase 2: Firestore Data Layer [COMPLETED]

> **Status**: Done. All files created, build passes, 168/168 tests pass.
> - `firebase@^12.13.0` and `firebase-admin@^13.10.0` installed
> - TypeScript types: `src/types/index.ts` with `Bilingual`, `BilingualArray` helpers + 5 interfaces
> - Firebase client init: `src/lib/firebase.ts`
> - Firebase Admin init: `src/lib/firebase-admin.ts`
> - Firestore query functions: `src/lib/firestore.ts` (6 functions)
> - Security rules: `firestore.rules` (admin: daniansyahchusyaidin@gmail.com)
> - Seed script: `scripts/seed-firestore.ts` (21 documents: 6 projects, 6 blogs, 3 experience, 6 skills)
> - `.env.example` updated with all Firebase env vars
> - Skills data merged from `Skills.tsx` hardcoded (tags/context) + bilingual titles from translations
> - Blog dates normalized to ISO format (YYYY-MM-DD) instead of display format
> - Blog content trimmed of leading/trailing whitespace from template literals
>
> **Pending**: User must fill `.env.local` with Firebase credentials, then run `npx tsx scripts/seed-firestore.ts`

### 2.1 Firebase Project Setup

1. Go to Firebase Console, use existing project
2. Enable **Cloud Firestore** (production mode)
3. Enable **Firebase Authentication** (Email/Password provider for admin)
4. Get project config values for environment variables

### 2.2 Install Firebase Dependencies

```bash
npm install firebase firebase-admin
```

### 2.3 TypeScript Types [IMPLEMENTED]

Uses `Bilingual` and `BilingualArray` type helpers for cleaner signatures. See `src/types/index.ts` for full definitions. Skills data uses merged structure from `Skills.tsx` hardcoded data (tags/context) with bilingual titles.

### 2.4 Firestore Collection Structure

```
firestore/
+-- projects/          (collection)
|   +-- {projectId}    (document) -> Project type
+-- blogs/             (collection)
|   +-- {blogId}       (document) -> Blog type
+-- experience/        (collection)
|   +-- {expId}        (document) -> ExperienceItem type
+-- skills/            (collection)
|   +-- {skillId}      (document) -> SkillGroup type
```

### 2.5 Firebase Client Init

**`src/lib/firebase.ts`** (for client components - auth):
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
```

### 2.6 Firebase Admin Init

**`src/lib/firebase-admin.ts`** (for server components, server actions, route handlers):
```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
```

### 2.7 Firestore Data Fetching Functions

**`src/lib/firestore.ts`** (used in server components and server actions):
```typescript
import { adminDb } from './firebase-admin';
import type { Project, Blog, ExperienceItem, SkillGroup } from '@/types';

export async function getProjects(): Promise<Project[]> {
  const snapshot = await adminDb
    .collection('projects')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Project);
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const snapshot = await adminDb
    .collection('blogs')
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Blog;
}

export async function getBlogs(): Promise<Blog[]> {
  const snapshot = await adminDb
    .collection('blogs')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Blog);
}

export async function getExperience(): Promise<ExperienceItem[]> {
  const snapshot = await adminDb
    .collection('experience')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as ExperienceItem);
}

export async function getSkills(): Promise<SkillGroup[]> {
  const snapshot = await adminDb
    .collection('skills')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as SkillGroup);
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const snapshot = await adminDb.collection('blogs').select('slug').get();
  return snapshot.docs.map(doc => doc.data().slug as string);
}
```

### 2.8 Data Seeding Script

Create a one-time script to migrate existing `constants.ts` and translation data into Firestore:

**`scripts/seed-firestore.ts`** (run with `npx tsx scripts/seed-firestore.ts`):

This script should:
1. Read existing `PROJECTS` from `constants.ts` and merge with translations from `en.ts`/`id.ts`
2. Read existing `BLOGS` from `constants.ts` and merge with translations
3. Read experience data from translations
4. Read skills data from translations
5. Write all documents to Firestore with proper `Record<'en'|'id', string>` structure and `order` fields

---

## Phase 3: Internationalization (next-intl) [COMPLETED]

> **Status**: Done. next-intl 4.12.0 fully integrated with Next.js 16 App Router.
> - `next-intl@^4.12.0` installed
> - `next.config.ts` updated with `createNextIntlPlugin`
> - `src/i18n/routing.ts` - defineRouting (en, id)
> - `src/i18n/navigation.ts` - createNavigation (Link, useRouter, etc.)
> - `src/i18n/request.ts` - getRequestConfig with message loading
> - `src/proxy.ts` - next-intl middleware (Next.js 16 proxy convention)
> - `messages/en.json` and `messages/id.json` - UI labels only (no Firestore data)
> - `app/[locale]/layout.tsx` - NextIntlClientProvider, generateStaticParams, setRequestLocale, fonts, theme script
> - `app/layout.tsx` - thin pass-through (html/body in locale layout)
> - `app/[locale]/page.tsx` - placeholder page using `useTranslations('hero')`
> - `phrases` kept in translation JSON files (bilingual, not Firestore)
> - `about.desc` added to both translation files
> - tsconfig exclude updated: legacy i18n files excluded individually, new routing/navigation/request included
> - Root `/` redirects to `/en` via next-intl middleware
> - `/en` and `/id` both render with correct translations (verified)
> - Build: SSG for both locales, proxy middleware registered
> - All 168 tests pass (7/7 files)

### 3.1 Install

```bash
npm install next-intl
```

### 3.2 Routing Configuration

**`src/i18n/routing.ts`:**
```typescript
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'id'],
  defaultLocale: 'en',
});
```

### 3.3 Navigation Helpers

**`src/i18n/navigation.ts`:**
```typescript
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### 3.4 Request Configuration

**`src/i18n/request.ts`:**
```typescript
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

### 3.5 Proxy (Middleware)

**`src/proxy.ts`** (Next.js 16 convention, formerly `middleware.ts`):
```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except API routes, static files, _next internals
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
```

### 3.6 Translation File Migration

Convert current TypeScript translation objects (`en.ts`, `id.ts`) to JSON files (`en.json`, `id.json`).

**Key changes:**
- Remove `export const en = { ... } as const;` wrapper
- Convert to plain JSON: `{ "nav": { "about": "About" }, ... }`
- Remove Phrases from translation files (stays in `constants.ts`)
- Remove data that moves to Firestore (projectItems, blogEntries, experience items, skills data)
- Keep: `nav`, `hero`, `about` (static text only), `contact`, `footer`, `hireBanner`, `game`, `dateFormat`, `phrases`

**What stays in translation files** (UI labels only):
```
nav.*                    - Navigation labels
hero.*                   - Hero section static text
about.title, about.headline, about.desc, about.stats  - About section labels
skills.title             - Skills section title
experience.title         - Experience section title
projects.title, projects.cta, projects.labels  - Projects section labels
blog.title, blog.cta, blog.readEntry  - Blog section labels
contact.*                - Contact form labels
footer.*                 - Footer text
hireBanner.*             - Hire banner text
game.*                   - Game UI labels
dateFormat.*             - Date formatting
```

**What moves to Firestore** (dynamic content):
```
projectItems[]           -> Firestore: projects collection
blogEntries.*            -> Firestore: blogs collection
experience.items[]       -> Firestore: experience collection
skills.groups[]          -> Firestore: skills collection
```

### 3.7 Usage in Components

**Server Components** (pages, layouts):
```typescript
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('hero');
  return <h1>{t('headline')}</h1>;
}
```

**Client Components**:
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function Navbar() {
  const t = useTranslations('nav');
  return <a>{t('about')}</a>;
}
```

### 3.8 Migration from Custom i18n

| Current | Next.js Target | Notes |
|---------|---------------|-------|
| `useLanguage().t('key')` | `useTranslations('namespace')('key')` | Namespace-based access |
| `useLanguage().tArray('key')` | Not needed (data from Firestore) | Arrays come from DB now |
| `useLanguage().language` | `useLocale()` | From next-intl |
| `useLanguage().setLanguage()` | `useRouter().replace()` with locale | next-intl navigation |
| `useLocalizedPath()` | `Link` from `@/i18n/navigation` | Auto locale-prefixed |
| `LanguageRedirect` | next-intl middleware | Automatic redirect |
| `LanguageLayout` | `app/[locale]/layout.tsx` | File-based |
| `LanguageContext.tsx` | Removed | next-intl handles it |
| `LanguageRedirect.tsx` | Removed | Middleware handles it |
| `useLocalizedPath.tsx` | Removed | `Link` component handles it |

---

## Phase 4: Theme System Migration [COMPLETED]

> **Status**: Done. Theme system migrated to Next.js client components.
> - `src/context/ThemeProvider.tsx` - new client component with `"use client"`, identical logic to legacy ThemeContext
> - `src/components/ui/CodeText.tsx` - extracted client component with `"use client"`, imports useTheme from new provider
> - `app/[locale]/layout.tsx` - ThemeProvider wraps NextIntlClientProvider
> - tsconfig exclude: `src/context/ThemeContext.tsx` (legacy only), `src/components/*.tsx` (legacy, allows subdirs)
> - Hydration script already in locale layout (from Phase 1)
> - All 168 tests pass, build succeeds

### 4.1 ThemeContext Migration [IMPLEMENTED]

Created `src/context/ThemeProvider.tsx` with `"use client"` directive. Same logic as legacy `ThemeContext.tsx`. Exports `ThemeProvider` and `useTheme`.

Extracted `CodeText` into `src/components/ui/CodeText.tsx` with `"use client"`. Imports `useTheme` from new provider path (`@/context/ThemeProvider`).

### 4.2 Hydration Mismatch Prevention

Add a theme script in root layout to prevent flash of wrong theme:

**`src/app/layout.tsx`** (root):
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('theme');
                var isCode = localStorage.getItem('isCodeMode') === 'true';
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.classList.add(theme);
                if (isCode) document.documentElement.classList.add('code');
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 4.3 CSS Variables

`globals.css` keeps the same `:root` and `.dark` CSS variable definitions. No changes needed.

---

## Phase 5: Layout & Navigation Migration [COMPLETED]

> **Status**: Done. Layout and navigation fully migrated to Next.js App Router.
> - Root layout (`src/app/layout.tsx`) — thin pass-through (html/body in locale layout)
> - Locale layout (`src/app/[locale]/layout.tsx`) — fonts, ThemeProvider, NextIntlClientProvider, Navbar, Footer, CustomCursor, ScrollToTop, ScrollProgress
> - MainLayout replaced by file-based locale layout (legacy file kept for reference)
> - Navbar (`src/components/layout/Navbar.tsx`) — `'use client'`, next-intl, `@/i18n/navigation`, hybrid hash-anchor scrolling
> - Footer (`src/components/layout/Footer.tsx`) — `'use client'`, `@/` imports
> - Gimmick components migrated to `src/components/gimmicks/` with `'use client'`
> - UI components migrated to `src/components/ui/` with `'use client'`
> - ScrollToAnchor removed: replaced by hybrid strategy (native `<a href="#hash">` on homepage for zero-JS smooth scroll via CSS `scroll-behavior: smooth`, next-intl `Link` for cross-page navigation)
> - All 168 tests pass, build succeeds

### 5.1 Root Layout

**`src/app/layout.tsx`:**
- Wraps entire app with `ThemeProvider`
- Sets fonts via `next/font` (replace Google Fonts `@import` for performance):

```typescript
import { Inter, JetBrains_Mono, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const playfairDisplay = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
```

This replaces the Google Fonts `@import` in CSS for better performance (self-hosted, zero layout shift).

### 5.2 Locale Layout

**`src/app/[locale]/layout.tsx`:**
- Wraps with `NextIntlClientProvider`
- Renders persistent elements: `Navbar`, `Footer`, `CustomCursor`, `ScrollToTop`, `ScrollProgress`
- Calls `setRequestLocale(locale)` for static rendering
- Implements `generateStaticParams` returning `[{ locale: 'en' }, { locale: 'id' }]`

### 5.3 MainLayout Removal

The current `MainLayout.tsx` + React Router `<Outlet />` pattern is replaced by Next.js file-based layouts. Remove `MainLayout.tsx` entirely. Its contents (Navbar, Footer, CustomCursor, ScrollToTop) move to `app/[locale]/layout.tsx`.

### 5.4 Navbar Migration

**`src/components/layout/Navbar.tsx`:**
- Add `"use client"` directive (uses useState, useEffect, scroll events)
- Replace `react-router-dom` imports:
  - `Link` from `react-router-dom` -> `Link` from `@/i18n/navigation`
  - `useNavigate()` -> `useRouter()` from `@/i18n/navigation`
- Replace `useLanguage()` -> `useTranslations('nav')` + `useLocale()`
- Replace `useLocalizedPath()` -> Use `Link` component directly (auto-prefixed)
- Language toggle: `router.replace(pathname, { locale: newLocale })`

### 5.5 Footer Migration

**`src/components/layout/Footer.tsx`:**
- Can be a server component if it only displays static text
- If it uses `useTranslations` client-side or animations, add `"use client"`
- Remove React Router dependencies

### 5.6 ScrollToAnchor Removal

Next.js App Router handles scroll restoration natively. The `ScrollToAnchor.tsx` component can likely be removed. If hash-anchor scrolling on the homepage is needed, handle it in the homepage client component.

---

## Phase 6: Page & Section Migration [COMPLETED]

> **Status**: Done. All pages and section components migrated to Next.js App Router.
> - Homepage: server page fetches Firestore data, passes to client `HomePage` component
> - Blog list: `/[locale]/blog/page.tsx` with ISR (1h)
> - Blog detail: `/[locale]/blog/[slug]/page.tsx` with `generateStaticParams` + ISR
> - Projects: `/[locale]/projects/page.tsx` with ISR (1h)
> - Section components in `src/components/sections/` (Hero, About, Skills, Experience, Projects, Blog, Contact)
> - Page components in `src/components/pages/` (BlogListPage, BlogDetailsPage, ProjectListPage)
> - Gimmick components in `src/components/gimmicks/` (all 10 migrated with `'use client'`)
> - UI components in `src/components/ui/` (Reveal, HireMeBanner, CodeText, GameRocket, CustomCursor, ScrollProgress, ScrollToTop)
> - SkyForceGame in `src/components/game/` with `dynamic()` and `ssr: false`
> - About section now bilingual via `useTranslations('about')`
> - Contact section now bilingual via `useTranslations('contact')`
> - Skills/Experience receive `SkillGroup[]`/`ExperienceItem[]` from Firestore as props (bilingual via locale)
> - Projects/Blog receive Firestore data as props (bilingual titles/excerpts)
> - Blog content remains single-language (string, not Bilingual)
> - Firebase Admin gracefully returns empty data when credentials unavailable (build without env)
> - Hero CTA buttons use native `<a href="#hash">` (same-page scroll, consistent with Phase 5 strategy)
> - HireMeBanner uses same hybrid scroll strategy (native `<a>` on homepage, `Link` on other pages)
> - All 168 tests pass, build succeeds with all routes

### 6.1 HomePage

**`src/app/[locale]/page.tsx`:**

```typescript
import { use } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { getProjects, getBlogs, getExperience, getSkills } from '@/lib/firestore';
import { HomePage } from './HomePage';

export const revalidate = 3600; // ISR: revalidate every 1 hour

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch all data in parallel for performance
  const [projects, blogs, experience, skills] = await Promise.all([
    getProjects(),
    getBlogs(),
    getExperience(),
    getSkills(),
  ]);

  return (
    <HomePage
      projects={projects}
      blogs={blogs}
      experience={experience}
      skills={skills}
      locale={locale}
    />
  );
}
```

`HomePage` is a client component that receives data as props and renders sections (Hero, About, Skills, SkyForceGame, Experience, Projects, Blog, Contact). Each section receives its relevant data as props.

### 6.2 BlogListPage

**`src/app/[locale]/blog/page.tsx`:**

```typescript
export const revalidate = 3600; // ISR: 1 hour

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const blogs = await getBlogs();
  return <BlogListPage blogs={blogs} locale={locale} />;
}
```

### 6.3 BlogDetailsPage

**`src/app/[locale]/blog/[slug]/page.tsx`:**

```typescript
export const revalidate = 3600; // ISR: 1 hour

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return {};
  return {
    title: blog.title[locale],
    description: blog.excerpt[locale],
  };
}

export default async function Page({ params }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();
  return <BlogDetailsPage blog={blog} locale={locale} />;
}
```

### 6.4 ProjectListPage

**`src/app/[locale]/projects/page.tsx`:**

```typescript
export const revalidate = 3600; // ISR: 1 hour

export default async function Page({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const projects = await getProjects();
  return <ProjectListPage projects={projects} locale={locale} />;
}
```

### 6.5 Section Components Data Flow

Current pattern: Components call `useLanguage().t('key')` to get data.
New pattern: Server page fetches from Firestore, passes data as props to client sections.

| Section | Current Data Source | New Data Source |
|---------|-------------------|-----------------|
| Hero | `useLanguage().t('hero.*')`, `PHRASES` | `useTranslations('hero')`, `PHRASES` (kept in constants.ts) |
| About | `useLanguage().t('about.*')` | `useTranslations('about')` |
| Skills | `useLanguage().t('skills.*')` | Props from Firestore (`SkillGroup[]`) + `useTranslations('skills')` for title |
| Experience | `useLanguage().t('experience.*')` | Props from Firestore (`ExperienceItem[]`) + `useTranslations('experience')` for title |
| Projects | `useLanguage().t('projects.*')`, `tArray('projectItems')` | Props from Firestore (`Project[]`) + `useTranslations('projects')` for labels |
| Blog | `BLOGS` constant, `useLanguage().t('blogEntries.*')` | Props from Firestore (`Blog[]`) + `useTranslations('blog')` for labels |
| Contact | `useLanguage().t('contact.*')` | `useTranslations('contact')` |
| SkyForceGame | `useLanguage().t('game.*')` | `useTranslations('game')` |

---

## Phase 7: Component Migration [COMPLETED]

> **Status**: Done. All components fully migrated to Next.js client/server architecture.
> - All client components have `'use client'` directive
> - All react-router-dom imports replaced with `@/i18n/navigation` (Link, useRouter, usePathname)
> - All `useLanguage()` calls replaced with `useTranslations()` from next-intl
> - All `useLocalizedPath()` replaced with next-intl `Link` component
> - All components organized into subdirectories: `layout/`, `sections/`, `ui/`, `game/`, `gimmicks/`, `pages/`
> - SkyForceGame: `dynamic()` with `ssr: false`, `useTranslations('game')` for all UI strings (bilingual)
> - All gimmick components: `'use client'` + motion/react (no import changes needed)
> - Server components: page wrappers only (fetch data, pass props)
> - ThemeProvider: `'use client'` with hydration script
> - All 168 tests pass, build succeeds

### 7.1 Client vs Server Component Decision

**Server Components** (no `"use client"` needed):
- Page wrappers (`app/[locale]/page.tsx`, etc.) - fetch data, pass props

**Client Components** (need `"use client"`):
- ALL section components (Hero, About, Skills, etc.) - they use motion/react animations
- ALL gimmick components - they use motion/react animations + useScroll
- Navbar - uses useState, useEffect, scroll events
- CustomCursor - uses useRef, useEffect, mousemove events
- ScrollProgress - uses useScroll from motion/react
- ScrollToTop - uses useState, useEffect, scroll events
- Reveal - uses motion from motion/react
- CodeText - uses useTheme context
- SkyForceGame - uses canvas, useRef, useEffect, Web Audio API
- GameRocket - uses motion animations
- HireMeBanner - uses motion animations
- Contact - uses useState for form
- ThemeContext - uses localStorage, window APIs
- AuthContext - uses Firebase Auth client SDK

### 7.2 Component Changes Required

For each component, the migration involves:

1. **Add `"use client"` directive** to all client components
2. **Replace react-router-dom imports**:
   - `Link` -> `Link` from `@/i18n/navigation`
   - `useNavigate()` -> `useRouter()` from `@/i18n/navigation`
   - `useLocation()` -> `usePathname()` from `@/i18n/navigation`
   - `useParams()` -> receive as props from server page
3. **Replace `useLanguage()` calls**:
   - `t('key')` -> `useTranslations('namespace')('key')` for UI labels
   - Dynamic data (projects, blogs, etc.) -> receive as props
4. **Replace `useLocalizedPath()`** -> Use `Link` from `@/i18n/navigation`
5. **Remove `Outlet`** references (MainLayout only)
6. **Organize into subdirectories**: `layout/`, `sections/`, `ui/`, `game/`, `gimmicks/`

### 7.3 SkyForceGame Special Handling

The SkyForceGame component is heavy (canvas, audio, game loop). Use `next/dynamic` with `ssr: false`:

```typescript
// In HomePage client component
import dynamic from 'next/dynamic';

const SkyForceGame = dynamic(() => import('@/components/game/SkyForceGame'), {
  ssr: false,
  loading: () => <div className="h-[600px] bg-background" />,
});
```

### 7.4 Gimmick Components

All gimmick components are purely client-side (animations, scroll tracking). No data changes needed:
- Add `"use client"` to each
- No import changes (they only use motion/react and React hooks)
- Move to `src/components/gimmicks/` subdirectory

---

## Phase 8: SEO Migration [COMPLETED]

> **Status**: Done. SEO fully migrated from react-helmet-async to Next.js Metadata API.
> - Root metadata in `[locale]/layout.tsx` (metadataBase, title template, OG, twitter)
> - `generateMetadata` on all 4 page routes with locale-specific titles, descriptions, canonical URLs, hreflang alternates
> - Homepage: bilingual title/description from `seo` namespace in translation JSON
> - Blog list: bilingual title/description from `seo` namespace
> - Blog detail: dynamic title/description from Firestore `Blog.title`/`Blog.excerpt` (bilingual)
> - Projects: bilingual title/description from `seo` namespace
> - Dynamic `src/app/sitemap.ts` — auto-includes blog posts from Firestore, hreflang alternates for all pages
> - Dynamic `src/app/robots.ts` — points to dynamic sitemap
> - Static `public/sitemap.xml` and `public/robots.txt` deleted (replaced by dynamic versions)
> - `seo` namespace added to both `messages/en.json` and `messages/id.json`
> - Legacy `SEO.tsx` still on disk (excluded from tsconfig, not in use — kept per no-delete policy)
> - All 168 tests pass, build succeeds with `/robots.txt` and `/sitemap.xml` as generated routes

### 8.1 Replace react-helmet-async with Metadata API

**Remove** `react-helmet-async` entirely. Delete `SEO.tsx` component.

### 8.2 Root Metadata

**`src/app/layout.tsx`:**
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://daniansyah.dev'),
  title: {
    default: 'Daniansyah Chusyaidin | Fullstack & Mobile Engineer',
    template: '%s | Daniansyah Chusyaidin',
  },
  description: 'High-fidelity portfolio for Daniansyah Chusyaidin - Fullstack & Mobile Engineer.',
  openGraph: {
    type: 'website',
    siteName: 'Daniansyah Chusyaidin Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

### 8.3 Per-Page Metadata with generateMetadata

Each page file exports `generateMetadata` for locale-specific titles, descriptions, canonical URLs, and hreflang alternates:

```typescript
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `https://daniansyah.dev/${loc}`;
  }
  languages['x-default'] = 'https://daniansyah.dev/en';

  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
    alternates: {
      canonical: `https://daniansyah.dev/${locale}`,
      languages,
    },
    openGraph: {
      title: t('homeTitle'),
      description: t('homeDescription'),
      url: `https://daniansyah.dev/${locale}`,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
  };
}
```

### 8.4 Dynamic Sitemap

**`src/app/sitemap.ts`:**
```typescript
import type { MetadataRoute } from 'next';
import { getAllBlogSlugs } from '@/lib/firestore';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogSlugs = await getAllBlogSlugs();
  const baseUrl = 'https://daniansyah.dev';
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = ['', '/blog', '/projects'];
  for (const page of staticPages) {
    for (const locale of routing.locales) {
      const languages: Record<string, string> = {};
      for (const alt of routing.locales) {
        languages[alt] = `${baseUrl}/${alt}${page}`;
      }
      languages['x-default'] = `${baseUrl}/en${page}`;

      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
        alternates: { languages },
      });
    }
  }

  // Blog detail pages
  for (const slug of blogSlugs) {
    for (const locale of routing.locales) {
      const languages: Record<string, string> = {};
      for (const alt of routing.locales) {
        languages[alt] = `${baseUrl}/${alt}/blog/${slug}`;
      }
      languages['x-default'] = `${baseUrl}/en/blog/${slug}`;

      entries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
```

This replaces the static `public/sitemap.xml` with a dynamically generated one that auto-includes new blog posts from Firestore.

### 8.5 Dynamic Robots

**`src/app/robots.ts`:**
```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://daniansyah.dev/sitemap.xml',
  };
}
```

---

## Phase 9: Authentication & Admin Panel [COMPLETED]

> **Status**: Done. Full admin panel with Firebase Auth and CRUD operations.
> - `next-firebase-auth-edge` installed for server-side auth in middleware
> - `src/context/AuthContext.tsx` — client-side Firebase Auth state, login/logout, admin email restriction
> - `src/proxy.ts` — extended with `authMiddleware` for `/admin` routes (graceful skip when env missing)
> - Server actions: `src/actions/blogs.ts`, `projects.ts`, `experience.ts`, `skills.ts` — CRUD + revalidatePath
> - API routes: `src/app/api/admin/` — counts, projects, blogs, experience, skills (GET for admin data fetching)
> - Admin layout: `src/app/[locale]/admin/layout.tsx` — AuthProvider + AdminGuard (redirects to login if unauthenticated)
> - Admin login: `src/app/[locale]/admin/login/page.tsx` — email/password form, restricted to daniansyahchusyaidin@gmail.com
> - Admin dashboard: overview with content counts
> - Admin CRUD pages: projects, blogs, experience, skills — all with inline create/edit forms and delete
> - `MarkdownEditor` component: toolbar (bold/italic/heading/code/list/link) + split/preview mode using react-markdown
> - `AdminSidebar` component: fixed dark slate-900 theme, nav items with active state
> - Admin panel: English-only, fixed dark theme (slate-900), minimal/functional design
> - Firebase client SDK gracefully handles missing env vars during build (placeholder API key)
> - On-demand revalidation via `revalidatePath()` after every CRUD operation
> - All 168 tests pass, build succeeds (admin pages SSG, API routes dynamic)

### 9.1 Install Auth Dependencies

```bash
npm install next-firebase-auth-edge
```

### 9.2 Auth Context (Client Side)

**`src/context/AuthContext.tsx`:**
```typescript
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 9.3 Admin Auth Middleware

Extend the proxy.ts to protect `/admin` routes using `next-firebase-auth-edge`:

```typescript
import { authMiddleware } from 'next-firebase-auth-edge';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: check Firebase auth session
  if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
    return authMiddleware(request, {
      loginPath: '/api/login',
      logoutPath: '/api/logout',
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      cookieName: 'AuthToken',
      cookieSignatureKeys: [
        process.env.COOKIE_SECRET_CURRENT!,
        process.env.COOKIE_SECRET_PREVIOUS!,
      ],
      cookieSerializeOptions: {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 12 * 60 * 60 * 24, // 12 days
      },
      serviceAccount: {
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      handleInvalidToken: async () => {
        // Redirect to login
        return Response.redirect(new URL(`/${routing.defaultLocale}/admin/login`, request.url));
      },
      handleValidToken: async ({ token, decodedToken }) => {
        // Allow through to the next middleware (intl)
        return intlMiddleware(request);
      },
    });
  }

  // Public routes: only i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
```

### 9.4 Server Actions for CRUD

**`src/actions/blogs.ts`:**
```typescript
'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { Blog } from '@/types';

export async function createBlog(data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString();
  await adminDb.collection('blogs').add({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  // Revalidate all locale versions
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
}

export async function updateBlog(id: string, data: Partial<Blog>) {
  await adminDb.collection('blogs').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
  if (data.slug) {
    revalidatePath(`/en/blog/${data.slug}`);
    revalidatePath(`/id/blog/${data.slug}`);
  }
}

export async function deleteBlog(id: string) {
  await adminDb.collection('blogs').doc(id).delete();
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
}
```

Similar server actions for `projects.ts`, `experience.ts`, `skills.ts`.

### 9.5 On-Demand Revalidation

Server actions call `revalidatePath()` after CRUD operations. This triggers ISR regeneration so changes appear immediately without waiting for the 1-hour revalidation timer.

### 9.6 Admin Panel Pages

Simple CRUD interface with:
- **Dashboard** (`/admin`): Overview of content counts
- **Projects** (`/admin/projects`): Table of projects with add/edit/delete
- **Blogs** (`/admin/blogs`): Table of blogs with add/edit/delete
- **Blogs Editor** (`/admin/blogs/[slug]`): Markdown editor for blog content
- **Experience** (`/admin/experience`): Table of experience entries
- **Skills** (`/admin/skills`): Table of skill groups

Admin pages use Tailwind for styling (same design system). Minimal UI - functional over decorative. No gimmick backgrounds in admin.

### 9.7 Admin Layout

**`src/app/[locale]/admin/layout.tsx`:**
```typescript
'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  if (!user) {
    router.replace('/admin/login');
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

---

## Phase 10: Firestore Security Rules [COMPLETED]

> **Status**: Done. Rules were created during Phase 2 with correct admin email.
> - `firestore.rules` already exists with public read for all 4 collections
> - Write restricted to `daniansyahchusyaidin@gmail.com` only
> - Default deny for all other paths
> - Defense-in-depth: server actions use firebase-admin (bypasses rules), rules protect against direct client access

**`firestore.rules`:**
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Public read access for all content collections
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
    }

    match /blogs/{blogId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
    }

    match /experience/{expId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
    }

    match /skills/{skillId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'YOUR_ADMIN_EMAIL@gmail.com';
    }

    // Deny everything else by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Note: Since server actions use `firebase-admin` (which bypasses security rules), these rules primarily protect against direct client-side Firestore access. The admin panel uses server actions (firebase-admin) for writes, so writes go through the server. The rules above provide defense-in-depth.

Replace `YOUR_ADMIN_EMAIL@gmail.com` with your actual admin email.

---

## Phase 11: Testing Migration [COMPLETED]

> **Status**: Done. Test infrastructure migrated from legacy react-router to Next.js/next-intl.
> - `src/test/setup.ts` — updated with `next/navigation`, `next-intl`, and `@/i18n/navigation` mocks
> - `src/test/test-utils.tsx` — rewritten with `ThemeProvider` wrapper (no BrowserRouter/MemoryRouter)
> - `src/test/translations.test.ts` — rewritten to import from JSON files, removed Firestore-migrated keys (blogEntries, experience.jobs, projectItems, skills.items/groups)
> - `src/test/pages.test.tsx` — new tests for section components rendering with mock Firestore data (Skills, Experience, Projects, Blog, About, Contact)
> - `src/test/metadata.test.ts` — new tests for `generateMetadata` output (homepage, blog list, projects) with locale-specific SEO validation
> - Vitest include pattern updated to `src/test/**/*.test.{ts,tsx}` (excludes legacy tests)
> - Legacy test files kept on disk (not deleted per no-delete policy) but excluded from test runs
> - 3 test files, 46 tests — all pass
> - Build succeeds (27 pages)

### 11.1 Keep Vitest

Next.js 16 works well with Vitest. Keep the current testing setup with minor changes.

### 11.2 Test Setup Changes

**`src/test/setup.ts`:**
- Keep all existing mocks (localStorage, matchMedia, scrollTo, ResizeObserver, IntersectionObserver)
- Add mock for `next/navigation`:
```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => '/en',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ locale: 'en' }),
}));
```

**`src/test/test-utils.tsx`:**
- Replace BrowserRouter/MemoryRouter wrappers with NextIntlClientProvider wrapper
- Remove react-router-dom dependencies

### 11.3 Test Migration Map

| Current Test | Migration Action |
|-------------|-----------------|
| `App.test.tsx` | Rewrite: test route rendering via page components directly |
| `SEO.test.tsx` | Rewrite: test `generateMetadata` function output |
| `LanguageContext.test.tsx` | Remove (replaced by next-intl) |
| `LanguageLayout.test.tsx` | Remove (replaced by next-intl middleware) |
| `LanguageRedirect.test.tsx` | Remove (replaced by next-intl middleware) |
| `useLocalizedPath.test.tsx` | Remove (replaced by next-intl Link) |
| `translations.test.ts` | Keep: validate JSON translation parity (update for .json format) |

### 11.4 New Tests to Add

- Firestore data fetching functions (mock firebase-admin)
- Server actions (CRUD operations)
- Admin auth flow
- generateMetadata output validation
- Component rendering with Firestore data props

---

## Phase 12: Performance Optimization [COMPLETED]

> **Status**: Done. All performance optimizations implemented.
> - ISR with `revalidate = 3600` on all public pages + on-demand `revalidatePath()` in server actions
> - `next/font` self-hosting Inter, JetBrains Mono, Playfair Display (zero CLS, no external requests)
> - SkyForceGame: `dynamic({ ssr: false })` — heavy canvas/audio excluded from SSR
> - All 7 gimmick components: `dynamic({ ssr: false })` — decorative backgrounds lazy-loaded, reduces initial JS bundle
> - `optimizePackageImports: ['lucide-react', 'motion/react']` — tree-shaking for icon/animation libraries
> - Firestore: `select('slug')` for slug-only queries, `orderBy('order')` on all collections, `Promise.all()` for parallel fetches on homepage
> - Phrases kept in translation JSON (immediate availability for typewriter animation)
> - All 46 tests pass, build succeeds

### 12.1 Rendering Strategy (ISR + On-Demand Revalidation)

All public pages use **Static Site Generation (SSG) with Incremental Static Regeneration (ISR)**:
- Pages are pre-rendered at build time
- `revalidate = 3600` (1 hour) for time-based background regeneration
- Admin CRUD operations trigger `revalidatePath()` for immediate updates
- Result: First visit always serves a cached static page (fast), content updates propagate within seconds after admin changes

### 12.2 Font Optimization

Replace Google Fonts CSS `@import` with `next/font`:
- Self-hosted fonts, zero external network requests
- Zero Cumulative Layout Shift (CLS)
- Font files included in deployment bundle

### 12.3 Image Optimization

If images are added in the future, use `next/image` for:
- Automatic WebP/AVIF conversion
- Responsive srcset generation
- Lazy loading by default

### 12.4 Dynamic Imports

Heavy client components loaded with `next/dynamic`:

```typescript
// SkyForceGame - heavy (canvas, audio, game loop)
const SkyForceGame = dynamic(() => import('@/components/game/SkyForceGame'), {
  ssr: false,
});

// Gimmick components - decorative, not critical path
const SystemGimmick = dynamic(() => import('@/components/gimmicks/SystemGimmick'), {
  ssr: false,
});
```

### 12.5 Bundle Optimization

`next.config.ts`:
```typescript
experimental: {
  optimizePackageImports: ['lucide-react', 'motion/react'],
}
```

This tree-shakes lucide-react icons (only imports used icons, not entire library).

### 12.6 Firestore Query Optimization

- Use `select()` to fetch only needed fields when possible
- Use `orderBy('order')` with indexes for sorted queries
- Parallel fetches with `Promise.all()` on homepage
- No real-time listeners (fetch on load only) - reduces client bundle

### 12.7 Static Data Kept Client-Side

`PHRASES` array stays in `constants.ts` (not Firestore) since it's:
- Small (4 strings)
- Rarely changes
- Used in typewriter animation (needs to be immediately available)
- No admin management needed

---

## Phase 13: Deployment (Vercel)

### 13.1 Vercel Setup

1. Connect GitHub repository to Vercel
2. Framework preset: Next.js (auto-detected)
3. Root directory: `./` (or project subdirectory if monorepo)
4. Build command: `next build` (default)
5. Output directory: `.next` (default)

### 13.2 Environment Variables on Vercel

Set all env vars in Vercel dashboard (Settings > Environment Variables):

```
# Firebase Client (NEXT_PUBLIC_ prefix = exposed to browser)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Firebase Admin (server-only, no NEXT_PUBLIC_ prefix)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...

# Auth Cookies
COOKIE_SECRET_CURRENT=...
COOKIE_SECRET_PREVIOUS=...
```

### 13.3 Domain Configuration

- Add `daniansyah.dev` custom domain in Vercel
- Vercel auto-provisions SSL
- Update DNS records as directed by Vercel

### 13.4 Vercel Settings

- **Framework**: Next.js
- **Node.js Version**: 20.x (LTS)
- **Build Output**: Standalone (via `output: 'standalone'` in next.config.ts)
- **ISR**: Automatically handled by Vercel's edge network

---

## Migration Mapping: File by File

### Files to Remove

| Current File | Reason |
|-------------|--------|
| `index.html` | Next.js generates HTML via layouts |
| `vite.config.ts` | Replaced by `next.config.ts` |
| `metadata.json` | AI Studio specific, not needed |
| `.env.example` | Rewrite for new env vars |
| `src/main.tsx` | Next.js entry is `app/layout.tsx` |
| `src/App.tsx` | Routing is file-based now |
| `src/components/MainLayout.tsx` | Replaced by `app/[locale]/layout.tsx` |
| `src/components/SEO.tsx` | Replaced by `generateMetadata` |
| `src/components/ScrollToAnchor.tsx` | Next.js handles scroll restoration |
| `src/i18n/LanguageContext.tsx` | Replaced by next-intl |
| `src/i18n/LanguageLayout.tsx` | Replaced by `app/[locale]/layout.tsx` |
| `src/i18n/LanguageRedirect.tsx` | Replaced by next-intl middleware |
| `src/i18n/useLocalizedPath.tsx` | Replaced by next-intl `Link` |
| `src/i18n/types.ts` | Replaced by next-intl types |
| `src/i18n/index.ts` | Replaced by `@/i18n/navigation` |
| `src/i18n/translations/en.ts` | Migrated to `messages/en.json` |
| `src/i18n/translations/id.ts` | Migrated to `messages/id.json` |
| `src/i18n/translations/index.ts` | Not needed |
| `src/App.test.tsx` | Rewrite for Next.js |
| `src/components/SEO.test.tsx` | Rewrite for generateMetadata |
| `src/i18n/LanguageContext.test.tsx` | Remove (next-intl) |
| `src/i18n/LanguageLayout.test.tsx` | Remove (next-intl) |
| `src/i18n/LanguageRedirect.test.tsx` | Remove (next-intl) |
| `src/i18n/useLocalizedPath.test.tsx` | Remove (next-intl) |
| `public/sitemap.xml` | Replaced by dynamic `app/sitemap.ts` |
| `public/robots.txt` | Replaced by dynamic `app/robots.ts` |

### Files to Migrate (with changes)

| Current File | Target Location | Changes |
|-------------|----------------|---------|
| `src/index.css` | `src/app/globals.css` | Remove Google Fonts @import (use next/font), change Tailwind import if needed |
| `src/context/ThemeContext.tsx` | `src/context/ThemeContext.tsx` | Add `"use client"`, extract CodeText to separate file |
| `src/constants.ts` | `src/constants.ts` | Keep PHRASES only, remove PROJECTS and BLOGS |
| `src/pages/HomePage.tsx` | `src/app/[locale]/page.tsx` + client component | Split into server page (data fetch) + client composition |
| `src/pages/BlogListPage.tsx` | `src/app/[locale]/blog/page.tsx` + client component | Server page + client component with Firestore data |
| `src/pages/BlogDetailsPage.tsx` | `src/app/[locale]/blog/[slug]/page.tsx` + client component | Server page + client component with Firestore data |
| `src/pages/ProjectListPage.tsx` | `src/app/[locale]/projects/page.tsx` + client component | Server page + client component with Firestore data |
| `src/components/Navbar.tsx` | `src/components/layout/Navbar.tsx` | `"use client"`, replace router/i18n imports |
| `src/components/Footer.tsx` | `src/components/layout/Footer.tsx` | `"use client"`, replace i18n imports |
| `src/components/Hero.tsx` | `src/components/sections/Hero.tsx` | `"use client"`, replace i18n imports |
| `src/components/About.tsx` | `src/components/sections/About.tsx` | `"use client"`, replace i18n imports |
| `src/components/Skills.tsx` | `src/components/sections/Skills.tsx` | `"use client"`, receive data via props |
| `src/components/Experience.tsx` | `src/components/sections/Experience.tsx` | `"use client"`, receive data via props |
| `src/components/Projects.tsx` | `src/components/sections/Projects.tsx` | `"use client"`, receive data via props |
| `src/components/Blog.tsx` | `src/components/sections/Blog.tsx` | `"use client"`, receive data via props |
| `src/components/Contact.tsx` | `src/components/sections/Contact.tsx` | `"use client"`, replace i18n imports |
| `src/components/HireMeBanner.tsx` | `src/components/ui/HireMeBanner.tsx` | `"use client"`, replace i18n imports |
| `src/components/Reveal.tsx` | `src/components/ui/Reveal.tsx` | `"use client"` (already client-only) |
| `src/components/CustomCursor.tsx` | `src/components/ui/CustomCursor.tsx` | `"use client"` |
| `src/components/ScrollProgress.tsx` | `src/components/ui/ScrollProgress.tsx` | `"use client"` |
| `src/components/ScrollToTop.tsx` | `src/components/ui/ScrollToTop.tsx` | `"use client"` |
| `src/components/GameRocket.tsx` | `src/components/ui/GameRocket.tsx` | `"use client"` |
| `src/components/SkyForceGame.tsx` | `src/components/game/SkyForceGame.tsx` | `"use client"`, dynamic import, performance review |
| All `*Gimmick.tsx` | `src/components/gimmicks/*.tsx` | `"use client"` to each |
| `src/i18n/translations/translations.test.ts` | `src/test/translations.test.ts` | Update for JSON format |
| `src/test/setup.ts` | `src/test/setup.ts` | Add next/navigation mocks |
| `src/test/test-utils.tsx` | `src/test/test-utils.tsx` | Replace router wrappers with NextIntlClientProvider |

### New Files to Create

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `postcss.config.mjs` | Tailwind v4 PostCSS setup |
| `src/proxy.ts` | next-intl + auth middleware |
| `src/i18n/routing.ts` | next-intl routing config |
| `src/i18n/navigation.ts` | next-intl navigation helpers |
| `src/i18n/request.ts` | next-intl request config |
| `src/messages/en.json` | English translations (JSON) |
| `src/messages/id.json` | Indonesian translations (JSON) |
| `src/app/layout.tsx` | Root layout |
| `src/app/globals.css` | Global styles |
| `src/app/not-found.tsx` | 404 page |
| `src/app/sitemap.ts` | Dynamic sitemap |
| `src/app/robots.ts` | Dynamic robots.txt |
| `src/app/[locale]/layout.tsx` | Locale layout |
| `src/app/[locale]/page.tsx` | Homepage server page |
| `src/app/[locale]/blog/page.tsx` | Blog list server page |
| `src/app/[locale]/blog/[slug]/page.tsx` | Blog detail server page |
| `src/app/[locale]/projects/page.tsx` | Projects server page |
| `src/app/[locale]/admin/layout.tsx` | Admin layout with auth guard |
| `src/app/[locale]/admin/page.tsx` | Admin dashboard |
| `src/app/[locale]/admin/login/page.tsx` | Admin login |
| `src/app/[locale]/admin/projects/page.tsx` | Admin projects CRUD |
| `src/app/[locale]/admin/blogs/page.tsx` | Admin blogs CRUD |
| `src/app/[locale]/admin/blogs/[slug]/page.tsx` | Admin blog editor |
| `src/app/[locale]/admin/experience/page.tsx` | Admin experience CRUD |
| `src/app/[locale]/admin/skills/page.tsx` | Admin skills CRUD |
| `src/lib/firebase.ts` | Firebase client init |
| `src/lib/firebase-admin.ts` | Firebase Admin init |
| `src/lib/firestore.ts` | Firestore query functions |
| `src/lib/auth.ts` | Auth helpers |
| `src/context/AuthContext.tsx` | Auth provider |
| `src/actions/projects.ts` | Server actions: projects CRUD |
| `src/actions/blogs.ts` | Server actions: blogs CRUD |
| `src/actions/experience.ts` | Server actions: experience CRUD |
| `src/actions/skills.ts` | Server actions: skills CRUD |
| `src/actions/revalidate.ts` | On-demand revalidation |
| `src/types/index.ts` | Shared TypeScript types |
| `src/components/admin/AdminSidebar.tsx` | Admin navigation |
| `src/components/admin/DataTable.tsx` | Reusable admin table |
| `src/components/admin/MarkdownEditor.tsx` | Blog content editor |
| `src/components/admin/FormField.tsx` | Reusable form input |
| `src/components/ui/CodeText.tsx` | Extracted from ThemeContext |
| `firestore.rules` | Firestore security rules |
| `scripts/seed-firestore.ts` | One-time data migration script |
| `.env.example` | New env var template |

---

## Rendering Strategy per Route

| Route | Strategy | Revalidation | Rationale |
|-------|----------|-------------|-----------|
| `/:locale` (Home) | SSG + ISR | 3600s (1h) + on-demand | Heavy page with all data; static is fastest |
| `/:locale/blog` | SSG + ISR | 3600s + on-demand | Blog list rarely changes |
| `/:locale/blog/:slug` | SSG + ISR | 3600s + on-demand | `generateStaticParams` pre-builds all slugs |
| `/:locale/projects` | SSG + ISR | 3600s + on-demand | Project list rarely changes |
| `/:locale/admin/*` | Dynamic (SSR) | None | Always needs fresh auth state |
| `/:locale/admin/login` | Dynamic (SSR) | None | Auth page |

**On-Demand Revalidation**: When admin creates/updates/deletes content via server actions, `revalidatePath()` is called to immediately regenerate affected pages. This means:
- Normal visitors always get cached static pages (fast)
- After admin changes, the next visitor gets a freshly generated page
- 1-hour fallback ensures pages refresh even without admin action

---

## Dependency Changes

### Dependencies to Add

```bash
npm install next next-intl firebase firebase-admin next-firebase-auth-edge
```

### Dependencies to Remove

```bash
npm uninstall @google/genai @tailwindcss/vite @vitejs/plugin-react dotenv express react-helmet-async react-router-dom vite
```

### Dev Dependencies to Remove

```bash
npm uninstall @types/express autoprefixer tsx
```

### Dev Dependencies to Add

```bash
npm install -D @tailwindcss/postcss @types/node
```

### Dependencies That Stay (no changes)

- `react`, `react-dom` (v19)
- `lucide-react`
- `motion` (motion/react)
- `react-markdown`
- `tailwindcss` (upgrade to v4 with postcss plugin)
- `typescript`
- `vitest`, `@vitest/ui`
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `jsdom`

---

## Environment Variables

### New .env.example

```bash
# Firebase Client SDK (exposed to browser via NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-only, NEVER expose to browser)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Auth Cookie Secrets (generate with: openssl rand -base64 32)
COOKIE_SECRET_CURRENT=
COOKIE_SECRET_PREVIOUS=
```

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Animation hydration mismatches | Visual glitches on load | All animated components use `"use client"`, motion components are client-only |
| Theme flash (FOUC) | Light flash before dark theme | Inline `<script>` in root layout sets theme class before hydration |
| SkyForceGame SSR crash | Build failure | `dynamic(() => import(...), { ssr: false })` |
| Firestore cold starts | Slow first page load after deploy | ISR ensures pages are pre-built; Firestore cold starts only affect regeneration |
| next-intl + auth middleware conflict | Routing issues | Compose middlewares carefully in proxy.ts; test both auth and intl paths |
| Translation file format change (TS -> JSON) | Missing/broken translations | Keep `translations.test.ts` to validate parity after migration |
| Path alias change (`@/` root -> `@/src/`) | Broken imports | Global find-and-replace; TypeScript compiler catches errors |
| Firebase Admin private key in env | Security risk if leaked | Server-only env (no NEXT_PUBLIC_ prefix), Vercel encrypted env vars |
| ISR cache staleness | Admin changes not visible immediately | On-demand `revalidatePath()` after every CRUD server action |
| Large client bundle from gimmick components | Slow page load | Dynamic imports for gimmick components, code-split per section |
| Google Fonts removal | Different font rendering | next/font self-hosts same fonts; visually identical |
| next-firebase-auth-edge compatibility with Next.js 16 | Auth flow breaks | Library docs confirm Next.js 16 support with proxy.ts convention |
| Admin panel i18n | Unnecessary complexity | Admin panel can default to English-only, or support both locales via same next-intl setup |

---

## Execution Order Summary

| Phase | Description | Depends On |
|-------|-------------|-----------|
| 1 | Project scaffold, configs, Tailwind | None |
| 2 | Firebase setup, types, Firestore functions, seed script | Phase 1 |
| 3 | next-intl setup, translation migration | Phase 1 |
| 4 | Theme system migration | Phase 1 |
| 5 | Layout & navigation migration | Phase 3, 4 |
| 6 | Page & section migration | Phase 2, 3, 5 |
| 7 | Component migration (all components) | Phase 5, 6 |
| 8 | SEO migration (metadata, sitemap, robots) | Phase 3, 6 |
| 9 | Auth & admin panel | Phase 2, 5 |
| 10 | Firestore security rules | Phase 9 |
| 11 | Testing migration | Phase 7, 8, 9 |
| 12 | Performance optimization | Phase 7, 8 |
| 13 | Deployment to Vercel | All phases |
