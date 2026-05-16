'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import type { Blog } from '@/types';

export async function createBlog(data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!adminDb) throw new Error('Firebase not initialized');
  const now = new Date().toISOString();
  const ref = await adminDb.collection('blogs').add({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en');
  revalidatePath('/id');
  return ref.id;
}

export async function updateBlog(id: string, data: Partial<Omit<Blog, 'id'>>) {
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('blogs').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  });
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en');
  revalidatePath('/id');
  if (data.slug) {
    revalidatePath(`/en/blog/${data.slug}`);
    revalidatePath(`/id/blog/${data.slug}`);
  }
}

export async function deleteBlog(id: string) {
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('blogs').doc(id).delete();
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en');
  revalidatePath('/id');
}
