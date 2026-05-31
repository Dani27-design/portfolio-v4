import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from 'next-firebase-auth-edge';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

function getAuthConfig() {
  return {
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
  };
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If env vars are missing, skip all auth (dev without credentials)
  const hasCredentials = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.FIREBASE_PROJECT_ID;

  // Bare root path: permanent redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url), 308);
  }

  // API routes (except auth endpoints): skip middleware entirely
  if (pathname.startsWith('/api/') && pathname !== '/api/login' && pathname !== '/api/logout') {
    return NextResponse.next();
  }

  // Auth cookie endpoints: let authMiddleware handle login/logout cookie setting
  if (pathname === '/api/login' || pathname === '/api/logout') {
    if (!hasCredentials) {
      return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
    }
    return authMiddleware(request, {
      ...getAuthConfig(),
      handleValidToken: async () => NextResponse.next(),
      handleInvalidToken: async () => NextResponse.next(),
    });
  }

  // Admin routes (except login page): check Firebase auth session
  if (pathname.includes('/admin') && !pathname.includes('/admin/login')) {
    if (!hasCredentials) {
      const locale = pathname.split('/')[1] || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }

    const locale = pathname.split('/')[1] || routing.defaultLocale;

    return authMiddleware(request, {
      ...getAuthConfig(),
      handleInvalidToken: async () => {
        return NextResponse.redirect(
          new URL(`/${locale}/admin/login`, request.url)
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
  matcher: [
    // All pages (excluding static files and _next internals)
    '/((?!trpc|_next|_vercel|.*\\..*).*)',
    // Auth cookie endpoints
    '/api/login',
    '/api/logout',
  ],
};
