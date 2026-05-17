import { NextResponse } from 'next/server';
import { getExperience } from '@/lib/firestore';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const experience = await getExperience();
  return NextResponse.json(experience);
}
