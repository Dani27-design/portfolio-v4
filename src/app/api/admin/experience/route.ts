import { NextResponse } from 'next/server';
import { getExperience } from '@/lib/firestore';

export async function GET() {
  const experience = await getExperience();
  return NextResponse.json(experience);
}
