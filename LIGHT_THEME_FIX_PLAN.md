# Light Theme Fix Plan

## Problem
The site was built dark-first. Many components use hardcoded dark-only colors (`text-white`, `bg-white/X`, `border-white/X`, `bg-cyan-950/X`) that break on light backgrounds. All should use theme-aware classes.

## Fix patterns

| Dark-only pattern | Theme-safe replacement | Reason |
|-------------------|----------------------|--------|
| `text-white` | `text-text-main` | Switches per theme |
| `hover:text-white` | `hover:text-text-main` | Switches per theme |
| `bg-white/5` or `bg-white/10` | `bg-border/10` or `bg-border/20` | Subtle fill that works on both |
| `border-white/5` | `border-border/40` | Visible on both backgrounds |
| `bg-cyan-950/XX` | `bg-cyan-500/10` or `bg-cyan-500/15` | Light tint works on both |
| `bg-indigo-950/XX` | `bg-indigo-500/10` | Light tint works on both |
| `bg-[#0f1115]` | `bg-background` | Theme variable |
| `text-white` (in overlay) | `text-text-main` | Follows theme |

---

## ~~Phase 1: Hero.tsx~~ [DONE]

| Line | Current | Fix |
|------|---------|-----|
| 91 | `className="relative text-white"` | `className="relative text-text-main"` |

---

## ~~Phase 2: Navbar.tsx~~ [DONE]

| Line | Current | Fix |
|------|---------|-----|
| 113 | `border-white/5 bg-background/30` | `border-border/20 bg-background/30` |
| 179 | `border-r border-white/5` | `border-r border-border/40` |
| 183 | `hover:bg-white/5` | `hover:bg-border/10` |
| 193 | `hover:bg-white/5` | `hover:bg-border/10` |
| 202 | `hover:bg-white/5` | `hover:bg-border/10` |
| 238 | `hover:bg-white/5 ... border border-white/5` | `hover:bg-border/10 ... border border-border/40` |
| 259 | `bg-[#0f1115] text-white` | `bg-background text-text-main` |
| 268 | `text-white` | `text-text-main` |
| 273 | `text-white/60` (inactive code btn) | `text-text-muted` |
| 280 | `text-white/60 hover:text-white` | `text-text-muted hover:text-text-main` |
| 287 | `text-white/60 hover:text-white` | `text-text-muted hover:text-text-main` |
| 293 | `text-white hover:bg-white/5 ... border-white/5` | `text-text-main hover:bg-border/10 ... border-border/40` |
| 311 | `text-white group-hover:text-cyan-400` | `text-text-main group-hover:text-cyan-400` |

---

## ~~Phase 3: Experience.tsx~~ [DONE]

| Line | Current | Fix |
|------|---------|-----|
| 63 | `bg-cyan-950/20 border border-cyan-500/30` | `bg-cyan-500/10 border border-cyan-500/30` |
| 90 | `border-l border-white/5` | `border-l border-border/30` |

---

## ~~Phase 4: Contact.tsx~~ [DONE]

| Line | Current | Fix |
|------|---------|-----|
| 61 | `border-l-2 border-white/5` | `border-l-2 border-border/30` |
| 90 | `bg-cyan-950/30` | `bg-cyan-500/10` |
| 112 | `focus:bg-cyan-950/10` | `focus:bg-cyan-500/5` |
| 127 | `focus:bg-cyan-950/10` | `focus:bg-cyan-500/5` |
| 151 | `bg-white/5 ... border border-white/5` | `bg-border/10 ... border border-border/30` |
| 152 | `bg-white/10` | `bg-border/20` |
| 176 | `bg-white/5` | `bg-border/10` |
| 194 | `hover:bg-cyan-950/10` | `hover:bg-cyan-500/5` |
| 198 | `group-hover/social:bg-cyan-950/20` | `group-hover/social:bg-cyan-500/10` |

---

## ~~Phase 5: Projects.tsx + ProjectListPage.tsx~~ [DONE]

**Projects.tsx:**
| Line | Current | Fix |
|------|---------|-----|
| 70 | `bg-cyan-950/60` | `bg-cyan-500/15` |

**ProjectListPage.tsx:**
| Line | Current | Fix |
|------|---------|-----|
| 67 | `bg-cyan-950/60` | `bg-cyan-500/15` |

---

## ~~Phase 6: BlogDetailsPage.tsx + BlogListPage.tsx + ProjectListPage.tsx~~ [DONE]

**BlogDetailsPage.tsx:**
| Line | Current | Fix |
|------|---------|-----|
| 33 | `hover:text-white` | `hover:text-text-main` |
| 43 | `bg-cyan-950/20` | `bg-cyan-500/10` |
| 46 | `bg-indigo-950/20` | `bg-indigo-500/10` |

**BlogListPage.tsx:**
| Line | Current | Fix |
|------|---------|-----|
| 31 | `hover:text-white` | `hover:text-text-main` |

**ProjectListPage.tsx (also):**
| Line | Current | Fix |
|------|---------|-----|
| 32 | `hover:text-white` | `hover:text-text-main` |

---

## ~~Phase 7: HireMeBanner.tsx~~ [DONE]

| Line | Current | Fix |
|------|---------|-----|
| 56 | `rgba(0,0,0,0.25)` in scanline | `rgba(0,0,0,0.1)` — lighter so it's subtle on both themes |

---

## ~~Phase 8: ScrollToTop.tsx~~ [DONE]

| Line | Current | Fix |
|------|---------|-----|
| 118-121 | `border-white/20` (4 brackets) | `border-border/40` |

---

## Files Summary

| File | Changes |
|------|---------|
| Hero.tsx | 1 |
| Navbar.tsx | 13 |
| Experience.tsx | 2 |
| Contact.tsx | 9 |
| Projects.tsx | 1 |
| ProjectListPage.tsx | 2 |
| BlogDetailsPage.tsx | 3 |
| BlogListPage.tsx | 1 |
| HireMeBanner.tsx | 1 |
| ScrollToTop.tsx | 4 |
| **Total** | **37 fixes across 10 files** |

## Execution Order

All phases are independent — they can be done in any order. Grouped by file for efficiency.

## Verification

After all fixes:
- Toggle to light mode via the theme button
- Every section should have readable text on white/light-gray backgrounds
- No white-on-white text
- No dark smudge badges
- No invisible borders
- Accent colors (cyan, indigo) should still pop on both themes
- Mobile nav overlay should use light background in light mode
