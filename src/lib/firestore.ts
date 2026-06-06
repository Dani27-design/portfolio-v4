import { cache } from 'react';
import { adminDb } from './firebase-admin';
import type { Project, Blog, ExperienceItem, SkillGroup, HeroContent, AboutContent, ContactContent, FooterContent, HireBannerContent, NavbarContent, LeaderboardEntry } from '@/types';

export const getProjects = cache(async (): Promise<Project[]> => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('projects')
      .orderBy('order', 'asc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  if (!adminDb) return null;
  try {
    const snapshot = await adminDb
      .collection('projects')
      .where('slug', '==', slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Project;
  } catch (err) {
    console.error('Failed to fetch project by slug:', err);
    return null;
  }
});

export const getAllProjectSlugs = cache(async (): Promise<string[]> => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb.collection('projects').select('slug').get();
    return snapshot.docs
      .map((doc) => doc.data().slug as string)
      .filter(Boolean);
  } catch (err) {
    console.error('Failed to fetch project slugs:', err);
    return [];
  }
});

export const getBlogs = cache(async (): Promise<Blog[]> => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('blogs')
      .orderBy('order', 'asc')
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Blog);
  } catch (err) {
    console.error('Failed to fetch blogs:', err);
    return [];
  }
});

export const getBlogBySlug = cache(async (slug: string): Promise<Blog | null> => {
  if (!adminDb) return null;
  try {
    const snapshot = await adminDb
      .collection('blogs')
      .where('slug', '==', slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Blog;
  } catch (err) {
    console.error('Failed to fetch blog by slug:', err);
    return null;
  }
});

export const getAllBlogSlugs = cache(async (): Promise<string[]> => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb.collection('blogs').select('slug').get();
    return snapshot.docs.map((doc) => doc.data().slug as string);
  } catch (err) {
    console.error('Failed to fetch blog slugs:', err);
    return [];
  }
});

export const getAllBlogSlugsWithUpdatedAt = cache(async (): Promise<{ slug: string; updatedAt: string }[]> => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb.collection('blogs').select('slug', 'updatedAt').get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return { slug: data.slug as string, updatedAt: data.updatedAt as string };
    });
  } catch (err) {
    console.error('Failed to fetch blog slugs with dates:', err);
    return [];
  }
});

export const getExperience = cache(async (): Promise<ExperienceItem[]> => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('experience')
      .orderBy('order', 'asc')
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as ExperienceItem,
    );
  } catch (err) {
    console.error('Failed to fetch experience:', err);
    return [];
  }
});

export const getSkills = cache(async (): Promise<SkillGroup[]> => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('skills')
      .orderBy('order', 'asc')
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as SkillGroup,
    );
  } catch (err) {
    console.error('Failed to fetch skills:', err);
    return [];
  }
});

export const getHeroContent = cache(async (): Promise<HeroContent | null> => {
  if (!adminDb) return null;
  try {
    const doc = await adminDb.collection('siteContent').doc('hero').get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as HeroContent;
  } catch (err) {
    console.error('Failed to fetch hero content:', err);
    return null;
  }
});

export const getAboutContent = cache(async (): Promise<AboutContent | null> => {
  if (!adminDb) return null;
  try {
    const doc = await adminDb.collection('siteContent').doc('about').get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as AboutContent;
  } catch (err) {
    console.error('Failed to fetch about content:', err);
    return null;
  }
});

export const getContactContent = cache(async (): Promise<ContactContent | null> => {
  if (!adminDb) return null;
  try {
    const doc = await adminDb.collection('siteContent').doc('contact').get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as ContactContent;
  } catch (err) {
    console.error('Failed to fetch contact content:', err);
    return null;
  }
});

export const getFooterContent = cache(async (): Promise<FooterContent | null> => {
  if (!adminDb) return null;
  try {
    const doc = await adminDb.collection('siteContent').doc('footer').get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as FooterContent;
  } catch (err) {
    console.error('Failed to fetch footer content:', err);
    return null;
  }
});

export const getHireBannerContent = cache(async (): Promise<HireBannerContent | null> => {
  if (!adminDb) return null;
  try {
    const doc = await adminDb.collection('siteContent').doc('hireBanner').get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as HireBannerContent;
  } catch (err) {
    console.error('Failed to fetch hire banner content:', err);
    return null;
  }
});

export const getNavbarContent = cache(async (): Promise<NavbarContent | null> => {
  if (!adminDb) return null;
  try {
    const doc = await adminDb.collection('siteContent').doc('navbar').get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as NavbarContent;
  } catch (err) {
    console.error('Failed to fetch navbar content:', err);
    return null;
  }
});

export const getLeaderboard = cache(async (limit: number = 10): Promise<LeaderboardEntry[]> => {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb
      .collection('leaderboard')
      .orderBy('score', 'desc')
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as LeaderboardEntry);
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
    return [];
  }
});
