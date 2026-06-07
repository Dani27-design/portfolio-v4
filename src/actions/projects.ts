'use server';

import { adminDb, deleteStorageFile } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { validate, projectCreateSchema, projectUpdateSchema } from '@/lib/validation';

export async function createProject(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(projectCreateSchema, data);
  const existing = await adminDb.collection('projects').where('slug', '==', validated.slug).limit(1).get();
  if (!existing.empty) throw new Error(`Project with slug "${validated.slug}" already exists`);
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
  if (validated.slug) {
    const existing = await adminDb.collection('projects').where('slug', '==', validated.slug).limit(1).get();
    if (!existing.empty && existing.docs[0].id !== id) throw new Error(`Project with slug "${validated.slug}" already exists`);
  }
  await adminDb.collection('projects').doc(id).update({
    ...validated,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
  revalidatePath('/en');
  revalidatePath('/id');
  if (validated.slug) {
    revalidatePath(`/en/projects/${validated.slug}`);
    revalidatePath(`/id/projects/${validated.slug}`);
  }
}

export async function deleteProject(id: string) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  const doc = await adminDb.collection('projects').doc(id).get();
  if (doc.exists) {
    const data = doc.data();
    const mediaItems = (data?.media ?? []) as { storagePath?: string }[];
    await Promise.all(
      mediaItems
        .filter((m) => m.storagePath)
        .map((m) => deleteStorageFile(m.storagePath!)),
    );
  }
  await adminDb.collection('projects').doc(id).delete();
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
  revalidatePath('/en');
  revalidatePath('/id');
}
