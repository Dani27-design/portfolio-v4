import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGet, mockSet, mockDoc, mockCollection } = vi.hoisted(() => {
  const mockGet = vi.fn();
  const mockSet = vi.fn();
  const mockDoc = vi.fn(() => ({ get: mockGet, set: mockSet }));
  const mockCollection = vi.fn(() => ({ doc: mockDoc }));
  return { mockGet, mockSet, mockDoc, mockCollection };
});

vi.mock('./firebase-admin', () => ({
  adminDb: { collection: mockCollection },
}));

import { isRateLimitedPersistent } from './rate-limit';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('isRateLimitedPersistent', () => {
  it('allows request when no previous hits exist', async () => {
    mockGet.mockResolvedValue({ exists: false });
    mockSet.mockResolvedValue(undefined);

    const result = await isRateLimitedPersistent('1.2.3.4', 'contact', 5, 60_000);

    expect(result).toBe(false);
    expect(mockCollection).toHaveBeenCalledWith('_rateLimits');
    expect(mockDoc).toHaveBeenCalledWith('contact:1_2_3_4');
    expect(mockSet).toHaveBeenCalledOnce();
    const setArg = mockSet.mock.calls[0][0];
    expect(setArg.timestamps).toHaveLength(1);
  });

  it('allows request when under the limit', async () => {
    const now = Date.now();
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ timestamps: [now - 10_000, now - 20_000] }),
    });
    mockSet.mockResolvedValue(undefined);

    const result = await isRateLimitedPersistent('1.2.3.4', 'contact', 5, 60_000);

    expect(result).toBe(false);
    const setArg = mockSet.mock.calls[0][0];
    expect(setArg.timestamps).toHaveLength(3); // 2 existing + 1 new
  });

  it('blocks request when at the limit', async () => {
    const now = Date.now();
    const timestamps = Array.from({ length: 5 }, (_, i) => now - i * 1000);
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ timestamps }),
    });

    const result = await isRateLimitedPersistent('1.2.3.4', 'contact', 5, 60_000);

    expect(result).toBe(true);
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('prunes expired timestamps and allows if under limit after pruning', async () => {
    const now = Date.now();
    // 3 expired + 2 valid = under limit of 5
    const timestamps = [
      now - 120_000, now - 90_000, now - 70_000, // expired (> 60s)
      now - 10_000, now - 5_000,                  // valid
    ];
    mockGet.mockResolvedValue({
      exists: true,
      data: () => ({ timestamps }),
    });
    mockSet.mockResolvedValue(undefined);

    const result = await isRateLimitedPersistent('1.2.3.4', 'contact', 5, 60_000);

    expect(result).toBe(false);
    const setArg = mockSet.mock.calls[0][0];
    expect(setArg.timestamps).toHaveLength(3); // 2 valid + 1 new
  });

  it('sanitizes IP with dots and slashes in doc ID', async () => {
    mockGet.mockResolvedValue({ exists: false });
    mockSet.mockResolvedValue(undefined);

    await isRateLimitedPersistent('192.168.1.1', 'contact', 5, 60_000);

    expect(mockDoc).toHaveBeenCalledWith('contact:192_168_1_1');
  });

  it('fails open when Firestore throws', async () => {
    mockGet.mockRejectedValue(new Error('Firestore unavailable'));

    const result = await isRateLimitedPersistent('1.2.3.4', 'contact', 5, 60_000);

    expect(result).toBe(false);
  });
});
