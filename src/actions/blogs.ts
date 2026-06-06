'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { validate, blogCreateSchema, blogUpdateSchema } from '@/lib/validation';

export async function createBlog(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(blogCreateSchema, data);
  const existing = await adminDb.collection('blogs').where('slug', '==', validated.slug).limit(1).get();
  if (!existing.empty) throw new Error(`Blog with slug "${validated.slug}" already exists`);
  const now = new Date().toISOString();
  const ref = await adminDb.collection('blogs').add({
    ...validated,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en');
  revalidatePath('/id');
  return ref.id;
}

export async function updateBlog(id: string, data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  const validated = validate(blogUpdateSchema, data);
  if (validated.slug) {
    const existing = await adminDb.collection('blogs').where('slug', '==', validated.slug).limit(1).get();
    if (!existing.empty && existing.docs[0].id !== id) throw new Error(`Blog with slug "${validated.slug}" already exists`);
  }
  await adminDb.collection('blogs').doc(id).update({
    ...validated,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en');
  revalidatePath('/id');
  if (validated.slug) {
    revalidatePath(`/en/blog/${validated.slug}`);
    revalidatePath(`/id/blog/${validated.slug}`);
  }
}

export async function deleteBlog(id: string) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (!id || typeof id !== 'string') throw new Error('Invalid ID');
  const doc = await adminDb.collection('blogs').doc(id).get();
  const slug = doc.exists ? (doc.data()?.slug as string) : null;
  await adminDb.collection('blogs').doc(id).delete();
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en');
  revalidatePath('/id');
  if (slug) {
    revalidatePath(`/en/blog/${slug}`);
    revalidatePath(`/id/blog/${slug}`);
  }
}
