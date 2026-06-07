import { cache } from 'react';
import { adminDb } from './firebase-admin';
import type { Project, Blog, ExperienceItem, SkillGroup, HeroContent, AboutContent, ContactContent, FooterContent, HireBannerContent, NavbarContent, LeaderboardEntry } from '@/types';

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb
    .collection('projects')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project);
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  if (!adminDb) return null;
  const snapshot = await adminDb
    .collection('projects')
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Project;
});

export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection('projects').select('slug').get();
  return snapshot.docs
    .map((doc) => doc.data().slug as string)
    .filter(Boolean);
});

export const getBlogs = cache(async (): Promise<Blog[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb
    .collection('blogs')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Blog);
});

export const getBlogBySlug = cache(async (slug: string): Promise<Blog | null> => {
  if (!adminDb) return null;
  const snapshot = await adminDb
    .collection('blogs')
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Blog;
});

export const getAllBlogSlugs = cache(async (): Promise<string[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection('blogs').select('slug').get();
  return snapshot.docs.map((doc) => doc.data().slug as string);
});

export const getAllBlogSlugsWithUpdatedAt = cache(async (): Promise<{ slug: string; updatedAt: string }[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection('blogs').select('slug', 'updatedAt').get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return { slug: data.slug as string, updatedAt: data.updatedAt as string };
  });
});

export const getExperience = cache(async (): Promise<ExperienceItem[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb
    .collection('experience')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as ExperienceItem,
  );
});

export const getSkills = cache(async (): Promise<SkillGroup[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb
    .collection('skills')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as SkillGroup,
  );
});

export const getHeroContent = cache(async (): Promise<HeroContent | null> => {
  if (!adminDb) return null;
  const doc = await adminDb.collection('siteContent').doc('hero').get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as HeroContent;
});

export const getAboutContent = cache(async (): Promise<AboutContent | null> => {
  if (!adminDb) return null;
  const doc = await adminDb.collection('siteContent').doc('about').get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as AboutContent;
});

export const getContactContent = cache(async (): Promise<ContactContent | null> => {
  if (!adminDb) return null;
  const doc = await adminDb.collection('siteContent').doc('contact').get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as ContactContent;
});

export const getFooterContent = cache(async (): Promise<FooterContent | null> => {
  if (!adminDb) return null;
  const doc = await adminDb.collection('siteContent').doc('footer').get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as FooterContent;
});

export const getHireBannerContent = cache(async (): Promise<HireBannerContent | null> => {
  if (!adminDb) return null;
  const doc = await adminDb.collection('siteContent').doc('hireBanner').get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as HireBannerContent;
});

export const getNavbarContent = cache(async (): Promise<NavbarContent | null> => {
  if (!adminDb) return null;
  const doc = await adminDb.collection('siteContent').doc('navbar').get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as NavbarContent;
});

export const getLeaderboard = cache(async (limit: number = 10): Promise<LeaderboardEntry[]> => {
  if (!adminDb) return [];
  const snapshot = await adminDb
    .collection('leaderboard')
    .orderBy('score', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as LeaderboardEntry);
});
