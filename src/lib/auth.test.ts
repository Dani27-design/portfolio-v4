import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

vi.mock('next-firebase-auth-edge', () => ({
  getTokens: vi.fn(),
}));

vi.mock('./constants', () => ({
  ADMIN_EMAIL: 'admin@test.com',
}));

import { verifyAdmin } from './auth';

describe('verifyAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;
  });

  it('returns false when env vars are missing', async () => {
    const result = await verifyAdmin();
    expect(result).toBe(false);
  });

  it('returns false when getTokens returns null', async () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'key';
    process.env.FIREBASE_PROJECT_ID = 'proj';
    process.env.FIREBASE_CLIENT_EMAIL = 'email';
    process.env.FIREBASE_PRIVATE_KEY = 'pk';
    process.env.COOKIE_SECRET_CURRENT = 'secret1';
    process.env.COOKIE_SECRET_PREVIOUS = 'secret2';

    const { cookies } = await import('next/headers');
    (cookies as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { getTokens } = await import('next-firebase-auth-edge');
    (getTokens as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const result = await verifyAdmin();
    expect(result).toBe(false);
  });

  it('returns true when token email matches ADMIN_EMAIL', async () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'key';
    process.env.FIREBASE_PROJECT_ID = 'proj';
    process.env.FIREBASE_CLIENT_EMAIL = 'email';
    process.env.FIREBASE_PRIVATE_KEY = 'pk';
    process.env.COOKIE_SECRET_CURRENT = 'secret1';
    process.env.COOKIE_SECRET_PREVIOUS = 'secret2';

    const { cookies } = await import('next/headers');
    (cookies as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { getTokens } = await import('next-firebase-auth-edge');
    (getTokens as ReturnType<typeof vi.fn>).mockResolvedValue({
      decodedToken: { email: 'admin@test.com' },
    });

    const result = await verifyAdmin();
    expect(result).toBe(true);
  });

  it('returns false when token email does not match', async () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'key';
    process.env.FIREBASE_PROJECT_ID = 'proj';
    process.env.FIREBASE_CLIENT_EMAIL = 'email';
    process.env.FIREBASE_PRIVATE_KEY = 'pk';
    process.env.COOKIE_SECRET_CURRENT = 'secret1';
    process.env.COOKIE_SECRET_PREVIOUS = 'secret2';

    const { cookies } = await import('next/headers');
    (cookies as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { getTokens } = await import('next-firebase-auth-edge');
    (getTokens as ReturnType<typeof vi.fn>).mockResolvedValue({
      decodedToken: { email: 'other@test.com' },
    });

    const result = await verifyAdmin();
    expect(result).toBe(false);
  });

  it('returns false when getTokens throws', async () => {
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'key';
    process.env.FIREBASE_PROJECT_ID = 'proj';
    process.env.FIREBASE_CLIENT_EMAIL = 'email';
    process.env.FIREBASE_PRIVATE_KEY = 'pk';
    process.env.COOKIE_SECRET_CURRENT = 'secret1';
    process.env.COOKIE_SECRET_PREVIOUS = 'secret2';

    const { cookies } = await import('next/headers');
    (cookies as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { getTokens } = await import('next-firebase-auth-edge');
    (getTokens as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('fail'));

    const result = await verifyAdmin();
    expect(result).toBe(false);
  });
});
