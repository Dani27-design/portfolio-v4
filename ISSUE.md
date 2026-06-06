# ISSUE-001 [DONE]

## Problem
Firebase Admin SDK credential file exists in the project root directory (`portfolio-88003-firebase-adminsdk-fbsvc-0f32ea547d.json`). While listed in `.gitignore`, the file is present on disk alongside the working project. Any directory copy, backup, or file sharing operation exposes full admin credentials for the Firebase project.

## Severity
Critical

## Category
Security

## Location
`/portfolio-88003-firebase-adminsdk-fbsvc-0f32ea547d.json` (project root)

## Root Cause
The Firebase Admin SDK service account key was downloaded and placed directly in the project root for local development. The credential values should exist only in environment variables (`.env.local`), not as a standalone JSON file.

## Proof
```
$ ls -la portfolio-88003-firebase-adminsdk-fbsvc-0f32ea547d.json
-rw-r--r--@ 1 dev staff 2385 May 17 03:28 portfolio-88003-firebase-adminsdk-fbsvc-0f32ea547d.json
```
The `.gitignore` entry exists, but the file is still on disk:
```
# .gitignore line 14
portfolio-88003-firebase-adminsdk-fbsvc-0f32ea547d.json
```

## Impact
- **Security**: Full admin access to Firestore, Storage, and all Firebase services if the file is leaked
- **Business**: Complete data breach potential — attacker could read, modify, or delete all data
- **Compliance**: Credential files in project directories violate security best practices

## Fix Solution
1. Delete the file from disk: `rm portfolio-88003-firebase-adminsdk-fbsvc-0f32ea547d.json`
2. Rotate the service account key in Firebase Console (the existing key may have been compromised if the project was ever shared)
3. Ensure credentials are only stored in `.env.local` (which is already set up correctly)

## Fix Priority
P0

## Estimated Effort
XS

## Verification Method
Verify the file no longer exists: `ls portfolio-88003-firebase-adminsdk-fbsvc-0f32ea547d.json` should return "No such file or directory". Verify the application still works using env vars.

---

# ISSUE-002 [DONE]

## Problem
No Content-Security-Policy (CSP) headers are configured anywhere in the application. The site uses `dangerouslySetInnerHTML` in multiple locations (JSON-LD structured data injection, theme initialization script) and renders user-provided markdown content. Without CSP, any XSS vulnerability has unrestricted access to the DOM, cookies, and external resources.

## Severity
High

## Category
Security

## Location
- `next.config.ts` — no `headers()` configuration
- `src/proxy.ts` — no security headers added to responses
- `src/app/[locale]/layout.tsx:80-82` — `dangerouslySetInnerHTML` for theme init script
- `src/app/[locale]/page.tsx:96-106` — `dangerouslySetInnerHTML` for JSON-LD

## Root Cause
Security headers were never configured. Next.js does not add CSP headers by default.

## Proof
```bash
$ grep -ri "Content-Security-Policy\|CSP\|helmet\|security-headers\|X-Frame-Options" src/
# Returns no results (only found in package-lock.json)
```
No `headers()` function in `next.config.ts`. No middleware-level header injection in `src/proxy.ts`.

## Impact
- **Security**: XSS attacks have full access — can steal auth cookies, redirect users, inject malicious content
- **Security**: Clickjacking possible without `X-Frame-Options` header
- **Security**: MIME-type sniffing attacks possible without `X-Content-Type-Options`
- **SEO**: Some security scanners flag missing headers

## Fix Solution
Add security headers in `next.config.ts`:
```typescript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https://firebasestorage.googleapis.com data:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com; font-src 'self' https://fonts.gstatic.com;" },
    ],
  }];
}
```

## Fix Priority
P0

## Estimated Effort
S

## Verification Method
After deployment, verify headers with `curl -I https://dani-chusyaidin.vercel.app` and confirm CSP, X-Frame-Options, X-Content-Type-Options are present. Run a security scanner (e.g., securityheaders.com).

---

# ISSUE-003

## Problem
The `/api/admin/me` endpoint exposes admin authentication status to any unauthenticated caller. It returns `{ isAdmin: true }` or `{ isAdmin: false }` without returning a 401 for unauthenticated requests, allowing attackers to probe whether auth cookies are valid.

## Severity
High

## Category
Security

## Location
`src/app/api/admin/me/route.ts:4-7`

## Root Cause
The endpoint unconditionally returns the admin status as a JSON boolean. It does not differentiate between "not authenticated" and "authenticated but not admin".

## Proof
```typescript
// src/app/api/admin/me/route.ts
export async function GET() {
  const isAdmin = await verifyAdmin();
  return NextResponse.json({ isAdmin }); // Always 200, leaks auth state
}
```
Any unauthenticated user can call `GET /api/admin/me` and receive `{ isAdmin: false }`, confirming the endpoint exists and revealing the authentication mechanism.

## Impact
- **Security**: Information disclosure — attackers can validate whether stolen cookies grant admin access
- **Security**: Enumeration vector — confirms authentication endpoint and mechanism

## Fix Solution
Return 401 when not authenticated:
```typescript
export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ isAdmin: true });
}
```

## Fix Priority
P1

## Estimated Effort
XS

## Verification Method
Call `GET /api/admin/me` without auth cookies — should return 401 status code, not 200 with `{ isAdmin: false }`.

---

# ISSUE-004

## Problem
Server actions (`createBlog`, `updateBlog`, `createProject`, etc.) accept typed data at compile time but perform no runtime validation of field contents, lengths, or structure. An admin user (or attacker with admin cookies) can inject arbitrarily long strings, malformed data, or unexpected field types.

## Severity
High

## Category
Security

## Location
- `src/actions/blogs.ts:8-24` — `createBlog` accepts `Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>` without validation
- `src/actions/projects.ts:8-22` — `createProject` same issue
- `src/actions/experience.ts:8-19` — `createExperience` same issue
- `src/actions/skills.ts:8-19` — `createSkillGroup` same issue
- `src/actions/siteContent.ts:8-76` — all update functions same issue

## Root Cause
TypeScript types are erased at runtime. The server actions trust that incoming data matches the TypeScript interface. No runtime schema validation library (Zod, Yup, etc.) is used.

## Proof
```typescript
// src/actions/blogs.ts:8-18
export async function createBlog(data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  // No validation of data.slug format, data.title length, data.content size, etc.
  const ref = await adminDb.collection('blogs').add({
    ...data, // Spread directly to Firestore — any extra fields accepted
    createdAt: now,
    updatedAt: now,
  });
}
```
The `...data` spread means any arbitrary keys passed in the object will be stored in Firestore.

## Impact
- **Security**: Arbitrary data injection into Firestore documents
- **Security**: Potential for stored XSS if field values are rendered without sanitization
- **Business**: Database pollution with oversized or malformed documents
- **Performance**: Unbounded document sizes increase Firestore costs

## Fix Solution
Add Zod schema validation at the top of each server action:
```typescript
import { z } from 'zod';

const blogSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  title: z.object({ en: z.string().max(500), id: z.string().max(500) }),
  excerpt: z.object({ en: z.string().max(1000), id: z.string().max(1000) }),
  content: z.string().max(100000),
  // ... etc
}).strict(); // Reject unknown keys
```

## Fix Priority
P1

## Estimated Effort
M

## Verification Method
Attempt to call a server action with oversized data (e.g., 10MB string in a field) — should be rejected with a validation error before reaching Firestore.

---

# ISSUE-005

## Problem
The logo image at `public/logo.png` is a 6.7MB, 2048x2048 pixel PNG file. It is used in the Navbar at 40x40px display size and in the About section as a fill image. This dramatically impacts page load performance, server-side image optimization latency, and memory usage.

## Severity
Critical

## Category
Performance

## Location
- `public/logo.png` — 6,759,112 bytes, 2048x2048 PNG, RGBA
- `src/components/layout/Navbar.tsx:122-127` — `<Image src="/logo.png" width={40} height={40} />`
- `src/components/sections/About.tsx:37` — `<Image src="/logo.png" fill />`

## Root Cause
The original high-resolution logo was placed in the public directory without optimization. A 2048x2048 source image is unnecessary for a logo displayed at 40x40–320x320px maximum.

## Proof
```bash
$ wc -c public/logo.png
6759112 public/logo.png

$ file public/logo.png
public/logo.png: PNG image data, 2048 x 2048, 8-bit/color RGBA, non-interlaced
```
For comparison, the manifest icons are properly sized: `web-app-manifest-192x192.png` (66KB), `web-app-manifest-512x512.png` (442KB).

## Impact
- **Performance**: Next.js must optimize a 6.7MB source on first request — increases TTFB significantly
- **Performance**: Server memory spike during image optimization
- **Performance**: Even optimized, the source is wastefully large for the display sizes used
- **User**: Slower page loads, especially on mobile networks

## Fix Solution
1. Replace `public/logo.png` with a properly sized version (512x512 max, WebP or optimized PNG)
2. Target file size: under 100KB
3. Use a tool like `sharp` or Squoosh to resize and compress
4. Add `priority` prop to the Navbar Image component (see ISSUE-006)

## Fix Priority
P0

## Estimated Effort
XS

## Verification Method
Verify `public/logo.png` is under 100KB. Run Lighthouse and confirm LCP improvement. Check that the Navbar and About section render correctly.

---

# ISSUE-006

## Problem
The Navbar logo `<Image>` component is above the fold on every page but lacks the `priority` prop. Next.js lazy-loads images by default, causing the logo to load after other resources and potentially delaying LCP.

## Severity
Medium

## Category
Performance

## Location
`src/components/layout/Navbar.tsx:122-127`

## Root Cause
The `priority` prop was not added to the navbar logo Image component.

## Proof
```tsx
// src/components/layout/Navbar.tsx:122-127
<Image
  src={navbarContent?.logoUrl || '/logo.png'}
  alt={navbarContent?.brandName ?? 'Daniansyah'}
  width={40}
  height={40}
  className="object-cover rounded-sm group-hover:scale-105 transition-transform shrink-0"
  // Missing: priority={true}
/>
```

## Impact
- **Performance**: Logo appears after page paint, causing visual instability
- **UX**: Users see a blank space where the logo should be during initial load

## Fix Solution
Add `priority` prop to the Navbar Image:
```tsx
<Image
  src={navbarContent?.logoUrl || '/logo.png'}
  alt={navbarContent?.brandName ?? 'Daniansyah'}
  width={40}
  height={40}
  priority
  className="object-cover rounded-sm group-hover:scale-105 transition-transform shrink-0"
/>
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
Inspect the generated HTML — the image should have `fetchpriority="high"` and `loading="eager"` attributes. Run Lighthouse and verify LCP element loads earlier.

---

# ISSUE-007

## Problem
The Firebase client SDK (`firebase/firestore`) is imported directly in `SkyForceGame.tsx` for real-time leaderboard updates via `onSnapshot`. This bundles the Firestore client SDK into the home page's JavaScript bundle, significantly increasing bundle size for all users regardless of whether they play the game.

## Severity
High

## Category
Performance

## Location
`src/components/game/SkyForceGame.tsx:9-12`

## Root Cause
The `SkyForceGame` component imports `firebase/firestore` at the module level to set up a real-time listener. Even though the game component is dynamically imported via `ClientSkyForceGame.tsx`, the Firestore SDK is a heavy dependency (~100KB+ gzipped).

## Proof
```typescript
// src/components/game/SkyForceGame.tsx:9-12
import { app } from "@/lib/firebase";
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

const db = getFirestore(app); // Module-level initialization
```
```bash
$ du -sh node_modules/firebase/
40M     node_modules/firebase/
```
The Firebase client SDK is 40MB installed. The `firebase/firestore` submodule alone adds significant JS to the client bundle.

## Impact
- **Performance**: Increased JavaScript bundle size for all home page visitors
- **Performance**: Longer Time to Interactive (TTI) and Total Blocking Time (TBT)
- **Performance**: Mobile users download unnecessary Firebase SDK code

## Fix Solution
Replace client-side `onSnapshot` with server-sent events or polling via the existing `/api/leaderboard` REST endpoint. The REST fallback is already implemented (line 269-273), so removing `onSnapshot` and relying solely on REST polling would eliminate the Firebase client SDK dependency entirely from the public-facing pages.

## Fix Priority
P1

## Estimated Effort
S

## Verification Method
After removing the `firebase/firestore` import, verify the home page JS bundle size decreases. Run `next build` and compare bundle analysis. Confirm leaderboard still updates via REST polling.

---

# ISSUE-008

## Problem
Only `getContactContent` uses React's `cache()` wrapper in `src/lib/firestore.ts`. All other Firestore query functions lack `cache()`, meaning duplicate calls within the same server request hit Firestore separately. The home page calls `getContactContent()` in both the layout and page, which is correctly deduplicated. But `getNavbarContent()`, `getFooterContent()`, etc., would not be deduplicated if called from multiple components in the same render.

## Severity
Medium

## Category
Performance

## Location
`src/lib/firestore.ts:1-222` — only line 161 uses `cache()`

## Root Cause
The `cache()` wrapper from React was applied inconsistently. Most functions use plain `async function` declarations.

## Proof
```typescript
// src/lib/firestore.ts:161 — CACHED
export const getContactContent = cache(async (): Promise<ContactContent | null> => {

// src/lib/firestore.ts:5 — NOT CACHED
export async function getProjects(): Promise<Project[]> {

// src/lib/firestore.ts:137 — NOT CACHED
export async function getHeroContent(): Promise<HeroContent | null> {

// src/lib/firestore.ts:197 — NOT CACHED
export async function getNavbarContent(): Promise<NavbarContent | null> {
```

## Impact
- **Performance**: Redundant Firestore reads per request increase latency and cost
- **Performance**: Each uncached function call adds ~50-200ms of Firestore latency

## Fix Solution
Wrap all Firestore query functions with React's `cache()`:
```typescript
export const getProjects = cache(async (): Promise<Project[]> => { ... });
export const getHeroContent = cache(async (): Promise<HeroContent | null> => { ... });
// etc.
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
Add logging to Firestore functions and verify each is called exactly once per request, even when referenced from multiple components.

---

# ISSUE-009

## Problem
The admin layout renders `<meta name="robots" content="noindex, nofollow" />` as a JSX child element inside the `AdminLayout` component. In Next.js App Router, metadata should be exported via the `metadata` or `generateMetadata` API, not rendered as JSX — JSX `<meta>` tags inside components are not guaranteed to be placed in `<head>`.

## Severity
Medium

## Category
SEO

## Location
`src/app/[locale]/admin/layout.tsx:51`

## Root Cause
The admin layout is a client component (`'use client'`), so it cannot export `metadata`. The `<meta>` tag was placed inline as a workaround, but this is not the correct approach.

## Proof
```tsx
// src/app/[locale]/admin/layout.tsx:48-55
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <meta name="robots" content="noindex, nofollow" />  {/* Rendered as body child */}
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
```
The `<meta>` tag is rendered inside `<body>` (inside the AuthProvider), not in `<head>`. While Next.js may hoist it, this is not guaranteed behavior.

## Impact
- **SEO**: Admin pages may be indexed by search engines if the meta tag is not hoisted to `<head>`
- **SEO**: Duplicate/conflicting metadata could confuse crawlers

## Fix Solution
The `robots.ts` at `src/app/robots.ts` already disallows `/*/admin/` paths:
```typescript
rules: { userAgent: '*', allow: '/', disallow: '/*/admin/' },
```
This is the primary protection. To add the meta tag correctly, create a separate server layout file or use a `<head>` tag:
```tsx
// Option: Use Next.js head in the client component
<head><meta name="robots" content="noindex, nofollow" /></head>
```
Next.js App Router properly hoists `<head>` contents from client components.

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
Inspect the rendered HTML of an admin page. Confirm the `<meta name="robots">` tag appears inside `<head>`, not `<body>`.

---

# ISSUE-010

## Problem
Blog content is only in Indonesian, but blog URLs under `/en/blog/[slug]` are accessible and serve the same Indonesian-language content. While the canonical URL correctly points to `/id/blog/${slug}`, serving identical non-English content under the English locale is semantically misleading and could be considered cloaking by search engines.

## Severity
Medium

## Category
SEO

## Location
- `src/app/[locale]/blog/[slug]/page.tsx` — serves blog at both `/en/` and `/id/` locales
- `src/components/pages/BlogDetailsPage.tsx:75` — `lang="id"` hardcoded on content div
- `src/app/sitemap.ts:39-47` — blog entries only emitted for `/id/` locale (correct)

## Root Cause
Blog content stored in Firestore is always Indonesian (the `content` field is a single string, not bilingual). However, the blog detail page is accessible under both locale prefixes. The `lang="id"` attribute on the content div (BlogDetailsPage.tsx:75) is hardcoded rather than dynamic.

## Proof
```typescript
// src/components/pages/BlogDetailsPage.tsx:75
<div lang="id" className="markdown-body prose ...">  {/* Hardcoded lang="id" */}
```
```typescript
// src/app/sitemap.ts:39-47 — Only /id/ URLs in sitemap (correct)
for (const blog of blogs) {
  entries.push({
    url: `${baseUrl}/id/blog/${blog.slug}`,
    // No /en/ URL emitted — correct, but /en/ is still accessible
  });
}
```
The `/en/blog/[slug]` routes are not blocked or redirected.

## Impact
- **SEO**: Google may flag `/en/blog/[slug]` serving Indonesian content as a quality issue
- **UX**: English-speaking users reaching `/en/blog/[slug]` see untranslated content with no indication

## Fix Solution
Redirect `/en/blog/[slug]` to `/id/blog/[slug]` in the middleware/proxy, or display a notice that the article is only available in Indonesian.

## Fix Priority
P2

## Estimated Effort
S

## Verification Method
Navigate to `/en/blog/[any-slug]` — should either redirect to `/id/blog/[slug]` or display a language notice.

---

# ISSUE-011

## Problem
The SkyForceGame canvas is completely inaccessible to keyboard-only users and screen reader users. The game relies entirely on pointer (mouse/touch) input and provides no keyboard controls, no screen reader announcements, and no alternative content beyond a static `aria-label`.

## Severity
High

## Category
Accessibility

## Location
- `src/components/game/SkyForceGame.tsx:901` — `<canvas role="img" aria-label={t('ariaLabel')} />`
- `src/components/game/SkyForceGame.tsx:898-899` — `onPointerDown`, `onPointerMove` only (no `onKeyDown`)

## Root Cause
The game was built for mouse/touch interaction only. No keyboard event handlers exist. The canvas element has `role="img"` which tells screen readers it's a static image, hiding all interactive content.

## Proof
```tsx
// src/components/game/SkyForceGame.tsx:897-901
<div
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  // No onKeyDown, no tabIndex, no keyboard controls
>
  <canvas ref={canvasRef} className="w-full h-full" role="img" aria-label={t('ariaLabel')} />
</div>
```
No `tabIndex`, no `onKeyDown` handler, no keyboard-based movement or shooting controls.

## Impact
- **Accessibility**: WCAG 2.2 Level A failure — interactive content must be operable via keyboard (2.1.1 Keyboard)
- **Accessibility**: Screen reader users have no way to interact with or understand the game state
- **User**: Keyboard-only users (including many people with motor disabilities) cannot play the game

## Fix Solution
1. Add keyboard controls (arrow keys for movement, space for shooting)
2. Add `tabIndex={0}` to the game container for keyboard focus
3. Add `aria-live` region for score updates
4. Consider adding a `<noscript>` or text alternative explaining the game
5. The `SkipGameLink` component (already present) allows skipping — this is good practice

## Fix Priority
P1

## Estimated Effort
M

## Verification Method
Tab to the game section — the game container should receive focus. Use arrow keys and spacebar to control the game. Verify screen reader announces score changes.

---

# ISSUE-012

## Problem
The `TypewriterText` component in `Hero.tsx` dynamically changes text via rapid state updates, but the text changes are not announced to screen readers. There is no `aria-live` region wrapping the typewriter output.

## Severity
Medium

## Category
Accessibility

## Location
`src/components/sections/Hero.tsx:14-54` — `TypewriterText` component

## Root Cause
The component uses `useState` to update text character-by-character, but the output is rendered as a plain `<span>` without any `aria-live` attribute.

## Proof
```tsx
// src/components/sections/Hero.tsx:47-53
return (
  <span className="text-base md:text-3xl font-mono text-primary typewriter">
    <CodeText type="js">
      {text}  {/* Changes rapidly, no aria-live */}
    </CodeText>
  </span>
);
```
No `aria-live="polite"` or `role="status"` on the container or parent.

## Impact
- **Accessibility**: Screen reader users miss the dynamic role/title display entirely
- **Accessibility**: WCAG 4.1.3 Status Messages — status messages must be programmatically determined

## Fix Solution
Wrap the typewriter output in an `aria-live` region, or add a visually-hidden element that announces the full phrase when it completes:
```tsx
<span aria-live="polite" aria-atomic="true">
  <CodeText type="js">{text}</CodeText>
</span>
```
Consider debouncing announcements to avoid flooding screen readers with character-by-character updates.

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
Enable a screen reader (VoiceOver/NVDA). Navigate to the hero section and verify the typewriter text phrases are announced when they complete.

---

# ISSUE-013

## Problem
The contact form uses a `mailto:` link to open the user's default email client instead of submitting to a server-side endpoint. Users without a configured email client (common in web-only environments, Chromebooks, or mobile browsers without email apps) experience a broken or confusing interaction.

## Severity
Medium

## Category
UX

## Location
`src/components/sections/Contact.tsx:38-41`

## Root Cause
The `handleSend` function constructs a `mailto:` URL and navigates to it. There is no server-side form submission endpoint.

## Proof
```typescript
// src/components/sections/Contact.tsx:38-41
const handleSend = () => {
  const subject = encodeURIComponent(title || t('fallbackSubject'));
  const body = encodeURIComponent(message);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};
```
No `<form>` element, no `action` attribute, no API endpoint for form submission.

## Impact
- **UX**: Users without email clients configured see nothing happen or get an OS error
- **Business**: Lost leads — potential clients/employers who cannot send messages
- **Business**: No message persistence — if the email client crashes, the message is lost

## Fix Solution
Implement a server-side contact form handler (e.g., via an API route that sends email through a service like Resend, SendGrid, or Nodemailer). Keep `mailto:` as a fallback option.

## Fix Priority
P1

## Estimated Effort
M

## Verification Method
Submit a test message through the contact form without an email client configured. Verify the message is delivered to the admin email.

---

# ISSUE-014

## Problem
Admin API routes (`/api/admin/experience`, `/api/admin/blogs`, `/api/admin/projects`, `/api/admin/skills`, `/api/admin/site-content`, `/api/admin/counts`) have no error handling around Firestore operations. If Firestore is temporarily unavailable or returns an error, the routes crash with an unhandled exception, returning a generic 500 error.

## Severity
Medium

## Category
Backend

## Location
- `src/app/api/admin/experience/route.ts:11-12`
- `src/app/api/admin/blogs/route.ts:11-12`
- `src/app/api/admin/site-content/route.ts:11-18`
- `src/app/api/admin/counts/route.ts:15-20`

## Root Cause
The API route handlers call Firestore query functions without try-catch wrappers. While the underlying `firestore.ts` functions have their own try-catch blocks that return empty arrays/null on failure, the API routes that use `Promise.all()` (site-content, counts) could still fail if the function throws before reaching the try-catch.

## Proof
```typescript
// src/app/api/admin/site-content/route.ts:11-18
const [hero, about, contact, footer, hireBanner, navbar] = await Promise.all([
  getHeroContent(),
  getAboutContent(),
  getContactContent(),
  getFooterContent(),
  getHireBannerContent(),
  getNavbarContent(),
]);
// No try-catch — if Promise.all rejects, unhandled 500 error
```
```typescript
// src/app/api/admin/counts/route.ts:15-20
const [projects, blogs, experience, skills] = await Promise.all([
  adminDb.collection('projects').count().get(),  // Direct Firestore call, not wrapped
  // ...
]);
// No try-catch — crashes if Firestore is unavailable
```

## Impact
- **UX**: Admin panel shows generic error instead of actionable message
- **Debugging**: No error logging in API routes — issues are invisible
- **Reliability**: Transient Firestore errors crash the entire admin panel

## Fix Solution
Wrap all Firestore operations in try-catch blocks:
```typescript
try {
  const [projects, blogs, experience, skills] = await Promise.all([...]);
  return NextResponse.json({ projects: projects.data().count, ... });
} catch (err) {
  console.error('Failed to fetch counts:', err);
  return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
}
```

## Fix Priority
P2

## Estimated Effort
S

## Verification Method
Temporarily misconfigure Firebase credentials and verify the admin API routes return proper 500 error responses with descriptive messages instead of crashing.

---

# ISSUE-015

## Problem
The game leaderboard score is tracked entirely client-side via `scoreRef`. There is no server-side score validation. A user can submit any score (up to MAX_SCORE of 99999) by calling the `/api/leaderboard` endpoint directly, without playing the game.

## Severity
Medium

## Category
Security

## Location
- `src/components/game/SkyForceGame.tsx:279-285` — client-side score submission
- `src/app/api/leaderboard/route.ts:96-104` — only validates score is an integer 1-99999

## Root Cause
The score is incremented in the client-side game loop and submitted to the API. The API validates format (integer, 1-99999) and name (1-12 chars, uppercase alphanumeric) but has no way to verify the score was actually earned through gameplay.

## Proof
```typescript
// src/components/game/SkyForceGame.tsx:281-285
fetch('/api/leaderboard', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, score: newScore }),  // Client-controlled
}).then(() => fetchLeaderboardREST()).catch(() => {});
```
An attacker can run:
```javascript
fetch('/api/leaderboard', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'HACKER', score: 99999 })
});
```

## Impact
- **Business**: Leaderboard integrity is compromised — fake scores undermine the feature
- **UX**: Legitimate players' scores are overshadowed by fake ones
- **Security**: No server-side validation of gameplay — common in client-side games but should be acknowledged

## Fix Solution
This is inherently difficult to solve for client-side games. Mitigations include:
1. Add a game session token generated server-side at game start
2. Track game duration server-side and reject scores submitted too quickly
3. Implement score plausibility checks (e.g., max possible score per second)
4. Accept the limitation and document it, as the leaderboard is a fun feature, not a critical system

## Fix Priority
P3

## Estimated Effort
L

## Verification Method
Submit a score without playing the game via DevTools. If mitigations are added, verify the fake score is rejected.

---

# ISSUE-016

## Problem
The old Vite build output directory (`dist/`) is still present in the project root, containing stale `index.html`, `robots.txt`, `sitemap.xml`, and assets from the previous build system. This is dead weight and could cause confusion.

## Severity
Low

## Category
Architecture

## Location
`/dist/` directory in project root

## Root Cause
The project migrated from Vite to Next.js, but the old `dist/` directory was never removed.

## Proof
```bash
$ ls dist/
assets     index.html robots.txt sitemap.xml
```
The `dist/` directory is in `.gitignore`, so it's not committed, but it exists on disk.

## Impact
- **Maintainability**: Confusion about which build output is current
- **Disk**: Unnecessary files consuming space

## Fix Solution
Delete the directory: `rm -rf dist/`

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Verify `dist/` directory no longer exists. Verify `next build` still works correctly.

---

# ISSUE-017

## Problem
The `.env` file exists in the project root alongside `.env.local`, and both contain credentials (16 lines each with values). Having two separate credential files increases the risk of confusion and potential accidental exposure.

## Severity
Low

## Category
Security

## Location
- `/.env` — 16 lines with values
- `/.env.local` — 16 lines with values

## Root Cause
Both files were created during development. Next.js loads `.env.local` with higher priority, making `.env` redundant.

## Proof
```bash
$ wc -l .env .env.local
16 .env
16 .env.local
```
Both files are in `.gitignore` (not committed), but both exist on disk with real credential values.

## Impact
- **Security**: Two credential files doubles the surface area for accidental exposure
- **Maintainability**: Confusion about which file is authoritative

## Fix Solution
Delete `.env` and keep only `.env.local`. Next.js uses `.env.local` by default for local development.

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Delete `.env` and verify the application still runs correctly with `.env.local` alone.

---

# ISSUE-018

## Problem
The `PublicShell` component wraps all public pages as a client component (`'use client'`), including the Navbar, Footer, CustomCursor, ScrollToTop, and ScrollProgress. This makes the entire page shell a client component, preventing server-side rendering of the navigation and footer. All shell components (and their dependencies) are included in the client bundle.

## Severity
Medium

## Category
Frontend

## Location
`src/components/layout/PublicShell.tsx:1` — `'use client'` directive

## Root Cause
The `PublicShell` checks `usePathname()` to conditionally render admin vs. public layout, requiring client-side hooks. This forces the entire component tree (Navbar, Footer) to be client components.

## Proof
```tsx
// src/components/layout/PublicShell.tsx:1-43
'use client';

import { usePathname } from 'next/navigation';
// ...
export function PublicShell({ children, ... }: PublicShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');
  // This check forces client rendering of the entire shell
```
The `isAdmin` check could be done at the layout level (server-side) instead of inside the shell.

## Impact
- **Performance**: Navbar, Footer, and all UI utilities are fully client-rendered
- **Performance**: Increased JavaScript bundle size for all pages
- **SEO**: Navigation links are not in the initial HTML (must wait for JS hydration)

## Fix Solution
Move the admin/public routing logic to the server-side layout. The admin layout already has its own `layout.tsx`. The public shell should be restructured so the admin check doesn't force client rendering of the entire navigation.

## Fix Priority
P2

## Estimated Effort
M

## Verification Method
View page source of the home page. Verify navigation links are present in the server-rendered HTML (not waiting for client-side hydration).

---

# ISSUE-019

## Problem
The `SkyForceGame` component creates `AudioContext` instances that are never properly closed. Multiple game restarts accumulate audio contexts, leading to memory leaks and potential browser audio resource exhaustion.

## Severity
Medium

## Category
Frontend

## Location
`src/components/game/SkyForceGame.tsx:75-82` (approximate — audio context creation)

## Root Cause
`AudioContext` is created via `audioCtxRef` on demand but never closed with `audioCtxRef.current.close()` during cleanup or component unmount.

## Proof
The SkyForceGame component creates audio context for sound effects but the useEffect cleanup only calls `unsubscribe()` for Firestore (line 276) — no audio cleanup is performed. Each game restart may create a new AudioContext without closing the previous one.

## Impact
- **Performance**: Memory leak from accumulated AudioContext instances
- **Performance**: Browser may limit audio contexts (Chrome limits to ~6 concurrent)
- **UX**: Audio may stop working after multiple game restarts

## Fix Solution
Close the AudioContext in the cleanup function:
```typescript
return () => {
  if (audioCtxRef.current) {
    audioCtxRef.current.close();
  }
  if (unsubscribe) unsubscribe();
};
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
Play the game 10+ times in a row. Verify in DevTools (Performance tab) that AudioContext instances are not accumulating.

---

# ISSUE-020

## Problem
The Experience section artificially truncates job responsibilities to 3 bullet points via `.slice(0, 3)`, regardless of how many points are stored in Firestore. Important achievements or responsibilities beyond the first 3 are hidden.

## Severity
Low

## Category
Content

## Location
`src/components/sections/Experience.tsx:77`

## Root Cause
Hardcoded `.slice(0, 3)` on the experience points array.

## Proof
```tsx
// src/components/sections/Experience.tsx:77
{job.points[loc].slice(0, 3).map((point, pIdx) => (
```
If a job has 5 bullet points in Firestore, only the first 3 are displayed.

## Impact
- **Content**: Important career achievements are hidden from visitors
- **Business**: Reduced portfolio effectiveness — recruiters/clients miss key accomplishments
- **Portfolio**: Incomplete representation of work history

## Fix Solution
Either remove the `.slice(0, 3)` limit, or add a "Show more" expansion mechanism, or make the limit configurable via the admin panel.

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
Add an experience entry with 5+ bullet points in Firestore. Verify all points are displayed on the home page.

---

# ISSUE-021

## Problem
The contact form's `handleSend` function uses `mailto:` which constructs the email URL from user input. While `encodeURIComponent` is used, the `email` variable comes from Firestore content and is not validated. If the Firestore `contact.email` field is modified to contain malicious content, it could be injected into the URL.

## Severity
Low

## Category
Security

## Location
`src/components/sections/Contact.tsx:38-41`

## Root Cause
The `email` variable is sourced from Firestore without validation:
```typescript
const email = contactContent?.email ?? "daniansyah@chusyaidin.engineer";
```

## Proof
```typescript
// src/components/sections/Contact.tsx:38-41
const handleSend = () => {
  const subject = encodeURIComponent(title || t('fallbackSubject'));
  const body = encodeURIComponent(message);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  // email is not URI-encoded — comes directly from Firestore
};
```
The `email` variable is not encoded with `encodeURIComponent`, though `mailto:` URLs don't typically allow script injection.

## Impact
- **Security**: Low risk — `mailto:` protocol handlers in browsers sanitize the email, but malformed email could cause unexpected behavior
- **UX**: If Firestore email field is corrupted, the contact form breaks silently

## Fix Solution
Validate the email format before constructing the URL:
```typescript
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
if (!isValidEmail) return;
window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Set an invalid email in Firestore contact content. Verify the contact form gracefully handles the invalid email.

---

# ISSUE-022

## Problem
No error monitoring or logging service is configured. All error handling uses `console.error`, which is lost in production on Vercel. There is no way to detect, track, or debug production errors.

## Severity
High

## Category
Architecture

## Location
- `src/lib/firestore.ts` — all functions use `console.error`
- `src/app/api/leaderboard/route.ts:138` — `console.error`
- All API routes lack error telemetry

## Root Cause
No error tracking service (Sentry, LogRocket, etc.) was integrated.

## Proof
```typescript
// src/lib/firestore.ts:13-16 (and 13 more functions with same pattern)
} catch (err) {
  console.error('Failed to fetch projects:', err);
  return [];
}
```
The `global-error.tsx` claims "This has been logged for investigation" (line 22), but no logging service exists.

## Impact
- **Reliability**: Production errors are invisible — no alerting, no tracking, no historical data
- **Debugging**: Cannot reproduce or investigate issues reported by users
- **Business**: Data loss events or Firestore outages go unnoticed

## Fix Solution
Integrate an error monitoring service:
1. Add Sentry: `npm install @sentry/nextjs`
2. Configure in `next.config.ts` with `withSentryConfig()`
3. Replace `console.error` calls with `Sentry.captureException()`
4. Update `global-error.tsx` to actually report to Sentry

## Fix Priority
P1

## Estimated Effort
M

## Verification Method
Trigger an error in production. Verify the error appears in the monitoring dashboard with full stack trace and context.

---

# ISSUE-023

## Problem
Personal WhatsApp phone number (`6285790428078`) is hardcoded as a fallback in both the Contact section and Footer. This exposes a personal phone number in the source code even when Firestore data is unavailable.

## Severity
Low

## Category
Content

## Location
- `src/components/sections/Contact.tsx:48` — `"https://wa.me/6285790428078"`
- `src/components/layout/Footer.tsx:28` — `"https://wa.me/6285790428078"`

## Root Cause
Social links use hardcoded fallback values for when Firestore content is not available.

## Proof
```typescript
// src/components/sections/Contact.tsx:48
{ name: "WhatsApp", icon: <MessageCircle ... />, href: contactContent?.socials.whatsapp ?? "https://wa.me/6285790428078" },
```

## Impact
- **Privacy**: Phone number visible in client-side JavaScript source to anyone inspecting the page
- **Security**: Phone number could be harvested for spam/phishing

## Fix Solution
If the WhatsApp number must be displayed, that's a business decision. If it should be private when Firestore data is unavailable, replace the fallback with a `#` or remove the WhatsApp link when `contactContent` is null.

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
View the page source. Verify the phone number is only present when explicitly set in Firestore content.

---

# ISSUE-024

## Problem
Missing OpenGraph image for project detail pages. Blog detail pages have a dynamic `opengraph-image.tsx` that generates custom OG images per blog post, but project detail pages use only the default OG image from the locale layout. When sharing a project link on social media, the generic portfolio OG image appears instead of a project-specific image.

## Severity
Low

## Category
SEO

## Location
- `src/app/[locale]/blog/[slug]/opengraph-image.tsx` — exists (custom per blog)
- `src/app/[locale]/projects/[slug]/` — no `opengraph-image.tsx` file

## Root Cause
The OG image generation was implemented for blog posts but not for project pages.

## Proof
```bash
$ ls src/app/[locale]/blog/[slug]/
error.tsx  loading.tsx  opengraph-image.tsx  page.tsx

$ ls src/app/[locale]/projects/[slug]/
error.tsx  loading.tsx  page.tsx
# No opengraph-image.tsx
```

## Impact
- **SEO**: Project links shared on social media show generic portfolio image
- **Marketing**: Lower click-through rate on shared project links

## Fix Solution
Create `src/app/[locale]/projects/[slug]/opengraph-image.tsx` similar to the blog version, displaying the project name, description, and tech stack.

## Fix Priority
P3

## Estimated Effort
S

## Verification Method
Share a project URL on a social media platform or use an OG preview tool. Verify a project-specific image appears.

---

# ISSUE-025

## Problem
The `Script` component with `strategy="beforeInteractive"` is placed inside `<head>` in the locale layout. In Next.js App Router, `beforeInteractive` scripts should be placed in the root layout, not nested layouts. The theme initialization script may not execute at the optimal time.

## Severity
Low

## Category
Frontend

## Location
`src/app/[locale]/layout.tsx:77-82`

## Root Cause
The `<Script strategy="beforeInteractive">` is inside the `<head>` tag within the `[locale]/layout.tsx`. Next.js documentation recommends `beforeInteractive` scripts only in the root layout (`app/layout.tsx`).

## Proof
```tsx
// src/app/[locale]/layout.tsx:76-82
<head>
  <Script
    id="theme-init"
    strategy="beforeInteractive"
    dangerouslySetInnerHTML={{
      __html: `(function(){var t=localStorage.getItem('theme')...})()`,
    }}
  />
</head>
```
The root layout at `src/app/layout.tsx` is a thin pass-through with no `<html>`/`<head>`.

## Impact
- **UX**: Possible theme flash (FOUT) if the script doesn't execute before first paint
- **Performance**: Script may be injected at a suboptimal position in the document

## Fix Solution
Move the `Script` component to the root layout, or use a regular `<script>` tag inside `<head>` (which Next.js hoists properly in App Router).

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Hard-refresh the page in dark mode. Verify no flash of light theme before dark theme applies.

---

# ISSUE-026

## Problem
The `about.title` translation value is semantically different between locales: English has `"About Me"` while Indonesian has `"Software Developer"`. These are not translations of each other — they convey different meanings.

## Severity
Low

## Category
Content

## Location
- `messages/en.json:22` — `"title": "About Me"`
- `messages/id.json:22` — `"title": "Software Developer"`

## Root Cause
The translations were set independently rather than being true translations of the same concept.

## Proof
```json
// messages/en.json
"about": { "title": "About Me", ... }

// messages/id.json
"about": { "title": "Software Developer", ... }
```
"About Me" ≠ "Software Developer" — these are different labels.

## Impact
- **Content**: Inconsistent section branding across locales
- **UX**: Users switching languages see a different section label, which is confusing

## Fix Solution
Align the translations. Either both should be "About Me" / "Tentang Saya" or both should be "Software Developer" / "Software Developer".

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Switch between EN and ID locales. Verify the About section title is a proper translation in both languages.

---

# ISSUE-027

## Problem
The admin panel pages fetch data from API routes using `fetch` with relative URLs (e.g., `/api/admin/experience`) without handling the case where the user's network connection is lost or the API is unreachable. Failed fetches show error messages but provide no retry mechanism beyond page refresh.

## Severity
Low

## Category
Admin Panel

## Location
- `src/app/[locale]/admin/experience/page.tsx:20-27`
- `src/app/[locale]/admin/blogs/page.tsx:22-29`
- `src/app/[locale]/admin/projects/page.tsx:21-28`
- `src/app/[locale]/admin/skills/page.tsx:20-27`

## Root Cause
The admin pages use `fetch` in `useEffect` without retry logic or offline detection.

## Proof
```typescript
// src/app/[locale]/admin/experience/page.tsx (pattern repeated in all admin pages)
const fetchItems = async () => {
  try {
    const res = await fetch('/api/admin/experience');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    setItems(data);
  } catch (err) {
    setFetchError(err instanceof Error ? err.message : 'Failed to load experience');
  }
};
```
No retry button in the error UI (the error is displayed as text with no action).

## Impact
- **UX**: Admin must manually refresh the page to retry after a transient error
- **Reliability**: Network glitches require full page reload

## Fix Solution
Add a retry button to the error state UI. Consider implementing SWR or React Query for automatic retries and revalidation.

## Fix Priority
P3

## Estimated Effort
S

## Verification Method
Simulate a network error in the admin panel. Verify a "Retry" button appears that re-fetches data without a full page reload.

---

# ISSUE-028

## Problem
The `MediaModal` component lacks proper focus trapping. When the modal is open, users can Tab outside the modal to interact with background content. Only Escape and arrow key handlers are implemented.

## Severity
Medium

## Category
Accessibility

## Location
`src/components/ui/MediaModal.tsx:38-45`

## Root Cause
The modal implements keyboard navigation for content (Escape to close, arrows for prev/next) but does not trap Tab focus within the modal.

## Proof
```tsx
// src/components/ui/MediaModal.tsx:38-45
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
  };
  // No Tab key handling for focus trapping
```
The Navbar mobile menu correctly implements focus trapping (Navbar.tsx:54-86), but the MediaModal does not.

## Impact
- **Accessibility**: WCAG 2.4.3 Focus Order — users can interact with hidden background content
- **UX**: Keyboard users may get lost behind the modal overlay

## Fix Solution
Add focus trapping similar to the Navbar mobile menu implementation:
```typescript
if (e.key === 'Tab') {
  const focusable = modalRef.current?.querySelectorAll('button, [tabindex]');
  // Trap focus within modal
}
```

## Fix Priority
P2

## Estimated Effort
S

## Verification Method
Open the media modal. Tab through focusable elements — focus should cycle within the modal and not escape to background content.

---

# ISSUE-029

## Problem
The upload path for media files is constructed using user-provided input (blog slug, project data) without server-side path sanitization. The `storagePath` parameter in `uploadImage` and `uploadMedia` functions comes from client-side code and could potentially contain path traversal characters.

## Severity
Medium

## Category
Security

## Location
- `src/lib/upload.ts:191-196` — `uploadImage(file, path)` uses `path` directly
- `src/lib/upload.ts:199-207` — `uploadMedia(file, basePath)` uses `basePath` directly

## Root Cause
The storage path is constructed on the client side and passed to Firebase Storage upload functions without sanitization. While Firebase Storage itself prevents true path traversal, malicious paths could organize files in unexpected locations within the bucket.

## Proof
```typescript
// src/lib/upload.ts:191-196
export async function uploadImage(file: File, path: string): Promise<string> {
  const optimized = await compressImage(file);
  const ext = optimized.name.split('.').pop() || 'webp';
  const storageRef = ref(storage, `${path}.${ext}`);  // path comes from client
  const snapshot = await uploadBytes(storageRef, optimized);
  return getDownloadURL(snapshot.ref);
}
```
The `path` parameter is passed directly from admin form components without validation.

## Impact
- **Security**: An attacker with admin access could upload files to arbitrary storage paths
- **Maintenance**: Files could end up in unexpected storage locations

## Fix Solution
Sanitize the storage path on the client before upload, or better yet, construct the path server-side:
```typescript
function sanitizePath(path: string): string {
  return path.replace(/\.\./g, '').replace(/[^a-zA-Z0-9/_-]/g, '');
}
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
Attempt to upload a file with a path containing `../` — verify the path is sanitized.

---

# ISSUE-030

## Problem
The `global-error.tsx` displays "An unexpected error occurred. This has been logged for investigation." (line 22), but no actual logging or error reporting service is configured. This message is misleading to users.

## Severity
Low

## Category
UX

## Location
`src/app/global-error.tsx:22`

## Root Cause
The error message text was written assuming an error monitoring service would be set up, but no such service exists.

## Proof
```tsx
// src/app/global-error.tsx:22
<p style={{ ... }}>
  An unexpected error occurred. This has been logged for investigation.
</p>
```
No Sentry, LogRocket, or any error tracking SDK is installed or configured.

## Impact
- **UX**: Users expect their error is being tracked, but it isn't
- **Trust**: Misleading message reduces credibility if users learn errors aren't actually logged

## Fix Solution
Either:
1. Integrate an error monitoring service (see ISSUE-022) to make the message accurate
2. Change the message to: "An unexpected error occurred. Please try again later."

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Read the error page text. Verify it accurately reflects the error handling infrastructure.

---

# ISSUE-031

## Problem
The `SkyForceGame` component uses `alert()` as a fallback when the Web Share API is unavailable and clipboard copy succeeds. Native `alert()` dialogs are blocking, visually jarring, and cannot be styled to match the application design.

## Severity
Low

## Category
UX

## Location
`src/components/game/SkyForceGame.tsx:304`

## Root Cause
The share handler falls back to `alert()` for clipboard copy confirmation when `navigator.share` is not available.

## Proof
```typescript
// src/components/game/SkyForceGame.tsx:301-306
} else {
  try {
    await navigator.clipboard.writeText(shareText);
    alert(t('copiedToClipboard'));  // Blocking native alert
  } catch {
```

## Impact
- **UX**: Native alert is inconsistent with the polished game UI
- **UX**: Alert blocks the main thread

## Fix Solution
Replace `alert()` with a toast notification or inline status message, similar to the `AdminToast` component already in the codebase:
```typescript
// Use a state-based notification instead of alert
setShowCopied(true);
setTimeout(() => setShowCopied(false), 2000);
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Share a game score on a device without Web Share API. Verify a styled notification appears instead of a native alert dialog.

---

# ISSUE-032

## Problem
The `ProjectDetailsPage` component sorts media items on every render without memoization. The `.sort()` call creates a new array reference each time, potentially causing unnecessary re-renders of the `ProjectMediaGallery` child component.

## Severity
Low

## Category
Performance

## Location
`src/components/pages/ProjectDetailsPage.tsx:66-73`

## Root Cause
The IIFE that processes media items runs on every render, including the `[...project.media].sort()` operation.

## Proof
```tsx
// src/components/pages/ProjectDetailsPage.tsx:66-73
{(() => {
  const mediaItems: MediaItem[] =
    project.media && project.media.length > 0
      ? [...project.media].sort((a, b) => a.order - b.order)  // New array every render
      : [/* legacy fallback */];
  // ...
})()}
```
Since this is a server component (no `'use client'`), this runs once per request — making this a non-issue in practice. However, if the component is ever converted to a client component, this would cause re-renders.

## Impact
- **Performance**: Minimal in current server component context
- **Maintenance**: Technical debt if component is refactored to client side

## Fix Solution
Low priority — the component is a server component, so this runs once per request. No action needed unless converting to client component.

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
This is a server component — verify it doesn't have `'use client'` directive.

---

# ISSUE-033

## Problem
The light mode `--border-color` CSS variable is set to `#1e293b` (very dark blue-gray), which is inconsistent with typical light mode borders. Combined with `border-border/10` opacity modifiers used extensively, borders may be nearly invisible in light mode, reducing visual structure and readability.

## Severity
Low

## Category
UI

## Location
`src/app/globals.css:25`

## Root Cause
The light mode border color variable was set to a dark value typically used in dark mode themes.

## Proof
```css
/* src/app/globals.css:18-26 */
:root {
  --border-color: #1e293b;  /* This is slate-800, very dark for light mode */
}
```
With `border-border/10` used in many components, the effective border color in light mode is `rgba(30, 41, 59, 0.1)` — barely visible on a `#f9fafb` background.

## Impact
- **UI**: Borders and separators may be nearly invisible in light mode
- **Accessibility**: Reduced visual structure for users who rely on visual boundaries

## Fix Solution
Change the light mode border color to a lighter value:
```css
:root {
  --border-color: #cbd5e1; /* slate-300 — appropriate for light mode */
}
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Switch to light mode. Verify borders and separators are clearly visible throughout the site.

---

# ISSUE-034

## Problem
The `SkyForceGame` runs `requestAnimationFrame` without any frame rate cap. On high refresh rate displays (120Hz, 144Hz), the game loop runs at the monitor's refresh rate, consuming more CPU and battery than necessary. The game logic may also run faster on higher refresh rate displays if not using delta-time based updates.

## Severity
Low

## Category
Performance

## Location
`src/components/game/SkyForceGame.tsx` — game loop using `requestAnimationFrame`

## Root Cause
The game loop uses `requestAnimationFrame` directly without frame rate limiting or delta-time normalization.

## Proof
The game loop calls `requestAnimationFrame(gameLoop)` at the end of each frame without checking elapsed time. On a 144Hz monitor, the game runs 144 times per second instead of the intended ~60fps.

## Impact
- **Performance**: Excessive CPU usage on high refresh rate displays
- **Performance**: Increased battery drain on mobile devices and laptops
- **Gameplay**: Game speed may vary based on display refresh rate

## Fix Solution
Add delta-time based updates or cap the frame rate:
```typescript
let lastTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function gameLoop(currentTime: number) {
  const delta = currentTime - lastTime;
  if (delta >= frameInterval) {
    lastTime = currentTime - (delta % frameInterval);
    update(delta);
    render();
  }
  requestAnimationFrame(gameLoop);
}
```

## Fix Priority
P3

## Estimated Effort
S

## Verification Method
Run the game on a 144Hz display. Monitor CPU usage before and after the fix. Verify gameplay speed is consistent across different refresh rates.

---

# ISSUE-035

## Problem
The `about.stats` section in the About component renders stat values like "E2E", "0%", and "TDD" without contextual labels for screen readers. These abbreviations are meaningless without their accompanying label text, and the visual layout (large value above small label) is not conveyed to assistive technology.

## Severity
Low

## Category
Accessibility

## Location
`src/components/sections/About.tsx:72-83`

## Root Cause
The stats are rendered as plain `<div>` elements without `aria-label` or semantic grouping.

## Proof
```tsx
// src/components/sections/About.tsx:72-83
<div className="grid grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-12 border-t border-border">
  <div className="space-y-1">
    <div className="text-xl md:text-3xl font-bold text-text-main">{stat1Value}</div>
    <div className="text-xs uppercase tracking-wider text-text-muted font-semibold">{stat1Label}</div>
  </div>
  {/* No aria-label connecting value to label */}
```
Screen readers will announce "E2E" and "Lifecycle Ownership" as separate, unrelated elements.

## Impact
- **Accessibility**: Screen reader users cannot associate stat values with their labels
- **Accessibility**: WCAG 1.3.1 Info and Relationships — programmatic association missing

## Fix Solution
Add `aria-label` to each stat group:
```tsx
<div className="space-y-1" aria-label={`${stat1Value} — ${stat1Label}`}>
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Use a screen reader. Navigate to the About section stats. Verify each stat is announced with both its value and label.

---

# ISSUE-036

## Problem
The `Reveal` animation component does not respect `prefers-reduced-motion`. Elements below the fold are hidden (`opacity: 0, y: 30, scale: 0.98`) and only revealed via scroll-triggered animation. Users who have enabled reduced motion in their OS settings still see all scroll-triggered animations, and more critically, if animations fail to trigger, content remains invisible.

## Severity
High

## Category
Accessibility

## Location
`src/components/ui/Reveal.tsx:32-42`

## Root Cause
The component does not check `prefers-reduced-motion` before hiding and animating content. The `MotionConfig reducedMotion="user"` in `ThemeProvider.tsx:53` may affect motion library behavior, but `Reveal` uses `controls.set()` imperatively, which bypasses motion config.

## Proof
```tsx
// src/components/ui/Reveal.tsx:32-42
// No prefers-reduced-motion check before hiding content
controls.set({ opacity: 0, y: 30, scale: 0.98 });

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting && !hasAnimated.current) {
      hasAnimated.current = true;
      controls.start({
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
      });
    }
  },
  { rootMargin: "-50px" }
);
```
No `window.matchMedia('(prefers-reduced-motion: reduce)')` check exists anywhere in the component.

## Impact
- **Accessibility**: WCAG 2.3.3 Animation from Interactions — users with motion sensitivity cannot disable animations
- **Accessibility**: Content may be invisible if the IntersectionObserver fails or is not supported (content stays at opacity: 0)
- **User**: Users with vestibular disorders may experience discomfort from scroll-triggered animations

## Fix Solution
Check `prefers-reduced-motion` and skip animations when enabled:
```tsx
useEffect(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return; // Content stays visible, no animation

  // ... existing animation logic
}, [controls, delay]);
```

## Fix Priority
P1

## Estimated Effort
XS

## Verification Method
Enable "Reduce motion" in OS accessibility settings. Reload the page and scroll. Verify all content is visible without scroll-triggered animations.

---

# ISSUE-037

## Problem
The admin panel's `MarkdownEditor` component renders markdown preview without `rehype-sanitize`, while the public-facing `BlogDetailsPage` and `ProjectDetailsPage` both use it. This means the admin preview could render malicious HTML/scripts that would be stripped on the public site, creating an inconsistent and potentially dangerous preview experience.

## Severity
Medium

## Category
Security

## Location
`src/components/admin/MarkdownEditor.tsx:167`

## Root Cause
The `rehype-sanitize` plugin was added to public-facing markdown rendering but not to the admin preview.

## Proof
```tsx
// src/components/admin/MarkdownEditor.tsx:167 — NO sanitization
{value ? <Markdown remarkPlugins={[remarkBreaks]}>{value}</Markdown> : ...}

// src/components/pages/BlogDetailsPage.tsx:76 — HAS sanitization
<Markdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeSanitize]}>
  {blog.content}
</Markdown>

// src/components/pages/ProjectDetailsPage.tsx:109 — HAS sanitization
<Markdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeSanitize]}>
  {project.content[loc]}
</Markdown>
```

## Impact
- **Security**: Self-XSS risk — admin could paste malicious markdown that executes in their own browser during preview
- **UX**: Preview doesn't match what the public sees — admin might include HTML that gets stripped on publish
- **Security**: If an attacker gains access to the admin panel, they could exploit the unsanitized preview

## Fix Solution
Add `rehype-sanitize` to the admin MarkdownEditor:
```tsx
import rehypeSanitize from 'rehype-sanitize';
// ...
<Markdown remarkPlugins={[remarkBreaks]} rehypePlugins={[rehypeSanitize]}>{value}</Markdown>
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
Enter `<script>alert('xss')</script>` in the markdown editor preview. Verify the script tag is stripped in the preview, matching public behavior.

---

# ISSUE-038

## Problem
The `LoadingImage` component has no `onError` handler. If an image URL is broken or returns a 404, the component remains in its loading state forever — showing the shimmer/pulse animation indefinitely with the actual image at `opacity: 0`.

## Severity
Medium

## Category
Frontend

## Location
`src/components/ui/LoadingImage.tsx:26-35`

## Root Cause
Only `onLoad` is handled. The `onError` callback is not implemented on the `Image` component.

## Proof
```tsx
// src/components/ui/LoadingImage.tsx:26-35
<Image
  src={src}
  alt={alt}
  fill={fill}
  sizes={sizes}
  quality={quality}
  priority={priority}
  onLoad={() => setLoaded(true)}
  // Missing: onError={() => setLoaded(true)}
  className={`${className || ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
/>
```
When `src` points to a broken URL, `onLoad` never fires, so `loaded` stays `false` and the shimmer animation runs forever.

## Impact
- **UX**: Broken images show infinite loading animation instead of a broken image indicator
- **UX**: Users may think the page is still loading when the image simply doesn't exist
- **Performance**: Continuous CSS animation on elements that will never finish loading

## Fix Solution
Add an `onError` handler to dismiss the loading state:
```tsx
<Image
  src={src}
  alt={alt}
  onLoad={() => setLoaded(true)}
  onError={() => setLoaded(true)}
  // ...
/>
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
Set a blog cover image URL to an invalid/broken URL. Verify the loading shimmer stops and the broken image state is visible instead of an infinite loading animation.

---

# ISSUE-039

## Problem
The Hero section CTA buttons (`<a href="#mini-game">` and `<a href="#contact">`) lack `aria-label` attributes. Screen readers will announce the visible text, but the fragment links themselves provide no additional context about what happens when activated.

## Severity
Low

## Category
Accessibility

## Location
`src/components/sections/Hero.tsx:115-126`

## Root Cause
The CTA anchor elements use `href` with hash fragments but don't have `aria-label` describing the navigation action.

## Proof
```tsx
// src/components/sections/Hero.tsx:115-126
<a
  href="#mini-game"
  className="px-8 md:px-10 py-3 md:py-4 bg-text-main text-background ..."
>
  {ctaGame}  {/* e.g., "Wanna play a game?" */}
</a>
<a
  href="#contact"
  className="px-8 md:px-10 py-3 md:py-4 border border-border ..."
>
  {ctaContact}  {/* e.g., "Get in Touch" */}
</a>
```
While the visible text is descriptive, adding `role="button"` would better convey these are action elements styled as buttons.

## Impact
- **Accessibility**: Minor — the visible text is descriptive enough for most screen readers
- **Accessibility**: Semantically, these styled-as-buttons elements should use `role="button"` for clarity

## Fix Solution
Add descriptive attributes:
```tsx
<a href="#mini-game" role="button" ...>{ctaGame}</a>
<a href="#contact" role="button" ...>{ctaContact}</a>
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
Use a screen reader to navigate the Hero section. Verify CTAs are announced with appropriate context.
