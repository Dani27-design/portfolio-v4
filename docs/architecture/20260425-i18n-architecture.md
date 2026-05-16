## ADR: i18n Architecture for Portfolio v4

### Context

The portfolio site has a language toggle UI (EN/ID buttons) in the Navbar component that currently does nothing — it only updates local component state without affecting any displayed content. Per stakeholder directive (L-022), actual internationalization support must be implemented for English and Indonesian languages.

**Constraints:**
- Client-side SPA with no backend (currently)
- React Context is the only permitted state management pattern
- No external dependencies unless absolutely necessary
- SEO-critical: each language must have distinct crawlable URLs
- Must support future dynamic blog content (admin-posted)
- Browser language detection with English fallback

**Content requiring translation:**
- UI labels (navigation, buttons, section headers)
- Project names and descriptions (6 projects in constants.ts)
- Blog titles and excerpts (6 blogs in constants.ts)
- Role phrases displayed in Hero typewriter effect (4 phrases)
- Section content text

**Content NOT translated (stakeholder decision):**
- Decorative tech labels (stay English for authenticity)
- Code snippets and technical terms

### Decision

Implement a **path-based i18n solution** with URL prefixes (`/en/`, `/id/`) for SEO compliance, using React Context for state management and TypeScript translation files. No external library will be added.

---

### Architecture Components

#### 1. URL Structure (SEO-Compliant)

```
/                    → Redirect to /en/ or /id/ (browser detection)
/en/                 → English homepage
/en/#about           → English homepage, about section
/en/blog             → English blog list
/en/blog/:slug       → English blog post
/en/projects         → English project list
/id/                 → Indonesian homepage
/id/#about           → Indonesian homepage, about section
/id/blog             → Indonesian blog list
/id/blog/:slug       → Indonesian blog post
/id/projects         → Indonesian project list
```

Language is determined by URL path, not client-side state alone.

#### 2. React Router Restructuring

**Current structure (App.tsx):**
```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/blog" element={<BlogListPage />} />
  <Route path="/blog/:slug" element={<BlogDetailsPage />} />
  <Route path="/projects" element={<ProjectListPage />} />
</Routes>
```

**New structure:**
```tsx
<Routes>
  {/* Root redirect based on browser language */}
  <Route path="/" element={<LanguageRedirect />} />

  {/* Language-prefixed routes */}
  <Route path="/:lang" element={<LanguageLayout />}>
    <Route index element={<HomePage />} />
    <Route path="blog" element={<BlogListPage />} />
    <Route path="blog/:slug" element={<BlogDetailsPage />} />
    <Route path="projects" element={<ProjectListPage />} />
  </Route>

  {/* Fallback for invalid language codes */}
  <Route path="*" element={<Navigate to="/en/" replace />} />
</Routes>
```

#### 3. LanguageRedirect Component

Location: `src/i18n/LanguageRedirect.tsx`

```tsx
export const LanguageRedirect: React.FC = () => {
  const getPreferredLanguage = (): Language => {
    // 1. Check localStorage preference
    const saved = localStorage.getItem("language") as Language;
    if (saved && ["en", "id"].includes(saved)) return saved;

    // 2. Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("id")) return "id";

    // 3. Default to English
    return "en";
  };

  return <Navigate to={`/${getPreferredLanguage()}/`} replace />;
};
```

#### 4. LanguageLayout Component

Location: `src/i18n/LanguageLayout.tsx`

Wraps all language-specific routes, validates `:lang` param, and provides LanguageContext.

```tsx
export const LanguageLayout: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Validate language param
  if (!lang || !["en", "id"].includes(lang)) {
    return <Navigate to="/en/" replace />;
  }

  const language = lang as Language;

  // Persist preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  // Language switch function navigates to new URL
  const setLanguage = (newLang: Language) => {
    const newPath = location.pathname.replace(`/${language}`, `/${newLang}`);
    navigate(newPath + location.hash);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <Outlet />
    </LanguageContext.Provider>
  );
};
```

#### 5. LanguageContext

Location: `src/i18n/LanguageContext.tsx`

```typescript
export type Language = "en" | "id";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];  // For arrays like phrases
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageLayout");
  return context;
};
```

Key difference from ThemeContext pattern: context value is provided by LanguageLayout (which has access to URL params), not a standalone provider.

#### 6. Translation Files

Location: `src/i18n/translations/`

```
src/i18n/
├── LanguageContext.tsx      # Context definition, useLanguage hook
├── LanguageRedirect.tsx     # Root redirect component
├── LanguageLayout.tsx       # Route wrapper, provides context
├── translations/
│   ├── en.ts                # English translations
│   ├── id.ts                # Indonesian translations
│   └── index.ts             # Re-exports both
├── types.ts                 # Translations type definition
└── index.ts                 # Public exports
```

Translation files are TypeScript objects (not JSON) for:
- Compile-time type checking for missing keys
- IDE autocomplete for translation keys
- No runtime JSON parsing overhead

#### 7. Translation Function Implementation

```typescript
const t = (key: string): string => {
  const translations = language === "en" ? en : id;
  const keys = key.split(".");
  let result: unknown = translations;

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Fallback to key itself
    }
  }

  return typeof result === "string" ? result : key;
};

const tArray = (key: string): string[] => {
  const translations = language === "en" ? en : id;
  const keys = key.split(".");
  let result: unknown = translations;

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return [];
    }
  }

  return Array.isArray(result) ? result : [];
};
```

#### 8. Language Toggle Navigation

In Navbar and other components, language switching navigates to the equivalent URL:

```tsx
const { language, setLanguage } = useLanguage();

// Toggle button
<button onClick={() => setLanguage(language === "en" ? "id" : "en")}>
  {language.toUpperCase()}
</button>
```

`setLanguage` internally calls `navigate()` to change the URL path, preserving the current route and hash.

#### 9. Internal Links

All internal links must include the language prefix. Create a helper hook:

```tsx
// src/i18n/useLocalizedPath.ts
export const useLocalizedPath = () => {
  const { language } = useLanguage();

  return (path: string) => {
    // Handle hash-only links (e.g., "#about")
    if (path.startsWith("#")) {
      return `/${language}/${path}`;
    }
    // Handle absolute paths (e.g., "/blog")
    if (path.startsWith("/")) {
      return `/${language}${path}`;
    }
    // Handle relative paths
    return `/${language}/${path}`;
  };
};

// Usage in components
const localizedPath = useLocalizedPath();
<Link to={localizedPath("/blog")}>Blog</Link>
<Link to={localizedPath("#about")}>About</Link>
```

---

### SEO Implementation

#### 1. hreflang Tags (Build-Time Injection)

Create a Vite plugin or post-build script to inject into `index.html`:

```html
<link rel="alternate" hreflang="en" href="https://daniansyah.dev/en/" />
<link rel="alternate" hreflang="id" href="https://daniansyah.dev/id/" />
<link rel="alternate" hreflang="x-default" href="https://daniansyah.dev/en/" />
```

#### 2. Dynamic Meta Tags

Use `react-helmet-async` (lightweight, ~3KB) for per-page meta tags:

```tsx
// In each page component
const { language, t } = useLanguage();

<Helmet>
  <title>{t("meta.home.title")}</title>
  <meta name="description" content={t("meta.home.description")} />
  <meta property="og:locale" content={language === "en" ? "en_US" : "id_ID"} />
  <link rel="canonical" href={`https://daniansyah.dev/${language}/`} />
</Helmet>
```

Note: This is the ONE external dependency recommended for SEO compliance. It is small, well-maintained, and required for dynamic meta tags in SPAs.

#### 3. Sitemap Generation

Create a build script (`scripts/generate-sitemap.ts`) that outputs `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://daniansyah.dev/en/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://daniansyah.dev/en/"/>
    <xhtml:link rel="alternate" hreflang="id" href="https://daniansyah.dev/id/"/>
  </url>
  <url>
    <loc>https://daniansyah.dev/id/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://daniansyah.dev/en/"/>
    <xhtml:link rel="alternate" hreflang="id" href="https://daniansyah.dev/id/"/>
  </url>
  <!-- Repeat for /blog, /projects, and each blog post -->
</urlset>
```

---

### Translation Key Structure

```typescript
interface Translations {
  meta: {
    home: { title: string; description: string };
    blog: { title: string; description: string };
    projects: { title: string; description: string };
  };
  nav: {
    about: string;
    stack: string;
    experience: string;
    projects: string;
    blog: string;
    contact: string;
  };
  hero: {
    tagline: string;
    subtitle: string;
    ctaGame: string;
    ctaContact: string;
  };
  phrases: string[];  // Role phrases for typewriter
  about: {
    title: string;
    content: string[];  // Paragraphs
  };
  skills: {
    title: string;
    // Category labels if needed
  };
  experience: {
    title: string;
    items: {
      [key: string]: {
        role: string;
        company: string;
        description: string;
      };
    };
  };
  projects: {
    title: string;
    items: {
      [slug: string]: {
        name: string;
        desc: string;
      };
    };
  };
  blog: {
    title: string;
    readMore: string;
    items: {
      [slug: string]: {
        title: string;
        excerpt: string;
        // content: string; // Phase 2 - full markdown
      };
    };
  };
  contact: {
    title: string;
    subtitle: string;
    cta: string;
  };
  footer: {
    copyright: string;
  };
  common: {
    viewProject: string;
    backToHome: string;
    loading: string;
  };
}
```

---

### Future-Proofing for Dynamic Blog Content

When blog becomes admin-posted (future requirement):

1. **Translation keys for static UI remain in TypeScript files**
2. **Blog content comes from API with language field:**
   ```typescript
   interface BlogPost {
     slug: string;
     language: "en" | "id";
     title: string;
     excerpt: string;
     content: string;
   }
   ```
3. **API call includes language param:** `GET /api/blogs?lang=en`
4. **LanguageContext provides current language to data fetching hooks**

The architecture supports this transition without structural changes.

---

### Provider Hierarchy

```tsx
// src/App.tsx
export default function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToAnchor />
          <ScrollProgress />
          <Routes>
            <Route path="/" element={<LanguageRedirect />} />
            <Route path="/:lang" element={<LanguageLayout />}>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="blog" element={<BlogListPage />} />
                <Route path="blog/:slug" element={<BlogDetailsPage />} />
                <Route path="projects" element={<ProjectListPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/en/" replace />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}
```

Note: LanguageContext is provided by LanguageLayout, not a separate provider wrapper.

---

### Scope Definition

**Phase 1 (this implementation):**
- URL-based language routing (`/en/`, `/id/`)
- All UI labels and static text
- Project names and descriptions
- Blog titles and excerpts
- Role phrases
- Navigation links
- SEO elements (hreflang, meta tags, sitemap)

**Phase 2 (future, if requested):**
- Full blog post content (markdown)
- Dynamic content from API integrations

---

### Rationale

**Why path-based URLs over client-side-only:**
- SEO requirement: Google indexes distinct URLs
- Each language version is crawlable independently
- hreflang tags point to real, distinct pages
- Shareable URLs include language context

**Why custom solution over react-i18next:**

| Factor | Custom | react-i18next |
|--------|--------|---------------|
| Bundle size | ~3KB (helmet only) | ~40KB |
| Setup complexity | Medium | Medium |
| Features needed | Language toggle, key lookup, URL routing | Same minus URL routing |
| URL-based language | Custom implementation required anyway | Same |

For 2 languages with URL-based routing, a library adds bundle size without solving the routing problem.

**Why react-helmet-async (one dependency):**
- Dynamic meta tags are required for SEO
- Cannot be solved without a library in React SPA
- ~3KB is acceptable trade-off
- Well-maintained, widely used

---

### Consequences

**Positive:**
- SEO-compliant with distinct crawlable URLs per language
- Type-safe translations with IDE support
- Language preference persists via URL (shareable) and localStorage (returning visitors)
- Future-ready for dynamic blog content
- Minimal dependencies (only react-helmet-async added)

**Negative:**
- All internal links must use helper hook or include language prefix
- Route restructuring touches multiple files
- Slightly more complex than pure client-side approach
- Both translation files bundled (~5-10KB total)

**Migration required:**
- Restructure App.tsx routes with `/:lang` prefix
- Create LanguageRedirect and LanguageLayout components
- Remove `lang` state from Navbar.tsx
- Update all `<Link>` components to use `useLocalizedPath()`
- Update all hardcoded strings to use `t()` function
- Add react-helmet-async dependency
- Create sitemap generation script
- Update index.html with hreflang tags

---

### Alternatives Considered

**1. Client-side only (same URL)**
- Rejected: Does not meet SEO requirement — Google would only index default language

**2. Query parameters (`?lang=id`)**
- Rejected: Google may ignore query params, poor SEO signal

**3. Subdomains (`en.site.com`, `id.site.com`)**
- Rejected: Requires DNS configuration, separate deployments, overkill for 2 languages

**4. Full SSR migration (Next.js/Astro)**
- Rejected: Major infrastructure change for a portfolio site, current approach achieves good SEO within existing stack

**5. react-i18next**
- Rejected: Still requires custom URL routing implementation, adds bundle size without solving the core problem

---

*Created: 2026-04-25*
*Revised: 2026-04-25 — Updated for path-based URLs per stakeholder SEO decision*
*Author: technical-architect (Workflow A — i18n implementation)*
*Status: Active*
*Supersedes: None*
