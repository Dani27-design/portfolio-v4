import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Only initialize if credentials are available (skips during build without env)
if (getApps().length === 0 && projectId && clientEmail && privateKey) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const adminDb: ReturnType<typeof getFirestore> | null = getApps().length > 0 ? getFirestore() : null;

/**
 * Delete a file from Firebase Storage using admin SDK.
 * Silently ignores errors (file may not exist).
 */
export async function deleteStorageFile(storagePath: string): Promise<void> {
  if (getApps().length === 0 || !storagePath) return;
  try {
    const bucket = getStorage().bucket();
    await bucket.file(storagePath).delete();
  } catch {
    // File may not exist — ignore
  }
}
