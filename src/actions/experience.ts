'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { ExperienceItem } from '@/types';

export async function createExperience(data: Omit<ExperienceItem, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!adminDb) throw new Error('Firebase not initialized');
  const now = new Date().toISOString();
  const ref = await adminDb.collection('experience').add({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath('/en');
  revalidatePath('/id');
  return ref.id;
}

export async function updateExperience(id: string, data: Partial<Omit<ExperienceItem, 'id'>>) {
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('experience').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function deleteExperience(id: string) {
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('experience').doc(id).delete();
  revalidatePath('/en');
  revalidatePath('/id');
}
