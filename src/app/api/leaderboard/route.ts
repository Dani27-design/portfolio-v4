import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getLeaderboard } from '@/lib/firestore';

const NAME_REGEX = /^[A-Z0-9_]{1,12}$/;
const MAX_SCORE = 99999;

export async function GET() {
  const entries = await getLeaderboard(10);
  return NextResponse.json(entries);
}

export async function POST(request: NextRequest) {
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
    const ref = await adminDb.collection('leaderboard').add({
      name,
      score,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: ref.id });
  } catch (err) {
    console.error('Failed to submit leaderboard entry:', err);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
