# Portfolio v5 — Technical Documentation

Comprehensive reference for the portfolio website of Muhammad Daniansyah Chusyaidin, S.Kom.

**Domain**: https://daniansyah.dev
**Stack**: Next.js 16 · React 19 · Tailwind v4 · Firebase · Vercel
**Repository**: portfolio-v4 (in-place migration from Vite SPA to Next.js App Router)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [App Router & Routes](#app-router--routes)
- [Data Layer (Firestore)](#data-layer-firestore)
- [Internationalization (i18n)](#internationalization-i18n)
- [Theme System](#theme-system)
- [Authentication & Admin Panel](#authentication--admin-panel)
- [Components](#components)
- [SEO](#seo)
- [Performance](#performance)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Visual Design Language](#visual-design-language)
- [Middleware](#middleware)
- [Provider Hierarchy](#provider-hierarchy)
- [Known Conventions & Gotchas](#known-conventions--gotchas)

---

## Architecture Overview

The application follows a server-first architecture using Next.js App Router. Public pages are statically generated at build time and revalidated every hour via ISR. Admin pages are dynamically rendered on each request behind Firebase authentication.

```
Browser Request
  → Proxy Middleware (next-intl locale + Firebase auth for /admin)
  → Server Component (page.tsx) fetches Firestore data
  → Client Component receives data as props, renders with animations
  → Static HTML served via ISR (revalidate every 1 hour)
```

**Data flow for public pages:**
```
App Router page (server)
  → getProjects() / getBlogs() / getExperience() / getSkills()
  → firebase-admin SDK queries Firestore
  → Data passed as props to client components
  → Client renders with motion/react animations + next-intl translations
```

**Data flow for admin CRUD:**
```
Admin form (client) → Server Action → firebase-admin write → revalidatePath()
```

**Provider nesting (locale layout):**
```
<html lang={locale}>
  <head> (theme hydration script) </head>
  <body>
    <ThemeProvider>
      <NextIntlClientProvider>
        <CustomCursor />
        <ScrollToTop />
        <ScrollProgress />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </ThemeProvider>
  </body>
</html>
```

**Admin layout nesting (separate from public):**
```
<AuthProvider>
  <AdminGuard>
    <AdminSidebar />
    <main>{children}</main>
  </AdminGuard>
</AuthProvider>
```

The `AuthProvider` is only rendered inside admin routes. Public visitors never load the Firebase Auth client SDK.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.2.6 |
| Language | TypeScript (strict) | 5.8.2 |
| UI | React | 19.0.0 |
| CSS | Tailwind CSS (with @tailwindcss/postcss) | 4.1.14 |
| Animation | motion/react | 12.23.24 |
| Icons | lucide-react | 0.546.0 |
| Markdown | react-markdown | 10.1.0 |
| i18n | next-intl | 4.12.0 |
| Database | Firebase Firestore | firebase 12.13.0, firebase-admin 13.10.0 |
| Auth | Firebase Auth + next-firebase-auth-edge | 1.12.0 |
| Fonts | next/font (Inter, JetBrains Mono, Playfair Display) | Self-hosted |
| Compiler | React Compiler (babel-plugin-react-compiler) | 19.1.0-rc.3 |
| Testing | Vitest + @testing-library/react + jsdom | 4.1.5 |
| Deployment | Vercel | — |

**No ESLint** — type-checking uses `tsc --noEmit` only.

### Key Architectural Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Bundler | Turbopack (Next.js 16 default) | Faster dev builds than webpack |
| CSS | `@tailwindcss/postcss` (not `@tailwindcss/vite`) | Required for Next.js PostCSS pipeline |
| Compiler | React Compiler (`reactCompiler: true`) | Automatic memoization without manual `useMemo`/`useCallback` |
| Fonts | `next/font/google` (self-hosted) | Zero CLS, no external Google Fonts requests |
| State | React Context (Theme, Auth) | Lightweight, no external state library needed |
| Forms | Controlled inputs + Server Actions | No form library (keeps admin panel simple) |
| Markdown | `react-markdown` | Renders blog content and admin preview without extra deps |
| Testing | Vitest (not Jest) | Faster, native ESM support, Vite-compatible |

---

## Project Structure

```
portfolio-v4/
├── .env.example              # Environment variable template
├── .gitignore
├── firebase.json             # Firebase CLI config (rules only)
├── firestore.rules           # Firestore security rules
├── next.config.ts            # Next.js config (React Compiler, next-intl, optimizePackageImports)
├── package.json
├── postcss.config.mjs        # Tailwind v4 PostCSS setup
├── tsconfig.json             # TypeScript strict config (path alias @/*)
├── vitest.config.ts          # Test config (jsdom, src/test/**)
│
├── messages/
│   ├── en.json               # English UI translations
│   └── id.json               # Indonesian UI translations
│
├── scripts/
│   └── seed-firestore.ts     # One-time Firestore data migration
│
└── src/
    ├── proxy.ts              # Middleware (next-intl + Firebase auth)
    │
    ├── app/
    │   ├── layout.tsx        # Root layout (thin pass-through)
    │   ├── globals.css       # Tailwind theme, CSS variables, custom utilities
    │   ├── robots.ts         # Dynamic robots.txt
    │   ├── sitemap.ts        # Dynamic sitemap (Firestore blog slugs)
    │   ├── [locale]/
    │   │   ├── layout.tsx    # Locale layout (fonts, providers, persistent UI)
    │   │   ├── page.tsx      # Homepage (SSG + ISR)
    │   │   ├── blog/
    │   │   │   ├── page.tsx  # Blog list (SSG + ISR)
    │   │   │   └── [slug]/
    │   │   │       └── page.tsx  # Blog detail (SSG + ISR + generateStaticParams)
    │   │   ├── projects/
    │   │   │   └── page.tsx  # Projects list (SSG + ISR)
    │   │   └── admin/
    │   │       ├── layout.tsx    # Admin auth guard + sidebar
    │   │       ├── page.tsx      # Dashboard
    │   │       ├── login/page.tsx
    │   │       ├── blogs/page.tsx
    │   │       ├── projects/page.tsx
    │   │       ├── experience/page.tsx
    │   │       └── skills/page.tsx
    │   └── api/admin/
    │       ├── counts/route.ts
    │       ├── blogs/route.ts
    │       ├── projects/route.ts
    │       ├── experience/route.ts
    │       └── skills/route.ts
    │
    ├── actions/
    │   ├── blogs.ts          # CRUD + revalidatePath
    │   ├── projects.ts
    │   ├── experience.ts
    │   └── skills.ts
    │
    ├── components/
    │   ├── admin/            # AdminSidebar, MarkdownEditor
    │   ├── game/             # SkyForceGame (canvas, dynamic import, ssr:false)
    │   ├── gimmicks/         # 10 decorative background components (dynamic, ssr:false)
    │   ├── layout/           # Navbar, Footer
    │   ├── pages/            # BlogListPage, BlogDetailsPage, ProjectListPage
    │   ├── sections/         # Hero, About, Skills, Experience, Projects, Blog, Contact, HomePage
    │   └── ui/               # CodeText, CustomCursor, GameRocket, HireMeBanner, Reveal, ScrollProgress, ScrollToTop
    │
    ├── context/
    │   ├── ThemeProvider.tsx  # Dark/light/code mode (localStorage)
    │   └── AuthContext.tsx    # Firebase Auth state + admin check
    │
    ├── i18n/
    │   ├── routing.ts        # Locales: ['en', 'id'], default: 'en'
    │   ├── navigation.ts     # Link, useRouter, usePathname (locale-aware)
    │   └── request.ts        # Server-side locale + message loading
    │
    ├── lib/
    │   ├── firebase.ts       # Client SDK init (auth export)
    │   ├── firebase-admin.ts # Admin SDK init (adminDb, adminAuth exports)
    │   └── firestore.ts      # 6 query functions (getProjects, getBlogs, etc.)
    │
    ├── types/
    │   └── index.ts          # Locale, Bilingual, Project, Blog, ExperienceItem, SkillGroup
    │
    └── test/
        ├── setup.ts          # Global mocks (localStorage, next/navigation, next-intl)
        ├── test-utils.tsx    # Render wrapper with ThemeProvider
        ├── translations.test.ts
        ├── pages.test.tsx
        └── metadata.test.ts
```

---

## App Router & Routes

### Public Routes

| Route | Rendering | Revalidation | Data Source |
|-------|-----------|-------------|-------------|
| `/[locale]` | SSG + ISR | 3600s + on-demand | Projects, Blogs, Experience, Skills from Firestore |
| `/[locale]/blog` | SSG + ISR | 3600s + on-demand | Blogs from Firestore |
| `/[locale]/blog/[slug]` | SSG + ISR | 3600s + on-demand | Blog by slug (`generateStaticParams` pre-builds all) |
| `/[locale]/projects` | SSG + ISR | 3600s + on-demand | Projects from Firestore |
| `/robots.txt` | Static | — | Generated at build |
| `/sitemap.xml` | Static | — | Generated from Firestore slugs at build |

### Admin Routes (Dynamic SSR)

| Route | Purpose |
|-------|---------|
| `/[locale]/admin/login` | Email/password login |
| `/[locale]/admin` | Dashboard with content counts |
| `/[locale]/admin/projects` | CRUD for projects |
| `/[locale]/admin/blogs` | CRUD for blogs (with MarkdownEditor) |
| `/[locale]/admin/experience` | CRUD for experience |
| `/[locale]/admin/skills` | CRUD for skill groups |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/admin/counts` | GET | Collection document counts |
| `/api/admin/projects` | GET | All projects |
| `/api/admin/blogs` | GET | All blogs |
| `/api/admin/experience` | GET | All experience items |
| `/api/admin/skills` | GET | All skill groups |

---

## Data Layer (Firestore)

### Collections

**projects**
```typescript
interface Project {
  id: string;
  name: Bilingual;       // { en: string, id: string }
  desc: Bilingual;
  tech: string[];
  version: string;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

**blogs**
```typescript
interface Blog {
  id: string;
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  content: string;        // Single-language markdown (Indonesian)
  date: string;           // ISO format (YYYY-MM-DD)
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

**experience**
```typescript
interface ExperienceItem {
  id: string;
  title: Bilingual;
  company: string;
  period: Bilingual;
  points: BilingualArray;  // { en: string[], id: string[] }
  isCurrent: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

**skills**
```typescript
interface SkillGroup {
  id: string;
  title: Bilingual;
  context: Bilingual;
  skills: { name: string; tag: string }[];
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### Query Functions (src/lib/firestore.ts)

All functions return empty arrays when Firebase Admin is not initialized (graceful build without credentials).

| Function | Query | Used By |
|----------|-------|---------|
| `getProjects()` | `orderBy('order', 'asc')` | Homepage, Projects page |
| `getBlogs()` | `orderBy('order', 'asc')` | Homepage, Blog list |
| `getBlogBySlug(slug)` | `where('slug', '==', slug).limit(1)` | Blog detail |
| `getAllBlogSlugs()` | `select('slug')` | generateStaticParams, sitemap |
| `getExperience()` | `orderBy('order', 'asc')` | Homepage |
| `getSkills()` | `orderBy('order', 'asc')` | Homepage |

### Security Rules

- Public read for all 4 collections
- Write restricted to `daniansyahchusyaidin@gmail.com` only
- Default deny for all other paths
- Server actions use firebase-admin (bypasses rules) — rules are defense-in-depth

---

## Internationalization (i18n)

**Locales**: `en` (default), `id`

### Architecture

- **Routing**: `[locale]` segment in App Router, managed by next-intl
- **Middleware**: `src/proxy.ts` handles locale detection and redirect
- **Navigation**: `Link`, `useRouter`, `usePathname` from `@/i18n/navigation` (auto locale-prefix)
- **Server**: `setRequestLocale()` + `getTranslations()` in server components
- **Client**: `useTranslations()` + `useLocale()` in client components
- **Static generation**: `generateStaticParams()` returns both locales

### Translation File Structure (messages/*.json)

| Namespace | Content | Bilingual? |
|-----------|---------|------------|
| `nav` | Navigation labels | Yes |
| `hero` | Hero section | Partial (tagline, CTA kept in English as design language) |
| `about` | About section text + stats | Yes |
| `skills.title` | Section title | Yes |
| `experience.title` | Section title | Yes |
| `projects` | Section labels, CTA, metadata | Partial (HUD strings kept in English) |
| `blog` | Section labels, CTA | Partial (HUD strings kept in English) |
| `contact` | Form headline, labels, placeholders | Yes |
| `footer` | Role title | Same in both |
| `hireBanner` | Banner headline | Partial (badge/CTA kept in English) |
| `game` | Game UI strings | English in both (design language) |
| `seo` | Page titles, descriptions | Yes |
| `dateFormat` | Locale string, month abbreviations | Yes |
| `phrases` | Typewriter animation phrases | Same in both |

### Design Language Convention

HUD-style strings (`_UNDERSCORE_CASE`, technical badges, game UI) stay in English in both locales. Only human-readable content (headlines, descriptions, form labels) is translated to natural Indonesian.

---

## Theme System

### Modes

- **Light** (`:root` CSS variables)
- **Dark** (`.dark` CSS variables)
- **Code Mode** (`.code` class — decorative code syntax overlays via `CodeText` component)

### Implementation

1. **Hydration script** in `<head>` reads localStorage before paint (prevents FOUC)
2. **ThemeProvider** (`src/context/ThemeProvider.tsx`) manages state + localStorage persistence
3. **CSS variables** in `globals.css` (`--bg-color`, `--text-color`, `--primary-color`, etc.)
4. **Tailwind theme** maps CSS variables to utility classes (`bg-background`, `text-text-main`, etc.)

### Color Variables

| Variable | Light | Dark | Tailwind Utility |
|----------|-------|------|-----------------|
| `--primary-color` | #2563eb | #3b82f6 | `text-primary`, `bg-primary` |
| `--bg-color` | #ffffff | #0f1115 | `bg-background` |
| `--surface-color` | #f8fafc | #1a1d23 | `bg-surface` |
| `--surface-hover-color` | #f1f5f9 | #23272f | `bg-surface-hover` |
| `--text-color` | #0f172a | #f8fafc | `text-text-main` |
| `--text-muted-color` | #475569 | #94a3b8 | `text-text-muted` |
| `--border-color` | #e2e8f0 | #2d333b | `border-border` |

The mapping from CSS variables to Tailwind utilities is defined in `globals.css` via the `@theme` block:

```css
@theme {
  --color-primary: var(--primary-color);
  --color-background: var(--bg-color);
  --color-surface: var(--surface-color);
  --color-text-main: var(--text-color);
  --color-text-muted: var(--text-muted-color);
  --color-border: var(--border-color);
}
```

### Code Mode

When enabled, the `CodeText` component wraps text content with syntax-colored decorators. Four syntax types are available:

| Type | Decorator Style | Example Output |
|------|----------------|----------------|
| `html` | Pink `<tag>` wrappers | `<h1>` Content `</h1>` |
| `css` | Yellow `.class {}` wrappers | `.text_content {` Content `}` |
| `js` | Blue `const = ""` wrappers | `const content = "` Content `";` |
| `logic` | Purple `if () {}` wrappers | `if (is_visible) {` Content `}` |

Code mode state is persisted in localStorage (`isCodeMode`) and toggled via the Navbar.

### FOUC Prevention

A blocking `<script>` in `<head>` reads localStorage before the first paint:

```javascript
(function() {
  var theme = localStorage.getItem('theme');
  var isCode = localStorage.getItem('isCodeMode') === 'true';
  if (!theme) {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.classList.add(theme);
  if (isCode) document.documentElement.classList.add('code');
})();
```

This runs before React hydration, preventing any flash of the wrong theme.

---

## Authentication & Admin Panel

### Auth Flow

1. User visits `/admin/login` → enters email/password
2. `AuthContext.login()` checks email against allowed admin (`daniansyahchusyaidin@gmail.com`)
3. Firebase Auth `signInWithEmailAndPassword()` on success
4. `AdminGuard` in admin layout checks `useAuth()` state
5. Middleware (`proxy.ts`) validates auth cookie via `next-firebase-auth-edge` for `/admin` routes

### Admin Panel Design

- English-only (no i18n)
- Fixed dark theme (slate-900 palette)
- Functional/minimal design (no gimmick backgrounds)
- Inline create/edit forms with bilingual fields
- MarkdownEditor with toolbar + split/preview mode using react-markdown

### Server Actions

All CRUD operations use firebase-admin SDK and call `revalidatePath()` on both locale variants after every write:

```typescript
// Example: after updating a blog
revalidatePath('/en/blog');
revalidatePath('/id/blog');
revalidatePath('/en');
revalidatePath('/id');
```

---

## Components

### Section Components (src/components/sections/)

All `'use client'` with motion/react animations. Gimmick backgrounds are dynamically imported with `ssr: false`.

| Component | Data Source | Gimmick Background |
|-----------|-----------|-------------------|
| Hero | `useTranslations('hero')` + phrases | SystemGimmick |
| About | `useTranslations('about')` | NetworkTopologyGimmick |
| Skills | Props: `SkillGroup[]` + locale | ArchitectureSchematicGimmick |
| Experience | Props: `ExperienceItem[]` + locale | TacticalTrajectoryGimmick |
| Projects | Props: `Project[]` + locale | ServiceClusterGimmick |
| Blog | Props: `Blog[]` + locale | LogStreamGimmick |
| Contact | `useTranslations('contact')` | NeuralBridgeGimmick |

### Navbar Hash Scrolling

Hybrid strategy for anchor links (`/#about`, `/#skills`, etc.):
- **On homepage** (`pathname === '/'`): renders native `<a href="#section">` for zero-JS smooth scroll
- **From other pages**: renders next-intl `<Link href="/#section">` for cross-page navigation

### SkyForceGame

- Canvas-based arcade game with Web Audio API
- Dynamic import with `ssr: false` and loading placeholder
- All UI strings bilingual via `useTranslations('game')`
- High score tracking with localStorage
- Custom rocket SVG (`GameRocket` component)

### Gimmick Components (10 total)

Decorative animated backgrounds using motion/react. All dynamically imported with `ssr: false` to reduce initial bundle. These are purely visual — they use `pointer-events-none`, low opacity, and absolute positioning to sit behind section content.

| Gimmick | Used In | Visual Effect |
|---------|---------|---------------|
| SystemGimmick | Hero | Rotating hexagon wireframe, scrolling scanline, matrix rain |
| NetworkTopologyGimmick | About | SVG node graph with animated data packets |
| ArchitectureSchematicGimmick | Skills | CAD grid, parallax blueprint modules, radar scan |
| TacticalTrajectoryGimmick | Experience | 3D perspective grid, timeline signal beam, sonar pings |
| ServiceClusterGimmick | Projects, ProjectListPage | Isometric clusters, neural mesh network, scanning sweeps |
| LogStreamGimmick | Blog, BlogListPage, BlogDetailsPage | Hex terminal blocks, vertical data rails, parsing brackets |
| NeuralBridgeGimmick | Contact | Converging signal rays, data transmission bubbles, star-map grid |
| QuantumSyncGimmick | Navbar | Subtle gradient sweep, vertical accent lines |
| MobileMenuGimmick | Navbar (mobile) | Grid pattern, rotating orbital rings, section markers |
| KernelSubstrateGimmick | Footer | Animated gradient lines |

### UI Components (src/components/ui/)

| Component | Purpose | Key Behavior |
|-----------|---------|-------------|
| `Reveal` | Scroll-triggered entrance animation | `whileInView` with blur, opacity, y-translate, scale |
| `CodeText` | Code mode decorator | Wraps text in syntax-colored brackets when code mode active |
| `CustomCursor` | Custom mouse cursor | Fixed-position dot + follower circle, hidden on mobile |
| `ScrollProgress` | Top progress bar | Gradient bar scaled by `useScroll` progress |
| `ScrollToTop` | Rocket scroll-to-top button | Appears after 300px scroll, launch animation, game integration |
| `GameRocket` | SVG rocket | Color-coded by code mode (cyan vs pink), animated thruster |
| `HireMeBanner` | CTA banner | Used on blog/project list pages, hybrid scroll strategy |

### Layout Components (src/components/layout/)

**Navbar** — Fixed top navigation with three sections:
1. Brand logo (left)
2. Nav links with section codes `[01]`-`[06]` (center, desktop only)
3. Controls: Code mode toggle, theme toggle, language toggle (right)

Mobile: hamburger → fullscreen overlay with `MobileMenuGimmick` background.

**Footer** — Compact footer with owner name, role, and `KernelSubstrateGimmick` background.

### Page Components (src/components/pages/)

Client components for sub-routes. Each receives Firestore data + locale as props:

| Component | Route | Features |
|-----------|-------|----------|
| `BlogListPage` | `/blog` | Grid of all blogs, back-to-root link, HireMeBanner |
| `BlogDetailsPage` | `/blog/[slug]` | Markdown rendering, metadata badges, HireMeBanner |
| `ProjectListPage` | `/projects` | Grid of all projects, back-to-root link, HireMeBanner |

---

## SEO

### Metadata

- **Root**: `metadataBase`, title template (`%s | Daniansyah Chusyaidin`), OpenGraph, Twitter card
- **Per-page**: `generateMetadata()` with locale-specific titles, descriptions, canonical URLs, hreflang alternates
- **Blog detail**: Dynamic metadata from Firestore `Blog.title[locale]` and `Blog.excerpt[locale]`

### Sitemap (src/app/sitemap.ts)

Dynamically generated at build time:
- Static pages: `/`, `/blog`, `/projects` (both locales)
- Blog detail pages: all slugs from Firestore (both locales)
- Each entry includes hreflang alternates + x-default

### Robots (src/app/robots.ts)

```
User-agent: *
Allow: /
Sitemap: https://daniansyah.dev/sitemap.xml
```

---

## Performance

| Optimization | Implementation |
|-------------|----------------|
| SSG + ISR | `revalidate = 3600` on all public pages |
| On-demand revalidation | `revalidatePath()` after admin CRUD |
| Self-hosted fonts | `next/font` (zero CLS, zero external requests) |
| Dynamic imports | SkyForceGame + 10 gimmicks with `ssr: false` |
| Package tree-shaking | `optimizePackageImports: ['lucide-react', 'motion/react']` |
| Parallel data fetching | `Promise.all()` for 4 collections on homepage |
| Selective queries | `select('slug')` for slug-only fetches |
| React Compiler | Automatic memoization |
| Turbopack | Default bundler in Next.js 16 |

---

## Testing

**Framework**: Vitest + @testing-library/react + jsdom

### Test Files

| File | Tests | Purpose |
|------|-------|---------|
| `translations.test.ts` | Key parity, empty value check, content validation | Validates en.json and id.json |
| `pages.test.tsx` | Section component rendering with mock data | Skills, Experience, Projects, Blog, About, Contact |
| `metadata.test.ts` | generateMetadata output validation | Homepage, blog list, projects (canonical, hreflang, OG) |

### Global Mocks (setup.ts)

- `localStorage`, `matchMedia`, `scrollTo`
- `ResizeObserver`, `IntersectionObserver` (class-based)
- `next/navigation` (useRouter, usePathname, useParams)
- `next-intl` (useTranslations, useLocale, useMessages)
- `@/i18n/navigation` (Link, useRouter, usePathname)

### Running Tests

```bash
npm run test         # Watch mode
npm run test:run     # Single run
npm run test:coverage # With coverage report
```

---

## Environment Variables

### Required for Production

```bash
# Firebase Client (exposed to browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Auth Cookie Secrets
COOKIE_SECRET_CURRENT=
COOKIE_SECRET_PREVIOUS=
```

### Build Behavior Without Env Vars

- Firebase Admin returns null → Firestore functions return empty arrays
- Firebase Client uses placeholder API key → prevents build crash
- Auth middleware skips checks → admin routes accessible without auth
- Build succeeds with empty data (ISR fetches real data at runtime)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 3000, Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Type-check (`tsc --noEmit`) |
| `npm run test` | Tests in watch mode |
| `npm run test:run` | Tests single run |
| `npm run test:coverage` | Tests with coverage |
| `npx tsx scripts/seed-firestore.ts` | Seed Firestore with initial data |

### Seed Script

Seeds 4 Firestore collections from actual CV data:
- 6 projects (from real work at AMX Group, Andromedia, Brilian, etc.)
- 1 blog post (MQTT technical article in Indonesian)
- 8 experience entries (all positions from CV)
- 6 skill groups (merged from CV + extended categories)

Requires `.env.local` with Firebase Admin credentials. Idempotent (uses fixed document IDs).

---

## Deployment

### Vercel Configuration

- **Framework**: Next.js (auto-detected)
- **Build command**: `next build`
- **Node.js**: 20.x LTS
- **ISR**: Handled by Vercel edge network
- **Domain**: daniansyah.dev (with auto SSL)

### Deploy Steps

1. Connect GitHub repository to Vercel
2. Set all environment variables in Vercel dashboard
3. Deploy — Vercel auto-detects Next.js and builds
4. Configure custom domain DNS as directed by Vercel

### Firebase Setup

1. Enable Firestore (production mode) in Firebase Console
2. Enable Firebase Authentication (Email/Password provider)
3. Create admin user with `daniansyahchusyaidin@gmail.com`
4. Deploy security rules: `firebase deploy --only firestore:rules`
5. Run seed script: `npx tsx scripts/seed-firestore.ts`

---

## Visual Design Language

The portfolio uses a "tactical systems engineering / HUD" aesthetic throughout. This is not a conventional portfolio design — it intentionally resembles a military or aerospace command interface.

### Design Characteristics

- **Monospace typography** for labels, badges, and metadata (`font-mono`)
- **Uppercase tracking** with wide letter-spacing (`tracking-[0.3em]`, `uppercase`)
- **Cyan/indigo color palette** as accent colors (`#06b6d4` cyan-500, `#6366f1` indigo-500)
- **Corner bracket accents** on cards and interactive elements
- **Animated scanlines and sweep effects** via CSS keyframes and motion/react
- **Grid/dot patterns** as subtle backgrounds (`.grid-bg` utility)
- **Technical metadata overlays** (e.g., "PING_STABLE", "BUILD_VERSION_8.0.4")
- **Code-style numbering** for nav items (`[01]`, `[02]`, etc.)

### Custom CSS Utilities

Defined in `globals.css`:

| Utility | Purpose |
|---------|---------|
| `.grid-bg` | Radial dot grid background pattern |
| `.container-custom` | `max-w-[1280px]` with responsive horizontal padding |
| `.section-padding` | `py-20 md:py-32` for consistent section spacing |
| `#cursor` / `#cursor-follower` | Custom cursor styling (hidden on mobile) |
| `.typewriter::after` | Blinking cursor for Hero typewriter animation |
| `.animate-spin-slow` | 8-second rotation for decorative elements |
| `.animate-sweep` | Horizontal sweep animation for hover effects |

### Scrollbar

Custom WebKit scrollbar with cyan-to-indigo gradient thumb. Firefox fallback via `scrollbar-width: thin`.

---

## Middleware

The proxy middleware (`src/proxy.ts`) handles two concerns in sequence:

### 1. Admin Authentication (for `/admin` routes except `/admin/login`)

Uses `next-firebase-auth-edge` to validate Firebase auth cookies:
- Valid token → passes through to i18n middleware
- Invalid/missing token → redirects to `/en/admin/login`
- Missing env vars → skips auth entirely (development without credentials)

Cookie configuration:
- Name: `AuthToken`
- Max age: 12 days
- HttpOnly, SameSite: Lax, Secure in production
- Signed with `COOKIE_SECRET_CURRENT` and `COOKIE_SECRET_PREVIOUS` (rotation support)

### 2. Internationalization (all routes)

Uses `next-intl/middleware` with the routing config:
- Detects locale from URL path (`/en/...`, `/id/...`)
- Redirects root `/` to default locale `/en`
- Matcher excludes: `api`, `_next`, `_vercel`, static files (`.*\\..*`)

---

## Provider Hierarchy

### Public Pages

```
RootLayout (server, thin pass-through)
  └── LocaleLayout (server)
        ├── ThemeProvider (client — dark/light/code mode)
        │   └── NextIntlClientProvider (client — translations)
        │       ├── CustomCursor
        │       ├── ScrollToTop
        │       ├── ScrollProgress
        │       ├── Navbar
        │       ├── <main>{page content}</main>
        │       └── Footer
```

### Admin Pages

```
LocaleLayout (same as above)
  └── AdminLayout (client)
        └── AuthProvider (client — Firebase Auth state)
              └── AdminGuard (client — auth check + redirect)
                    ├── AdminSidebar
                    └── <main>{admin page}</main>
```

The admin layout is nested inside the locale layout, so the public Navbar and Footer still render. The `AdminGuard` component handles the auth check and renders the admin-specific sidebar layout.

---

## Known Conventions & Gotchas

### Next.js 16 Specifics

- Middleware file is `proxy.ts` (not `middleware.ts`) — Next.js 16 convention. The export is `default function proxy()`, not `middleware()`.
- `params` in pages/layouts is a `Promise` that must be awaited: `const { locale } = await params;`
- Turbopack is the default bundler (no `--turbopack` flag needed).
- `reactCompiler: true` is a top-level `next.config.ts` option (not inside `experimental`).

### Build Without Firebase Credentials

The project builds successfully without `.env.local`:
- `firebase-admin.ts` checks for credentials before initializing; exports null if missing
- All Firestore query functions check `if (!adminDb) return []`
- `firebase.ts` (client) uses `'placeholder'` as fallback API key to prevent initialization crash
- Auth middleware skips when env vars are absent

This allows CI/CD builds and development without Firebase access.

### Bilingual Data Strategy

| Data Type | Source | Bilingual? |
|-----------|--------|------------|
| UI labels (nav, buttons, form labels) | Translation JSON (`messages/*.json`) | Yes |
| Section titles, headlines, descriptions | Translation JSON | Yes |
| HUD/badge strings (`_UNDERSCORE_CASE`) | Translation JSON (same in both locales) | No (English only) |
| Project names, descriptions | Firestore (`Bilingual` type) | Yes |
| Blog titles, excerpts | Firestore (`Bilingual` type) | Yes |
| Blog content (markdown body) | Firestore (`string`) | No (Indonesian only) |
| Experience titles, periods, points | Firestore (`Bilingual` / `BilingualArray`) | Yes |
| Skill group titles, context | Firestore (`Bilingual` type) | Yes |
| Skill names, tags | Firestore (`string`) | No (English only — tech terms) |

### Section Anchor IDs

Used by Navbar hash links for same-page scrolling:

| Section | Anchor ID |
|---------|-----------|
| About | `#about` |
| Skills | `#skills` |
| Experience | `#work` |
| Projects | `#projects` |
| Blog | `#blog` |
| Contact | `#contact` |
| SkyForceGame | `#mini-game` |

### File Naming Conventions

- App Router pages: `page.tsx` (server by default)
- Client components: `'use client'` directive at top
- Server actions: `'use server'` directive at top
- Gimmick components: `*Gimmick.tsx` suffix
- Types: `src/types/index.ts` (centralized)
- Tests: `src/test/*.test.{ts,tsx}` pattern
