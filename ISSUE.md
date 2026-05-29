# Un-Humanized Wording Audit

Audit date: 2026-05-30
Focus: All user-facing text across every section — identifying robotic, overly-jargon, or machine-like wording that doesn't sound like a real human wrote it.

---

## ~~WORD-01: Hero CTA button says "Protocol_Initialize"~~ [FIXED]

**Problem**: The contact CTA button on the hero section reads `Protocol_Initialize` — this is robotic jargon with an underscore, not a human call-to-action.

**Root cause**: `messages/en.json` line 15: `"ctaContact": "Protocol_Initialize"`. Same in `id.json` line 15.

**Proof**: Hero.tsx:122 renders `{ctaContact}` which resolves to this string.

**Impact**: HIGH — This is a primary CTA. Recruiters and visitors see this immediately. It doesn't communicate what the button does. A recruiter won't click "Protocol_Initialize" — they'll scroll past.

**Solution**: EN: "Get in Touch" or "Let's Talk". ID: "Hubungi Saya" or "Mari Bicara".

---

## ~~WORD-02: Hero tagline says "System Architect Core"~~ [FIXED]

**Problem**: `System Architect Core` sounds like a product name or internal code label, not a human tagline.

**Root cause**: `messages/en.json` line 11: `"tagline": "System Architect Core"`. Same in id.json.

**Proof**: Hero.tsx:84 renders `{tagline}`.

**Impact**: MEDIUM — First text visitors see above the headline. Doesn't tell the visitor who you are in human terms.

**Solution**: EN: "Fullstack & Mobile Engineer" or "Building Reliable Software". ID: "Fullstack & Mobile Engineer" or "Membangun Software Handal".

---

## ~~WORD-03: Hero headline "I don't return undefined."~~ [KEPT AS-IS — Owner's preference]

**Problem**: A JavaScript joke (`undefined`) — only developers understand this. Recruiters, HR, project managers, and non-technical visitors see a confusing sentence.

**Root cause**: `messages/en.json` line 12: `"headline": "I don't return undefined."`. ID: `"Saya tidak mengembalikan undefined."`.

**Proof**: Hero.tsx:94 renders `{headline}`.

**Impact**: MEDIUM — The main headline. Clever for devs but alienating for non-dev visitors. A portfolio should communicate value to ALL visitors, not just engineers.

**Solution**: EN: "I Build Systems That Just Work." or "Engineering Reliability Into Every Line." ID: "Saya Membangun Sistem yang Andal." — Keep it confident but universally understandable.

---

## ~~WORD-04: Hero description uses dense jargon~~ [FIXED]

**Problem**: "Architecting fault-tolerant distributed systems and robust mobile cores. I solve for complexity through rigorous structural design and end-to-end technical ownership." — Every word is a technical buzzword. No human talks like this.

**Root cause**: `messages/en.json` line 13.

**Proof**: Hero.tsx:108 renders `{desc}`.

**Impact**: MEDIUM — Supporting text that should explain what you do in accessible language.

**Solution**: EN: "I build web and mobile applications from the ground up — from system design to deployment. I focus on making things reliable, fast, and easy to maintain." ID: keep current (already more natural in Indonesian).

---

## ~~WORD-05: About section title says "Structural Engineer"~~ [FIXED]

**Problem**: "Structural Engineer" is a civil engineering job title (buildings/bridges). Confusing for a software portfolio.

**Root cause**: `messages/en.json` line 18: `"title": "Structural Engineer"`.

**Proof**: About.tsx:55 renders `{title}`.

**Impact**: LOW — Small label above the headline. But misleading — visitors may think this is a construction portfolio.

**Solution**: EN: "About Me" or "Who I Am". ID already uses "Software Developer" which is fine.

---

## ~~WORD-06: About section description is overly dense~~ [FIXED]

**Problem**: "From technical flowcharts and PRDs to backend infrastructure and mobile cores, I own the entire lifecycle. I thrive in the complexity that others avoid, delivering robust, maintainable solutions with a commitment to lifetime maintenance." — Jargon-heavy, sounds like a LinkedIn auto-generated summary.

**Root cause**: `messages/en.json` line 20.

**Proof**: About.tsx:70 renders `{desc}`.

**Impact**: MEDIUM — This is where visitors learn about you. Dense jargon pushes non-technical visitors away.

**Solution**: EN: "I handle the full development process — from planning and design to building and shipping. I enjoy solving hard problems and building software that's reliable and easy to maintain long-term."

---

## ~~WORD-07: Experience title says "Professional Trajectory"~~ [FIXED]

**Problem**: "Professional Trajectory" is an unusual phrase. Normal portfolios say "Experience" or "Work History."

**Root cause**: `messages/en.json` line 31: `"title": "Professional Trajectory"`.

**Proof**: Experience.tsx:31 renders `{t('title')}`.

**Impact**: LOW — Section heading. "Professional Trajectory" sounds academic/corporate, not natural.

**Solution**: EN: "Work Experience" or "Experience". ID already uses "Pengalaman Kerja" which is natural.

---

## ~~WORD-08: Projects section title "System Architecture & Deployment"~~ [FIXED]

**Problem**: Overly technical section heading. Visitors expect "Projects" or "My Work."

**Root cause**: `messages/en.json` line 34: `"title": "System Architecture & Deployment"`.

**Proof**: Projects.tsx:34 renders `{t('title')}`.

**Impact**: LOW — Section heading.

**Solution**: EN: "Projects" or "Featured Work". ID: "Proyek" or "Proyek Unggulan".

---

## ~~WORD-09: Projects CTA "ACCESS_SYSTEM_ARCHIVE"~~ [FIXED]

**Problem**: `ACCESS_SYSTEM_ARCHIVE` with underscores and all-caps — looks like a terminal command, not a button label.

**Root cause**: `messages/en.json` line 35. Same in id.json.

**Proof**: Projects.tsx:47 renders `{t('cta')}`.

**Impact**: HIGH — This is the CTA to see all projects. Visitors won't click something that looks like a system command.

**Solution**: EN: "View All Projects". ID: "Lihat Semua Proyek".

---

## ~~WORD-10: Projects metadata "Access: Granted"~~ [FIXED]

**Problem**: `Access: Granted` on project cards — fake security jargon. Meaningless to visitors.

**Root cause**: `messages/en.json` line 40. Same in id.json.

**Proof**: Projects.tsx:88 renders `{t('metadata.access')}`.

**Impact**: LOW — Small label at bottom of project cards.

**Solution**: EN: "View Project" or "Details". ID: "Lihat Proyek".

---

## ~~WORD-11: Blog section title "Technical Logs"~~ [FIXED]

**Problem**: "Technical Logs" sounds like server logs, not blog posts.

**Root cause**: `messages/en.json` line 46.

**Proof**: Blog.tsx:32 renders `{t('title')}`.

**Impact**: MEDIUM — Section heading. Visitors expect "Blog" or "Articles."

**Solution**: EN: "Blog" or "Latest Articles". ID: already uses "Catatan Teknis" which is OK but could be "Blog" or "Artikel Terbaru".

---

## ~~WORD-12: Blog CTA "ACCESS_FULL_ARCHIVE"~~ [FIXED]

**Problem**: Same terminal-command style as WORD-09.

**Root cause**: `messages/en.json` line 47. Same in id.json.

**Proof**: Blog.tsx:45 renders `{t('cta')}`.

**Impact**: HIGH — CTA button.

**Solution**: EN: "View All Posts". ID: "Lihat Semua Artikel".

---

## ~~WORD-13: Blog card "READ_LOG_ENTRY"~~ [FIXED]

**Problem**: `READ_LOG_ENTRY` with underscores — robotic label for a "Read more" link.

**Root cause**: `messages/en.json` line 48. Same in id.json.

**Proof**: Blog.tsx:88 and BlogListPage.tsx:84 render `{t('readEntry')}`.

**Impact**: MEDIUM — Every blog card has this label.

**Solution**: EN: "Read Article". ID: "Baca Artikel".

---

## ~~WORD-14: Blog read time "READ_TIME: {minutes} MIN"~~ [FIXED]

**Problem**: `READ_TIME: 5 MIN` — underscore and colon formatting looks like a system log, not a reading estimate.

**Root cause**: `messages/en.json` line 51. ID: `"WAKTU_BACA: {minutes} MIN"`.

**Proof**: BlogDetailsPage.tsx:66 renders `{t('readTime', { minutes })}`.

**Impact**: LOW — Blog detail page only.

**Solution**: EN: "{minutes} min read". ID: "{minutes} menit baca".

---

## ~~WORD-15: Contact description uses dense jargon~~ [FIXED]

**Problem**: EN: "Accepting high-priority inquiries for complex service architectures and scalable engineering collaborations. Establish verified transit below." — "Establish verified transit below" is meaningless to a human.

**Root cause**: `messages/en.json` line 55.

**Proof**: Contact.tsx:62 renders `{desc}`.

**Impact**: HIGH — Contact section description. Should encourage visitors to reach out, not confuse them.

**Solution**: EN: "Have a project in mind or want to collaborate? Drop me a message below and I'll get back to you within 24 hours."

---

## ~~WORD-16: Contact form labels "01 / Request_Title" and "02 / Query_Payload"~~ [FIXED]

**Problem**: `Request_Title` and `Query_Payload` with underscores and numbering — looks like an API schema, not a form.

**Root cause**: `messages/en.json` lines 57-58. ID has better versions: "Judul Pesan" / "Isi Pesan".

**Proof**: Contact.tsx:104 and :118 render these labels.

**Impact**: MEDIUM — Form labels that users interact with.

**Solution**: EN: "Subject" and "Message". Keep the 01/02 numbering if desired but drop underscores: "01 / Subject" and "02 / Message".

---

## ~~WORD-17: Contact send button "Transmit_Protocol"~~ [FIXED]

**Problem**: `Transmit_Protocol` — no human clicks a button called this.

**Root cause**: `messages/en.json` line 65. Same in id.json line 65.

**Proof**: Contact.tsx:137 renders `{buttonTransmit}`.

**Impact**: HIGH — Primary action button on the contact form.

**Solution**: EN: "Send Message". ID: "Kirim Pesan".

---

## ~~WORD-18: Contact copy button "COPY_UID"~~ [FIXED]

**Problem**: `COPY_UID` — "UID" (User ID) is incorrect context. This copies an email address, not a user ID.

**Root cause**: `messages/en.json` line 66. Same in id.json.

**Proof**: Contact.tsx:93 renders `{buttonCopyUid}`.

**Impact**: LOW — Small secondary button.

**Solution**: EN: "Copy Email". ID: "Salin Email".

---

## ~~WORD-19: Hire banner badge "SYSTEM_AVAILABILITY :: OPEN_FOR_MISSIONS"~~ [FIXED]

**Problem**: `SYSTEM_AVAILABILITY :: OPEN_FOR_MISSIONS` — robotic jargon with double colons and underscores.

**Root cause**: `messages/en.json` line 73. Same in id.json.

**Proof**: HireMeBanner.tsx:65 renders `{badge}`.

**Impact**: MEDIUM — Prominent banner shown across multiple pages.

**Solution**: EN: "Available for Hire" or "Open to Work". ID: "Tersedia untuk Direkrut" or "Terbuka untuk Kerja Sama".

---

## ~~WORD-20: Hire banner CTA "INITIALIZE_Recruitment_Protocol"~~ [FIXED]

**Problem**: `INITIALIZE_Recruitment_Protocol` — the most egregious example. Underscores, mixed case, "Protocol" — sounds like starting a military operation.

**Root cause**: `messages/en.json` line 76. Same in id.json.

**Proof**: HireMeBanner.tsx CTA button renders `{ctaText}`.

**Impact**: HIGH — CTA button on the hire banner, shown on multiple pages.

**Solution**: EN: "Let's Work Together" or "Get in Touch". ID: "Mari Bekerja Sama" or "Hubungi Saya".

---

## ~~WORD-21: Hardcoded "LOG_DATE:" prefix on blog cards~~ [FIXED]

**Problem**: `LOG_DATE: 2025-05-17` — "LOG_DATE:" prefix with underscore makes dates look like system logs.

**Root cause**: Hardcoded in Blog.tsx:69 and BlogListPage.tsx:65: `LOG_DATE: {blog.date}`.

**Proof**: Visible on every blog card in both the homepage section and archive page.

**Impact**: MEDIUM — Every blog card shows this.

**Solution**: Just show the date directly without a prefix, or use "Published:" or a calendar icon with the date.

---

## ~~WORD-22: Hardcoded "BACK_TO_ROOT" and "RETURN_TO_ARCHIVES" navigation~~ [FIXED]

**Problem**: `BACK_TO_ROOT` and `RETURN_TO_ARCHIVES` — underscored terminal commands as navigation labels.

**Root cause**: Hardcoded in BlogListPage.tsx:34, ProjectListPage.tsx:35, BlogDetailsPage.tsx:36.

**Proof**: Visible as back-navigation links on archive and detail pages.

**Impact**: MEDIUM — Navigation labels on sub-pages.

**Solution**: "Back to Home" / "Back to Blog" — simple, human navigation text.

---

## ~~WORD-23: Hardcoded "Secure_Endpoint:" and "Response_Time:" in Contact~~ [FIXED]

**Problem**: `Secure_Endpoint:` labels the email address. `Response_Time: <24h / Verified` uses underscore and "Verified" as if it's a certificate.

**Root cause**: Hardcoded in Contact.tsx:80 and :171-172.

**Proof**: Visible on the contact form header and footer.

**Impact**: LOW — Decorative labels, but still reads as robotic.

**Solution**: "Email:" for the endpoint. "Typical response: within 24 hours" for the response time.

---

## ~~WORD-24: Blog detail "LOG_TYPE :: TECHNICAL_LOG" and "STATUS :: DEPLOYED" badges~~ [FIXED]

**Problem**: `LOG_TYPE :: TECHNICAL_LOG` and `STATUS :: DEPLOYED` — double-colon syntax and uppercase labels look like database entries.

**Root cause**: Hardcoded in BlogDetailsPage.tsx:44 and :47.

**Proof**: Visible as badges at the top of every blog post.

**Impact**: LOW — Small badges on blog detail page.

**Solution**: "Technical Article" and "Published" — or remove them entirely (they add no real information).

---

## ~~WORD-25: Blog detail author "DANIANSYAH_CORE"~~ [FIXED]

**Problem**: `DANIANSYAH_CORE` — underscore and "CORE" suffix make the author name look like a system process.

**Root cause**: Hardcoded in BlogDetailsPage.tsx:62.

**Proof**: Visible as the author name on every blog post.

**Impact**: MEDIUM — The author's name should be human-readable.

**Solution**: "Daniansyah Chusyaidin" or "Daniansyah" — the actual name without system-style formatting.

---

## ~~WORD-26: Game section uses excessive underscore/system terminology~~ [FIXED]

**Problem**: Multiple game strings use underscore formatting: `Session_Score`, `Terminal_High_Mark`, `Near_Record`, `System_Simulation`, `Sync_In_Progress`, `Simulation_Terminated`, `Final_Harvest`, `New_Terminal_Mark`, `PILOT_ID`, `COMMIT_IDENTITY`, `Identity_Secured:`.

**Root cause**: `messages/en.json` lines 81-103 and `messages/id.json` same section.

**Proof**: Rendered throughout SkyForceGame.tsx HUD and overlays.

**Impact**: LOW — The game is intentionally styled as a "system simulation" so some tactical language fits. But the underscores are still unnecessary.

**Solution**: Remove underscores but keep the tactical tone: "Score", "High Score", "Near Record", "System Simulation", "Syncing...", "Game Over", "Final Score", "New Record", "Enter Name", "Save", "Saved:", "Share Score", "Play Again".

---

## ~~WORD-27: HireMeBanner skill tags use underscores~~ [FIXED]

**Problem**: `Distributed_Eng`, `Security_First`, `High_Performance` — underscored labels.

**Root cause**: Hardcoded in HireMeBanner.tsx:80, 84, 88.

**Proof**: Visible as skill tags in the hire banner.

**Impact**: LOW — Decorative skill tags.

**Solution**: "Distributed Systems", "Security First", "High Performance" — remove underscores.

---

## Summary

| Severity | Count | Category |
|----------|-------|----------|
| HIGH | 5 | CTAs and primary buttons (WORD-01, 09, 12, 17, 20) |
| MEDIUM | 11 | Section headings, descriptions, labels (WORD-02, 03, 04, 06, 13, 15, 19, 21, 22, 25, 16) |
| LOW | 11 | Small labels, badges, decorative text (WORD-05, 07, 08, 10, 11, 14, 18, 23, 24, 26, 27) |
| **Total** | **27** | |

### Root pattern
The site uses a "tactical HUD / terminal" aesthetic. While this works for visual design (borders, fonts, colors), it was also applied to **actual text content** — CTAs, descriptions, labels, and navigation. The visual aesthetic and the copywriting should be separate: keep the tactical visual style but write text that a human would actually say.
