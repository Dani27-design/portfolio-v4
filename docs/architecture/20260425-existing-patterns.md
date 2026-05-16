## ADR: Existing Architectural Patterns — Portfolio v4

### Context

This ADR documents the architectural patterns discovered during Workflow 0 (Project Onboarding) for the portfolio-v4 project. The project is a React 19 single-page application built with Vite and TypeScript, serving as a personal portfolio website.

This document establishes the baseline patterns that exist in the codebase as of 2026-04-25. Future architectural decisions should reference this ADR to maintain consistency or explicitly supersede patterns documented here.

### Decision

The following patterns are established as the project's architectural baseline:

---

#### 1. Project Paradigm: Frontend SPA (Single Page Application)

- **Type**: Client-side rendered React application
- **No backend**: No server-side code despite Express dependency in package.json (unused)
- **Routing**: React Router DOM with hash-based anchor navigation for sections
- **Hosting**: Designed for AI Studio / Cloud Run deployment

---

#### 2. Component Architecture

**Pattern: Flat Component Directory**
- All components reside in `src/components/` without subdirectories
- 31 components in a single folder

**Pattern: Component Categories (implicit, not enforced by folders)**
- **Page Sections**: Hero, About, Skills, Experience, Projects, Blog, Contact
- **Layout**: MainLayout, Navbar, Footer
- **UI Primitives**: Reveal (animation wrapper), ScrollToTop, ScrollProgress, CustomCursor
- **Decorative Gimmicks**: 12 files ending in `Gimmick.tsx` (SystemGimmick, ArchitectureSchematicGimmick, etc.)
- **Interactive**: SkyForceGame, GameRocket

**Pattern: Named Exports with Matching Filenames**
- Files use PascalCase: `Hero.tsx`, `MainLayout.tsx`
- Components are exported as named exports: `export const Hero = () => { ... }`
- No default exports except `App.tsx`

---

#### 3. Page Architecture

**Pattern: Page Components as Composition Roots**
- Pages live in `src/pages/` (4 files)
- Pages compose section components without additional logic
- Example: `HomePage.tsx` renders `<Hero /><About /><Skills />...` in sequence

**Pattern: Route Structure**
```
/           → HomePage (sections via anchor: /#about, /#skills, etc.)
/blog       → BlogListPage
/blog/:slug → BlogDetailsPage
/projects   → ProjectListPage
```

---

#### 4. State Management

**Pattern: React Context for Global State**
- Single context: `ThemeContext` in `src/context/`
- Manages: theme (light/dark), code mode toggle
- Persists to localStorage
- Provides custom hook: `useTheme()`

**Pattern: Local Component State**
- Complex animations and UI state managed with useState/useEffect
- No external state management library (Redux, Zustand, etc.)

---

#### 5. Styling Architecture

**Pattern: Tailwind CSS v4 with CSS Variables**
- Tailwind integrated via Vite plugin
- Custom theme tokens defined in `index.css` using CSS custom properties
- Semantic color tokens: `--bg-color`, `--text-color`, `--surface-color`, etc.
- Light/dark theme via `.dark` class on `:root`

**Pattern: Utility-First with Custom Utilities**
- Global utilities in `index.css`: `.container-custom`, `.section-padding`, `.grid-bg`
- Typography hierarchy defined in `@layer base`

**Pattern: Inline Tailwind Classes**
- All styling via className strings
- No CSS modules, no styled-components

---

#### 6. Animation Architecture

**Pattern: Motion (Framer Motion successor) for Animations**
- Import from `motion/react`
- Used for: scroll-linked transforms, viewport reveal animations, complex SVG animations
- `Reveal` component as reusable animation wrapper

**Pattern: CSS Animations for Simple Effects**
- Keyframe animations in `index.css` for simple effects (blink, spin, sweep)
- Tailwind's built-in animation utilities

---

#### 7. Data Architecture

**Pattern: Static Data in Constants File**
- All content data in `src/constants.ts`
- Exports: `PROJECTS`, `BLOGS`, `PHRASES`
- Blog content embedded as template literal strings with markdown

**Pattern: No API Calls for Content**
- Content is compile-time static
- Gemini API integration exists but usage not found in scanned components

---

#### 8. Import Conventions

**Pattern: Path Alias**
- `@/*` maps to project root (configured in tsconfig.json and vite.config.ts)
- Actual usage: relative imports (`../components/`, `./Reveal`)
- Path alias appears underutilized

**Pattern: Import Order (observed)**
1. React imports
2. Third-party libraries (motion, lucide-react, react-router-dom)
3. Local components
4. Context/hooks
5. Constants

---

#### 9. TypeScript Conventions

**Pattern: Functional Components with Explicit Props Interface**
```typescript
interface MainLayoutProps {
  children: React.ReactNode;
}
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => { ... }
```

**Pattern: Type Exports in Context Files**
- Types defined and exported alongside implementation (e.g., `BaseTheme` in ThemeContext)

---

### Rationale

These patterns represent the current state of the codebase. They were not designed against CLAUDE.md universal standards but reflect common React/Vite project conventions. The patterns prioritize:

1. **Simplicity**: Flat structure, minimal abstraction
2. **Visual impact**: Heavy use of decorative animation components
3. **Self-contained**: No external APIs, no backend, no database

### Consequences

**Positive:**
- Low complexity — easy to understand and modify
- Fast build times — minimal dependencies
- No runtime dependencies on external services for core functionality

**Negative:**
- Scalability concerns — 31 components in flat folder will grow unwieldy
- No test infrastructure — zero test coverage
- Convention conflicts with CLAUDE.md universal standards (see below)

### Conflicts with CLAUDE.md Universal Standards

| Standard | Current State | Gap |
|----------|---------------|-----|
| File naming: snake_case | PascalCase (React convention) | **Conflict** — requires ADR decision |
| Co-located tests | No tests exist | **Gap** — needs test infrastructure |
| 500 LOC limit | Not verified for all files | **Needs audit** |
| OOP class-based | Functional components | **N/A** — React paradigm |
| Repository pattern | No database | **N/A** |
| docs/specs/ | Does not exist | **Gap** — needs creation |
| docs/architecture/ | Created by this ADR | **Resolved** |

### Alternatives Considered

**File Naming Convention:**
1. **Keep PascalCase** — aligns with React ecosystem conventions, reduces friction
2. **Migrate to snake_case** — aligns with CLAUDE.md universal standards, breaks React conventions

**Recommendation**: Create a follow-up ADR to formally decide on file naming convention for this project. PascalCase for React components is industry-standard and may warrant an exception.

---

*Created: 2026-04-25*
*Author: technical-architect (Workflow 0)*
*Status: Active*
