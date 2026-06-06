'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { validate, projectCreateSchema, projectUpdateSchema } from '@/lib/validation';

export async function createProject(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(projectCreateSchema, data);
  const now = new Date().toISOString();
  const ref = await adminDb.collection('projects').add({
    ...validated,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
  revalidatePath('/en');
  revalidatePath('/id');
  return ref.id;
}

export async function updateProject(id: string, data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  const validated = validate(projectUpdateSchema, data);
  await adminDb.collection('projects').doc(id).update({
    ...validated,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function deleteProject(id: string) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  await adminDb.collection('projects').doc(id).delete();
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
  revalidatePath('/en');
  revalidatePath('/id');
}
