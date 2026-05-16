import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Only initialize if credentials are available (skips during build without env)
if (getApps().length === 0 && projectId && clientEmail && privateKey) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

// These will throw if accessed without initialization - handled in firestore.ts
export const adminDb = getApps().length > 0 ? getFirestore() : (null as unknown as ReturnType<typeof getFirestore>);
export const adminAuth = getApps().length > 0 ? getAuth() : (null as unknown as ReturnType<typeof getAuth>);
