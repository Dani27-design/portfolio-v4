import { adminDb } from './firebase-admin';
import type { Project, Blog, ExperienceItem, SkillGroup } from '@/types';

export async function getProjects(): Promise<Project[]> {
  if (!adminDb) return [];
  const snapshot = await adminDb
    .collection('projects')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project);
}

export async function getBlogs(): Promise<Blog[]> {
  if (!adminDb) return [];
  const snapshot = await adminDb
    .collection('blogs')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Blog);
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (!adminDb) return null;
  const snapshot = await adminDb
    .collection('blogs')
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Blog;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  if (!adminDb) return [];
  const snapshot = await adminDb.collection('blogs').select('slug').get();
  return snapshot.docs.map((doc) => doc.data().slug as string);
}

export async function getExperience(): Promise<ExperienceItem[]> {
  if (!adminDb) return [];
  const snapshot = await adminDb
    .collection('experience')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as ExperienceItem,
  );
}

export async function getSkills(): Promise<SkillGroup[]> {
  if (!adminDb) return [];
  const snapshot = await adminDb
    .collection('skills')
    .orderBy('order', 'asc')
    .get();
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as SkillGroup,
  );
}
