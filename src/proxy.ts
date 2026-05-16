import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from 'next-firebase-auth-edge';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes (except login): check Firebase auth session
  if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
    // If env vars are missing, skip auth check (dev without credentials)
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.FIREBASE_PROJECT_ID) {
      return intlMiddleware(request);
    }

    return authMiddleware(request, {
      loginPath: '/api/login',
      logoutPath: '/api/logout',
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      cookieName: 'AuthToken',
      cookieSignatureKeys: [
        process.env.COOKIE_SECRET_CURRENT!,
        process.env.COOKIE_SECRET_PREVIOUS!,
      ],
      cookieSerializeOptions: {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 12 * 60 * 60 * 24, // 12 days
      },
      serviceAccount: {
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      handleInvalidToken: async () => {
        return NextResponse.redirect(
          new URL(`/${routing.defaultLocale}/admin/login`, request.url)
        );
      },
      handleValidToken: async () => {
        return intlMiddleware(request);
      },
    });
  }

  // Public routes: only i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
