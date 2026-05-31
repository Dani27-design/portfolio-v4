# Issue Tracker

---

## ~~SEC-05: Admin routes accessible when credentials are missing~~ [FIXED]

**Problem:** When Firebase credentials are not configured, the proxy middleware falls through to `intlMiddleware(request)` for admin routes, serving admin page HTML and JS bundles without any auth check.

**Root Cause:** `src/proxy.ts` lines 62-64 — when `!hasCredentials`, admin routes bypass auth entirely and render normally. The client-side `AdminGuard` renders `null` for non-admin users, but the admin layout, sidebar, and JS bundle are still served.

**Proof:** `src/proxy.ts` line 63: `return intlMiddleware(request);` inside `if (!hasCredentials)` block for admin routes.

**Impact:** In development or if credentials are accidentally unset in production, admin page structure (HTML, component code, routing) is exposed. Data is protected by API-level auth, but UI structure leaks.

**Solution:** When `!hasCredentials`, redirect admin routes to the home page or return a 503 instead of rendering the page.

**Risk:** Low implementation risk.

---

## ~~SEC-06: Rate limiter IP can be spoofed via x-forwarded-for~~ [FIXED]

**Problem:** The rate limiter reads client IP from `x-forwarded-for` header, which can be set by any client to bypass rate limiting.

**Root Cause:** `src/app/api/leaderboard/route.ts` lines 50-54 — `getClientIp()` reads `x-forwarded-for` first, which is user-controlled.

**Proof:** `request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()` — an attacker can set `X-Forwarded-For: random-value` on each request to get a fresh identity.

**Impact:** The rate limiter is ineffective against determined attackers who rotate the header value.

**Solution:** Use `request.ip` (available on `NextRequest` in Vercel serverless) which reads the verified IP. Fall back to `x-forwarded-for` only as last resort.

**Risk:** Low. `request.ip` may be `undefined` in local dev — needs a fallback chain.

---

## ~~PERF-04: Duplicate getContactContent() fetch on homepage~~ [FIXED]

**Problem:** `getContactContent()` is called in both the layout and the homepage, resulting in two Firestore reads for the same document.

**Root Cause:** `src/app/[locale]/layout.tsx` line 65 fetches `contactContent` for the Footer via PublicShell. `src/app/[locale]/page.tsx` line 62 fetches it again for the Contact section. Firebase admin SDK calls are NOT deduplicated by Next.js (only native `fetch()` is).

**Proof:** Both files call `getContactContent()` in their `Promise.all` arrays — layout line 65, page line 62.

**Impact:** Every homepage render triggers 2 Firestore reads for the same `siteContent/contact` document. Mitigated by ISR cache (`revalidate = 3600`), but initial renders and revalidations are doubled.

**Solution:** Use React's `cache()` wrapper around `getContactContent()` in `firestore.ts` to deduplicate within the same request.

**Risk:** None — `cache()` is a React built-in for server components.

---

## ~~PERF-05: Missing loading.tsx for project detail route~~ [FIXED]

**Problem:** No `loading.tsx` exists at `src/app/[locale]/projects/[slug]/`. Blog detail route has one, but projects do not.

**Root Cause:** The project detail route was created later and the loading skeleton was not added.

**Proof:** `src/app/[locale]/blog/[slug]/loading.tsx` exists. `src/app/[locale]/projects/[slug]/loading.tsx` does not.

**Impact:** No Suspense skeleton during navigation to project detail pages — users see a blank state while the server renders.

**Solution:** Create a `loading.tsx` matching the blog detail loading pattern.

**Risk:** None.

---

## ~~PERF-06: Missing error.tsx for project detail route~~ [FIXED]

**Problem:** No `error.tsx` exists at `src/app/[locale]/projects/[slug]/`. Blog detail route has one, but projects do not.

**Root Cause:** Same as PERF-05 — project detail route was created later.

**Proof:** `src/app/[locale]/blog/[slug]/error.tsx` exists. `src/app/[locale]/projects/[slug]/error.tsx` does not.

**Impact:** If `getProjectBySlug()` throws, the error bubbles to the parent `[locale]/error.tsx`, replacing the entire page layout instead of being scoped to the content area.

**Solution:** Create an `error.tsx` matching the blog detail error pattern.

**Risk:** None.

---

## ~~SEO-06: Project detail pages missing hreflang alternates in metadata~~ [FIXED]

**Problem:** Project content is bilingual, but project detail page metadata only sets `canonical` without `languages` alternates. The sitemap DOES emit bilingual hreflang for projects, creating a contradiction.

**Root Cause:** `src/app/[locale]/projects/[slug]/page.tsx` lines 27-30 — `alternates` object has `canonical` but no `languages` property.

**Proof:** Compare with sitemap.ts lines 50-65 which emit both locales for each project slug. The page metadata says "no alternates" while the sitemap says "alternates exist."

**Impact:** Search engines receive conflicting signals about whether bilingual project pages exist.

**Solution:** Add `languages` alternates to project detail metadata, matching the blog list/project list page pattern.

**Risk:** None.

---

## ~~A11Y-04: Footer text and icons have insufficient contrast~~ [FIXED]

**Problem:** Footer social link icons use `text-text-muted/30` (30% opacity) and copyright text uses `text-text-muted/40` (40% opacity). In dark mode, these produce contrast ratios well below WCAG 2.1 AA minimum of 3:1.

**Root Cause:** `src/components/layout/Footer.tsx` line 36 (`text-text-muted/40`) and line 47 (`text-text-muted/30`).

**Proof:** Dark mode `--text-muted-color: #94a3b8` at 30% opacity on `--surface-color: #16181e` background. Calculated effective color is extremely faint.

**Impact:** Fails WCAG 2.1 AA. Users with low vision cannot perceive footer links or text.

**Solution:** Increase opacity to at least `/60` for interactive elements and `/50` for text.

**Risk:** None — purely visual tweak.

---

## ~~A11Y-05: navigator.clipboard call has no error handling~~ [FIXED]

**Problem:** `navigator.clipboard.writeText()` is called without catching the returned Promise. On non-HTTPS or browsers that deny clipboard permission, this throws an unhandled rejection while the UI shows "Copied" regardless.

**Root Cause:** `src/components/sections/Contact.tsx` line 86 — `navigator.clipboard.writeText(email)` with no `.catch()` or `try/catch`.

**Proof:** Line 86-87: `navigator.clipboard.writeText(email); setCopied(true);` — `setCopied(true)` runs synchronously before the async clipboard operation resolves.

**Impact:** On HTTP or restricted browsers, the UI shows "Copied" but nothing was actually copied.

**Solution:** Wrap in try/catch with async/await, only set `setCopied(true)` on success.

**Risk:** None.

---

## ~~QUAL-05: Tests render async server components without proper mocking~~ [FIXED]

**Problem:** `About`, `Skills`, `Experience`, `Projects`, and `Blog` are now async server components using `await getTranslations()` from `next-intl/server`. The test setup mocks `next-intl` (client) but NOT `next-intl/server`. Tests pass but may not be rendering actual component output.

**Root Cause:** `src/test/setup.ts` mocks `next-intl` (line 70) but has no mock for `next-intl/server`. `src/test/pages.test.tsx` renders these async components with synchronous `render()`.

**Proof:** `setup.ts` line 70-75 — only `useTranslations`, `useLocale`, `useMessages` are mocked. No `getTranslations` mock exists for `next-intl/server`.

**Impact:** Tests give false confidence — they pass but may not actually verify rendered content of the converted server components.

**Solution:** Add `vi.mock('next-intl/server')` to `setup.ts` with a `getTranslations` mock that returns a translation function. Or restructure tests to properly handle async components.

**Risk:** Medium — requires understanding async component test patterns.

---

## ~~QUAL-07: Rate limiter key doesn't distinguish GET vs POST~~ [FIXED]

**Problem:** Both GET and POST handlers share the same IP key in the rate limiter map. GET requests consume POST budget and vice versa.

**Root Cause:** `src/app/api/leaderboard/route.ts` line 17 — `const key = \`${ip}\`` uses bare IP without method prefix.

**Proof:** GET handler (line 60) and POST handler (line 79) both call `isRateLimited(ip, ...)` with the same `ip` string. The timestamps are stored in the same array.

**Impact:** Low with current identical limits (60/60s for both). Becomes a bug if limits are ever tuned separately.

**Solution:** Prefix key with method: `const key = \`${method}:${ip}\``.

**Risk:** None.

---

## ~~QUAL-08: Video element lacks accessible fallback and preload optimization~~ [FIXED]

**Problem:** The `<video>` element in project detail has no `aria-label`, no `<track>` for captions, and no `preload` attribute — with `autoPlay` it downloads the full video eagerly.

**Root Cause:** `src/components/pages/ProjectDetailsPage.tsx` lines 72-79 — video has `autoPlay loop muted playsInline` but no accessibility or preload attributes.

**Proof:** The `<video>` tag has only `src`, `autoPlay`, `loop`, `muted`, `playsInline`, and `className`. No `aria-label`, no `preload="metadata"`.

**Impact:** Screen reader users get no context about the video. Full video downloads eagerly on mobile even when below viewport.

**Solution:** Add `aria-label={project.name[loc]}` and `preload="metadata"` to the video element.

**Risk:** None.
