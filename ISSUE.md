# Accessibility, Performance, Reliability & Robustness Audit

Audit date: 2026-05-28
Focus: Accessibility, speed performance, reliability, robustness, feature ability

---

## ~~A11Y-01: No "Skip to main content" link for keyboard users~~ [FIXED]

**Problem**: No skip navigation link — keyboard users had to Tab through 9+ Navbar elements before reaching content.

**Fix applied** (`PublicShell.tsx`): Added a visually-hidden skip link (`sr-only focus:not-sr-only`) as the first focusable element in the DOM. When focused via Tab, it appears as a fixed button at top-left with `z-[200]` (above all other fixed elements). Links to `#main-content`. Added `id="main-content"` to the `<main>` element. Style matches the existing "Skip game section" link pattern in `HomePage.tsx`.

---

## ~~A11Y-02: Interactive elements use `outline-none` without visible focus replacement~~ [FIXED]

**Problem**: 2 of 5 `outline-none` elements had no visible focus replacement: ScrollToTop anchor and admin MarkdownEditor textarea. (The other 3 — Contact input, textarea, game input — already had `focus:border-cyan-500/60` as replacements.)

**Fix applied**:
- `ScrollToTop.tsx:112` — Added `focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:rounded-lg`
- `MarkdownEditor.tsx:93` — Added `focus-visible:ring-2 focus-visible:ring-cyan-500`

`focus-visible` ensures the ring only appears for keyboard navigation, not mouse clicks — preserving the clean visual on mouse interaction.

---

## ~~A11Y-03: Social links in Contact section have no accessible labels~~ [FIXED]

**Problem**: 4 social links used `target="_blank"` without indicating to screen reader users that they open in a new tab.

**Fix applied** (`Contact.tsx`): Added `aria-label={`${social.name} (opens in new tab)`}` to each social link. Screen readers now announce e.g. "GitHub (opens in new tab), link" instead of just "GitHub, link".

---

## ~~A11Y-04: Game canvas has no accessible alternative~~ [FIXED]

**Problem**: Game `<canvas>` element had no `role`, no `aria-label` — screen readers announced it as an unlabeled element.

**Fix applied** (`SkyForceGame.tsx`): Added `role="img" aria-label="SYSTEM_SHOT: DEFENDER — interactive space shooter game"` to the canvas element. `role="img"` tells screen readers this is a visual element (not interactive via keyboard), and the label describes what it is. Combined with the existing "Skip game section" skip link, screen reader users can now understand and bypass the game.

---

## ~~A11Y-05: Color contrast may be insufficient for small tactical text~~ [FIXED]

**Problem**: Calculated contrast ratios against dark background (#0f1115) showed functional text failing WCAG AA (4.5:1): `text-text-muted/60` at 3.4:1 (Contact form labels), `text-white/40` at 3.8:1 (mobile menu overlay buttons).

**Fix applied**:
- `Contact.tsx` — Form labels (`Secure_Endpoint:`, title label, `Response_Time:`) changed from `text-text-muted/60` (3.4:1) to `text-text-muted/80` (5.1:1 — PASS AA)
- `Navbar.tsx` — Mobile overlay buttons (code toggle, theme toggle, language toggle) changed from `text-white/40` (3.8:1) to `text-white/60` (7.2:1 — PASS AA)

**Remaining low-contrast items (acceptable)**: Game HUD labels (`text-white/40` on black/60), skill tag labels (`opacity-40` revealed on hover), footer copyright (`text-text-muted/60`), skill index numbers (`text-indigo-500` at 4.2:1). All pass AA-large (3:1) and are supplementary/decorative — not primary functional text.

---

## RELIAB-01: Contact form sends email via `mailto:` with no feedback or error handling

**Problem**: `Contact.tsx:38-42` — `handleSend()` constructs a `mailto:` URL and sets `window.location.href`. If the user has no email client configured, nothing happens — no error, no feedback. The form fields are also not cleared after "sending." There's no loading state, no success confirmation.

**Root cause**: `mailto:` is a fire-and-forget URL scheme. The browser hands off to the OS email client (if any). There's no JavaScript callback for success or failure.

**Impact**: MEDIUM — Users without a configured email client (common on web-only devices) see no response after clicking the send button. Users who DO have a client get no confirmation the form worked.

**Solution**: Add user feedback after the `mailto:` action — at minimum, show a brief success message ("Opening email client...") so users know the button worked. Consider clearing the form fields after send.

---

## RELIAB-02: `navigator.clipboard.writeText` used without fallback or error handling

**Problem**: `Contact.tsx:86` and `SkyForceGame.tsx:280` call `navigator.clipboard.writeText()` without try/catch. The Clipboard API requires a secure context (HTTPS) and may be denied by browser permissions. If it fails, the Promise rejects unhandled.

**Root cause**: No error handling around `navigator.clipboard.writeText()` calls.

**Impact**: LOW — The site is deployed on HTTPS (Vercel), so the secure context requirement is met. But browser permission denials or HTTP localhost testing could cause unhandled rejections.

**Solution**: Wrap both clipboard calls in try/catch. For the game share fallback (`SkyForceGame.tsx:280`), use the existing `alert()` only on success, and show a different message on failure.

---

## RELIAB-03: Game `handleShare` uses `alert()` for clipboard feedback

**Problem**: `SkyForceGame.tsx:281` uses `alert("Score result copied to clipboard!")` as a fallback when `navigator.share` is unavailable. `alert()` blocks the main thread and is a jarring UX in a modern web app.

**Root cause**: Quick implementation using `alert()` instead of in-app notification.

**Impact**: LOW — Only triggers when the Web Share API is unavailable (desktop browsers) and user clicks Share. Functional but poor UX.

**Solution**: Replace `alert()` with a temporary in-game toast/notification state, similar to the Contact form's `copied` state pattern.

---

## RELIAB-04: Leaderboard POST has no rate limiting or duplicate prevention

**Problem**: `src/app/api/leaderboard/route.ts` accepts any number of POST requests from any client. A user could submit hundreds of leaderboard entries by replaying the API call. There's no IP-based rate limiting, no session tracking, and no deduplication.

**Root cause**: The leaderboard API is intentionally public (no auth) for game accessibility. No rate limiting was implemented.

**Impact**: LOW — This is a portfolio game, not a competitive platform. Abuse risk is minimal. But a motivated troll could flood the leaderboard collection.

**Solution**: Add basic protection — e.g., a simple in-memory rate limiter (max 5 POSTs per IP per hour), or a Firestore rule limiting entries per time window. Alternatively, add a `lastSubmittedAt` timestamp check against the same name.

---

## ROBUST-01: `ThemeProvider` reads `localStorage` during SSR state initialization

**Problem**: `ThemeProvider.tsx:19-25` uses `typeof window !== 'undefined'` check to access `localStorage` during `useState` initialization. While this works in practice (the component is `'use client'`), React 19 may call the initializer during server rendering. If it does, the `typeof window` check prevents the error, but the initial state (`'dark'`) may not match the client's actual theme, causing a hydration mismatch.

**Root cause**: `useState(() => { if (typeof window !== 'undefined') { ... } return 'dark'; })` — the server always returns `'dark'`, but the client might have `'light'` saved in localStorage.

**Impact**: LOW — The `<html>` element has a synchronous `<script>` in the `<head>` (`layout.tsx:76-87`) that sets the correct theme class BEFORE React hydrates. This prevents any visual flash. The hydration mismatch (if any) is suppressed by `suppressHydrationWarning` on the `<html>` element. No user-visible issue, but technically impure SSR.

**Solution**: No action needed — the existing `<head>` script + `suppressHydrationWarning` pattern is the standard solution for theme persistence. This is informational only.

---

## ROBUST-02: `adminDb` type assertion hides null state

**Problem**: `firebase-admin.ts:17` uses `null as unknown as ReturnType<typeof getFirestore>` when Firebase isn't initialized. This means `adminDb` is typed as `Firestore` even when it's actually `null`. Every function in `firestore.ts` starts with `if (!adminDb) return ...` to guard against this, but the type system doesn't enforce this check — a new function could forget the guard and crash at runtime.

**Root cause**: Type assertion `null as unknown as Firestore` defeats TypeScript's null safety.

**Impact**: LOW — All existing Firestore functions have the null guard. But it's a maintenance trap for future code.

**Solution**: Type `adminDb` as `ReturnType<typeof getFirestore> | null` and remove the type assertion. This forces every consumer to handle the null case at compile time.

---

## FEAT-01: Experience section truncates bullet points to 3 per job

**Problem**: `Experience.tsx:82` uses `job.points[loc].slice(0, 3)` to limit each job entry to 3 bullet points. If a job has 5+ important accomplishments, visitors only see the first 3 with no indication that more exist.

**Root cause**: Hardcoded `.slice(0, 3)` truncation without a "show more" mechanism.

**Impact**: LOW — The truncation creates a clean visual, but it may hide important experience details from recruiters.

**Solution**: Either (a) remove the truncation and show all points, or (b) add a "Show more" toggle that reveals the remaining points, or (c) make the truncation limit configurable via the admin panel.
