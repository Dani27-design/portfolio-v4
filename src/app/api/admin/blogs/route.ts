import { NextResponse } from 'next/server';
import { getBlogs } from '@/lib/firestore';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const blogs = await getBlogs();
    return NextResponse.json(blogs);
  } catch (err) {
    console.error('Failed to fetch blogs:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
