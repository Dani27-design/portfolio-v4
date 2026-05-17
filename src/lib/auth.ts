import { cookies } from 'next/headers';
import { getTokens } from 'next-firebase-auth-edge';
import { ADMIN_EMAIL } from './constants';

/**
 * Verifies the current request has a valid admin auth cookie.
 * Returns true if the caller is the authenticated admin, false otherwise.
 * Gracefully returns false when env vars are missing (dev without credentials).
 */
export async function verifyAdmin(): Promise<boolean> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // Skip auth in dev without credentials
  if (!apiKey || !projectId || !clientEmail || !privateKey) {
    return false;
  }

  try {
    const cookieStore = await cookies();
    const tokens = await getTokens(cookieStore, {
      apiKey,
      cookieName: 'AuthToken',
      cookieSignatureKeys: [
        process.env.COOKIE_SECRET_CURRENT!,
        process.env.COOKIE_SECRET_PREVIOUS!,
      ],
      serviceAccount: {
        projectId,
        clientEmail,
        privateKey,
      },
    });

    if (!tokens) return false;
    return tokens.decodedToken.email === ADMIN_EMAIL;
  } catch {
    return false;
  }
}
