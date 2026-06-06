'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { validate, heroContentSchema, aboutContentSchema, contactContentSchema, footerContentSchema, hireBannerContentSchema, navbarContentSchema } from '@/lib/validation';

export async function updateHeroContent(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(heroContentSchema, data);
  await adminDb.collection('siteContent').doc('hero').set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function updateAboutContent(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(aboutContentSchema, data);
  await adminDb.collection('siteContent').doc('about').set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function updateContactContent(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(contactContentSchema, data);
  await adminDb.collection('siteContent').doc('contact').set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function updateFooterContent(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(footerContentSchema, data);
  await adminDb.collection('siteContent').doc('footer').set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function updateHireBannerContent(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(hireBannerContentSchema, data);
  await adminDb.collection('siteContent').doc('hireBanner').set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
}

export async function updateNavbarContent(data: unknown) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  const validated = validate(navbarContentSchema, data);
  await adminDb.collection('siteContent').doc('navbar').set({
    ...validated,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}
