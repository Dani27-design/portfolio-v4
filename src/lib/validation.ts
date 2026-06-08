import { z } from 'zod';

// --- Reusable sub-schemas ---

const bilingualSchema = z.object({
  en: z.string().max(2000),
  id: z.string().max(2000),
});

const bilingualLongSchema = z.object({
  en: z.string().max(200000),
  id: z.string().max(200000),
});

const bilingualShortSchema = z.object({
  en: z.string().max(500),
  id: z.string().max(500),
});

const bilingualArraySchema = z.object({
  en: z.array(z.string().max(2000)).max(20),
  id: z.array(z.string().max(2000)).max(20),
});

const mediaItemSchema = z.object({
  url: z.string().max(2000),
  type: z.enum(['image', 'video']),
  storagePath: z.string().max(500).optional(),
  order: z.number().int(),
});

const skillItemSchema = z.object({
  name: z.string().max(200),
  tag: z.string().max(200),
});

const statItemSchema = z.object({
  value: z.string().max(200),
  label: bilingualShortSchema,
});

// --- Entity schemas (create) ---

export const blogCreateSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: bilingualShortSchema,
  excerpt: bilingualSchema,
  content: z.string().max(200000),
  coverImage: z.string().max(2000).optional(),
  coverStoragePath: z.string().max(500).optional(),
  date: z.string().min(1).max(50).regex(/^\d{4}-\d{2}-\d{2}/, 'Date must start with YYYY-MM-DD format'),
  order: z.number().int(),
});

export const blogUpdateSchema = blogCreateSchema.partial();

export const projectCreateSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  name: bilingualShortSchema,
  desc: bilingualSchema,
  content: bilingualLongSchema.optional(),
  tech: z.array(z.string().max(200)).max(30),
  status: z.string().max(200),
  image: z.string().max(2000).optional(),
  videoUrl: z.string().max(2000).optional(),
  media: z.array(mediaItemSchema).max(50).optional(),
  url: z.string().max(2000).optional(),
  order: z.number().int(),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const experienceCreateSchema = z.object({
  title: bilingualShortSchema,
  company: z.string().min(1).max(500),
  period: bilingualShortSchema,
  points: bilingualArraySchema,
  isCurrent: z.boolean(),
  order: z.number().int(),
});

export const experienceUpdateSchema = experienceCreateSchema.partial();

export const skillGroupCreateSchema = z.object({
  title: bilingualShortSchema,
  context: bilingualSchema,
  skills: z.array(skillItemSchema).max(50),
  order: z.number().int(),
});

export const skillGroupUpdateSchema = skillGroupCreateSchema.partial();

export const heroContentSchema = z.object({
  tagline: bilingualShortSchema,
  headline: bilingualShortSchema,
  desc: bilingualSchema,
  ctaGame: bilingualShortSchema,
  ctaContact: bilingualShortSchema,
  phrases: bilingualArraySchema,
});

export const aboutContentSchema = z.object({
  title: bilingualShortSchema,
  headline: bilingualShortSchema,
  desc: bilingualSchema,
  avatarUrl: z.string().max(2000).optional(),
  stats: z.object({
    stat1: statItemSchema,
    stat2: statItemSchema,
    stat3: statItemSchema,
  }),
});

export const contactContentSchema = z.object({
  headline: bilingualShortSchema,
  desc: bilingualSchema,
  email: z.string().email().min(1).max(500),
  labels: z.object({
    title: bilingualShortSchema,
    payload: bilingualShortSchema,
  }),
  placeholders: z.object({
    title: bilingualShortSchema,
    payload: bilingualShortSchema,
  }),
  buttons: z.object({
    transmit: bilingualShortSchema,
    copyUid: bilingualShortSchema,
  }),
  socials: z.object({
    github: z.string().max(2000),
    linkedin: z.string().max(2000),
    instagram: z.string().max(2000),
    whatsapp: z.string().max(2000),
  }),
});

export const footerContentSchema = z.object({
  ownerName: z.string().min(1).max(500),
  role: bilingualShortSchema,
});

export const hireBannerContentSchema = z.object({
  headline: bilingualShortSchema,
  desc: bilingualSchema,
  cta: bilingualShortSchema,
});

export const navbarContentSchema = z.object({
  logoUrl: z.string().max(2000).optional(),
  brandName: z.string().max(200).optional(),
  labels: z.object({
    about: bilingualShortSchema,
    stack: bilingualShortSchema,
    experience: bilingualShortSchema,
    projects: bilingualShortSchema,
    blog: bilingualShortSchema,
    contact: bilingualShortSchema,
  }),
});

// --- Validation helper ---

export function validate<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const messages = result.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`
    );
    throw new Error(`Validation failed: ${messages.join('; ')}`);
  }
  return result.data;
}
