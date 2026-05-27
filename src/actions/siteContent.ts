'use server';

import { adminDb } from '@/lib/firebase-admin';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import type { HeroContent, AboutContent, ContactContent, FooterContent, HireBannerContent, NavbarContent } from '@/types';

export async function updateHeroContent(data: Omit<HeroContent, 'id' | 'updatedAt'>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('siteContent').doc('hero').set({
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function updateAboutContent(data: Omit<AboutContent, 'id' | 'updatedAt'>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('siteContent').doc('about').set({
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function updateContactContent(data: Omit<ContactContent, 'id' | 'updatedAt'>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('siteContent').doc('contact').set({
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function updateFooterContent(data: Omit<FooterContent, 'id' | 'updatedAt'>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('siteContent').doc('footer').set({
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}

export async function updateHireBannerContent(data: Omit<HireBannerContent, 'id' | 'updatedAt'>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('siteContent').doc('hireBanner').set({
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
  revalidatePath('/en/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en/projects');
  revalidatePath('/id/projects');
}

export async function updateNavbarContent(data: Omit<NavbarContent, 'id' | 'updatedAt'>) {
  if (!(await verifyAdmin())) throw new Error('Unauthorized');
  if (!adminDb) throw new Error('Firebase not initialized');
  await adminDb.collection('siteContent').doc('navbar').set({
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
  revalidatePath('/en');
  revalidatePath('/id');
}
