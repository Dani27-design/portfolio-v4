import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!adminDb) {
    return NextResponse.json({ projects: 0, blogs: 0, experience: 0, skills: 0 });
  }

  const [projects, blogs, experience, skills] = await Promise.all([
    adminDb.collection('projects').count().get(),
    adminDb.collection('blogs').count().get(),
    adminDb.collection('experience').count().get(),
    adminDb.collection('skills').count().get(),
  ]);

  return NextResponse.json({
    projects: projects.data().count,
    blogs: blogs.data().count,
    experience: experience.data().count,
    skills: skills.data().count,
  });
}
