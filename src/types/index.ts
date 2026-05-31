export type Locale = 'en' | 'id';
export type Bilingual = Record<Locale, string>;
export type BilingualArray = Record<Locale, string[]>;

export interface Project {
  id: string;
  slug: string;
  name: Bilingual;
  desc: Bilingual;
  content?: Bilingual;
  tech: string[];
  status: string;
  image?: string;
  videoUrl?: string;
  url?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  content: string;
  date: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceItem {
  id: string;
  title: Bilingual;
  company: string;
  period: Bilingual;
  points: BilingualArray;
  isCurrent: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillItem {
  name: string;
  tag: string;
}

export interface SkillGroup {
  id: string;
  title: Bilingual;
  context: Bilingual;
  skills: SkillItem[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface StatItem {
  value: string;
  label: Bilingual;
}

export interface HeroContent {
  id: string;
  tagline: Bilingual;
  headline: Bilingual;
  desc: Bilingual;
  ctaGame: Bilingual;
  ctaContact: Bilingual;
  phrases: BilingualArray;
  updatedAt: string;
}

export interface AboutContent {
  id: string;
  title: Bilingual;
  headline: Bilingual;
  desc: Bilingual;
  stats: {
    stat1: StatItem;
    stat2: StatItem;
    stat3: StatItem;
  };
  avatarUrl?: string;
  updatedAt: string;
}

export interface ContactContent {
  id: string;
  headline: Bilingual;
  desc: Bilingual;
  email: string;
  labels: {
    title: Bilingual;
    payload: Bilingual;
  };
  placeholders: {
    title: Bilingual;
    payload: Bilingual;
  };
  buttons: {
    transmit: Bilingual;
    copyUid: Bilingual;
  };
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
    whatsapp: string;
  };
  updatedAt: string;
}

export interface FooterContent {
  id: string;
  ownerName: string;
  role: Bilingual;
  updatedAt: string;
}

export interface HireBannerContent {
  id: string;
  headline: Bilingual;
  desc: Bilingual;
  cta: Bilingual;
  updatedAt: string;
}

export interface NavbarContent {
  id: string;
  labels: {
    about: Bilingual;
    stack: Bilingual;
    experience: Bilingual;
    projects: Bilingual;
    blog: Bilingual;
    contact: Bilingual;
  };
  logoUrl?: string;
  brandName?: string;
  updatedAt: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}
