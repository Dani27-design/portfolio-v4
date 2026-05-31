import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock firebase-admin modules before import
vi.mock('firebase-admin/app', () => ({
  initializeApp: vi.fn(),
  getApps: vi.fn(() => []),
  cert: vi.fn((config) => config),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({ collection: vi.fn() })),
}));

describe('firebase-admin', () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_CLIENT_EMAIL;
    delete process.env.FIREBASE_PRIVATE_KEY;
  });

  it('exports null adminDb when credentials are missing', async () => {
    const { getApps } = await import('firebase-admin/app');
    (getApps as ReturnType<typeof vi.fn>).mockReturnValue([]);

    const mod = await import('./firebase-admin');
    expect(mod.adminDb).toBeNull();
  });

  it('exports Firestore instance when app is initialized', async () => {
    const mockDb = { collection: vi.fn() };
    const { getApps } = await import('firebase-admin/app');
    const { getFirestore } = await import('firebase-admin/firestore');
    (getApps as ReturnType<typeof vi.fn>).mockReturnValue([{}]);
    (getFirestore as ReturnType<typeof vi.fn>).mockReturnValue(mockDb);

    const mod = await import('./firebase-admin');
    expect(mod.adminDb).toBe(mockDb);
  });
});
