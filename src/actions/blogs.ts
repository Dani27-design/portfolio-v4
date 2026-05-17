'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import type { Blog } from '@/types';

export async function createBlog(data: Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const existing = await adminDb.collection('blogs').where('slug', '==', data.slug).limit(1).get();
  if (!existing.empty) throw new Error(`Blog with slug "${data.slug}" already exists`);
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
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  if (data.slug) {
    const existing = await adminDb.collection('blogs').where('slug', '==', data.slug).limit(1).get();
    if (!existing.empty && existing.docs[0].id !== id) throw new Error(`Blog with slug "${data.slug}" already exists`);
  }
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
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
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
