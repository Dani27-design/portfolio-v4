import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/firestore';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
