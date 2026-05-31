import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { getLeaderboard } from '@/lib/firestore';

const NAME_REGEX = /^[A-Z0-9_]{1,12}$/;
const MAX_SCORE = 99999;

// --- In-memory IP rate limiter (resets on cold start, effective within warm instance) ---
const RATE_LIMIT_POST = { max: 60, windowMs: 60_000 };   // 60 POST per 60s
const RATE_LIMIT_GET  = { max: 60, windowMs: 60_000 };   // 60 GET per 60s

const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string, method: string, limit: { max: number; windowMs: number }): boolean {
  const now = Date.now();
  const key = `${method}:${ip}`;
  const timestamps = ipHits.get(key) ?? [];

  // Remove expired entries
  const valid = timestamps.filter(t => now - t < limit.windowMs);

  if (valid.length >= limit.max) {
    ipHits.set(key, valid);
    return true;
  }

  valid.push(now);
  ipHits.set(key, valid);
  return false;
}

// Cleanup stale IPs every 5 minutes to prevent memory leak
let lastCleanup = Date.now();
function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  const maxWindow = Math.max(RATE_LIMIT_POST.windowMs, RATE_LIMIT_GET.windowMs);
  for (const [key, timestamps] of ipHits) {
    const valid = timestamps.filter(t => now - t < maxWindow);
    if (valid.length === 0) {
      ipHits.delete(key);
    } else {
      ipHits.set(key, valid);
    }
  }
}

function getClientIp(request: NextRequest): string {
  // x-real-ip is set by Vercel and is NOT user-spoofable
  // x-forwarded-for is user-controlled (leftmost value) — fallback only
  return request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown';
}

export async function GET(request: NextRequest) {
  cleanupStaleEntries();

  const ip = getClientIp(request);
  if (isRateLimited(ip, 'GET', RATE_LIMIT_GET)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!adminDb) return NextResponse.json([]);

  const [entries, countSnapshot] = await Promise.all([
    getLeaderboard(10),
    adminDb.collection('leaderboard').count().get(),
  ]);

  const totalPlayers = countSnapshot.data().count;
  return NextResponse.json({ entries, totalPlayers });
}

export async function POST(request: NextRequest) {
  cleanupStaleEntries();

  const ip = getClientIp(request);
  if (isRateLimited(ip, 'POST', RATE_LIMIT_POST)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
  }

  if (!adminDb) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  let body: { name?: string; score?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, score } = body;

  if (!name || typeof name !== 'string' || !NAME_REGEX.test(name)) {
    return NextResponse.json({ error: 'Invalid name. Must be 1-12 characters, uppercase A-Z, 0-9, or underscore.' }, { status: 400 });
  }

  if (score === undefined || typeof score !== 'number' || !Number.isInteger(score) || score < 1 || score > MAX_SCORE) {
    return NextResponse.json({ error: `Invalid score. Must be an integer between 1 and ${MAX_SCORE}.` }, { status: 400 });
  }

  try {
    // Check if player with same name already exists
    const existing = await adminDb.collection('leaderboard')
      .where('name', '==', name)
      .limit(1)
      .get();

    if (!existing.empty) {
      const doc = existing.docs[0];
      const existingScore = doc.data().score as number;

      if (score > existingScore) {
        // Update with higher score
        await doc.ref.update({
          score,
          updatedAt: FieldValue.serverTimestamp(),
        });
        return NextResponse.json({ id: doc.id, updated: true });
      } else {
        // Existing score is higher — keep it
        return NextResponse.json({ id: doc.id, kept: true });
      }
    }

    // New player — create entry
    const ref = await adminDb.collection('leaderboard').add({
      name,
      score,
      createdAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error('Failed to submit leaderboard entry:', err);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
