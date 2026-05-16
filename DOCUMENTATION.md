# Portfolio v4 - Full Codebase Documentation

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Build & Development](#build--development)
- [Environment Variables](#environment-variables)
- [Architecture](#architecture)
- [Routing](#routing)
- [Internationalization (i18n)](#internationalization-i18n)
- [Theme System](#theme-system)
- [Pages](#pages)
- [Components](#components)
  - [Layout Components](#layout-components)
  - [Section Components](#section-components)
  - [Utility Components](#utility-components)
  - [Interactive Components](#interactive-components)
  - [Gimmick (Decorative) Components](#gimmick-decorative-components)
- [Data Layer](#data-layer)
- [Styling](#styling)
- [SEO](#seo)
- [Testing](#testing)
- [Documentation Status](#documentation-status)

---

## Overview

**Name**: Portfolio v4 (Daniansyah Chusyaidin)
**Type**: Client-side React Single Page Application (SPA) with no backend
**Purpose**: High-fidelity, production-grade portfolio for a Fullstack & Mobile Engineer
**Domain**: https://daniansyah.dev
**AI Studio App**: https://ai.studio/apps/8b400248-5ce1-4394-8731-796a8838a9fc
**License**: Apache-2.0 (noted in App.tsx header)

The project was scaffolded from Google AI Studio and uses the Gemini API key for AI capabilities. It is a visually rich portfolio with a "systems engineering / tactical HUD" aesthetic featuring animated SVG backgrounds, a custom cursor, scroll-based parallax, and an embedded canvas-based game.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | 19.0.0 |
| Language | TypeScript | ~5.8.2 |
| Build Tool | Vite | ^6.2.0 |
| CSS Framework | Tailwind CSS | ^4.1.14 (v4 with `@tailwindcss/vite` plugin) |
| Animation | motion/react (Framer Motion successor) | ^12.23.24 |
| Routing | react-router-dom | ^7.14.2 |
| Icons | lucide-react | ^0.546.0 |
| SEO | react-helmet-async | ^3.0.0 |
| Markdown | react-markdown | ^10.1.0 |
| AI | @google/genai | ^1.29.0 |
| Testing | Vitest + @testing-library/react + jsdom | vitest ^4.1.5 |
| Server (unused in prod) | express | ^4.21.2 |
| Environment | dotenv | ^17.2.3 |

---

## Project Structure

```
portfolio-v4/
+-- index.html                  # Vite entry HTML (title: "My Google AI Studio App")
+-- package.json                # Dependencies and scripts
+-- tsconfig.json               # TypeScript config (ES2022, strict, bundler resolution)
+-- vite.config.ts              # Vite config with Tailwind + React plugins, path aliases
+-- vitest.config.ts            # Vitest config (jsdom, globals, v8 coverage)
+-- metadata.json               # AI Studio app metadata
+-- .env.example                # GEMINI_API_KEY, APP_URL
+-- .gitignore                  # node_modules, dist, .env*, coverage
+-- README.md                   # AI Studio setup instructions
+-- public/
|   +-- robots.txt              # Allows all bots, references sitemap
|   +-- sitemap.xml             # 26 URLs with hreflang alternates for EN/ID
+-- docs/
|   +-- architecture/
|   |   +-- 20260425-existing-patterns.md   # ADR: current architecture baseline
|   |   +-- 20260425-i18n-architecture.md   # ADR: i18n design decisions
|   +-- specs/
|       +-- i18n.md             # Full spec with 21 ACs (only complete spec)
|       +-- (14 other .md)      # All stubs - "To be documented"
+-- src/
    +-- main.tsx                # React entry point (StrictMode + createRoot)
    +-- App.tsx                 # Root component with routing
    +-- constants.ts            # Static data: PROJECTS, BLOGS, PHRASES
    +-- index.css               # Global styles, Tailwind theme, CSS variables
    +-- context/
    |   +-- ThemeContext.tsx     # Theme provider (light/dark + code mode) + CodeText
    +-- i18n/
    |   +-- index.ts            # Barrel export for i18n modules
    |   +-- types.ts            # Language, LanguageContextType types
    |   +-- LanguageContext.tsx  # Language provider + useLanguage hook + t()/tArray()
    |   +-- LanguageLayout.tsx  # Route wrapper validating language param
    |   +-- LanguageRedirect.tsx# Root redirect based on detection priority
    |   +-- useLocalizedPath.tsx# Hook to prefix paths with current language
    |   +-- translations/
    |       +-- index.ts        # Barrel export for en/id
    |       +-- en.ts           # English translations (complete)
    |       +-- id.ts           # Indonesian translations (complete)
    |       +-- translations.test.ts  # Translation parity and completeness tests
    +-- pages/
    |   +-- HomePage.tsx        # Composition root: Hero, About, Skills, Game, Experience, Projects, Blog, Contact
    |   +-- BlogListPage.tsx    # Blog grid with i18n, responsive layout
    |   +-- BlogDetailsPage.tsx # Blog detail with react-markdown rendering
    |   +-- ProjectListPage.tsx # Project grid with 3D hover effects
    +-- components/
    |   +-- MainLayout.tsx      # Layout shell: Navbar + Outlet + Footer + CustomCursor + ScrollToTop
    |   +-- Navbar.tsx          # Fixed navigation with mobile hamburger, theme/language/code toggles
    |   +-- Hero.tsx            # Hero section with typewriter effect
    |   +-- About.tsx           # About section with stats grid
    |   +-- Skills.tsx          # Skills grid (6 categories, 3 skills each)
    |   +-- Experience.tsx      # Timeline of 3 professional roles
    |   +-- Projects.tsx        # Featured project cards (subset)
    |   +-- Blog.tsx            # Featured blog post cards (subset)
    |   +-- Contact.tsx         # Contact form + social links + system diagnostics
    |   +-- Footer.tsx          # Copyright, version (V4.4.2-LDP), telemetry
    |   +-- HireMeBanner.tsx    # CTA banner with animated styling
    |   +-- SEO.tsx             # Helmet-based meta tags, hreflang, OpenGraph
    |   +-- Reveal.tsx          # Scroll-triggered fade/slide animation wrapper
    |   +-- CustomCursor.tsx    # Dual cursor (dot + follower ring)
    |   +-- ScrollProgress.tsx  # Top progress bar (cyan-to-indigo gradient)
    |   +-- ScrollToAnchor.tsx  # Hash-based smooth scroll handler
    |   +-- ScrollToTop.tsx     # Floating rocket button with launch animation
    |   +-- GameRocket.tsx      # SVG rocket graphic (reusable)
    |   +-- SkyForceGame.tsx    # Canvas-based bullet-hell game
    |   +-- SystemGimmick.tsx           # Hexagonal wireframe with matrix rain
    |   +-- ArchitectureSchematicGimmick.tsx  # CAD blueprint with radar scan
    |   +-- KernelSubstrateGimmick.tsx  # Ultra-subtle gradient slabs
    |   +-- LogStreamGimmick.tsx        # Scrolling hex data with parser overlays
    |   +-- MobileMenuGimmick.tsx       # Mobile menu background effect
    |   +-- NetworkTopologyGimmick.tsx  # Network graph with animated packets
    |   +-- NeuralBridgeGimmick.tsx     # Neural constellation with signal rays
    |   +-- QuantumSyncGimmick.tsx      # Minimal scroll-responsive accent
    |   +-- ServiceClusterGimmick.tsx   # Mesh network with isometric hexagons
    |   +-- TacticalTrajectoryGimmick.tsx # 3D perspective grid with tactical HUD
    +-- test/
        +-- setup.ts            # Global mocks (localStorage, matchMedia, IntersectionObserver)
        +-- test-utils.tsx      # Custom render with BrowserRouter + ThemeProvider wrappers
```

---

## Build & Development

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite --port=3000 --host=0.0.0.0` | Start dev server on port 3000 |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview production build |
| `clean` | `rm -rf dist` | Remove build artifacts |
| `lint` | `tsc --noEmit` | TypeScript type checking only |
| `test` | `vitest` | Run tests in watch mode |
| `test:ui` | `vitest --ui` | Run tests with Vitest UI |
| `test:run` | `vitest run` | Single test run |
| `test:coverage` | `vitest run --coverage` | Coverage report (v8 provider) |

**Path Alias**: `@/*` maps to project root (`./`) via both `tsconfig.json` and `vite.config.ts`.

**HMR**: Can be disabled via `DISABLE_HMR=true` environment variable (for AI Studio agent editing).

---

## Environment Variables

| Variable | Purpose | Source |
|----------|---------|--------|
| `GEMINI_API_KEY` | Google Gemini AI API access | AI Studio secrets panel / `.env.local` |
| `APP_URL` | Hosted app URL for self-referential links | AI Studio runtime injection |
| `DISABLE_HMR` | Disables Vite HMR when set to `"true"` | Environment |

The `GEMINI_API_KEY` is injected into the client bundle via `vite.config.ts` using `define: { 'process.env.GEMINI_API_KEY': ... }`.

---

## Architecture

### Provider Hierarchy

```
<StrictMode>
  <HelmetProvider>
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToAnchor />
        <ScrollProgress />
        <Routes>
          <LanguageRedirect />     (at /)
          <LanguageLayout>         (at /:lang)
            <LanguageProvider>
              <SEO />
              <MainLayout>
                <Navbar />
                <CustomCursor />
                <ScrollToTop />
                <Outlet />         (page content)
                <Footer />
              </MainLayout>
            </LanguageProvider>
          </LanguageLayout>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </HelmetProvider>
</StrictMode>
```

### Key Architectural Decisions (from ADRs)

1. **Client-side SPA only** - No SSR, no backend server in production
2. **Flat component folder** - All components in `src/components/` (no subdirectories)
3. **PascalCase file naming** - React convention, noted as exception from potential snake_case standards
4. **React Context only** - No Redux/Zustand; ThemeContext and LanguageContext suffice
5. **Static data** - Content lives in `constants.ts` and translation files, not fetched from API
6. **Custom i18n** - No external i18n library; custom solution with TypeScript translation files
7. **Path-based i18n** - URL prefix (`/en/`, `/id/`) for SEO compliance over query params or subdomains

---

## Routing

All routes are language-prefixed. The router is defined in `App.tsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `LanguageRedirect` | Detects language, redirects to `/:lang/` |
| `/:lang` | `LanguageLayout > MainLayout` | Language wrapper |
| `/:lang/` (index) | `HomePage` | Main landing page |
| `/:lang/blog` | `BlogListPage` | All blog posts |
| `/:lang/blog/:slug` | `BlogDetailsPage` | Individual blog post |
| `/:lang/projects` | `ProjectListPage` | All projects |
| `*` | `Navigate to /en/` | Fallback for invalid paths |

**Hash anchors** are used for homepage sections: `#about`, `#stack`, `#experience`, `#projects`, `#blog`, `#contact`.

**Valid languages**: `en` and `id` only. Any other `:lang` value redirects to `/en/`.

---

## Internationalization (i18n)

### Language Detection Priority

1. `localStorage.getItem('portfolio_language')` - User's saved preference
2. `navigator.language` - Browser language (checks `startsWith('id')`)
3. `'en'` - Default fallback

### Translation System

- **Files**: `src/i18n/translations/en.ts` and `id.ts`
- **Format**: Deeply nested TypeScript objects with `as const` assertion
- **Access**: `t('key.nested.path')` returns string, `tArray('key')` returns string array
- **Fallback**: Returns the key string itself if translation is missing

### What Gets Translated

- All navigation labels
- All section headings, descriptions, and body text
- Hero tagline, headline, CTAs
- About section stats and descriptions
- Skill group titles and context descriptions
- Experience job titles, periods, and bullet points (company names stay as-is)
- Project names and descriptions
- Blog titles and excerpts (blog body content stays in English)
- Contact form labels and placeholders
- Footer role title
- HireMeBanner badge and CTA
- SkyForce Game UI (20+ labels)
- Typewriter phrases (4 items)
- Date format locale and month abbreviations

### What Stays in English

- Technical status badges (PRODUCTION, STABLE, DEPLOYED, etc.)
- Tech stack tags (Node.js, React, PostgreSQL, etc.)
- Personal name: "Daniansyah Chusyaidin"
- Email address
- Decorative code/system labels (NODE_STATUS, DEPLOYMENT_PHASE, etc.)
- Blog markdown body content
- Version numbers

### Key i18n Components

| Component | Role |
|-----------|------|
| `LanguageRedirect` | Root `/` redirect based on detection priority |
| `LanguageLayout` | Validates `:lang` param, wraps children in `LanguageProvider` |
| `LanguageContext` / `useLanguage()` | Provides `language`, `setLanguage()`, `t()`, `tArray()` |
| `useLocalizedPath()` | Returns function to prefix any path with current language |

---

## Theme System

Defined in `src/context/ThemeContext.tsx`.

### Modes

| Mode | CSS Class | Description |
|------|-----------|-------------|
| Light | `.light` on `<html>` | Light color scheme |
| Dark | `.dark` on `<html>` | Dark color scheme (default if system prefers dark) |
| Code Mode | `.code` on `<html>` (additive) | Overlays syntax-highlighting decorations on text |

### Theme Detection

1. `localStorage.getItem('theme')` - Saved preference
2. `window.matchMedia('(prefers-color-scheme: dark)')` - System preference
3. `'dark'` - SSR/default fallback

### CSS Variables (defined in `index.css`)

| Variable | Light | Dark |
|----------|-------|------|
| `--primary-color` | `#2563eb` | `#3b82f6` |
| `--bg-color` | `#ffffff` | `#0f1115` |
| `--surface-color` | `#f8fafc` | `#1a1d23` |
| `--surface-hover-color` | `#f1f5f9` | `#23272f` |
| `--text-color` | `#0f172a` | `#f8fafc` |
| `--text-muted-color` | `#475569` | `#94a3b8` |
| `--border-color` | `#e2e8f0` | `#2d333b` |

These CSS variables are mapped to Tailwind theme tokens via `@theme` block:
- `--color-primary`, `--color-background`, `--color-surface`, `--color-surface-hover`, `--color-text-main`, `--color-text-muted`, `--color-border`

### CodeText Component

Exported from `ThemeContext.tsx`. When `isCodeMode` is true, wraps text in syntax-highlighted decorations:

| Type | Visual |
|------|--------|
| `html` | `<tag>content</tag>` in pink |
| `css` | `.text_content { content }` in yellow |
| `js` | `const label = "content";` in blue |
| `logic` | `if (is_visible) { content }` in purple |

---

## Pages

### HomePage (`src/pages/HomePage.tsx`)

Pure composition component rendering sections in order:
1. `<Hero />` - Landing hero with typewriter
2. `<About />` - Developer background
3. `<Skills />` - Technical skills grid
4. `<SkyForceGame />` - Interactive canvas game
5. `<Experience />` - Work timeline
6. `<Projects />` - Featured projects (subset of 6)
7. `<Blog />` - Featured blog posts (subset of 6)
8. `<Contact />` - Contact form and socials

### BlogListPage (`src/pages/BlogListPage.tsx`)

- Renders all 6 blog entries from `BLOGS` constant
- Uses translated titles/excerpts via `t('blogEntries.<slug>.title')`
- Grid: 1/2/3 columns responsive
- Each card: date, commit hash, index number, title, excerpt, read link
- Includes `LogStreamGimmick` background and `HireMeBanner` at bottom

### BlogDetailsPage (`src/pages/BlogDetailsPage.tsx`)

- Takes `:slug` URL param, finds matching blog from `BLOGS` constant
- Renders blog body content via `react-markdown` (content is always English)
- Shows translated title, date, author ("DANIANSYAH_CORE"), read time (5 min)
- 404 handling if slug not found
- Includes `HireMeBanner` at bottom

### ProjectListPage (`src/pages/ProjectListPage.tsx`)

- Renders all 6 projects from `tArray('projectItems')`
- Grid: 1/2/3 columns responsive
- Cards have 3D perspective hover transforms (rotateX, rotateY)
- Corner accents, pulsing indicators, scanline sweep on hover
- Includes `ServiceClusterGimmick` background and `HireMeBanner` at bottom

---

## Components

### Layout Components

#### MainLayout (`src/components/MainLayout.tsx`)
- Wraps page content with persistent `<Navbar />`, `<Footer />`, `<CustomCursor />`, `<ScrollToTop />`
- Uses React Router `<Outlet />` for child pages
- Sets `id="top"` on root for scroll-to-top targeting
- Applies selection styling (blue background)

#### Navbar (`src/components/Navbar.tsx`)
- Fixed position, transforms on scroll (smaller height, blur backdrop)
- Desktop: Logo "DC" | 6 nav links (hash anchors) | Code Mode toggle | Theme toggle | Language toggle (EN/ID)
- Mobile: Hamburger menu with clip-path circle animation, full overlay with large text links
- Nav links: About, Stack, Experience, Projects, Blog, Contact
- Includes `QuantumSyncGimmick` (desktop) and `MobileMenuGimmick` (mobile overlay)

### Section Components

#### Hero (`src/components/Hero.tsx`)
- Full viewport height, grid background
- Animated tagline badge with icon
- Large headline wrapped in `CodeText`
- **Typewriter effect**: Cycles through `phrases` array (typing 100ms, deleting 50ms, pause 2000ms between phrases)
- Two CTAs: Game button (scrolls to game section), Contact button
- System status block (bottom-left, desktop only): NODE_STATUS, ENV, BUILD v4.4.2-LDP
- Bouncing scroll arrow indicator
- Background: `SystemGimmick`

#### About (`src/components/About.tsx`)
- Two-column layout (image/logo left, content right)
- Left: "DC" monogram in bordered square (264x264 desktop, 320x320 large) with decorative internal lines and offset border
- Right: "Structural Engineer" heading with description
- Stats grid (3 items): E2E lifecycle, 0% fluff tolerance, TDD methodology
- Background: `NetworkTopologyGimmick`

#### Skills (`src/components/Skills.tsx`)
- 6 skill groups in grid layout:
  1. **Core Engineering**: TypeScript, Go, Node.js
  2. **Client & Interface**: React/Next, React Native, Tailwind
  3. **Persistence & Data**: PostgreSQL, Prisma ORM, Redis
  4. **Communication**: REST/gRPC, RabbitMQ, MQTT
  5. **DevOps & Infra**: Docker, CI/CD, AWS/GCP
  6. **AI & Design**: TensorFlow, Figma, Prompt Eng.
- Each skill card has hover effects with corner accents
- Tags showing skill type (STRICT, RUNTIME, MOBILE CORE, etc.)
- Connector lines on left side
- Background: `ArchitectureSchematicGimmick`

#### Experience (`src/components/Experience.tsx`)
- Timeline layout with left border and circular markers
- 3 roles (from translations):
  1. Senior Systems Engineer - PT. Technology Solutions Indonesia (2022-Present)
  2. Fullstack Developer - Freelance Collective (2021-2022)
  3. Mobile Core Specialist - PT. Digital Nusantara Karya (2020-2021)
- Each role: period, title, company, 3 bullet points
- Active role marker is cyan, past roles are gray
- Deployment phase labels
- Background: `TacticalTrajectoryGimmick`

#### Projects (`src/components/Projects.tsx`)
- Header with "View All Projects" CTA link
- Displays subset of projects from translations
- Cards with production badge, pulsing indicator, name, description
- 3D perspective hover effects (rotateX/Y)
- Corner accents, grid pattern background, scanline sweep on hover
- Background: `ServiceClusterGimmick`

#### Blog (`src/components/Blog.tsx`)
- Header with "View All Blog Posts" CTA link
- Displays subset of blog entries from `BLOGS` constant + translations
- Cards with date, excerpt, title, random commit hash
- Left border accent animates on hover
- Sweep animation on hover
- Background: `LogStreamGimmick`

#### Contact (`src/components/Contact.tsx`)
- Headline: "Let's engineer solutions together"
- Form with header rail showing email endpoint and copy button
- Fields: Request_Title (input) and Inquiry_Payload (textarea)
- Send button opens `mailto:` link
- Desktop: Side panel with 5 animated system diagnostic bars
- Social links grid (4 columns): GitHub, LinkedIn, Instagram, WhatsApp
- Response time and auth status footer rail
- Background: `NeuralBridgeGimmick`

#### Footer (`src/components/Footer.tsx`)
- Logo + name "DANIANSYAH CHUSYAIDIN" + role title
- Copyright with year + version V4.4.2-LDP
- Telemetry: PING_STABLE, UPTIME_99.9
- Background: `KernelSubstrateGimmick`

#### HireMeBanner (`src/components/HireMeBanner.tsx`)
- Animated gradient border
- CRT scanline effect overlay
- Pulsing badge indicator
- Headline with specialty tags (Distributed_Eng, Security_First, High_Performance)
- Primary CTA button with mail icon
- Technical metadata (Latency, Uptime)
- Used on BlogListPage, BlogDetailsPage, ProjectListPage

### Utility Components

#### Reveal (`src/components/Reveal.tsx`)
- Scroll-triggered animation wrapper used extensively throughout the site
- **Props**: `children`, `delay?`, `width?` ("fit-content" | "100%"), `className?`
- **Animation**: opacity 0->1, y 30->0, blur 5px->0, scale 0.98->1
- Duration 0.8s, triggers once on viewport entry (margin -50px)

#### CustomCursor (`src/components/CustomCursor.tsx`)
- Two elements: main cursor dot (8px) + follower ring (30px)
- Main cursor follows mouse exactly, follower has 500ms lag
- Hidden on mobile/tablet
- Styled via CSS `#cursor` and `#cursor-follower` in `index.css`

#### ScrollProgress (`src/components/ScrollProgress.tsx`)
- Fixed top bar (2px height), z-index 100
- Gradient: cyan to indigo
- Spring-animated scaleX based on scroll position
- Glow shadow effect

#### ScrollToAnchor (`src/components/ScrollToAnchor.tsx`)
- Handles smooth scrolling to hash anchors on navigation
- Scrolls to top on page changes without hash
- 100ms delay for DOM readiness
- Returns null (no visual output)

#### ScrollToTop (`src/components/ScrollToTop.tsx`)
- Fixed bottom-right floating button (z-index 100)
- Appears when scrolled >300px
- Animated rocket icon with launch animation (flies up with flame trail)
- Smoke particles during launch
- Listens to custom `game-active` event for game integration
- Corner bracket decorations
- Hover text: "READY_FOR_LIFT" / "ENG_IGNITION"

#### SEO (`src/components/SEO.tsx`)
- Uses `react-helmet-async` for dynamic `<head>` management
- Sets: HTML lang, canonical URL, hreflang alternates (en, id, x-default)
- OpenGraph meta tags (title, description, url, locale)
- Twitter card meta tags
- Default titles: "Daniansyah Chusyaidin | Fullstack & Mobile Engineer" (EN) / "...Insinyur Fullstack & Mobile" (ID)
- Domain: `https://daniansyah.dev`

### Interactive Components

#### SkyForceGame (`src/components/SkyForceGame.tsx`)
- Canvas-based 2D bullet-hell style game
- **Controls**: Pointer/touch to move rocket; auto-fires bullets
- **Enemy types**: Meteors, rockets (5 variants), shards
- **Difficulty**: Scales with frame count and score ratio
- **Wave system**: Sine wave pattern for spawn density bursts
- **Scoring**: localStorage-persisted high scores with player name input
- **Effects**: Particle explosions, smoke trails, screen shake
- **Audio**: Web Audio API for shoot and explosion sounds
- **Viewport**: Intersection Observer for auto-play when visible
- **Code Mode**: Shows debug info (bounding boxes, scanlines, stats)
- **Share**: navigator.share API integration
- **Responsive**: Canvas resizes to container

#### GameRocket (`src/components/GameRocket.tsx`)
- Reusable SVG rocket graphic
- **Props**: `className?`, `isLaunching?` (expands thruster flame), `isCodeMode?` (pink vs cyan colors)
- Used by both `ScrollToTop` and `SkyForceGame`

### Gimmick (Decorative) Components

All gimmick components are animated SVG/div backgrounds placed behind section content. They share common patterns:
- Low opacity (5-45%) to avoid overwhelming content
- Consistent color palette: cyan (`#06b6d4`) and indigo (`#6366f1`) gradients
- Framer Motion animations (most infinite loops)
- Many use `useScroll` and `useTransform` for scroll-linked parallax
- Monospace technical labels for aesthetic

| Component | Used In | Visual Effect |
|-----------|---------|---------------|
| `SystemGimmick` | Hero | Rotating hexagonal wireframe, matrix rain, scanning beam |
| `ArchitectureSchematicGimmick` | Skills | CAD blueprint grid, floating modules, radar scan, PCB tracers |
| `KernelSubstrateGimmick` | Footer | Ultra-subtle gradient slabs, scanning beam |
| `LogStreamGimmick` | Blog, BlogListPage | Scrolling hex data, parser brackets, pulsing rings |
| `MobileMenuGimmick` | Navbar (mobile) | Scanning pulse, fine grid, rotating circle |
| `NetworkTopologyGimmick` | About | 7-node network graph, animated data packets |
| `NeuralBridgeGimmick` | Contact | Constellation nodes, signal rays, rising bubbles |
| `QuantumSyncGimmick` | Navbar (desktop) | Minimal scroll-responsive gradient accent |
| `ServiceClusterGimmick` | Projects, ProjectListPage | Mesh network, isometric hexagons, concentric rings |
| `TacticalTrajectoryGimmick` | Experience | 3D perspective grid, timeline beam, sonar pings, tactical HUD |

---

## Data Layer

All content is static. No API calls for content fetching.

### `src/constants.ts`

#### PROJECTS (6 items)
Each project has: `name`, `desc`, `tech` (string array), `version`, `status`.

| # | Name | Tech Stack | Status |
|---|------|-----------|--------|
| 1 | Distributed IoT Orchestration | Node.js, RabbitMQ, PostgreSQL, MQTT | PRODUCTION |
| 2 | Enterprise Mobile Core v2 | React Native, SQLite, TypeScript, TCP/IP | STABLE |
| 3 | Financial Ledger Engine | Next.js, Prisma ORM, PostgreSQL, Docker | DEPLOYED |
| 4 | Real-time Analytics Pipeline | Go, Kafka, Redis, Prometheus | OPTIMIZED |
| 5 | Security Auth Middleware | Node.js, Redis, OAuth 2.0, Auth0 | SECURITY_OK |
| 6 | Cloud Resource Monitor | Python, React, GCP SDK, TensorFlow | LIVE |

#### BLOGS (6 items)
Each blog has: `slug`, `title`, `date`, `excerpt`, `content` (full markdown string).

| # | Slug | Date |
|---|------|------|
| 1 | debugging-rabbitmq-race-conditions | Oct 24, 2023 |
| 2 | prisma-orm-performance | Aug 12, 2023 |
| 3 | reliable-mobile-sync-mqtt | May 05, 2023 |
| 4 | optimizing-postgresql-indexing | Dec 15, 2023 |
| 5 | monorepo-engineering-workflow | Jan 10, 2024 |
| 6 | memory-management-react-native | Feb 28, 2024 |

#### PHRASES (4 items)
Used by the Hero typewriter effect: `["Systems Architect", "Fullstack Engineer", "Mobile Core Developer", "Automation Specialist"]`

Note: The translated versions of project names/descriptions, blog titles/excerpts, and phrases live in the translation files (`en.ts`, `id.ts`). The `constants.ts` file holds the English defaults and full blog markdown content.

---

## Styling

### Approach
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin (no `tailwind.config.js`)
- **CSS Variables** for theme tokens (light/dark switching)
- **`@theme` block** in `index.css` maps CSS vars to Tailwind tokens
- **Inline Tailwind classes** exclusively (no CSS modules, no styled-components)

### Fonts (Google Fonts)
| Font | Usage | Weights |
|------|-------|---------|
| Inter | Body/sans-serif (`font-sans`) | 300, 400, 500, 600, 700 |
| JetBrains Mono | Code/monospace (`font-mono`) | 400, 500 |
| Playfair Display | Serif accents (`font-serif`) | 400-900, italic |

### Typography Hierarchy (base layer)
- `h1`: 4xl/5xl/7xl, bold, tracking-tight
- `h2`: 3xl/4xl, bold, tracking-tight
- `h3`: xl/2xl, bold, tracking-tight
- `p`: base, leading-relaxed, text-muted

### Custom Utilities
- `.grid-bg` - Dot grid background pattern (32px spacing)
- `.container-custom` - max-w-[1280px] mx-auto px-6/12/16
- `.section-padding` - py-20/32
- `.typewriter::after` - Blinking cursor `|`
- `.vertical-text` - vertical-rl writing mode
- `.animate-spin-slow` - 8s rotation
- `.animate-sweep` - Horizontal sweep animation

### Custom Scrollbar
- 4px wide, transparent track
- Gradient thumb (cyan to indigo with transparency)
- Glow effect on hover
- Firefox support via `scrollbar-width: thin`

---

## SEO

### Implementation
- **react-helmet-async** for dynamic `<head>` meta tags
- **robots.txt**: Allows all bots, points to sitemap
- **sitemap.xml**: 26 URLs with full hreflang alternate mappings

### Meta Tags Generated by SEO Component
- `<html lang="en|id">`
- `<link rel="canonical">`
- `<link rel="alternate" hreflang="en|id|x-default">`
- OpenGraph: `og:title`, `og:description`, `og:url`, `og:type`, `og:locale`
- Twitter: `twitter:card`, `twitter:title`, `twitter:description`

### Sitemap Coverage
- Homepage: `/en/`, `/id/`
- Blog list: `/en/blog`, `/id/blog`
- Project list: `/en/projects`, `/id/projects`
- Blog details: 6 slugs x 2 languages = 12 URLs
- Each URL has hreflang alternates pointing to its counterpart

---

## Testing

### Framework
- **Vitest** ^4.1.5 with `jsdom` environment
- **@testing-library/react** for component rendering
- **@testing-library/jest-dom** for DOM matchers
- **@testing-library/user-event** for user interactions

### Configuration
- Global test setup: `src/test/setup.ts`
- Test pattern: `src/**/*.test.{ts,tsx}`
- Coverage: v8 provider, text + HTML reporters

### Global Mocks (setup.ts)
- `localStorage` (getItem, setItem, removeItem, clear)
- `window.matchMedia` (dark mode detection)
- `window.scrollTo`
- `ResizeObserver`
- `IntersectionObserver`

### Custom Test Utilities (test-utils.tsx)
- `customRender()` - wraps with BrowserRouter + ThemeProvider
- `renderWithRouter()` - wraps with MemoryRouter + ThemeProvider (for URL testing)
- Re-exports all @testing-library/react functions + userEvent

### Test Suites

| File | Focus | Test Cases |
|------|-------|------------|
| `App.test.tsx` | Routing, redirects, layout integration | 12+ |
| `SEO.test.tsx` | Meta tags, hreflang rendering | 6 |
| `LanguageContext.test.tsx` | Language detection, translation functions | 15+ |
| `LanguageLayout.test.tsx` | Language toggle, route switching, persistence | 16+ |
| `LanguageRedirect.test.tsx` | Default language detection, redirect | 12+ |
| `useLocalizedPath.test.tsx` | URL path generation with language prefix | 16+ |
| `translations.test.ts` | Translation parity, completeness, content | 30+ |

### What Is Tested
- Route rendering for all paths in both languages
- Language detection priority (localStorage > browser > default)
- Language switching preserves routes and hash fragments
- Translation key parity between EN and ID
- No empty translation values
- Array lengths match (phrases, skills, etc.)
- All 21 i18n acceptance criteria from spec
- hreflang generation
- Invalid locale redirects

### What Is Not Tested
- Individual section components (Hero, About, Skills, etc.)
- SkyForceGame gameplay
- Gimmick components
- Contact form functionality
- Theme switching
- Code mode visual output
- CustomCursor behavior

---

## Documentation Status

### Complete Documentation
| Document | Status |
|----------|--------|
| `docs/architecture/20260425-existing-patterns.md` | Active ADR documenting architectural baseline |
| `docs/architecture/20260425-i18n-architecture.md` | Active ADR with full i18n design decisions |
| `docs/specs/i18n.md` | Complete spec with 21 acceptance criteria + 8 edge cases |

### Stub Documentation (Title Only - "To be documented")
- `docs/specs/about-section.md`
- `docs/specs/animations.md`
- `docs/specs/blog-details-page.md`
- `docs/specs/blog-list-page.md`
- `docs/specs/blog-section.md`
- `docs/specs/code-mode-toggle.md`
- `docs/specs/contact-section.md`
- `docs/specs/experience-section.md`
- `docs/specs/hero-section.md`
- `docs/specs/homepage.md`
- `docs/specs/layout-system.md`
- `docs/specs/navigation.md`
- `docs/specs/projects-page.md`
- `docs/specs/projects-section.md`
- `docs/specs/skills-section.md`
- `docs/specs/skyforce-game.md`
- `docs/specs/theme-system.md`
- `docs/specs/visual-effects.md`
