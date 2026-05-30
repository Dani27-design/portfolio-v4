# Issue Tracker

---

## ~~GAME-02: Game arena has blank black space and misplaced red defense line on mobile~~ [FIXED]

**Problem**: The game container was set to `h-[85vh]` on mobile but the canvas height was hardcoded to 360px. This left ~330px of blank black empty space below the game content. The red dashed defense line drew at the bottom of the 360px canvas (in the middle of the visible container) instead of at the bottom of the full arena.

**Root cause**: `SkyForceGame.tsx:312` — `const logicalHeight = logicalWidth < 768 ? 360 : Math.min(540, logicalWidth * 0.54)` ignored the actual container height.

**Fix applied**: Changed to `const logicalHeight = containerRef.current.clientHeight` — canvas now uses the actual rendered container height on all screen sizes. The defense line, enemies, player, and all game elements render relative to the full arena height automatically.

---

# Un-translated / Non-bilingual Wording Audit

Audit date: 2026-05-30
Focus: All user-facing text that is English-only and not translated to Indonesian when the user switches to ID locale.

---

## Category A: Translation file values that are still untranslated jargon

### ~~I18N-01: `projects.viewDetail` is "View_Detail" in both EN and ID~~ [FIXED]

**Problem**: The value `View_Detail` has an underscore and is identical in both languages. Not translated.

**Root cause**: `messages/en.json:36` and `messages/id.json:36` both have `"viewDetail": "View_Detail"`.

**Proof**: Same string in both locale files. Indonesian users see English with underscore.

**Impact**: LOW — this key doesn't appear to be actively rendered in any current component (it was for a feature that may have been removed). But it's in the translation file and could be used in the future.

**Solution**: EN: `"View Detail"` (remove underscore). ID: `"Lihat Detail"`.

---

### ~~I18N-02: `projects.metadata.checksum` and `projects.metadata.target` are untranslated jargon~~ [FIXED]

**Problem**: `"Checksum: Validated"` and `"Target: Prod_Env"` are identical in both EN and ID. These are fake technical jargon that were never translated.

**Root cause**: `messages/en.json:41-42` and `messages/id.json:41-42`. Leftover from the tactical HUD aesthetic.

**Proof**: Same string in both locale files.

**Impact**: LOW — These keys don't appear to be rendered in any current component (removed during gimmick text cleanup). But they're in the translation files.

**Solution**: Remove these keys from both files, or if kept for future use: EN: `"Verified"` / `"Production"`. ID: `"Terverifikasi"` / `"Produksi"`.

---

### ~~I18N-03: `projects.archiveTitle` and `projects.archiveSubtitle` EN still have jargon~~ [FIXED]

**Problem**: EN: `"System Architecture Archives"` and `"Comprehensive Technical Case Studies & System Designs"` — jargon-heavy. ID versions are already good (`"Arsip Proyek"` / `"Studi kasus teknis dan desain sistem"`).

**Root cause**: `messages/en.json:37-38`. These were missed during the WORD-* fixes — only the homepage section title was updated, not the archive page title.

**Proof**: Rendered in `ProjectListPage.tsx:40` and `:45` as the heading on the `/projects` archive page.

**Impact**: MEDIUM — visible on the projects archive page.

**Solution**: EN: `"All Projects"` and `"Technical case studies and system designs"`.

---

### ~~I18N-04: `blog.archiveTitle` and `blog.archiveSubtitle` EN still have jargon~~ [FIXED]

**Problem**: EN: `"Full Technical Archives"` and `"Comprehensive Technical Documentation & Field Logs"` — jargon. ID versions are already good (`"Semua Catatan Teknis"` / `"Dokumentasi teknis dan catatan pengembangan"`).

**Root cause**: `messages/en.json:49-50`.

**Proof**: Rendered in `BlogListPage.tsx:39` and `:43` as the heading on the `/blog` archive page.

**Impact**: MEDIUM — visible on the blog archive page.

**Solution**: EN: `"All Posts"` and `"Technical articles and development notes"`.

---

## Category B: Hardcoded English strings in components (not in translation files)

### ~~I18N-05: Back navigation links are hardcoded English~~ [FIXED]

**Problem**: `"Back to Home"` (BlogListPage:34, ProjectListPage:35) and `"Back to Blog"` (BlogDetailsPage:36) are hardcoded in JSX. Indonesian users see English navigation.

**Root cause**: These strings were changed from `BACK_TO_ROOT`/`RETURN_TO_ARCHIVES` to human text in WORD-22, but were hardcoded directly instead of being added to translation files.

**Proof**: Hardcoded strings in component JSX, not from `t()` calls.

**Impact**: MEDIUM — navigation text visible on every sub-page.

**Solution**: Add translation keys (e.g., `"backToHome"` and `"backToBlog"`) and use `t()`.

---

### ~~I18N-06: Blog detail badges "Technical Article" and "Published" are hardcoded English~~ [FIXED]

**Problem**: `"Technical Article"` (BlogDetailsPage:44) and `"Published"` (BlogDetailsPage:47) are hardcoded. Indonesian users see English badges.

**Root cause**: Changed from `LOG_TYPE :: TECHNICAL_LOG` / `STATUS :: DEPLOYED` in WORD-24, hardcoded instead of using translations.

**Proof**: Hardcoded strings in BlogDetailsPage.tsx JSX.

**Impact**: LOW — small badges on blog detail page.

**Solution**: Add translation keys and use `t()`.

---

### ~~I18N-07: Blog detail author name is hardcoded~~ [KEPT — proper name, same in both languages]

**Problem**: `"Daniansyah Chusyaidin"` (BlogDetailsPage:62) is hardcoded. This is a proper name so it doesn't need translation, but it's not editable via admin.

**Root cause**: Hardcoded string changed from `DANIANSYAH_CORE` in WORD-25.

**Proof**: Hardcoded in JSX.

**Impact**: LOW — proper name, same in both languages. Not a translation issue but an editability issue (should come from Firestore/aboutContent).

**Solution**: No translation needed (proper name). But could be wired to `footerContent.ownerName` or similar for editability.

---

### ~~I18N-08: Contact section has multiple hardcoded English labels~~ [FIXED]

**Problem**: These hardcoded strings in `Contact.tsx` are English-only:
- Line 80: `"Email:"`
- Line 93: `'COPIED'` (success feedback)
- Line 147: `"Sys_Diagnostics"` (still has underscore!)
- Line 171: `"Response Time:"`
- Line 172: `"Within 24 hours"`

**Root cause**: These were either hardcoded from the start or changed during WORD-23 but not moved to translation files.

**Proof**: All hardcoded in Contact.tsx JSX.

**Impact**: MEDIUM — `"COPIED"` and `"Response Time: Within 24 hours"` are visible to all users. `"Sys_Diagnostics"` is XL-only but still has underscore. `"Email:"` is a label next to the email address.

**Solution**: Add all to translation files. `"COPIED"` → EN: `"Copied"` / ID: `"Tersalin"`. `"Sys_Diagnostics"` → remove underscore: `"Sys Diagnostics"` / ID: `"Diagnostik"`. Others need proper ID translations.

---

### ~~I18N-09: Navbar mobile overlay "NAV_TERMINAL" is hardcoded English with underscore~~ [FIXED]

**Problem**: `"NAV_TERMINAL"` (Navbar.tsx:268) — hardcoded English with underscore. Shown in the mobile menu overlay header.

**Root cause**: Never moved to translations. Still has underscore from original design.

**Proof**: Hardcoded in Navbar.tsx JSX.

**Impact**: LOW — small decorative label in mobile menu.

**Solution**: Change to `"Navigation"` or `"Menu"` and move to translations. Or remove it entirely (the menu is self-evident).

---

### ~~I18N-10: Project card "[01] PRODUCTION" badge is hardcoded English~~ [KEPT — universal tech term]

**Problem**: `[{idx}] PRODUCTION` (Projects.tsx:71, ProjectListPage.tsx:68) — "PRODUCTION" is hardcoded English. Indonesian users see English status text.

**Root cause**: Hardcoded in JSX, not from translations.

**Proof**: Hardcoded in both Projects.tsx and ProjectListPage.tsx.

**Impact**: LOW — small badge on project cards. "PRODUCTION" is widely understood in Indonesian tech context.

**Solution**: Could stay as-is (universal tech term) or add to translations: ID: `"PRODUKSI"`.

---

### ~~I18N-11: Error and 404 pages are entirely English-only~~ [FIXED]

**Problem**: Three error/404 pages have all English text with no i18n:
- `not-found.tsx`: "404 :: ROUTE_NOT_FOUND", "Page not found", "The page you are looking for...", "Back to Home"
- `error.tsx`: "ERROR :: PAGE_FAULT", "Something went wrong", "An error occurred...", "Try Again", "Back to Home"
- `blog/[slug]/error.tsx`: "ERROR :: LOG_CORRUPTED", "Failed to load entry", "This blog entry could not...", "Try Again", "Back to Archives"

**Root cause**: These are edge-case pages that were built English-only. They don't use `useTranslations()`.

**Proof**: All text hardcoded in JSX across 3 files.

**Impact**: MEDIUM — Indonesian users see English error messages. Error/404 pages are important for UX trust.

**Solution**: Add error/404 translation keys to both message files. Use `useTranslations()` in the components. Note: `not-found.tsx` is a server component — need to use `getTranslations()` instead.

---

### ~~I18N-12: Game share text is hardcoded English~~ [FIXED]

**Problem**: `SkyForceGame.tsx:283` — `"I just hit a high score of ${score} on SYSTEM_SHOT: DEFENDER! 🚀 Can you beat my record?"` — hardcoded English share message.

**Root cause**: Hardcoded string in component, not from translations.

**Proof**: Line 283 and 288 in SkyForceGame.tsx.

**Impact**: LOW — only triggered when user clicks Share. But Indonesian users share English text.

**Solution**: Move share text template to translations with `{score}` interpolation.

---

### ~~I18N-13: Skip links and aria-labels are hardcoded English~~ [FIXED]

**Problem**:
- `PublicShell.tsx:30`: `"Skip to main content"` — hardcoded
- `HomePage.tsx:35`: `"Skip game section"` — hardcoded
- `SkyForceGame.tsx:890`: `aria-label="SYSTEM_SHOT: DEFENDER — interactive space shooter game"` — hardcoded

**Root cause**: Accessibility strings added as hardcoded English.

**Proof**: Hardcoded in JSX.

**Impact**: LOW — only affects screen reader users on the ID locale. Skip links are `sr-only` (visually hidden).

**Solution**: Move to translation files for proper bilingual accessibility.

---

### ~~I18N-14: Contact mailto fallback subject is hardcoded English~~ [FIXED]

**Problem**: `Contact.tsx:39` — `title || "Technical Inquiry"` — the fallback email subject is hardcoded English.

**Root cause**: Hardcoded fallback string.

**Proof**: Line 39 in Contact.tsx.

**Impact**: LOW — only triggers if user submits with empty title field.

**Solution**: Move to translations or use a locale-aware fallback.

---

## Summary

| Category | Count | Files affected |
|----------|-------|---------------|
| Translation file values (untranslated/jargon) | 4 | messages/en.json, messages/id.json |
| Hardcoded English in components | 10 | 9 component files |
| **Total** | **14** | |

### Priority order for fixing:
1. **I18N-05** (back nav) + **I18N-08** (contact labels) — MEDIUM, visible on every page visit
2. **I18N-03** + **I18N-04** (archive titles) — MEDIUM, visible on sub-pages
3. **I18N-11** (error/404 pages) — MEDIUM, important for UX trust
4. **I18N-06** (blog badges) + **I18N-09** (NAV_TERMINAL) + **I18N-10** (PRODUCTION) — LOW
5. **I18N-01** + **I18N-02** (unused translation keys) — LOW, cleanup
6. **I18N-12** (game share) + **I18N-13** (skip links) + **I18N-14** (mailto fallback) — LOW
