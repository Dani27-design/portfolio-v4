export type Locale = 'en' | 'id';
export type Bilingual = Record<Locale, string>;
export type BilingualArray = Record<Locale, string[]>;

export interface Project {
  id: string;
  name: Bilingual;
  desc: Bilingual;
  tech: string[];
  version: string;
  status: string;
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
