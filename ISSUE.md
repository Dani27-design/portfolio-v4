# ISSUE-001 [DONE]

## Problem
Contact form has no sender email field — the portfolio owner cannot reply to inquiries.

## Severity
High

## Category
UX

## Location
`src/components/sections/Contact.tsx` (lines 33–74), `src/app/api/contact/route.ts` (lines 41–44, 81–85)

## Root Cause
The contact form only collects `subject` and `message`. There is no field for the sender's email address. The email is sent from `SMTP_USER` to `SMTP_USER` with no reply-to address. The server-side validation schema (`contactSchema`) also only validates `subject` and `message`.

## Proof
```tsx
// src/components/sections/Contact.tsx:33-34
const [title, setTitle] = useState("");
const [message, setMessage] = useState("");
// No email state variable exists
```

```ts
// src/app/api/contact/route.ts:41-44
const contactSchema = z.object({
  subject: z.string().min(1).max(500),
  message: z.string().min(1).max(10000),
  // No email field
});
```

```ts
// src/app/api/contact/route.ts:81-85
await transporter.sendMail({
  from: smtpUser,
  to: smtpUser,  // Sends to self
  subject: `[Portfolio Contact] ${subject}`,
  text: `Subject: ${subject}\n\nMessage:\n${message}`,
  // No replyTo field
});
```

## Impact
- **User impact**: Visitors who send a contact message have no way to receive a reply. The entire contact form is functionally one-way, making it useless for business inquiries.
- **Business impact**: Lost leads — potential clients/employers cannot be contacted back. The primary conversion mechanism of the portfolio is broken.

## Fix Solution
1. Add an `email` input field to the contact form in `Contact.tsx`.
2. Add `email: z.string().email().max(500)` to `contactSchema` in `route.ts`.
3. Add `replyTo: email` to the `sendMail` options so the portfolio owner can reply directly.
4. Include the sender's email in the email body as well.

## Fix Priority
P0

## Estimated Effort
S

## Verification Method
1. Submit a contact form with a valid email.
2. Verify the received email has a `Reply-To` header set to the sender's email.
3. Click reply in the email client and verify it addresses the sender.

---

# ISSUE-002 [DONE]

## Problem
Missing Firebase Storage security rules — uploaded files may be publicly writable.

## Severity
High

## Category
Security

## Location
Project root (missing `storage.rules` file), `firebase.json`, `src/lib/upload.ts`

## Root Cause
The project configures Firestore security rules (`firestore.rules`) but has no Firebase Storage security rules file. Uploads go directly from the client browser to Firebase Storage via the client SDK (`src/lib/upload.ts`), bypassing the server entirely. Without explicit storage rules, Firebase Storage may be using default rules that allow any authenticated user (or anyone) to read/write.

## Proof
```bash
# No storage.rules file exists in the project
$ find . -name "storage.rules" -not -path "*/node_modules/*"
# (no results)
```

```json
// firebase.json — only Firestore rules configured, no Storage rules
{
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

```ts
// src/lib/upload.ts:199-206 — uploads directly from client to Storage
export async function uploadImage(file: File, path: string): Promise<string> {
  const optimized = await compressImage(file);
  const ext = optimized.name.split('.').pop() || 'webp';
  const safePath = sanitizePath(path);
  const storageRef = ref(storage, `${safePath}.${ext}`);
  const snapshot = await uploadBytes(storageRef, optimized);
  return getDownloadURL(snapshot.ref);
}
```

## Impact
- **Security impact**: Without storage rules, anyone with the Firebase config (which is public via `NEXT_PUBLIC_` env vars) could upload arbitrary files to the storage bucket, potentially using it as free file hosting or uploading malicious content.
- **Business impact**: Storage costs could spike from unauthorized uploads.

## Fix Solution
1. Create a `storage.rules` file that restricts writes to the admin email:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.email == 'daniansyahchusyaidin@gmail.com';
    }
  }
}
```
2. Add `"storage": { "rules": "storage.rules" }` to `firebase.json`.
3. Deploy the rules via `firebase deploy --only storage`.

## Fix Priority
P0

## Estimated Effort
S

## Verification Method
1. Deploy storage rules.
2. Attempt to upload a file without authentication — should be rejected.
3. Attempt to upload with a non-admin account — should be rejected.
4. Upload with the admin account — should succeed.

---

# ISSUE-003 [DONE]

## Problem
Project slug uniqueness is not enforced on creation, unlike blogs.

## Severity
High

## Category
Backend

## Location
`src/actions/projects.ts` (lines 8–23), compare with `src/actions/blogs.ts` (lines 8–24)

## Root Cause
`createBlog` checks for duplicate slugs before inserting, but `createProject` does not. Two projects with the same slug can be created, causing routing conflicts where `getProjectBySlug` returns the first match arbitrarily.

## Proof
```ts
// src/actions/blogs.ts:12-13 — HAS slug uniqueness check
const existing = await adminDb.collection('blogs').where('slug', '==', validated.slug).limit(1).get();
if (!existing.empty) throw new Error(`Blog with slug "${validated.slug}" already exists`);
```

```ts
// src/actions/projects.ts:8-23 — MISSING slug uniqueness check
export async function createProject(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(projectCreateSchema, data);
  const now = new Date().toISOString();
  const ref = await adminDb.collection('projects').add({
    ...validated,
    createdAt: now,
    updatedAt: now,
  });
  // No slug uniqueness check before add
```

## Impact
- **User impact**: Duplicate project slugs cause `/projects/[slug]` to show unpredictable content — whichever Firestore returns first.
- **SEO impact**: Duplicate URLs with different content confuse crawlers.

## Fix Solution
Add the same slug uniqueness check from `createBlog` to `createProject`:
```ts
const existing = await adminDb.collection('projects').where('slug', '==', validated.slug).limit(1).get();
if (!existing.empty) throw new Error(`Project with slug "${validated.slug}" already exists`);
```

Also add the same check to `updateProject` (as done in `updateBlog`).

## Fix Priority
P1

## Estimated Effort
XS

## Verification Method
1. Create a project with slug `test-project`.
2. Attempt to create another project with the same slug — should throw an error.
3. Verify `/projects/test-project` shows the correct project.

---

# ISSUE-004 [DONE]

## Problem
In-memory rate limiting is ineffective on serverless (Vercel).

## Severity
High

## Category
Security

## Location
`src/app/api/contact/route.ts` (lines 6–20), `src/app/api/leaderboard/route.ts` (lines 10–48)

## Root Cause
Both rate limiters use `new Map<string, number[]>()` stored in module-level variables. On Vercel's serverless architecture, each function invocation can run in a separate isolate with its own memory. Cold starts reset the map entirely. Even in warm instances, concurrent invocations may use different isolates with separate maps.

## Proof
```ts
// src/app/api/contact/route.ts:7-8
const RATE_LIMIT = { max: 5, windowMs: 60_000 };
const ipHits = new Map<string, number[]>();  // Resets on every cold start
```

```ts
// src/app/api/leaderboard/route.ts:13
const ipHits = new Map<string, number[]>();  // Same issue
```

The leaderboard route even acknowledges this:
```ts
// src/app/api/leaderboard/route.ts:9
// --- In-memory IP rate limiter (resets on cold start, effective within warm instance) ---
```

## Impact
- **Security impact**: An attacker can bypass rate limits by waiting for cold starts or exploiting concurrent isolates. The contact form could be used for email flooding (5 emails/min claim but actually unlimited across cold starts). The leaderboard could be spammed.
- **Performance impact**: No real protection against abuse.

## Fix Solution
Replace in-memory rate limiting with a persistent solution:
1. **Option A (simple)**: Use Vercel's built-in rate limiting via `vercel.json` configuration.
2. **Option B**: Use Firestore or Redis (Upstash) for rate limit state that persists across invocations.
3. **Option C**: Use Vercel KV/Edge Config for rate limit counters.

## Fix Priority
P1

## Estimated Effort
M

## Verification Method
1. Send 6+ requests within 1 minute.
2. Cold-restart the function (redeploy or wait).
3. Verify rate limiting still enforces the limit across restarts.

---

# ISSUE-005 [DONE]

## Problem
Admin layout renders `<head>` tag inside a client component, bypassing Next.js metadata API.

## Severity
Medium

## Category
Frontend

## Location
`src/app/[locale]/admin/layout.tsx` (line 51)

## Root Cause
The admin layout is a `'use client'` component that renders `<head><meta name="robots" content="noindex, nofollow" /></head>` directly. In Next.js App Router, metadata should be exported from server components using the `metadata` export or `generateMetadata`. A `<head>` tag inside a client component is rendered into the body and relies on React's hoisting behavior, which is not guaranteed in all scenarios.

## Proof
```tsx
// src/app/[locale]/admin/layout.tsx:1,48-55
'use client';
// ...
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <head><meta name="robots" content="noindex, nofollow" /></head>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
```

## Impact
- **SEO impact**: The `noindex, nofollow` meta tag may not be reliably rendered in the `<head>` of the HTML document, potentially allowing search engines to index admin pages.
- The `robots.ts` file does disallow `/*/admin/` which provides a secondary defense.

## Fix Solution
Since the admin layout must be a client component (for auth guard), extract the metadata to a separate server-side mechanism:
1. Create a `metadata` export in a server component wrapper, or
2. Use the existing `robots.ts` disallow as the primary mechanism (already in place), or
3. Move the meta tag to a Next.js `<Head>` component from `next/head` which properly hoists.

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. View source of an admin page.
2. Verify the `<meta name="robots" content="noindex, nofollow">` tag appears in the `<head>` section of the HTML.

---

# ISSUE-006 [DEFERRED]

## Problem
CSP `script-src` uses `'unsafe-inline'`, weakening XSS protection.

## Severity
Medium

## Category
Security

## Location
`next.config.ts` (line 14)

## Root Cause
The Content-Security-Policy header includes `"script-src 'self' 'unsafe-inline'"`. This allows inline scripts to execute, which is a common XSS vector. The `unsafe-inline` directive was likely added to support the inline theme detection script in the layout.

## Proof
```ts
// next.config.ts:13-14
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",  // <-- allows inline scripts
    // ...
  ].join('; '),
},
```

```tsx
// src/app/[locale]/layout.tsx:77-79 — the inline script that requires unsafe-inline
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){var t=localStorage.getItem('theme');...})()`,
  }}
/>
```

## Impact
- **Security impact**: If an attacker finds an injection point (e.g., via Firestore data rendered without sanitization), `unsafe-inline` allows injected `<script>` tags to execute. A nonce-based CSP would block this.

## Fix Solution
Replace `'unsafe-inline'` with a nonce-based approach:
1. Generate a nonce per request in the middleware/proxy.
2. Add the nonce to the CSP header: `script-src 'self' 'nonce-{random}'`.
3. Add the `nonce` attribute to the inline theme script.
4. Next.js supports `nonce` via the `headers` config or middleware.

## Fix Priority
P2

## Estimated Effort
M

## Verification Method
1. Remove `'unsafe-inline'` from CSP.
2. Verify the theme script still works with the nonce.
3. Inject an inline `<script>alert(1)</script>` into a test page and verify it is blocked by CSP.

---

# ISSUE-007 [DEFERRED]

## Problem
Leaderboard entries can be overwritten by anyone using the same player name.

## Severity
Medium

## Category
Security

## Location
`src/app/api/leaderboard/route.ts` (lines 107–127)

## Root Cause
When a POST request is made to the leaderboard with a `name` that already exists, the existing entry is updated if the new score is higher. There is no authentication — any visitor can submit a score under any name. This means anyone can overwrite someone else's high score by submitting a higher score with their name.

## Proof
```ts
// src/app/api/leaderboard/route.ts:107-127
const existing = await adminDb.collection('leaderboard')
  .where('name', '==', name)
  .limit(1)
  .get();

if (!existing.empty) {
  const doc = existing.docs[0];
  const existingScore = doc.data().score as number;

  if (score > existingScore) {
    // Update with higher score — anyone can do this
    await doc.ref.update({
      score,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id: doc.id, updated: true });
  }
```

## Impact
- **User impact**: A malicious user can overwrite legitimate players' scores by submitting higher scores under their names. Conversely, a player's name is "reserved" after first use — no one else can use that name at a lower score.
- **UX impact**: Trust in the leaderboard is undermined.

## Fix Solution
1. Use a unique session identifier (stored in localStorage) in addition to the display name, so only the original player can update their score.
2. Alternatively, tie leaderboard entries to a hash of IP + browser fingerprint to prevent impersonation.
3. At minimum, add a simple token system where the first submission returns a secret token that must be provided for updates.

## Fix Priority
P2

## Estimated Effort
M

## Verification Method
1. Submit a score as "PLAYER1".
2. From a different browser, submit a higher score as "PLAYER1" — should be rejected or create a separate entry.

---

# ISSUE-008 [DONE]

## Problem
Delete operations do not clean up associated files in Firebase Storage.

## Severity
Medium

## Category
Backend

## Location
`src/actions/projects.ts` (lines 40–49), `src/actions/blogs.ts` (lines 50–65)

## Root Cause
When a project or blog is deleted, the Firestore document is removed but any associated files in Firebase Storage (cover images, media files) are left orphaned. Over time, this accumulates unused files that consume storage and cost money.

## Proof
```ts
// src/actions/projects.ts:40-49
export async function deleteProject(id: string) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  await adminDb.collection('projects').doc(id).delete();
  // No cleanup of project.media[].storagePath or project.image
  revalidatePath('/en/projects');
  // ...
}
```

```ts
// src/actions/blogs.ts:50-65
export async function deleteBlog(id: string) {
  // ...
  const doc = await adminDb.collection('blogs').doc(id).get();
  const slug = doc.exists ? (doc.data()?.slug as string) : null;
  await adminDb.collection('blogs').doc(id).delete();
  // Reads slug for revalidation but does NOT read/delete coverStoragePath
}
```

The `deleteImage` function exists in `src/lib/upload.ts:220-228` but is never called during delete operations.

## Impact
- **Business impact**: Orphaned files accumulate, increasing Firebase Storage costs over time.
- **Maintainability impact**: No way to know which storage files are still referenced.

## Fix Solution
Before deleting a document, read its storage paths and delete them:
```ts
export async function deleteProject(id: string) {
  // ... auth checks ...
  const doc = await adminDb.collection('projects').doc(id).get();
  if (doc.exists) {
    const data = doc.data();
    // Delete media files from storage
    if (data?.media) {
      for (const item of data.media) {
        if (item.storagePath) await deleteStorageFile(item.storagePath);
      }
    }
  }
  await adminDb.collection('projects').doc(id).delete();
}
```

Note: Storage deletion must use the admin SDK server-side, not the client SDK `deleteImage`.

## Fix Priority
P2

## Estimated Effort
S

## Verification Method
1. Create a project with media uploads.
2. Delete the project.
3. Verify the associated files are no longer in Firebase Storage.

---

# ISSUE-009 [DONE]

## Problem
Contact form fields lack `required` attribute and `aria-required` for accessibility.

## Severity
Medium

## Category
Accessibility

## Location
`src/components/sections/Contact.tsx` (lines 143–165)

## Root Cause
The contact form's message field is functionally required (the `handleSend` function checks `if (!body.trim()) return;`), but neither the `<input>` nor the `<textarea>` have `required` or `aria-required="true"` attributes. Screen reader users have no indication which fields are mandatory.

## Proof
```tsx
// src/components/sections/Contact.tsx:143-149
<input
  id="contact-title"
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder={placeholderTitle}
  className="..."
  // No required, no aria-required
/>
```

```tsx
// src/components/sections/Contact.tsx:157-165
<textarea
  id="contact-message"
  rows={6}
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder={placeholderPayload}
  enterKeyHint="send"
  className="..."
  // No required, no aria-required
/>
```

## Impact
- **Accessibility impact**: Violates WCAG 2.2 SC 3.3.2 (Labels or Instructions) — users are not informed which fields are required.
- **User impact**: Users may submit a form without filling required fields and get no feedback (the form silently does nothing if message is empty).

## Fix Solution
1. Add `required` and `aria-required="true"` to the message textarea (and title input if it should be required).
2. Add visible required indicators (e.g., asterisk) next to labels.
3. Show a validation error message when the user tries to submit without filling required fields.

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. Navigate to the contact form with a screen reader.
2. Verify the screen reader announces which fields are required.
3. Try to submit without filling in the message — verify a clear error message appears.

---

# ISSUE-010 [DONE]

## Problem
Form submission status messages are not in an `aria-live` region.

## Severity
Medium

## Category
Accessibility

## Location
`src/components/sections/Contact.tsx` (lines 178–184)

## Root Cause
After form submission, status messages ("Message sent successfully!", error messages, rate limit messages) appear visually but are not announced to screen readers because they are not wrapped in an `aria-live` region.

## Proof
```tsx
// src/components/sections/Contact.tsx:178-184
{sendStatus !== 'idle' && (
  <div className={`text-center text-xs font-mono mt-3 ${sendStatus === 'sent' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
    {sendStatus === 'sent' && t('sent')}
    {sendStatus === 'error' && t('sendError')}
    {sendStatus === 'rateLimited' && t('rateLimited')}
  </div>
)}
// No aria-live, no role="alert" or role="status"
```

## Impact
- **Accessibility impact**: Violates WCAG 2.2 SC 4.1.3 (Status Messages). Screen reader users do not know whether their form submission succeeded or failed.

## Fix Solution
Wrap the status message area in a persistent `aria-live` region:
```tsx
<div aria-live="polite" aria-atomic="true" className="text-center text-xs font-mono mt-3">
  {sendStatus === 'sent' && <span className="text-emerald-600">{t('sent')}</span>}
  {sendStatus === 'error' && <span role="alert" className="text-red-500">{t('sendError')}</span>}
  {sendStatus === 'rateLimited' && <span role="alert" className="text-red-500">{t('rateLimited')}</span>}
</div>
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. Submit the contact form with a screen reader active.
2. Verify the success/error message is announced.

---

# ISSUE-011 [DONE]

## Problem
TypewriterText animation does not respect `prefers-reduced-motion`.

## Severity
Medium

## Category
Accessibility

## Location
`src/components/sections/Hero.tsx` (lines 14–59)

## Root Cause
The `TypewriterText` component uses a JavaScript-driven typing animation with `setTimeout` loops that run continuously. It does not check or respect the `prefers-reduced-motion` media query. Users who have requested reduced motion will still see constant text typing/deleting animation.

## Proof
```tsx
// src/components/sections/Hero.tsx:14-59
const TypewriterText = ({ phrases }: { phrases: string[] }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex % phrases.length];
    const timeout = setTimeout(() => {
      // Continuous typing/deleting animation
      // No prefers-reduced-motion check
    }, typingSpeed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, typingSpeed, phrases]);
```

Compare with the `Reveal` component which correctly checks:
```tsx
// src/components/ui/Reveal.tsx:23
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  return; // Content stays visible, no animation
}
```

## Impact
- **Accessibility impact**: Violates WCAG 2.2 SC 2.3.3 (Animation from Interactions). Users with vestibular disorders or motion sensitivities are subjected to continuous animation they cannot disable.

## Fix Solution
Check `prefers-reduced-motion` and show a static phrase instead:
```tsx
useEffect(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setText(phrases[0]); // Show first phrase statically
    return;
  }
  // ... existing animation logic
}, [...]);
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. Enable "Reduce motion" in OS accessibility settings.
2. Load the homepage.
3. Verify the typewriter text shows a static phrase without animation.

---

# ISSUE-012 [DONE]

## Problem
Blog date field has no format validation, causing unreliable structured data.

## Severity
Medium

## Category
SEO

## Location
`src/lib/validation.ts` (line 46), `src/app/[locale]/blog/[slug]/page.tsx` (lines 66–67)

## Root Cause
The blog `date` field is validated only as `z.string().min(1).max(50)` — any string up to 50 characters is accepted. This date is used directly in BlogPosting JSON-LD structured data as `datePublished` and `dateModified`, which Google requires in ISO 8601 format.

## Proof
```ts
// src/lib/validation.ts:46
date: z.string().min(1).max(50),  // No format validation
```

```ts
// src/app/[locale]/blog/[slug]/page.tsx:66-67
const blogPostingJsonLd = {
  // ...
  datePublished: blog.date,          // Could be "January 2025" or any string
  dateModified: blog.updatedAt || blog.date,  // updatedAt is ISO, date might not be
};
```

## Impact
- **SEO impact**: Invalid `datePublished` in JSON-LD causes Google to reject the structured data, losing rich snippet eligibility (article date in search results).
- **Data integrity**: No guarantee of consistent date formats across blog entries.

## Fix Solution
1. Add date format validation in the schema:
```ts
date: z.string().min(1).max(50).regex(/^\d{4}-\d{2}-\d{2}/, 'Date must be in ISO 8601 format (YYYY-MM-DD)'),
```
2. Alternatively, use `z.coerce.date()` for strict date parsing.

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. Attempt to create a blog with `date: "last tuesday"` — should be rejected.
2. Create a blog with `date: "2025-05-17"` — should succeed.
3. Validate the page's JSON-LD using Google's Rich Results Test.

---

# ISSUE-013 [DONE]

## Problem
Blog list page shows English card content but blog detail redirects to Indonesian only.

## Severity
Medium

## Category
UX

## Location
`src/components/sections/Blog.tsx`, `src/app/[locale]/blog/[slug]/page.tsx` (lines 47–49)

## Root Cause
Blog titles and excerpts are bilingual (`Bilingual` type), so blog cards on the English site display in English. However, blog content is single-language (Indonesian only). When an English user clicks a blog card, they are redirected from `/en/blog/[slug]` to `/id/blog/[slug]`, switching their entire locale context.

## Proof
```ts
// src/types/index.ts:32-43 — Blog has bilingual title/excerpt but single content
export interface Blog {
  title: Bilingual;    // Available in en + id
  excerpt: Bilingual;  // Available in en + id
  content: string;     // Single language (Indonesian)
  // ...
}
```

```tsx
// src/app/[locale]/blog/[slug]/page.tsx:47-49
// Blog content is Indonesian only — redirect non-id locales
if (locale !== 'id') {
  redirect(`/id/blog/${slug}`);
}
```

```tsx
// src/components/sections/Blog.tsx:44-49 — Blog cards use bilingual title
<h3>{blog.title[loc]}</h3>
<p>{blog.excerpt[loc]}</p>
// User sees English content, clicks, gets redirected to Indonesian page
```

## Impact
- **UX impact**: English users click an English-titled blog card and are unexpectedly redirected to an Indonesian page. This is confusing and creates a jarring language switch.
- **SEO impact**: The redirect creates a cross-language redirect chain.

## Fix Solution
1. On the English blog list page, indicate that blog content is in Indonesian (e.g., add a language badge "ID" on each card).
2. Set the blog card link to `/id/blog/[slug]` directly when `locale === 'en'` to avoid the redirect.
3. Long-term: make blog content bilingual like other content.

## Fix Priority
P2

## Estimated Effort
S

## Verification Method
1. Visit `/en` and navigate to the blog section.
2. Verify blog cards indicate the content language.
3. Click a blog card — verify no unexpected redirect occurs (or that the user is informed).

---

# ISSUE-014 [DONE]

## Problem
Admin email is hardcoded in source code instead of using an environment variable.

## Severity
Medium

## Category
Security

## Location
`src/lib/constants.ts` (line 1), `firestore.rules` (lines 10, 16, 22, 28, 34)

## Root Cause
The admin email address is hardcoded in both TypeScript source code and Firestore security rules. If the admin email changes, both the application code and Firebase rules must be updated and redeployed separately.

## Proof
```ts
// src/lib/constants.ts:1
export const ADMIN_EMAIL = 'daniansyahchusyaidin@gmail.com';
```

```
// firestore.rules:9-10 (repeated 5 times)
allow write: if request.auth != null
             && request.auth.token.email == 'daniansyahchusyaidin@gmail.com';
```

## Impact
- **Security impact**: The admin email is exposed in the public source code repository. While the email itself is not secret (it's on the portfolio), coupling it to authorization logic in source code is a maintenance risk.
- **Maintainability impact**: Changing the admin requires code changes and redeployment of both the app and Firestore rules.

## Fix Solution
1. Move `ADMIN_EMAIL` to an environment variable: `ADMIN_EMAIL=daniansyahchusyaidin@gmail.com`.
2. Update `constants.ts` to read from `process.env.ADMIN_EMAIL`.
3. Note: Firestore rules cannot use environment variables — they must be hardcoded. This is a Firebase limitation.

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Set `ADMIN_EMAIL` env var.
2. Verify login still works and admin access is granted to the configured email.

---

# ISSUE-015 [DONE]

## Problem
`ScrollToTop` component uses deprecated `window.pageYOffset`.

## Severity
Low

## Category
Frontend

## Location
`src/components/ui/ScrollToTop.tsx` (line 53)

## Root Cause
The component uses `window.pageYOffset` which is deprecated in favor of `window.scrollY`. While currently supported by all browsers, it may be removed in future browser versions.

## Proof
```ts
// src/components/ui/ScrollToTop.tsx:53
const scrollY = window.pageYOffset || document.documentElement.scrollTop;
```

MDN Web Docs: "This feature is deprecated. Although it may still work in some browsers, its use is discouraged."

## Impact
- **Maintainability impact**: May break in future browser versions.

## Fix Solution
Replace with:
```ts
const scrollY = window.scrollY;
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Replace `pageYOffset` with `scrollY`.
2. Verify scroll-to-top button still shows/hides correctly when scrolling.

---

# ISSUE-016 [DEFERRED]

## Problem
SkyForceGame component is 1,160 lines — a monolithic component mixing game logic, rendering, and state.

## Severity
Low

## Category
Architecture

## Location
`src/components/game/SkyForceGame.tsx` (1,160 lines)

## Root Cause
The entire game — canvas rendering, game loop, entity management, collision detection, UI overlays, leaderboard integration, input handling, and score management — is in a single React component. This makes it extremely difficult to test, debug, or modify any single aspect.

## Proof
```bash
$ wc -l src/components/game/SkyForceGame.tsx
1160 src/components/game/SkyForceGame.tsx
```

The component includes:
- Type definitions (lines 11–35)
- Canvas game loop with `requestAnimationFrame` (game engine)
- Entity spawning/collision logic
- Leaderboard API integration
- Multiple UI overlays (pre-game, countdown, game-over, high-score, leaderboard)
- Input handling (keyboard, mouse, touch)
- Score sharing logic

## Impact
- **Maintainability impact**: Any change to the game requires understanding 1,160 lines. Bug fixes risk introducing regressions.
- **Code quality**: Cannot unit test individual game systems in isolation.

## Fix Solution
Extract into separate modules:
1. `gameEngine.ts` — Core game loop, entity management, collision detection.
2. `gameTypes.ts` — Type definitions.
3. `useGameState.ts` — Custom hook for game state management.
4. `LeaderboardOverlay.tsx` — Leaderboard UI component.
5. `GameOverOverlay.tsx` — Game over UI component.

## Fix Priority
P3

## Estimated Effort
L

## Verification Method
1. After refactoring, run existing tests to verify no regression.
2. Play the game and verify all functionality works identically.

---

# ISSUE-017 [DONE]

## Problem
Custom cursor renders on touch-capable devices at `md` breakpoint and above.

## Severity
Low

## Category
UX

## Location
`src/components/ui/CustomCursor.tsx` (lines 22–24), `src/app/globals.css` (lines 60–86)

## Root Cause
The custom cursor is hidden on mobile with `hidden md:block` (Tailwind's responsive breakpoint). However, tablets and touch-screen laptops at `md` (768px) and above will show the custom cursor even though they primarily use touch input. The cursor elements follow mouse movement but serve no purpose on touch devices and add unnecessary DOM elements and event listeners.

## Proof
```tsx
// src/components/ui/CustomCursor.tsx:22-24
<div id="cursor" ref={cursorRef} className="hidden md:block" aria-hidden="true" />
<div id="cursor-follower" ref={followerRef} className="hidden md:block" aria-hidden="true" />
```

```tsx
// src/components/ui/CustomCursor.tsx:10-15 — mousemove listener always active
useEffect(() => {
  const moveCursor = (e: MouseEvent) => {
    // Always listens, even on touch devices
  };
  window.addEventListener("mousemove", moveCursor, { passive: true });
```

## Impact
- **Performance impact**: Unnecessary event listener and DOM updates on touch devices.
- **UX impact**: Two floating cursor elements visible on hybrid devices that use mouse occasionally.

## Fix Solution
Add pointer detection:
```tsx
useEffect(() => {
  if (window.matchMedia('(pointer: fine)').matches === false) return;
  // ... existing logic
}, []);
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Open the site on a tablet or touch-screen laptop.
2. Verify no custom cursor elements appear or follow touch.

---

# ISSUE-018 [DONE]

## Problem
WhatsApp social link defaults to `#` when not configured, creating a broken link.

## Severity
Medium

## Category
UX

## Location
`src/components/sections/Contact.tsx` (line 81), `src/components/layout/Footer.tsx` (line 28)

## Root Cause
When `contactContent?.socials.whatsapp` is not set or is empty, the WhatsApp link falls back to `"#"`. This creates a link that scrolls to the top of the page instead of opening WhatsApp, with no visual indication that it's non-functional.

## Proof
```tsx
// src/components/sections/Contact.tsx:81
{ name: "WhatsApp", icon: <MessageCircle className="w-4 h-4" />,
  href: contactContent?.socials.whatsapp ?? "#" },
```

```tsx
// src/components/layout/Footer.tsx:28
{ name: "WhatsApp", icon: <MessageCircle className="w-3.5 h-3.5" />,
  href: contactContent?.socials.whatsapp ?? "#" },
```

## Impact
- **UX impact**: Users click the WhatsApp icon expecting to open WhatsApp, but instead the page scrolls to top. This is confusing and unprofessional.
- **Trust impact**: Broken social links reduce credibility.

## Fix Solution
Conditionally render the WhatsApp link only when a valid URL is configured:
```tsx
const socials = [
  { name: "GitHub", icon: ..., href: contactContent?.socials.github ?? "..." },
  // ...
  ...(contactContent?.socials.whatsapp && contactContent.socials.whatsapp !== '#'
    ? [{ name: "WhatsApp", icon: ..., href: contactContent.socials.whatsapp }]
    : []),
];
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. Remove the WhatsApp URL from Firestore site content.
2. Verify the WhatsApp icon does not appear in the contact section or footer.
3. Set a valid WhatsApp URL and verify it appears and links correctly.

---

# ISSUE-019 [DEFERRED]

## Problem
Admin panel labels and text are entirely hardcoded in English, not localized.

## Severity
Low

## Category
Content

## Location
`src/app/[locale]/admin/page.tsx`, `src/app/[locale]/admin/login/page.tsx`, `src/components/admin/AdminSidebar.tsx`, all admin CRUD pages

## Root Cause
All admin panel UI text is hardcoded in English despite being served under the `[locale]` route. Labels like "Dashboard", "Projects", "Admin Panel", "Sign In", "Authenticating...", form labels, and error messages are all English strings.

## Proof
```tsx
// src/app/[locale]/admin/page.tsx:47
<h1 className="...">Dashboard</h1>
```

```tsx
// src/components/admin/AdminSidebar.tsx:48
<h1 className="...">Admin Panel</h1>
```

```tsx
// src/app/[locale]/admin/login/page.tsx:49-50
<h1 className="...">Admin Access</h1>
<p className="...">Restricted to authorized personnel</p>
```

```tsx
// src/app/[locale]/admin/login/page.tsx:104
{submitting ? 'Authenticating...' : 'Sign In'}
```

## Impact
- **UX impact**: The admin panel does not match the selected locale. An Indonesian admin sees an English-only interface.
- **Consistency impact**: Public-facing pages are bilingual but the admin panel is not.

## Fix Solution
For a single-user admin panel, this is low priority. If localization is desired:
1. Add admin namespace to `messages/en.json` and `messages/id.json`.
2. Replace hardcoded strings with `useTranslations('admin')` calls.

## Fix Priority
P3

## Estimated Effort
M

## Verification Method
1. Switch locale to `id`.
2. Navigate to admin panel.
3. Verify all text appears in Indonesian.

---

# ISSUE-020 [DONE]

## Problem
No CSRF protection on the contact form and leaderboard API routes.

## Severity
Medium

## Category
Security

## Location
`src/app/api/contact/route.ts`, `src/app/api/leaderboard/route.ts`

## Root Cause
The contact and leaderboard POST endpoints are standard Next.js API routes (not server actions). Next.js server actions have built-in CSRF protection via action tokens, but plain API routes do not. Any external website can submit POST requests to these endpoints.

## Proof
```ts
// src/app/api/contact/route.ts:46
export async function POST(request: NextRequest) {
  // No CSRF token check
  // No Origin/Referer header validation
  const ip = getClientIp(request);
  // ...
}
```

```ts
// src/app/api/leaderboard/route.ts:77
export async function POST(request: NextRequest) {
  // No CSRF token check
  // ...
}
```

The admin API routes are protected by auth cookies, but the public endpoints have no cross-origin request protection beyond rate limiting.

## Impact
- **Security impact**: An attacker can create a page that auto-submits forms to the contact endpoint, sending spam emails. The leaderboard can be manipulated from external sites.
- The in-memory rate limiter provides minimal protection (see ISSUE-004).

## Fix Solution
1. Validate the `Origin` header on POST requests:
```ts
const origin = request.headers.get('origin');
if (origin !== 'https://dani-chusyaidin.vercel.app') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```
2. Alternatively, convert these endpoints to server actions which have built-in CSRF protection.

## Fix Priority
P2

## Estimated Effort
S

## Verification Method
1. Submit a contact form from the legitimate site — should succeed.
2. Submit a POST request with a different `Origin` header — should be rejected.

---

# ISSUE-021 [DONE]

## Problem
`Reveal` animation can permanently hide content if IntersectionObserver fails.

## Severity
Medium

## Category
Accessibility

## Location
`src/components/ui/Reveal.tsx` (lines 36–55)

## Root Cause
The `Reveal` component immediately hides below-fold content by setting `opacity: 0, y: 30, scale: 0.98`. It then relies on `IntersectionObserver` to reveal it. If the observer fails to trigger (e.g., due to unusual scroll behavior, browser bugs, or CSS containing), content remains permanently invisible.

## Proof
```tsx
// src/components/ui/Reveal.tsx:36
controls.set({ opacity: 0, y: 30, scale: 0.98 });  // Content hidden

// src/components/ui/Reveal.tsx:38-50
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting && !hasAnimated.current) {
      // ... reveal animation
      observer.disconnect();
    }
  },
  { rootMargin: "-50px" }
);
// If observer never fires, content stays at opacity: 0
```

Note: The component correctly handles above-fold content (no animation) and `prefers-reduced-motion` (returns early, content visible). The issue only affects below-fold content when IntersectionObserver fails silently.

## Impact
- **Accessibility impact**: Content that is invisible cannot be accessed by any user.
- **UX impact**: On rare occasions, sections of the page may appear blank.

## Fix Solution
Add a fallback timeout that reveals content if the observer hasn't triggered within a reasonable time:
```tsx
const timeout = setTimeout(() => {
  if (!hasAnimated.current) {
    controls.set({ opacity: 1, y: 0, scale: 1 });
  }
}, 5000);
return () => { observer.disconnect(); clearTimeout(timeout); };
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. Disable IntersectionObserver in browser DevTools.
2. Load the page and scroll down.
3. Verify all content becomes visible within 5 seconds.

---

# ISSUE-022 [DONE]

## Problem
Admin delete operations lack error handling and user feedback.

## Severity
Low

## Category
Admin Panel

## Location
`src/app/[locale]/admin/projects/page.tsx` (lines 34–38)

## Root Cause
The `handleDelete` function calls `deleteProject(id)` without try/catch. If the server action throws (network error, auth expiry, etc.), the error is unhandled. There's also no loading state during deletion — the user has no visual feedback that the operation is in progress.

## Proof
```tsx
// src/app/[locale]/admin/projects/page.tsx:34-38
const handleDelete = async (id: string) => {
  if (!confirm('Delete this project?')) return;
  await deleteProject(id);  // No try/catch, no loading state
  fetchProjects();           // Refreshes list but user doesn't know deletion happened
};
```

## Impact
- **UX impact**: If delete fails, the user sees no error message. The list refreshes showing the item still exists with no explanation.
- **Admin impact**: Errors during delete operations are silently swallowed.

## Fix Solution
Add error handling and loading state:
```tsx
const handleDelete = async (id: string) => {
  if (!confirm('Delete this project?')) return;
  try {
    await deleteProject(id);
    setToast({ type: 'success', message: 'Project deleted' });
    fetchProjects();
  } catch (err) {
    setToast({ type: 'error', message: err instanceof Error ? err.message : 'Delete failed' });
  }
};
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Delete a project — verify a success toast appears.
2. Simulate a network error during delete — verify an error toast appears.

---

# ISSUE-023 [DONE]

## Problem
`ImageUpload` component uses native `<img>` tag instead of `next/image`.

## Severity
Low

## Category
Performance

## Location
`src/components/admin/ImageUpload.tsx` (line 86)

## Root Cause
The image preview in the admin upload component uses a native `<img>` tag instead of the `next/image` component. While this is admin-only and previews local/uploaded images, it bypasses Next.js image optimization.

## Proof
```tsx
// src/components/admin/ImageUpload.tsx:86
<img src={displayUrl} alt="Preview" className="w-full h-full object-cover" />
```

## Impact
- **Performance impact**: Minor — admin-only component, but unoptimized images in the admin panel could be large.
- **Consistency impact**: Rest of the codebase uses `next/image`.

## Fix Solution
Replace with `next/image`:
```tsx
<Image src={displayUrl} alt="Preview" fill sizes="80px" className="object-cover" unoptimized />
```
Note: `unoptimized` is needed for blob URLs from `URL.createObjectURL()`.

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Upload an image in the admin panel.
2. Verify the preview displays correctly.

---

# ISSUE-024 [DONE]

## Problem
Missing `Strict-Transport-Security` (HSTS) header.

## Severity
Medium

## Category
Security

## Location
`next.config.ts` (lines 6–27, security headers array)

## Root Cause
The security headers include `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Content-Security-Policy`, but do not include `Strict-Transport-Security` (HSTS). Without HSTS, browsers may allow initial connections over HTTP before redirecting to HTTPS, leaving a window for man-in-the-middle attacks.

## Proof
```ts
// next.config.ts:6-27
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: '...' },
  // Missing: Strict-Transport-Security
];
```

## Impact
- **Security impact**: Without HSTS, the first visit to the site may be over HTTP (before redirect to HTTPS). This allows SSL stripping attacks on the initial connection.
- Note: Vercel does enforce HTTPS redirects at the platform level, but HSTS provides defense-in-depth.

## Fix Solution
Add HSTS header to the security headers array:
```ts
{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. Deploy the change.
2. Check response headers using browser DevTools or `curl -I`.
3. Verify `Strict-Transport-Security` header is present.

---

# ISSUE-025 [DONE]

## Problem
Global CSS applies `scrollbar-color` to all elements via `*` selector, impacting performance.

## Severity
Low

## Category
Performance

## Location
`src/app/globals.css` (lines 115–118)

## Root Cause
The custom scrollbar styles use the `*` universal selector to apply `scrollbar-width` and `scrollbar-color` to every DOM element. This forces the browser to evaluate these properties for every single element in the DOM, which is unnecessary since most elements don't have scrollbars.

## Proof
```css
/* src/app/globals.css:115-118 */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(6, 182, 212, 0.4) transparent;
}
```

## Impact
- **Performance impact**: The universal selector applies to all elements, increasing style recalculation time. On pages with many DOM nodes (like the homepage with gimmicks and game), this adds unnecessary work.

## Fix Solution
Target only elements that actually scroll:
```css
html, .overflow-auto, .overflow-y-auto, .overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(6, 182, 212, 0.4) transparent;
}
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Apply the change.
2. Verify scrollbar styling still appears on scrollable elements.
3. Verify no visible change in page behavior.

---

# ISSUE-026 [DONE]

## Problem
No `<noscript>` fallback for JavaScript-dependent content.

## Severity
Low

## Category
Accessibility

## Location
`src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`

## Root Cause
The site is heavily JavaScript-dependent: the theme toggle, typewriter animation, contact form, game, scroll-to-top, custom cursor, and all `'use client'` sections require JavaScript. There is no `<noscript>` tag providing guidance to users who have JavaScript disabled.

## Proof
The `[locale]/layout.tsx` body has no `<noscript>` tag. Server components like `Experience`, `Skills`, `Projects`, `Blog`, and `About` do render static HTML (good), but client-only components like the contact form and game render nothing without JS.

## Impact
- **Accessibility impact**: Users with JavaScript disabled see an incomplete page with no explanation. The contact form is non-functional, and the game section is blank.
- Note: This is common in modern SPAs and the impact is limited since the majority of the site IS server-rendered.

## Fix Solution
Add a minimal `<noscript>` tag in the layout body:
```html
<noscript>
  <div style="padding: 2rem; text-align: center; background: #fef3c7; color: #92400e;">
    This site requires JavaScript for full functionality. Please enable JavaScript to continue.
  </div>
</noscript>
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Disable JavaScript in browser settings.
2. Load the page.
3. Verify a message appears informing the user to enable JavaScript.

---

# ISSUE-027 [DONE]

## Problem
Firestore query functions silently return empty data on errors, masking failures.

## Severity
Medium

## Category
Backend

## Location
`src/lib/firestore.ts` (all functions)

## Root Cause
Every Firestore query function catches errors and returns empty arrays or `null` without propagating the error. This means the page renders with missing content rather than showing an error state. The errors are only logged to `console.error` on the server, which is not monitored.

## Proof
```ts
// src/lib/firestore.ts:5-17 — getProjects as example (same pattern in ALL functions)
export const getProjects = cache(async (): Promise<Project[]> => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb.collection('projects').orderBy('order', 'asc').get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    return [];  // Silent failure — page shows "no projects" instead of an error
  }
});
```

This pattern repeats for ALL 14 query functions in the file. When `adminDb` is `null` (credentials missing), every function returns empty data with no warning.

## Impact
- **UX impact**: If Firestore is down or credentials expire, the homepage shows empty sections (no projects, no blogs, no experience, no skills) with no error indication. Users see a professional portfolio with no content.
- **Debugging impact**: Production issues with Firestore connectivity are invisible to the user and only visible in server logs (if monitored).

## Fix Solution
1. For critical content (hero, navbar), throw errors and let error boundaries handle display.
2. For list content (projects, blogs), either throw or add visual indicators: "Content temporarily unavailable."
3. At minimum, differentiate between "no content exists" (empty collection) and "failed to load" (Firestore error).

## Fix Priority
P2

## Estimated Effort
M

## Verification Method
1. Temporarily break Firestore credentials.
2. Load the homepage.
3. Verify an appropriate error message is shown instead of empty sections.

---

# ISSUE-028 [DEFERRED]

## Problem
Admin panel guard relies solely on client-side JavaScript for access control.

## Severity
Medium

## Category
Security

## Location
`src/app/[locale]/admin/layout.tsx` (lines 9–46)

## Root Cause
The admin layout is a `'use client'` component that uses `useAuth()` to check admin status. While the proxy/middleware does redirect unauthenticated users at the edge, the admin page content protection is entirely client-side. Server-rendered HTML for admin pages could briefly flash before the client-side guard kicks in, and the page source could contain the admin UI markup.

## Proof
```tsx
// src/app/[locale]/admin/layout.tsx:1
'use client';

// src/app/[locale]/admin/layout.tsx:9-46
function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  // ...
  if (!user || !isAdmin) {
    return null;  // Client-side only check
  }
  return (
    <div>
      <AdminSidebar />
      <main>{children}</main>
    </div>
  );
}
```

However, the middleware (`src/proxy.ts:62-81`) does provide server-side auth checking for admin routes, redirecting invalid tokens. The client-side guard is a secondary check.

## Impact
- **Security impact**: The middleware provides the primary defense, but admin page components (which are `'use client'`) receive their HTML in the initial response. The middleware validates the auth token but the actual admin UI markup is in the bundle.
- This is partially mitigated by the middleware auth check but not fully — the admin page JavaScript/HTML is publicly available in the bundle.

## Fix Solution
1. Convert admin pages to server components where possible, performing auth checks server-side.
2. Use Next.js middleware to add server-side rendering guards.
3. At minimum, this is acceptable as defense-in-depth (middleware + client guard) but the API routes are the true security boundary.

## Fix Priority
P3

## Estimated Effort
L

## Verification Method
1. Attempt to access `/en/admin` without authentication.
2. Verify immediate redirect to login (no flash of admin content).
3. View page source — verify no admin content is in the initial HTML.

---

# ISSUE-029 [DONE]

## Problem
OG images are not locale-aware — they always render English text.

## Severity
Low

## Category
SEO

## Location
`src/app/[locale]/opengraph-image.tsx`

## Root Cause
The Open Graph image generates a static image with hardcoded English text ("Systems Architect & Fullstack Engineer", "Distributed Systems", "Mobile Architecture", "Portfolio"). Despite being in the `[locale]` directory, it does not use the locale parameter to localize the content.

## Proof
```tsx
// src/app/[locale]/opengraph-image.tsx:57-68
<span style={{ fontSize: '52px', ... }}>
  Daniansyah Chusyaidin  {/* Always English */}
</span>
<span style={{ fontSize: '22px', ... }}>
  Systems Architect & Fullstack Engineer  {/* Always English */}
</span>
// ...
<span>Distributed Systems</span>  {/* Always English */}
<span>Mobile Architecture</span>  {/* Always English */}
```

The function signature is `export default function OgImage()` — it does not receive or use the locale param.

## Impact
- **SEO impact**: Indonesian users sharing the site on social media see English OG image text, which may not resonate with their Indonesian audience.

## Fix Solution
Accept the locale from the route params and localize text:
```tsx
export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });
  // Use t() for localized text
}
```

## Fix Priority
P3

## Estimated Effort
S

## Verification Method
1. Visit `/id/opengraph-image` and `/en/opengraph-image`.
2. Verify each shows text in the appropriate language.

---

# ISSUE-030 [DONE]

## Problem
JSON-LD structured data on the homepage uses hardcoded English text regardless of locale.

## Severity
Low

## Category
SEO

## Location
`src/app/[locale]/page.tsx` (lines 60–91)

## Root Cause
The Person and WebSite JSON-LD schemas contain hardcoded English text. When the Indonesian locale is active, the structured data still says "Systems Architect & Fullstack Engineer" in English.

## Proof
```tsx
// src/app/[locale]/page.tsx:60-71
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Daniansyah Chusyaidin',
  url: 'https://dani-chusyaidin.vercel.app',
  jobTitle: 'Systems Architect & Fullstack Engineer',  // Always English
  sameAs: [/* ... */],
};
```

## Impact
- **SEO impact**: Minor — Google typically uses the primary language version. But for complete i18n compliance, structured data should match the page language.

## Fix Solution
Use translations for the `jobTitle` field:
```tsx
const t = await getTranslations({ locale, namespace: 'seo' });
jobTitle: t('jobTitle'),
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Check JSON-LD on `/id` — verify job title is in Indonesian.
2. Validate with Google's Rich Results Test.

---

# ISSUE-031 [DONE]

## Problem
The `<label>` elements in the contact form use conflicting CSS display properties.

## Severity
Low

## Category
Accessibility

## Location
`src/components/sections/Contact.tsx` (lines 139, 153)

## Root Cause
The label elements have both `block` and `flex` in their className, which is contradictory. Tailwind's `flex` overrides `block`, but having both is confusing and indicates unintended styling.

## Proof
```tsx
// src/components/sections/Contact.tsx:139
<label htmlFor="contact-title"
  className="... font-bold block group-focus-within/input:text-cyan-600 ... flex items-center gap-2">
  //              ^^^^^                                                      ^^^^
  // Both 'block' and 'flex' — 'flex' wins, 'block' is dead code
```

```tsx
// src/components/sections/Contact.tsx:153
<label htmlFor="contact-message"
  className="... font-bold block group-focus-within/input:text-cyan-600 ... flex items-center gap-2">
  // Same issue
```

## Impact
- **Code quality**: Dead CSS class creates confusion for maintainers.

## Fix Solution
Remove the redundant `block` class from both labels:
```tsx
className="... font-bold group-focus-within/input:text-cyan-600 ... flex items-center gap-2"
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Remove `block` from both labels.
2. Verify labels still display correctly with icon and text side by side.

---

# ISSUE-032 [DEFERRED]

## Problem
`suppressHydrationWarning` on `<html>` element masks potential hydration issues.

## Severity
Low

## Category
Frontend

## Location
`src/app/[locale]/layout.tsx` (line 71)

## Root Cause
The `<html>` element has `suppressHydrationWarning` to handle the theme class difference between server and client (the inline script adds `dark`/`light` class before React hydrates). While necessary for the theme, this prop suppresses ALL hydration warnings on the `<html>` element and its attributes, potentially masking real mismatches.

## Proof
```tsx
// src/app/[locale]/layout.tsx:69-73
<html
  lang={locale}
  suppressHydrationWarning  // Suppresses ALL hydration warnings on <html>
  data-scroll-behavior="smooth"
  className={`${inter.variable} ${jetbrainsMono.variable}`}
>
```

## Impact
- **Debugging impact**: Any future hydration mismatch on the `<html>` element (e.g., wrong `lang` attribute, missing CSS variables) will be silently ignored.

## Fix Solution
This is an accepted trade-off for theme detection. Document the reason with a comment:
```tsx
{/* suppressHydrationWarning: inline script adds theme class before hydration */}
```
No code change needed, but awareness of the limitation is important.

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
No action needed — this is informational.

---

# ISSUE-033 [DONE]

## Problem
Project detail pages lack an `<article>` semantic wrapper.

## Severity
Low

## Category
Accessibility

## Location
`src/components/pages/ProjectDetailsPage.tsx`

## Root Cause
The `BlogDetailsPage` component correctly wraps content in an `<article>` tag, but `ProjectDetailsPage` does not. The project detail page uses a `<section>` as the outermost element, missing the semantic meaning that `<article>` provides.

## Proof
```tsx
// src/components/pages/BlogDetailsPage.tsx:28 — correctly uses <article>
<article>
  {/* blog content */}
</article>
```

```tsx
// src/components/pages/ProjectDetailsPage.tsx:25 — uses <section>, no <article>
<section className="pb-8 md:pb-14 bg-surface relative min-h-screen overflow-hidden pt-24 md:pt-28">
  {/* project content — no <article> wrapper */}
</section>
```

## Impact
- **Accessibility impact**: Screen readers and crawlers don't identify the project detail content as a self-contained article. Violates WCAG best practices for semantic HTML.
- **SEO impact**: Minor — search engines prefer semantic HTML for content identification.

## Fix Solution
Add `<article>` wrapper inside the section, similar to `BlogDetailsPage`:
```tsx
<section>
  <article>
    {/* project content */}
  </article>
</section>
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. View a project detail page.
2. Inspect the DOM and verify content is wrapped in `<article>`.

---

# ISSUE-034 [DEFERRED]

## Problem
No error monitoring or reporting beyond `console.error`.

## Severity
Medium

## Category
Architecture

## Location
All `catch` blocks throughout the codebase: `src/lib/firestore.ts`, `src/app/api/*/route.ts`, `src/actions/*.ts`

## Root Cause
All error handling throughout the application uses `console.error()`. In production on Vercel, these logs are only visible in the Vercel function logs dashboard and are ephemeral. There is no structured error monitoring service (e.g., Sentry, LogRocket, DataDog) to capture, alert on, and track errors.

## Proof
```ts
// src/lib/firestore.ts:14 (and 13 other functions)
console.error('Failed to fetch projects:', err);
return [];

// src/app/api/contact/route.ts:90
console.error('Failed to send contact email:', err);

// src/app/api/leaderboard/route.ts:138
console.error('Failed to submit leaderboard entry:', err);
```

## Impact
- **Operational impact**: Production errors go unnoticed until a user reports them. Firestore outages, SMTP failures, and API errors are invisible without active log monitoring.
- **Debugging impact**: Error context (user, request, stack trace) is lost in console.error.

## Fix Solution
1. Integrate an error monitoring service (Sentry is free tier available).
2. Replace `console.error` calls with structured logging that sends to the monitoring service.
3. Set up alerts for error rate thresholds.

## Fix Priority
P2

## Estimated Effort
M

## Verification Method
1. Trigger a controlled error (e.g., invalid Firestore credentials).
2. Verify the error appears in the monitoring dashboard with full context.

---

# ISSUE-035 [DEFERRED]

## Problem
The homepage loads 7 Firestore collections simultaneously without individual error boundaries.

## Severity
Low

## Category
Performance

## Location
`src/app/[locale]/page.tsx` (lines 50–58)

## Root Cause
The homepage `Promise.all` fetches 7 collections at once. If any single collection fails (returns empty due to catch), the page renders with missing content for that section. However, since each catch returns empty data (not throwing), `Promise.all` never rejects. The page renders partially without the user knowing something is missing.

## Proof
```tsx
// src/app/[locale]/page.tsx:50-58
const [projects, blogs, experience, skills, heroContent, aboutContent, contactContent] = await Promise.all([
  getProjects(),      // Returns [] on error
  getBlogs(),         // Returns [] on error
  getExperience(),    // Returns [] on error
  getSkills(),        // Returns [] on error
  getHeroContent(),   // Returns null on error
  getAboutContent(),  // Returns null on error
  getContactContent(),// Returns null on error — contact section uses fallbacks
]);
```

## Impact
- **UX impact**: Partial page rendering with missing sections and no explanation. The hero section could show fallback text while the contact section shows default email — a confusing mix of configured and default content.

## Fix Solution
This is related to ISSUE-027 (silent Firestore failures). Combined fix: either show error states per section or throw to trigger the error boundary.

## Fix Priority
P3

## Estimated Effort
S

## Verification Method
Covered by ISSUE-027 verification.

---

# ISSUE-036 [DONE]

## Problem
Missing `aria-current="page"` on active navigation links.

## Severity
Low

## Category
Accessibility

## Location
`src/components/layout/Navbar.tsx` (lines 138–177)

## Root Cause
The navigation links use visual indicators (underlines, color changes) to show the active page but do not include `aria-current="page"` to communicate the current page to screen readers.

## Proof
```tsx
// src/components/layout/Navbar.tsx:143-158
return (
  <a
    key={link.code}
    href={hash}
    className="hover:text-cyan-400 transition-all duration-300 relative group"
    // No aria-current attribute
  >
    {/* ... */}
  </a>
);
```

## Impact
- **Accessibility impact**: Violates WCAG 2.2 guideline for navigation. Screen reader users cannot determine which page/section is currently active.

## Fix Solution
Add `aria-current="page"` (or `aria-current="true"`) to the active link based on hash matching or route detection.

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Navigate to the home page.
2. Use a screen reader to navigate the menu.
3. Verify the current section is announced as the active link.

---

# ISSUE-037 [DONE]

## Problem
Email header injection vulnerability in the contact form API route.

## Severity
Critical

## Category
Security

## Location
`src/app/api/contact/route.ts` (lines 41–44, 81–85)

## Root Cause
The `subject` field from the contact form is inserted directly into the email subject header without sanitizing newline characters. While Zod validates string length, it does NOT prevent `\r\n` sequences. An attacker can inject additional email headers (e.g., `Bcc`, `Cc`, `To`) by embedding newline characters in the subject field.

## Proof
```ts
// src/app/api/contact/route.ts:41-44
const contactSchema = z.object({
  subject: z.string().min(1).max(500),  // No newline check
  message: z.string().min(1).max(10000),
});
```

```ts
// src/app/api/contact/route.ts:81-85
await transporter.sendMail({
  from: smtpUser,
  to: smtpUser,
  subject: `[Portfolio Contact] ${subject}`,  // subject injected directly into header
  text: `Subject: ${subject}\n\nMessage:\n${message}`,
});
```

Attack payload example:
```json
{ "subject": "Test\r\nBcc: attacker@evil.com\r\nContent-Type: text/html", "message": "..." }
```

This would inject a `Bcc` header, silently forwarding all contact emails to the attacker.

## Impact
- **Security impact**: Attacker can inject arbitrary email headers, forwarding emails to third parties, spoofing sender addresses, or manipulating email content type.
- **Privacy impact**: Contact form submissions could be silently copied to unauthorized recipients.

## Fix Solution
Add newline validation to the subject field in the Zod schema:
```ts
const contactSchema = z.object({
  subject: z.string().min(1).max(500)
    .refine(s => !/[\r\n]/.test(s), 'Subject cannot contain newlines'),
  message: z.string().min(1).max(10000),
});
```

## Fix Priority
P0

## Estimated Effort
XS

## Verification Method
1. Submit a contact form with `subject: "Test\r\nBcc: test@example.com"`.
2. Verify the request is rejected with a validation error.
3. Submit a normal subject — verify it succeeds.

---

# ISSUE-038 [DONE]

## Problem
Auth session cookie has excessively long lifetime (12 days).

## Severity
Medium

## Category
Security

## Location
`src/proxy.ts` (line 23)

## Root Cause
The authentication cookie `maxAge` is set to 12 days (`12 * 60 * 60 * 24` = 1,036,800 seconds). For an admin panel, this is excessively long. If an admin session is compromised (e.g., cookie theft via XSS or physical access), the attacker has a 12-day window to exploit it.

## Proof
```ts
// src/proxy.ts:18-24
cookieSerializeOptions: {
  path: '/',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 12 * 60 * 60 * 24, // 12 days
},
```

## Impact
- **Security impact**: Extended attack window if session cookie is compromised. Industry best practice for admin sessions is 1–24 hours.
- **Risk**: Combined with the `sameSite: 'lax'` setting (instead of `'strict'`), cross-site top-level navigations can include the cookie.

## Fix Solution
1. Reduce `maxAge` to 24 hours: `maxAge: 24 * 60 * 60` (86,400 seconds).
2. Consider changing `sameSite` to `'strict'` for admin routes.
3. Implement session refresh on activity to avoid forcing re-login during active use.

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. Log in to the admin panel.
2. Inspect the `AuthToken` cookie in browser DevTools.
3. Verify `Max-Age` is 86400 (24 hours) or less.

---

# ISSUE-039 [DONE]

## Problem
`contactContentSchema` does not validate the `email` field as a valid email address.

## Severity
Medium

## Category
Backend

## Location
`src/lib/validation.ts` (line 112)

## Root Cause
The `email` field in `contactContentSchema` is validated only as a non-empty string with max length. It does not use Zod's `.email()` validator, allowing any arbitrary string to be saved as the site's contact email.

## Proof
```ts
// src/lib/validation.ts:109-112
export const contactContentSchema = z.object({
  headline: bilingualShortSchema,
  desc: bilingualSchema,
  email: z.string().min(1).max(500),  // No .email() validation
  // ...
});
```

An admin could accidentally set `email` to `"not-an-email"` or `"hello world"`, breaking the contact form's `mailto:` fallback and displaying an invalid email on the page.

## Impact
- **Data integrity**: Invalid email stored in Firestore renders the contact section broken.
- **UX impact**: Users see a garbled email address and can't copy a valid one.

## Fix Solution
Add email format validation:
```ts
email: z.string().min(1).max(500).email('Must be a valid email address'),
```

## Fix Priority
P2

## Estimated Effort
XS

## Verification Method
1. In the admin panel, attempt to set the contact email to `"not-an-email"`.
2. Verify the server action rejects with a validation error.
3. Set a valid email — verify it succeeds.

---

# ISSUE-040 [DONE]

## Problem
Blog slug update does not revalidate the old slug path, causing stale cached pages.

## Severity
Medium

## Category
Backend

## Location
`src/actions/blogs.ts` (lines 44–47)

## Root Cause
When a blog's slug is changed via `updateBlog`, the action revalidates the new slug path but does NOT revalidate the old slug path. The old URL continues to serve stale cached content until the ISR TTL (3600s) expires.

## Proof
```ts
// src/actions/blogs.ts:32-47
export async function updateBlog(id: string, data: unknown) {
  // ...
  const validated = validate(blogUpdateSchema, data);
  if (validated.slug) {
    const existing = await adminDb.collection('blogs').where('slug', '==', validated.slug).limit(1).get();
    if (!existing.empty && existing.docs[0].id !== id) throw new Error(`Blog with slug "${validated.slug}" already exists`);
  }
  await adminDb.collection('blogs').doc(id).update({
    ...validated,
    updatedAt: new Date().toISOString(),
  });
  // ...
  if (validated.slug) {
    revalidatePath(`/en/blog/${validated.slug}`);  // Revalidates NEW slug
    revalidatePath(`/id/blog/${validated.slug}`);  // Revalidates NEW slug
    // OLD slug path is NOT revalidated — serves stale content
  }
}
```

## Impact
- **UX impact**: Users visiting the old blog URL see outdated content for up to 1 hour.
- **SEO impact**: Two URLs serve different versions of the same content, potentially causing duplicate content issues.

## Fix Solution
Read the old slug before updating, and revalidate it after:
```ts
const doc = await adminDb.collection('blogs').doc(id).get();
const oldSlug = doc.exists ? (doc.data()?.slug as string) : null;
// ... update ...
if (oldSlug && validated.slug && oldSlug !== validated.slug) {
  revalidatePath(`/en/blog/${oldSlug}`);
  revalidatePath(`/id/blog/${oldSlug}`);
}
```

## Fix Priority
P2

## Estimated Effort
S

## Verification Method
1. Create a blog with slug `test-blog`.
2. Change the slug to `new-test-blog`.
3. Verify `/id/blog/test-blog` returns 404 immediately (not stale content).

---

# ISSUE-041 [DONE]

## Problem
Navbar hamburger menu button is missing `aria-expanded` attribute.

## Severity
Low

## Category
Accessibility

## Location
`src/components/layout/Navbar.tsx` (lines 241–249)

## Root Cause
The mobile menu hamburger button does not include `aria-expanded` to indicate whether the menu is currently open or closed. Screen readers cannot determine the menu state.

## Proof
```tsx
// src/components/layout/Navbar.tsx:241-249
<button
  className="p-2 text-text-main hover:bg-border/10 transition-colors border border-border/40 lg:hidden flex flex-col gap-1 items-end overflow-hidden group"
  onClick={() => setIsMenuOpen(true)}
  aria-label="Open menu"
  // Missing: aria-expanded={isMenuOpen}
>
  <div className="w-6 h-0.5 bg-text-main ..." />
  <div className="w-4 h-0.5 bg-text-main ..." />
  <div className="w-5 h-0.5 bg-text-main ..." />
</button>
```

## Impact
- **Accessibility impact**: Violates WCAG 2.2 SC 4.1.2 (Name, Role, Value). Screen reader users cannot determine if the menu is expanded or collapsed.

## Fix Solution
Add `aria-expanded` and `aria-controls`:
```tsx
<button
  onClick={() => setIsMenuOpen(true)}
  aria-label="Open menu"
  aria-expanded={isMenuOpen}
  aria-controls="mobile-menu"
>
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Activate a screen reader on mobile.
2. Focus the menu button.
3. Verify the screen reader announces "collapsed" or "expanded" state.

---

# ISSUE-042 [DONE]

## Problem
Blog dates are not rendered using the semantic `<time>` HTML element.

## Severity
Low

## Category
SEO

## Location
`src/components/sections/Blog.tsx` (line 40), `src/components/pages/BlogDetailsPage.tsx` (line 47)

## Root Cause
Blog dates are rendered as plain `<span>` elements instead of the semantic `<time>` element with a `datetime` attribute. Search engines and assistive technologies cannot parse the date programmatically.

## Proof
```tsx
// src/components/sections/Blog.tsx:39-41
<span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
  {blog.date}
</span>
```

```tsx
// src/components/pages/BlogDetailsPage.tsx:47
<span className="font-mono text-xs uppercase tracking-wider">{blog.date}</span>
```

Both should use `<time datetime={blog.date}>`.

## Impact
- **SEO impact**: Search engines cannot reliably extract publication dates, reducing rich snippet eligibility.
- **Accessibility impact**: Assistive technologies cannot identify the text as a date.

## Fix Solution
Replace `<span>` with `<time>`:
```tsx
<time dateTime={blog.date} className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
  {blog.date}
</time>
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Inspect a blog card or blog detail page.
2. Verify the date is wrapped in a `<time>` element with a valid `datetime` attribute.
3. Validate with Google's Rich Results Test.

---

# ISSUE-043 [DONE]

## Problem
Footer social links have inconsistent `aria-label` compared to Contact section social links.

## Severity
Low

## Category
Accessibility

## Location
`src/components/layout/Footer.tsx` (lines 40–51), `src/components/sections/Contact.tsx` (lines 232–249)

## Root Cause
The Contact section social links include `"(opens in new tab)"` in the `aria-label`, following WCAG best practices for external links. However, the Footer social links do not include this information, creating an inconsistency.

## Proof
```tsx
// src/components/sections/Contact.tsx:238 — GOOD: includes "(opens in new tab)"
aria-label={`${social.name} (opens in new tab)`}
```

```tsx
// src/components/layout/Footer.tsx:46 — MISSING: no new tab indication
aria-label={social.name}
```

Both use `target="_blank" rel="noopener noreferrer"` but only Contact announces the new tab behavior.

## Impact
- **Accessibility impact**: Screen reader users clicking Footer social links are not warned that a new tab will open, which can be disorienting.

## Fix Solution
Add consistent aria-labels to Footer social links:
```tsx
aria-label={`${social.name} (opens in new tab)`}
```

## Fix Priority
P3

## Estimated Effort
XS

## Verification Method
1. Use a screen reader to navigate Footer social links.
2. Verify each link announces that it opens in a new tab.
