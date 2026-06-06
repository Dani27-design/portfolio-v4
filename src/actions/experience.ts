'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { validate, experienceCreateSchema, experienceUpdateSchema } from '@/lib/validation';

export async function createExperience(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(experienceCreateSchema, data);
  const now = new Date().toISOString();
  const ref = await adminDb.collection('experience').add({
    ...validated,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath('/en');
  revalidatePath('/id');
  return ref.id;
}

export async function updateExperience(id: string, data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  const validated = validate(experienceUpdateSchema, data);
  await adminDb.collection('experience').doc(id).update({
    ...validated,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function deleteExperience(id: string) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  await adminDb.collection('experience').doc(id).delete();
  revalidatePath('/en');
  revalidatePath('/id');
}
