# Image Upload & Editable Brand/Avatar Plan

## Goal

Make the Navbar logo, Footer logo, and About avatar editable via admin panel with image upload. If an uploaded image exists in Firestore, render it. If not, fall back to the current CSS div with text initials.

---

## Current State

| Location | File | What renders | Editable? |
|----------|------|-------------|-----------|
| Navbar logo | `Navbar.tsx:121` | `<div>DC</div>` — hardcoded text | NO |
| Navbar brand name | `Navbar.tsx:123` | `Daniansyah` — hardcoded | NO |
| Footer logo | `Footer.tsx:30-31` | Gradient CSS div, no text | NO (decorative only) |
| Footer ownerName | `Footer.tsx:34` | `footerContent.ownerName` | YES |
| About avatar | `About.tsx:40-45` | CSS div with `avatarInitials` ("DC") | Initials text only |

## Target State

| Location | Image exists | No image (fallback) |
|----------|-------------|-------------------|
| Navbar logo | `<img src={logoUrl}>` 40x40 | `<div>DC</div>` (current style, initials from Firestore) |
| Navbar brand name | N/A (text only) | `navbarContent.brandName ?? 'Daniansyah'` |
| Footer logo | `<img src={logoUrl}>` 24x24 | `<div>DC</div>` matching navbar style (black/white text) |
| About avatar | `<img src={avatarUrl}>` fills the 256/320px box | Current CSS div with `avatarInitials` text |

Navbar and Footer share the **same logo image** (single source of truth in NavbarContent).

---

## Architecture Decisions

### Image storage: Firebase Storage (client-side upload)
- `firebase` package already includes `@firebase/storage` 0.14.3
- `storageBucket` env var already in `firebase.ts` config
- Upload via client-side Firebase SDK (admin is authenticated via Firebase Auth)
- Get download URL → save URL string to Firestore via existing server action
- Server actions use `{ merge: true }` — new optional fields are automatically persisted without code changes

### Why client-side upload, not server action?
- Server actions can't receive `File` objects (they serialize to FormData strings)
- Firebase Storage `uploadBytes` needs the file blob on the client
- The admin is already authenticated client-side via Firebase Auth
- Upload happens client-side → URL string passed to server action

### Logo sharing: single source of truth
- `logoUrl` stored in `NavbarContent` only
- Footer receives `logoUrl` via prop threading: layout → PublicShell → Footer
- No data duplication — one upload, both components use the same URL

---

## ~~Phase 1: Firebase Storage Setup~~ [DONE]

### Files
- `src/lib/firebase.ts` — added `storage` export via `getStorage(app)`
- `src/lib/upload.ts` — new file with `uploadImage(file, path)` and `deleteImage(path)`

### Changes

**firebase.ts:**
```ts
// Add:
import { getStorage, type FirebaseStorage } from 'firebase/storage';
export const storage: FirebaseStorage = getStorage(app);
```

**upload.ts (new):**
```ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function deleteImage(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}
```

### Storage paths
- Brand logo: `brand/logo.{ext}` (overwritten on each upload)
- About avatar: `brand/avatar.{ext}`

### Firebase Storage Rules (must be set in Firebase Console)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /brand/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## ~~Phase 2: Type Changes~~ [DONE]

### File
- `src/types/index.ts`

### Changes

**NavbarContent — add 3 optional fields:**
```ts
export interface NavbarContent {
  id: string;
  labels: { ... };  // unchanged
  logoUrl?: string;        // NEW — brand logo image URL
  brandInitials?: string;  // NEW — fallback text (default: "DC")
  brandName?: string;      // NEW — brand display name (default: "Daniansyah")
  updatedAt: string;
}
```

**AboutContent — add 1 optional field:**
```ts
export interface AboutContent {
  id: string;
  title: Bilingual;
  headline: Bilingual;
  desc: Bilingual;
  stats: { ... };    // unchanged
  avatarInitials: string;
  avatarUrl?: string;      // NEW — avatar image URL
  updatedAt: string;
}
```

### Why optional (`?`)?
- Existing Firestore documents don't have these fields
- Backwards compatible — components check `?.logoUrl` and fall back to CSS div
- No migration needed for existing data

---

## ~~Phase 3: Reusable ImageUpload Admin Component~~ [DONE]

### File
- `src/components/admin/ImageUpload.tsx` — new file

### Props
```ts
interface ImageUploadProps {
  currentUrl?: string;           // Current image URL from Firestore
  storagePath: string;           // Firebase Storage path (e.g. "brand/logo")
  onUpload: (url: string) => void;  // Called with new URL after upload
  onRemove: () => void;         // Called when image is removed
  label: string;                // Form label text
  previewSize?: string;         // Tailwind size class (default: "w-20 h-20")
}
```

### UI (Google Forms style, mobile-first)
```
┌─────────────────────────────────┐
│ [Label]                         │
│                                 │
│  ┌──────┐  Choose File          │
│  │ img  │  [Upload] [Remove]    │
│  │ prev │  or "No image"        │
│  └──────┘                       │
│                                 │
│  Uploading... (progress state)  │
│  Error message (error state)    │
└─────────────────────────────────┘
```

### States
- `idle` — shows preview (if url) or "No image" placeholder
- `selected` — file chosen, Upload button enabled
- `uploading` — progress indicator, buttons disabled
- `error` — error message with retry option

### File validation (client-side)
- Accept: `image/png, image/jpeg, image/webp`
- Max size: 2MB
- Shows error if validation fails

### Upload flow
1. User selects file → preview shown immediately (via `URL.createObjectURL`)
2. User clicks Upload → `uploadImage(file, storagePath)` called
3. On success → `onUpload(downloadUrl)` called → parent saves URL to form state
4. On remove → `onRemove()` called → parent clears URL from form state
5. Actual Firestore save happens when parent form is submitted (existing pattern)

---

## ~~Phase 4: Admin Form Updates~~ [DONE]

### File
- `src/app/[locale]/admin/site-content/page.tsx`

### NavbarForm changes
- Add `logoUrl` to form state (from `navbar?.logoUrl || ''`)
- Add `brandInitials` to form state (from `navbar?.brandInitials || ''`)
- Add `brandName` to form state (from `navbar?.brandName || ''`)
- Add `ImageUpload` component for brand logo
- Add text inputs for `brandInitials` and `brandName` with mobile labels
- Pass all new fields to `updateNavbarContent` in handleSubmit

### AboutForm changes
- Add `avatarUrl` to form state (from `about?.avatarUrl || ''`)
- Add `ImageUpload` component for avatar
- Pass `avatarUrl` to `updateAboutContent` in handleSubmit

### Form layout
ImageUpload appears at the top of each form section (most prominent field). On mobile, it's full-width. On desktop, it sits alongside other fields.

---

## ~~Phase 5: Server Action Updates~~ [DONE — NO CHANGES NEEDED]

### File
- `src/actions/siteContent.ts`

### Changes
- **No code changes needed.** The server actions use `Omit<NavbarContent, 'id' | 'updatedAt'>` and `{ merge: true }`. Since the new fields are optional in the type, they're automatically included in the omit type. When the form passes them, Firestore stores them. When they're empty strings, they're stored as empty strings (components check truthiness).

### Verification
- `updateNavbarContent` receives `{ labels, logoUrl, brandInitials, brandName }` → Firestore stores all
- `updateAboutContent` receives `{ title, headline, desc, stats, avatarInitials, avatarUrl }` → Firestore stores all

---

## ~~Phase 6: Component Rendering (Image with Fallback)~~ [DONE]

### Navbar.tsx

**Current (line 121):**
```tsx
<div className="w-10 h-10 bg-text-main text-background flex items-center justify-center font-black text-lg select-none">DC</div>
```

**New:**
```tsx
{navbarContent?.logoUrl ? (
  <img
    src={navbarContent.logoUrl}
    alt={navbarContent?.brandName ?? 'Daniansyah'}
    className="w-10 h-10 object-cover rounded-sm"
  />
) : (
  <div className="w-10 h-10 bg-text-main text-background flex items-center justify-center font-black text-lg select-none">
    {navbarContent?.brandInitials ?? 'DC'}
  </div>
)}
```

**Brand name (line 123):**
```tsx
// Current: <span>Daniansyah</span>
// New:
<span>{navbarContent?.brandName ?? 'Daniansyah'}</span>
```

### Footer.tsx

**Current (line 30-31):** Gradient CSS div with inner border.

**New:** Match navbar fallback style (black/white "DC" text), render image if available.

Footer receives `logoUrl` as a new prop (see PublicShell changes below).

```tsx
{logoUrl ? (
  <img src={logoUrl} alt="Logo" className="w-6 h-6 object-cover rounded-sm" />
) : (
  <div className="w-6 h-6 bg-text-main text-background flex items-center justify-center font-black text-[8px] select-none rounded-sm">
    DC
  </div>
)}
```

### PublicShell.tsx

**Current:** Passes `footerContent` and `locale` to Footer.

**New:** Also pass `logoUrl`:
```tsx
<Footer footerContent={footerContent} locale={locale} logoUrl={navbarContent?.logoUrl} />
```

### Footer.tsx interface

**Add prop:**
```ts
interface FooterProps {
  footerContent?: FooterContent | null;
  locale?: string;
  logoUrl?: string;  // NEW — from NavbarContent, shared brand logo
}
```

### About.tsx

**Current (line 40-45):** CSS div with gradient + avatarInitials text.

**New:** If `avatarUrl` exists, render image filling the same dimensions. Keep all existing CSS for hover effects and the offset border.

```tsx
<div className="w-64 h-64 md:w-80 md:h-80 bg-surface border border-border flex items-center justify-center text-6xl font-bold text-text-muted/10 tracking-tighter relative z-10 select-none overflow-hidden">
  {aboutContent?.avatarUrl ? (
    <img
      src={aboutContent.avatarUrl}
      alt={avatarInitials}
      className="absolute inset-0 w-full h-full object-cover"
    />
  ) : (
    <>
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-indigo-500/5" />
      <CodeText type="logic">{avatarInitials}</CodeText>
    </>
  )}
  <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/10 -translate-y-4 group-hover:translate-y-4 transition-transform duration-700" />
  <div className="absolute bottom-0 right-0 w-full h-[1px] bg-primary/10 translate-y-4 group-hover:-translate-y-4 transition-transform duration-700" />
</div>
```

The hover line effects stay on top of the image (they're absolute positioned with z above).

---

## Execution Order

| Order | Phase | Files | Depends on |
|-------|-------|-------|------------|
| 1 | Phase 1: Storage setup | firebase.ts, upload.ts (new) | None |
| 2 | Phase 2: Types | types/index.ts | None |
| 3 | Phase 3: ImageUpload component | ImageUpload.tsx (new) | Phase 1 |
| 4 | Phase 4: Admin forms | site-content/page.tsx | Phase 2, 3 |
| 5 | Phase 5: Server actions | siteContent.ts (verify) | Phase 2 |
| 6 | Phase 6: Component rendering | Navbar.tsx, Footer.tsx, PublicShell.tsx, About.tsx | Phase 2 |

Phases 1+2 can be done in parallel (no dependency). Phase 3 needs Phase 1. Phase 4 needs 2+3. Phase 6 needs Phase 2 only.

---

## Files Changed Summary

| File | Type | Change |
|------|------|--------|
| `src/lib/firebase.ts` | Edit | Add `storage` export |
| `src/lib/upload.ts` | New | `uploadImage()` + `deleteImage()` helpers |
| `src/types/index.ts` | Edit | Add optional fields to NavbarContent + AboutContent |
| `src/components/admin/ImageUpload.tsx` | New | Reusable image upload form component |
| `src/app/[locale]/admin/site-content/page.tsx` | Edit | Add ImageUpload + new text inputs to NavbarForm + AboutForm |
| `src/components/layout/Navbar.tsx` | Edit | Render logo image or fallback, render brandName or fallback |
| `src/components/layout/Footer.tsx` | Edit | New `logoUrl` prop, render logo image or "DC" fallback |
| `src/components/layout/PublicShell.tsx` | Edit | Thread `navbarContent?.logoUrl` to Footer |
| `src/components/sections/About.tsx` | Edit | Render avatar image or fallback initials div |

## Files NOT Changed

| File | Reason |
|------|--------|
| `src/actions/siteContent.ts` | `{ merge: true }` + Omit type automatically handles new optional fields |
| `src/lib/firestore.ts` | Query functions return full document data — new fields included automatically |
| Seed script | No migration needed — fields are optional with CSS fallback |

---

## Prerequisite: Firebase Storage Rules

Before testing, the Firebase Storage security rules must be configured in the Firebase Console:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /brand/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

This allows:
- Public read (images served to all visitors)
- Authenticated write (only logged-in admin can upload)
