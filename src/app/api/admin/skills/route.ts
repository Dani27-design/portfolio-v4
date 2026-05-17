import { NextResponse } from 'next/server';
import { getSkills } from '@/lib/firestore';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const skills = await getSkills();
  return NextResponse.json(skills);
}
