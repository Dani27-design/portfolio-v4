'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { Project } from '@/types';

export async function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!adminDb) throw new Error('Firebase not initialized');
  const now = new Date().toISOString();
  const ref = await adminDb.collection('projects').add({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
  revalidatePath('/en');
  revalidatePath('/id');
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Omit<Project, 'id'>>) {
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('projects').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function deleteProject(id: string) {
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('projects').doc(id).delete();
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
  revalidatePath('/en');
  revalidatePath('/id');
}
