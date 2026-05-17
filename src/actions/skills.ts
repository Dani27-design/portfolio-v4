'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import type { SkillGroup } from '@/types';

export async function createSkillGroup(data: Omit<SkillGroup, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const now = new Date().toISOString();
  const ref = await adminDb.collection('skills').add({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath('/en');
  revalidatePath('/id');
  return ref.id;
}

export async function updateSkillGroup(id: string, data: Partial<Omit<SkillGroup, 'id'>>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('skills').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function deleteSkillGroup(id: string) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('skills').doc(id).delete();
  revalidatePath('/en');
  revalidatePath('/id');
}
