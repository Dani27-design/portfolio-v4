'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { validate, skillGroupCreateSchema, skillGroupUpdateSchema } from '@/lib/validation';

export async function createSkillGroup(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(skillGroupCreateSchema, data);
  const now = new Date().toISOString();
  const ref = await adminDb.collection('skills').add({
    ...validated,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath('/en');
  revalidatePath('/id');
  return ref.id;
}

export async function updateSkillGroup(id: string, data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  const validated = validate(skillGroupUpdateSchema, data);
  await adminDb.collection('skills').doc(id).update({
    ...validated,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function deleteSkillGroup(id: string) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  await adminDb.collection('skills').doc(id).delete();
  revalidatePath('/en');
  revalidatePath('/id');
}
