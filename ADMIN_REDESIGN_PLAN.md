# Admin Panel Mobile-First Redesign Plan

## Principle

- **Desktop (lg+):** Keep current sidebar + table + 2-col form layout exactly as-is. Zero visual changes.
- **Mobile/Tablet (< lg):** Redesign to Google Forms-style — full-width, single-column, labeled inputs, card-based lists, generous touch targets.
- All changes use Tailwind responsive breakpoints (`lg:` prefix) so desktop code is untouched.
- No backend/API/action changes. Only UI layout and presentation.

---

## Current State Inventory

| File | Lines | Desktop Layout | Mobile Problem |
|------|-------|---------------|----------------|
| `admin/layout.tsx` | 55 | `flex` with sidebar + main | Sidebar takes 256px of 375px screen |
| `AdminSidebar.tsx` | 61 | Fixed `w-64` sidebar | No mobile nav pattern, sidebar overflows |
| `admin/page.tsx` | 77 | 4-col card grid | Grid already responsive (grid-cols-1 sm:2 lg:4) — minor fix |
| `admin/blogs/page.tsx` | 167 | 5-col table + 2-col form | Table overflows, form cramped |
| `admin/projects/page.tsx` | 157 | 4-col table + 2-col form | Same |
| `admin/experience/page.tsx` | 167 | 5-col table + 2-col form | Same |
| `admin/skills/page.tsx` | 158 | 4-col table + 2-col form | Same |
| `admin/site-content/page.tsx` | 565 | 6 stacked forms (72 inputs total) | Extremely long scroll, no section navigation |
| `admin/login/page.tsx` | 98 | Centered max-w-sm form | Already mobile-friendly. No change needed. |
| `admin/error.tsx` | 27 | Centered error + retry | Already mobile-friendly. No change needed. |
| `MarkdownEditor.tsx` | 106 | Split editor/preview | Split mode unusable on mobile |

---

## ~~Phase 1: Responsive Admin Shell~~ [DONE]

### Scope
- `src/app/[locale]/admin/layout.tsx`
- `src/components/admin/AdminSidebar.tsx`

### Current behavior
- `layout.tsx:41`: `<div className="flex min-h-screen">` → sidebar + main side by side always
- `AdminSidebar.tsx:24`: `<aside className="w-64">` → fixed 256px width always
- `layout.tsx:43`: `<main className="flex-1 p-8">` → main takes remaining width always

### Changes

**layout.tsx:**
- Desktop (lg+): Keep `flex` layout with sidebar + main side by side (unchanged visual)
- Mobile (< lg): No sidebar. Main takes full width. Add top header bar.
- Change: `<div className="flex min-h-screen">` → `<div className="lg:flex min-h-screen">`
- Change: `<main className="flex-1 p-8">` → `<main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">`
  - `pt-16` on mobile gives room for the fixed top header bar
  - `p-4` on mobile for tighter but comfortable padding

**AdminSidebar.tsx — complete responsive rewrite:**
- Desktop (lg+): Current sidebar layout (aside with w-64, nav links, logout). Hidden below lg. Use `hidden lg:flex lg:flex-col`.
- Mobile (< lg): Two components:
  1. **Fixed top header bar** (`fixed top-0 left-0 right-0 h-14 z-40 lg:hidden`): Shows "Admin Panel" title + hamburger button
  2. **Slide-over navigation** (full-screen overlay, toggled by hamburger): Shows all nav links as large touch-friendly items (py-4, text-base), plus logout at bottom. Closes on link click.
- State: `const [mobileMenuOpen, setMobileMenuOpen] = useState(false)`
- Close on route change: `useEffect` watching `pathname` to close menu
- Body scroll lock when menu open (same pattern as Navbar mobile overlay)

### Risks
- Focus trap needed on mobile slide-over (same pattern as Navbar.tsx:53-85)
- Must keep `<meta name="robots" content="noindex, nofollow" />` in layout
- AuthGuard logic unchanged — only the JSX shell changes

### Verification
- Desktop lg+: Visual must be identical to current
- Mobile 375px: Top header visible, hamburger works, slide-over shows all 6 nav links + logout
- Tablet 768px: Same as mobile (below lg breakpoint)

---

## ~~Phase 2: Dashboard Page~~ [DONE]

### Scope
- `src/app/[locale]/admin/page.tsx`

### Current behavior
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` — already responsive
- `h1 text-2xl mb-8` — page heading

### Changes
- Minor: Page heading size `text-2xl` → `text-xl lg:text-2xl` for mobile
- Minor: `mb-8` → `mb-6 lg:mb-8`
- Cards already stack on mobile. No structural change needed.

### Risks
- None. Minimal CSS tweaks.

---

## ~~Phase 3: List Pages (Blogs, Projects, Experience, Skills)~~ [DONE]

### Scope
- `src/app/[locale]/admin/blogs/page.tsx`
- `src/app/[locale]/admin/projects/page.tsx`
- `src/app/[locale]/admin/experience/page.tsx`
- `src/app/[locale]/admin/skills/page.tsx`

### Current behavior (all 4 pages follow same pattern)
- Page header: `flex items-center justify-between mb-8` with h1 + "Add" button
- Data list: `<table>` with 4-5 columns (Order, Title, Status/Slug/Company, Actions)
- Edit form: Appears above table as a card with `grid grid-cols-1 md:grid-cols-2` inputs

### Changes — Data list

**Desktop (lg+):** Keep `<table>` as-is. Wrap in `<div className="hidden lg:block">`.

**Mobile (< lg):** Add a card list `<div className="lg:hidden space-y-3">`. Each item is a card:
```
<div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
  <div className="flex justify-between items-start mb-2">
    <div>
      <div className="text-white font-medium text-sm">{title}</div>
      <div className="text-slate-400 text-xs mt-1">{subtitle info}</div>
    </div>
    <div className="flex items-center gap-1">
      <button aria-label="Edit">...</button>
      <button aria-label="Delete">...</button>
    </div>
  </div>
</div>
```

Card content per page:
- **Blogs:** Title (EN), Slug + Date as subtitle
- **Projects:** Name (EN), Status as badge
- **Experience:** Title (EN), Company + Period as subtitle
- **Skills:** Title (EN), skill names as comma-separated subtitle

### Changes — Page header
- `h1 text-2xl` → `text-xl lg:text-2xl`
- "Add" button: `px-4 py-2 text-sm` → `px-3 py-2 text-xs lg:px-4 lg:py-2 lg:text-sm`

### Changes — Edit/Create forms

**Desktop (lg+):** Keep `grid grid-cols-1 md:grid-cols-2` (unchanged).

**Mobile (< lg):** Forms already use `grid-cols-1` below `md`. Since `md` (768px) < `lg` (1024px), forms on tablet (768-1023px) show 2 columns which is fine. On phone (< 768px) they're already single column.

However, the inputs need improvements for mobile:
- Add visible `<label>` above each input (currently placeholder-only)
- Increase touch target: `py-2` → `py-2 lg:py-2` (keep same, min 40px already met with text-sm + py-2 + border = ~38px... borderline)
- Actually: inputs are `px-3 py-2 text-sm` = computed height ~38px. WCAG recommends 44px minimum for touch. Change to `py-2.5 lg:py-2` on mobile.

**Label pattern (applied to all form inputs):**
```
Before: <input placeholder="Name (EN)" ... />
After:
<div>
  <label className="block text-xs text-slate-400 mb-1 lg:hidden">Name (EN)</label>
  <input placeholder="Name (EN)" ... />
</div>
```
Labels visible on mobile only (`lg:hidden`) since desktop relies on placeholder + 2-col layout context.

### Changes — Blog form specifically
- MarkdownEditor is used for content field. On mobile, force `edit` mode instead of `split` (split is two 50% columns, unusable on phone). See Phase 6.

### Risks
- Must render BOTH table (desktop) and cards (mobile) — same data, two presentations. This means the data list JSX doubles, but the data source and state management stay identical.
- Form labels add DOM elements but are `lg:hidden` so no desktop impact.
- Delete confirmation uses `confirm()` which works on mobile but is not ideal. Keep as-is for now (not in scope).

### Verification per page
- Desktop lg+: Table visible, cards hidden. Form looks identical.
- Mobile 375px: Cards visible, table hidden. Form inputs are single-column with labels visible above each field. Inputs have adequate touch target height.

---

## ~~Phase 4: Site Content Page~~ [DONE]

### Scope
- `src/app/[locale]/admin/site-content/page.tsx`

### Current behavior
- 6 form sections stacked vertically: HeroForm, AboutForm, ContactForm, FooterForm, HireBannerForm, NavbarForm
- All visible simultaneously
- ContactForm alone has 18 input fields
- Total: 72 inputs visible on one page

### Changes

**Desktop (lg+):** Keep all forms visible stacked (unchanged).

**Mobile (< lg):** Wrap each form in a collapsible accordion section.
- Only one section open at a time
- Collapsed state shows: section name + indicator (chevron)
- State: `const [openSection, setOpenSection] = useState<string | null>(null)`
- Toggling a section closes the previously open one
- Wrap the accordion logic in a responsive check: on mobile use accordion, on desktop render all forms directly

**Accordion structure (mobile only):**
```
<div className="lg:hidden space-y-3">
  {sections.map(section => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <button onClick={toggle} className="w-full flex justify-between items-center p-4">
        <span className="font-bold text-white text-sm">{section.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4 pt-0 border-t border-slate-700">{section.form}</div>}
    </div>
  ))}
</div>
<div className="hidden lg:block space-y-8">
  {/* Desktop: all forms visible, unchanged */}
</div>
```

**Form inputs (same label pattern as Phase 3):**
- Add visible `<label>` above each input on mobile (`lg:hidden`)
- Inputs already `grid-cols-1` below `md`, which is good for mobile
- Save button: make full-width on mobile (`w-full lg:w-auto`)

### Section inventory (for accordion labels)
1. Hero Section (12 inputs)
2. About Section (14 inputs)
3. Contact Section (18 inputs)
4. Footer (3 inputs)
5. Hire Me Banner (8 inputs)
6. Navbar Labels (12 inputs)

### Risks
- Rendering forms in both accordion (mobile) and stacked (desktop) means each form component renders twice in the DOM. Alternative: use CSS to show/hide the accordion wrapper vs stacked wrapper, but the forms themselves render once and are placed inside the correct container. This requires refactoring the form components to be reusable.
- Better approach: Keep form components as-is. Render them ONCE. On mobile, wrap the container in accordion behavior. On desktop, render without accordion. Use a responsive wrapper component:
  ```
  // One render, responsive behavior
  <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
    <button onClick={toggle} className="w-full flex justify-between items-center p-4 lg:hidden">
      ...
    </button>
    <div className={`p-6 ${!isOpen && mobileView ? 'hidden' : ''} lg:block`}>
      <FormComponent />
    </div>
  </div>
  ```
  This way each form renders once, but its visibility is controlled by the accordion on mobile and always visible on desktop via `lg:block`.

### Verification
- Desktop lg+: All 6 forms visible stacked (identical to current)
- Mobile 375px: 6 accordion cards. Tap one → opens form, others close. Inputs single-column with labels.

---

## ~~Phase 5: MarkdownEditor Mobile Mode~~ [DONE]

### Scope
- `src/components/admin/MarkdownEditor.tsx`

### Current behavior
- 3 modes: edit, preview, split (default: split)
- Split mode: `grid grid-cols-2 divide-x` — two 50% columns
- Toolbar: horizontal row of 7 format buttons + 3 mode buttons

### Changes

**Desktop (lg+):** Keep split mode default and 2-column layout (unchanged).

**Mobile (< lg):**
- Default mode: `edit` instead of `split` (split is unusable on phone — two 50% columns at 375px = 187px each)
- Hide "Split" mode button on mobile (`lg:inline` or similar)
- Toolbar: wrap if needed. Current toolbar has 10 buttons in one row. At 375px this may overflow. Add `flex-wrap` to toolbar container.
- Editor textarea: already full-width. No change needed.
- Preview: already full-width when in preview-only mode. No change needed.

**Implementation:**
- Default mode: `useState<'edit' | 'preview' | 'split'>(() => window.innerWidth >= 1024 ? 'split' : 'edit')`
  - BUT `window` is not available during SSR. Since MarkdownEditor is only used in admin (client component), use a mounted check:
  ```
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');
  useEffect(() => {
    if (window.innerWidth >= 1024) setMode('split');
  }, []);
  ```
- Split mode button: `<button className="hidden lg:inline-flex ...">Split</button>`
- Split grid: already uses `grid-cols-2` which only activates when mode is 'split'. Since mobile won't enter split mode (button hidden), this is fine.
- Toolbar: add `flex-wrap gap-1` to allow wrapping on narrow screens.

### Risks
- The `useEffect` default mode means there's a brief flash on desktop where it shows 'edit' then switches to 'split'. This is acceptable since admin pages aren't SSR-critical.
- The toolbar buttons are small (p-1.5 = ~28px). On mobile touch, this is below the 44px recommendation. Increase to `p-2 lg:p-1.5` for better touch targets.

### Verification
- Desktop lg+: Opens in split mode. Split button visible. Toolbar single row.
- Mobile 375px: Opens in edit mode. Split button hidden. Toolbar wraps if needed. Edit/Preview toggle works.

---

## Files NOT Changed

| File | Reason |
|------|--------|
| `admin/login/page.tsx` | Already mobile-friendly (centered, max-w-sm, single column) |
| `admin/error.tsx` | Already mobile-friendly (centered, flex-col) |
| All server actions (`src/actions/*`) | UI-only redesign, no backend changes |
| All API routes (`src/app/api/admin/*`) | UI-only redesign, no backend changes |
| Types (`src/types/index.ts`) | No data model changes |

---

## Execution Order

| Order | Phase | Files | Complexity | Depends on |
|-------|-------|-------|------------|------------|
| 1 | Phase 1: Admin shell | layout.tsx, AdminSidebar.tsx | HIGH — full sidebar rewrite for mobile | None |
| 2 | Phase 5: MarkdownEditor | MarkdownEditor.tsx | LOW — default mode + toolbar wrap | None |
| 3 | Phase 2: Dashboard | admin/page.tsx | LOW — minor CSS tweaks | Phase 1 |
| 4 | Phase 3a: Blogs list | admin/blogs/page.tsx | MEDIUM — card list + form labels | Phase 1 |
| 5 | Phase 3b: Projects list | admin/projects/page.tsx | MEDIUM — same pattern as 3a | Phase 1 |
| 6 | Phase 3c: Experience list | admin/experience/page.tsx | MEDIUM — same pattern as 3a | Phase 1 |
| 7 | Phase 3d: Skills list | admin/skills/page.tsx | MEDIUM — same pattern as 3a | Phase 1 |
| 8 | Phase 4: Site Content | admin/site-content/page.tsx | HIGH — accordion + 6 forms + labels | Phase 1 |

Phase 1 must be done first — it enables all mobile layouts. Phases 2-5 can be done in any order after Phase 1. Phase 5 (MarkdownEditor) has no dependency on Phase 1 and can be done in parallel.

---

## Testing Checklist

After all phases:

- [ ] Desktop 1440px: Every admin page looks identical to current design
- [ ] Desktop 1024px (lg breakpoint): Sidebar visible, tables visible, 2-col forms
- [ ] Tablet 768px (md breakpoint): Mobile layout, cards visible, single-col forms, accordion
- [ ] Phone 375px: Full mobile layout, all touch targets >= 40px, no horizontal overflow
- [ ] Mobile menu: Hamburger opens slide-over, all 6 links + logout accessible
- [ ] Mobile menu: Closes on link tap, closes on backdrop tap
- [ ] Accordion (site-content): Opens/closes sections, only one open at a time
- [ ] MarkdownEditor: Edit mode default on mobile, split on desktop
- [ ] All forms: Submit works, error/success feedback visible
- [ ] TypeScript: Zero errors
- [ ] Existing tests: All pass
