import { NextResponse } from 'next/server';
import { getSkills } from '@/lib/firestore';

export async function GET() {
  const skills = await getSkills();
  return NextResponse.json(skills);
}
