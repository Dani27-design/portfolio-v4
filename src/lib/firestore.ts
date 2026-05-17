import { adminDb } from './firebase-admin';
import type { Project, Blog, ExperienceItem, SkillGroup } from '@/types';

export async function getProjects(): Promise<Project[]> {
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
}

export async function getBlogs(): Promise<Blog[]> {
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
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
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
}

export async function getAllBlogSlugs(): Promise<string[]> {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb.collection('blogs').select('slug').get();
    return snapshot.docs.map((doc) => doc.data().slug as string);
  } catch (err) {
    console.error('Failed to fetch blog slugs:', err);
    return [];
  }
}

export async function getAllBlogSlugsWithUpdatedAt(): Promise<{ slug: string; updatedAt: string }[]> {
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
}

export async function getExperience(): Promise<ExperienceItem[]> {
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
}

export async function getSkills(): Promise<SkillGroup[]> {
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
}
