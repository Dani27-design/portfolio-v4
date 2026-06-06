import { NextResponse } from 'next/server';
import { getHeroContent, getAboutContent, getContactContent, getFooterContent, getHireBannerContent, getNavbarContent } from '@/lib/firestore';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [hero, about, contact, footer, hireBanner, navbar] = await Promise.all([
      getHeroContent(),
      getAboutContent(),
      getContactContent(),
      getFooterContent(),
      getHireBannerContent(),
      getNavbarContent(),
    ]);

    return NextResponse.json({ hero, about, contact, footer, hireBanner, navbar });
  } catch (err) {
    console.error('Failed to fetch site content:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
