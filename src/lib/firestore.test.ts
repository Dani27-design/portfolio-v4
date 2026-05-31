import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./firebase-admin', () => {
  const mockCollection = vi.fn();
  return { adminDb: { collection: mockCollection }, __mockCollection: mockCollection };
});

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return { ...actual, cache: (fn: Function) => fn };
});

import {
  getProjects,
  getBlogs,
  getHeroContent,
  getContactContent,
  getLeaderboard,
} from './firestore';

// Access the mock collection
const getMockCollection = async () => {
  const mod = await import('./firebase-admin') as Record<string, unknown>;
  return mod.__mockCollection as ReturnType<typeof vi.fn>;
};

describe('firestore', () => {
  let mockCollection: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    mockCollection = await getMockCollection();
    mockCollection.mockReset();
  });

  describe('getProjects', () => {
    it('returns projects array from Firestore', async () => {
      mockCollection.mockReturnValueOnce({
        orderBy: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({
            docs: [{ id: '1', data: () => ({ name: { en: 'P1', id: 'P1' }, order: 1 }) }],
          }),
        })),
      });

      const result = await getProjects();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns empty array on error', async () => {
      mockCollection.mockReturnValueOnce({
        orderBy: vi.fn(() => ({
          get: vi.fn().mockRejectedValue(new Error('fail')),
        })),
      });

      const result = await getProjects();
      expect(result).toEqual([]);
    });
  });

  describe('getBlogs', () => {
    it('returns blogs array', async () => {
      mockCollection.mockReturnValueOnce({
        orderBy: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({
            docs: [{ id: 'b1', data: () => ({ slug: 'test', title: { en: 'T', id: 'T' } }) }],
          }),
        })),
      });

      const result = await getBlogs();
      expect(result).toHaveLength(1);
    });
  });

  describe('getHeroContent', () => {
    it('returns data when doc exists', async () => {
      mockCollection.mockReturnValueOnce({
        doc: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({ exists: true, id: 'hero', data: () => ({ tagline: { en: 'T', id: 'T' } }) }),
        })),
      });

      const result = await getHeroContent();
      expect(result).not.toBeNull();
      expect(result?.id).toBe('hero');
    });

    it('returns null when doc missing', async () => {
      mockCollection.mockReturnValueOnce({
        doc: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({ exists: false }),
        })),
      });

      const result = await getHeroContent();
      expect(result).toBeNull();
    });
  });

  describe('getContactContent', () => {
    it('returns data', async () => {
      mockCollection.mockReturnValueOnce({
        doc: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({ exists: true, id: 'contact', data: () => ({ email: 'test@test.com' }) }),
        })),
      });

      const result = await getContactContent();
      expect(result).not.toBeNull();
    });
  });

  describe('getLeaderboard', () => {
    it('returns entries', async () => {
      mockCollection.mockReturnValueOnce({
        orderBy: vi.fn(() => ({
          limit: vi.fn(() => ({
            get: vi.fn().mockResolvedValue({
              docs: [{ id: 'e1', data: () => ({ name: 'PLAYER', score: 100 }) }],
            }),
          })),
        })),
      });

      const result = await getLeaderboard(10);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('PLAYER');
    });
  });
});
