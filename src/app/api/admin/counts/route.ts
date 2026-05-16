import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
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
