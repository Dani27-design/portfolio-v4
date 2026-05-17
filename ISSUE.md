# Project Hardening Audit (Round 3)

## Severity Legend

- **Critical** — Security vulnerability or data integrity risk
- **High** — Significant performance, UX, or reliability issue affecting real users
- **Medium** — Noticeable problem that degrades experience for subset of users
- **Low** — Minor issue with limited impact but should be addressed
- **Observation** — Not a bug, but a design decision worth reconsidering

---

# 1. Architecture & Rendering

## 1.1 Firebase Client SDK Bundle Boundary Risk [Acknowledged]

**Problem:** If any non-admin component accidentally imports from `@/context/AuthContext` or `@/lib/firebase`, the entire Firebase client SDK (~80-100KB gzipped) leaks into the public bundle.

**Root Cause:** No import boundary enforcement. The project uses `tsc --noEmit` only (no ESLint), so no rule prevents accidental imports outside admin routes.

**Impact:** Public visitors would download Firebase Auth SDK they never use, increasing LCP and TTI.

**Solution:** Add ESLint rule or barrel export guard preventing `@/lib/firebase` and `@/context/AuthContext` imports outside `src/app/[locale]/admin/`.

**Status:** Acknowledged — boundary currently intact. Documented as preventive awareness note.

---

## 1.2 HomePage Is a Single `'use client'` Boundary [Acknowledged]

**Problem:** All 7 section components are bundled into a single client chunk because `HomePage.tsx` is marked `'use client'`.

**Root Cause:** `HomePage.tsx` has `'use client'` at line 1. Removing it breaks `next/dynamic` with the `loading` prop used for SkyForceGame.

**Impact:** On slow 3G, the entire homepage JS must download before any section becomes interactive.

**Solution:** Restructure SkyForceGame loading to allow HomePage to become a server component.

**Status:** Acknowledged — each section already has its own `'use client'`. Marginal benefit does not justify refactor risk.

---

## ~~1.3 Contact Form `backdrop-blur-sm` on Form Container~~ [FIXED]

**Problem:** The contact form container at `Contact.tsx:53` uses `backdrop-blur-sm`, adding a GPU compositing layer on a large element that contains animated children (pulsing emerald dot, 5 diagnostic progress bars).

**Root Cause:** `bg-surface/80 backdrop-blur-sm` on the form wrapper div. The blur layer composites over the NeuralBridgeGimmick background, forcing a separate GPU texture for the entire form region.

**Impact:** On low-end Android, the contact form section scrolls slightly less smoothly than sections without backdrop-blur. The effect is subtle but measurable on budget devices.

**Solution:** Replace `bg-surface/80 backdrop-blur-sm` with `bg-surface/90` — increased opacity compensates for removed blur.

**Resolution:** Replaced `bg-surface/80 backdrop-blur-sm` with `bg-surface/90` in `Contact.tsx`. Eliminates the GPU compositing layer. Increased opacity compensates visually.

---

## ~~1.4 Light Theme Color Contrast May Be Insufficient~~ [FIXED]

**Problem:** The light theme uses `--text-muted-color: #475569` (slate-600) on `--bg-color: #ffffff`. This gives a contrast ratio of 5.9:1, which passes WCAG AA for normal text but fails for the `text-[10px]` and `text-[11px]` labels used extensively throughout (WCAG requires 4.5:1 for text <14px bold / <18px normal, but very small text is harder to read even when passing ratios).

**Root Cause:** `:root` CSS variables in `globals.css:22` define `--text-muted-color: #475569`. While technically AA-compliant, the combination of small font sizes (10-11px) + light weight + muted color creates readability issues.

**Impact:** Light theme users on low-resolution screens may struggle to read muted labels, metadata, and navigation text. The portfolio defaults to dark theme, so most visitors won't encounter this — but the light theme should still be polished.

**Solution:** Darken `--text-muted-color` to `#334155` (slate-700) in light theme for better contrast with small text.

**Resolution:** Changed `--text-muted-color` from `#475569` (slate-600) to `#334155` (slate-700) in the `:root` block of `globals.css`. Contrast ratio improves from 5.9:1 to 8.6:1 on white background. Dark theme unaffected.

---

## ~~1.5 No Default OG Image for Non-Blog Pages~~ [FIXED]

**Problem:** Blog detail pages now have dynamic OG images via `opengraph-image.tsx`, but the homepage, blog list, and projects list pages have no OG image at all. The layout metadata sets `twitter.card: 'summary_large_image'` but provides no image.

**Root Cause:** No `opengraph-image.tsx` exists at the `[locale]` level or root level. Only `[locale]/blog/[slug]/opengraph-image.tsx` exists.

**Impact:** When sharing the homepage or project list on social media, there's no preview image. The `summary_large_image` Twitter card shows a broken/blank image area.

**Solution:** Create a default `opengraph-image.tsx` at `src/app/[locale]/` that generates a branded site-wide OG image (name, title, aesthetic).

**Resolution:** Created `src/app/[locale]/opengraph-image.tsx` using `ImageResponse` API. Generates a 1200x630 branded OG image with: DC logo, name (52px), "Systems Architect & Fullstack Engineer" subtitle, "Distributed Systems" and "Mobile Architecture" badges with cyan/indigo accents, and site URL. Dark theme matching the portfolio aesthetic. Next.js auto-applies to all pages under `[locale]/` that don't have their own OG image (blog detail pages keep their own).

---

# 2. Runtime Performance

## ~~2.1 Hero Typewriter Effect Causes Frequent Re-renders~~ [FIXED]

**Problem:** The Hero typewriter effect updates state every 50-100ms via `setTimeout`, triggering re-renders of the entire Hero component including 5 `Reveal` wrappers, `CodeText` components, and the `LazyGimmick` wrapper.

**Root Cause:** `Hero.tsx:23-48` — `setText()`, `setIsDeleting()`, `setPhraseIndex()`, `setTypingSpeed()` are all called from a single `useEffect` with `[text, isDeleting, phraseIndex, typingSpeed, phrases]` as dependencies. Each state change triggers a full component re-render.

**Impact:** ~10-20 re-renders per second during typing. While React Compiler (enabled) may optimize some of this, the effect is still observable in DevTools. On the Hero section specifically, the `Reveal` wrappers use `viewport: { once: true }` so they don't re-animate, but each re-render still reconciles the DOM tree.

**Solution:** Extract the typewriter into a separate small component (`TypewriterText`) that only re-renders itself — isolating the high-frequency state changes from the rest of Hero's DOM tree.

**Resolution:** Extracted typewriter state + effect + display into a `TypewriterText` component inside `Hero.tsx`. Hero now renders `<TypewriterText phrases={phrases} />`. Only the small TypewriterText re-renders at high frequency — the rest of Hero's tree (5 Reveals, LazyGimmick, CodeText, CTAs) is untouched.

---

## ~~2.2 CustomCursor Mousemove Listener Has No `passive` Flag~~ [FIXED]

**Problem:** The `CustomCursor.tsx:20` mousemove listener is registered without `{ passive: true }`, meaning the browser can't optimize scroll compositing when the cursor is near the edge of the viewport.

**Root Cause:** `window.addEventListener("mousemove", moveCursor)` — no options object passed.

**Impact:** Minimal in practice since mousemove doesn't block scrolling, but adding `{ passive: true }` is a free optimization that signals intent to the browser.

**Solution:** Add `{ passive: true }` to the mousemove listener.

**Resolution:** Added `{ passive: true }` to the mousemove event listener in `CustomCursor.tsx`.

---

# 3. Mobile & Responsive Design

## 3.1 Admin Sidebar Not Responsive on Mobile [Deferred]

**Problem:** `AdminSidebar.tsx` uses `w-64` (256px) fixed width with no responsive behavior. On mobile devices, the sidebar occupies most of the screen width, leaving minimal space for the main content area.

**Root Cause:** The admin layout at `admin/layout.tsx:40` uses `<div className="flex min-h-screen">` with `<AdminSidebar />` at `w-64` — no breakpoint-based collapse or hamburger menu for the admin panel.

**Impact:** Admin users on tablets/phones see a cramped layout. The sidebar takes ~70% of a 375px screen. Admin pages become effectively unusable on mobile.

**Solution:** Add a mobile drawer pattern for the admin sidebar — hidden by default on mobile, toggleable via hamburger. Or collapse to icon-only at `md` breakpoint.

**Status:** Deferred — the admin panel is a single-user internal tool used primarily on desktop. Adding a responsive drawer pattern is significant effort (state management, hamburger, animation) for minimal impact on a single-admin portfolio site.

---

## ~~3.2 Mobile Menu Language Toggle Missing~~ [FIXED]

**Problem:** The mobile menu overlay (Navbar.tsx:206-301) includes Code Mode and Theme toggles in the header, but the Language toggle is missing. Users must close the menu, find the language button in the navbar, then reopen the menu.

**Root Cause:** The mobile overlay header at lines 223-245 only renders `toggleCodeMode` and `toggleTheme` buttons, not `toggleLang`.

**Impact:** Indonesian visitors on mobile have a fragmented workflow to switch language. The language toggle exists in the navbar controls section but is harder to discover when the menu is open.

**Solution:** Add the language toggle button to the mobile menu overlay header, next to the code mode and theme buttons.

**Resolution:** Added language toggle button (Languages icon + `toggleLang` handler + `aria-label="Switch language"`) to the mobile menu overlay header in `Navbar.tsx`, positioned between the theme button and close button. Matches the visual style of adjacent buttons (`p-2 text-white/40 hover:text-white rounded-full`).

---

# 4. Accessibility

## 4.1 Navbar Links Don't Indicate Current Section [Acknowledged]

**Problem:** Desktop navigation links have no `aria-current` attribute or visual indicator for the currently visible section.

**Root Cause:** No IntersectionObserver scroll-spy logic exists.

**Impact:** Screen reader users and keyboard navigators cannot determine which section they're viewing.

**Solution:** Add IntersectionObserver to track visible sections and apply `aria-current="true"` plus visual highlight.

**Status:** Acknowledged — feature addition, not a bugfix. Low severity. Deferred.

---

## ~~4.2 Contact Form Inputs Not Associated with Labels via `htmlFor`/`id`~~ [FIXED]

**Problem:** The contact form `<label>` elements at `Contact.tsx:80,93` don't use `htmlFor` and the `<input>`/`<textarea>` elements don't have `id` attributes. The labels and inputs are visually grouped but not programmatically associated.

**Root Cause:** Labels use `className="... block ..."` and appear before inputs in the DOM, but without explicit `htmlFor`/`id` binding, assistive technology may not associate them.

**Impact:** Screen readers may not announce the label when the input is focused. Users relying on assistive technology may not know which field they're filling in.

**Solution:** Add `id="contact-title"` to the input, `htmlFor="contact-title"` to its label. Same for textarea: `id="contact-message"` + `htmlFor="contact-message"`.

**Resolution:** Added `htmlFor="contact-title"` to title label, `id="contact-title"` to title input. Added `htmlFor="contact-message"` to message label, `id="contact-message"` to textarea. Labels and inputs are now programmatically associated for screen readers.

---

## ~~4.3 Scroll Indicator in Hero Has No Accessible Label~~ [FIXED]

**Problem:** The scroll-down arrow at `Hero.tsx:123-125` is a `<div>` containing an `<ArrowDown>` icon with no text, label, or accessible name. It has `cursor-pointer` suggesting interactivity but no click handler or semantic role.

**Root Cause:** The element is `<div className="... cursor-pointer hidden md:block"><ArrowDown /></div>` — a visual indicator styled as interactive but without any accessible attributes or actual interactivity.

**Impact:** Keyboard users can't focus it. Screen readers see an unlabeled div with an SVG. The `cursor-pointer` class creates false affordance (it's not actually clickable).

**Solution:** Either make it a link (`<a href="#about" aria-label="Scroll to content">`) or remove `cursor-pointer` and add `aria-hidden="true"` to mark it as decorative.

**Resolution:** Removed `cursor-pointer` and `group` classes (false affordance), added `aria-hidden="true"` to mark the scroll indicator as purely decorative in `Hero.tsx`.

---

# 5. SEO & Discoverability

## ~~5.1 No Default OG Image for Homepage/List Pages~~ [FIXED]

**Problem:** Same as issue 1.5. Homepage, `/blog`, and `/projects` pages have no OG image. Social shares appear as text-only links.

**Root Cause:** Only `[locale]/blog/[slug]/opengraph-image.tsx` exists. No site-wide fallback.

**Impact:** Homepage social shares on LinkedIn/Twitter lack preview images, reducing click-through rate.

**Solution:** Create `src/app/[locale]/opengraph-image.tsx` with a branded default image.

**Resolution:** Resolved as part of issue 1.5.

---

# 6. Data Layer & Reliability

## ~~6.1 Firestore Queries Have No Error Handling~~ [FIXED]

**Problem:** All Firestore query functions in `firestore.ts` (getProjects, getBlogs, getExperience, getSkills, etc.) have no try/catch. If Firestore throws (network error, permission denied, quota exceeded), the error propagates to the page component, triggering the error boundary.

**Root Cause:** `firestore.ts:4-68` — every function directly calls `adminDb.collection(...).get()` without error handling. The only guard is `if (!adminDb) return []`.

**Impact:** A transient Firestore error crashes the entire page instead of showing empty state or cached data. The error boundaries catch it, but the user sees a generic error page instead of a degraded experience.

**Solution:** Wrap each query in try/catch, log the error, and return empty arrays as fallback — matching the existing `if (!adminDb) return []` pattern.

**Resolution:** Wrapped all 7 Firestore query functions in try/catch. Each catches errors, logs with `console.error`, and returns empty array (or `null` for `getBlogBySlug`). Pages now gracefully degrade to empty state instead of crashing on transient Firestore errors.

---

## ~~6.2 Error/NotFound Pages Use Non-Locale-Aware Links~~ [FIXED]

**Problem:** The error pages (`error.tsx`, `not-found.tsx`, `blog/[slug]/error.tsx`) import `Link` from `next/link` instead of `@/i18n/navigation`. Their `href="/"` and `href="/blog"` links are not locale-prefixed — navigating to `/` from `/id/blog/some-post` would lose the Indonesian locale.

**Root Cause:** `error.tsx:3`, `not-found.tsx:1`, `blog/[slug]/error.tsx:3` all use `import Link from 'next/link'`. The project's locale-aware `Link` is at `@/i18n/navigation`. Error/NotFound pages were created before the i18n navigation pattern was established.

**Impact:** Users who encounter an error on an Indonesian page (`/id/...`) and click "Back to Home" get redirected to `/` (English) instead of `/id` (Indonesian). The locale context is lost during error recovery.

**Solution:** Replace `import Link from 'next/link'` with `import { Link } from '@/i18n/navigation'` in all 3 error/not-found files. Note: `error.tsx` is `'use client'` which supports `@/i18n/navigation` Link.

**Resolution:** Replaced `import Link from 'next/link'` with `import { Link } from '@/i18n/navigation'` in all 3 files: `error.tsx`, `not-found.tsx`, `blog/[slug]/error.tsx`. The `href="/"` and `href="/blog"` values are unchanged — the i18n Link auto-prefixes with the current locale. Error recovery now preserves locale context.

---

## ~~6.3 Admin Email Hardcoded in Two Separate Files~~ [FIXED]

**Problem:** The admin email `daniansyahchusyaidin@gmail.com` is hardcoded in both `src/lib/auth.ts:4` and `src/context/AuthContext.tsx:7`. If the admin email changes, both files must be updated — a DRY violation.

**Root Cause:** `auth.ts` and `AuthContext.tsx` were developed independently for server-side and client-side auth checks respectively. Both define `const ADMIN_EMAIL = 'daniansyahchusyaidin@gmail.com'` separately.

**Impact:** If the admin email is updated in one file but not the other, auth breaks silently — server actions accept the new email but client-side admin check rejects it (or vice versa).

**Solution:** Centralize in an environment variable (`NEXT_PUBLIC_ADMIN_EMAIL`) or a shared constants file imported by both.

**Resolution:** Created `src/lib/constants.ts` with `export const ADMIN_EMAIL`. Updated both `auth.ts` and `AuthContext.tsx` to import from `@/lib/constants`. Single source of truth — changing the email requires editing one file only.

---

## ~~6.4 Blog Slug Uniqueness Not Enforced~~ [FIXED]

**Problem:** When creating or updating a blog, there's no check that the `slug` is unique. Firestore allows duplicate slugs, which would break URL routing — `getBlogBySlug` returns `.limit(1)` so only one post would be accessible.

**Root Cause:** `actions/blogs.ts` `createBlog` and `updateBlog` write to Firestore without checking if another document already has the same slug. Firestore has no native unique constraint.

**Impact:** If an admin creates two blog posts with the same slug, one becomes permanently inaccessible via URL. The list page shows both, but only one resolves via `/blog/{slug}`.

**Solution:** In `createBlog` and `updateBlog`, query Firestore for existing documents with the same slug before writing. Throw an error if a duplicate is found.

**Resolution:** Added slug uniqueness validation to both `createBlog` and `updateBlog` in `actions/blogs.ts`. Before writing, queries Firestore for existing documents with the same slug. On create: throws if any document exists with that slug. On update: throws if a *different* document exists with that slug (allows updating the same document's other fields without false positive). Error message includes the duplicate slug for admin feedback.

---

# 7. Translation & i18n

## 7.1 Decorative HUD Strings Are Hardcoded English [Acknowledged]

**Problem:** Dozens of decorative HUD strings (tactical labels, status indicators) are hardcoded English throughout multiple components.

**Root Cause:** Intentional design decision. The tactical HUD aesthetic uses English code/technical labels as part of the visual design language.

**Impact:** None — decorative, not content.

**Solution:** No action needed. Intentional design decision.

---

# 8. Future Scalability

## 8.1 No Pagination on Blog/Project List Pages [Deferred]

**Problem:** Both list pages render ALL documents from Firestore in a single grid with no pagination or limit.

**Root Cause:** `.map()` on full arrays. No `.limit()` in Firestore queries.

**Impact:** Currently <20 items — no issue. Revisit when content grows past ~30 items.

**Status:** Deferred.

---

## 8.2 Testing Coverage Gaps [Deferred]

**Problem:** 46 tests cover translations, metadata, and basic rendering. No tests for server actions, Firestore queries, admin auth, error boundaries, or empty states.

**Root Cause:** Test infrastructure focused on UI rendering. Backend tests not yet added.

**Impact:** Regressions in critical paths go undetected until production.

**Status:** Deferred.
