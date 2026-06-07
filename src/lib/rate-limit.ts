import { adminDb } from './firebase-admin';

const COLLECTION = '_rateLimits';

/**
 * Firestore-based rate limiter that persists across serverless cold starts.
 * Each IP+endpoint pair is stored as a single document with an array of timestamps.
 * Old timestamps are pruned on every access.
 *
 * Returns true if the request should be rate-limited (blocked).
 */
export async function isRateLimitedPersistent(
  ip: string,
  endpoint: string,
  max: number,
  windowMs: number,
): Promise<boolean> {
  if (!adminDb) return false;

  const docId = `${endpoint}:${ip.replace(/[/.]/g, '_')}`;
  const now = Date.now();

  try {
    const docRef = adminDb.collection(COLLECTION).doc(docId);
    const doc = await docRef.get();

    const stored: number[] = doc.exists ? (doc.data()?.timestamps ?? []) : [];
    const valid = stored.filter((t: number) => now - t < windowMs);

    if (valid.length >= max) {
      return true;
    }

    valid.push(now);
    await docRef.set({ timestamps: valid, updatedAt: now });
    return false;
  } catch {
    // If Firestore fails, allow the request through (fail open)
    return false;
  }
}
