'use client';

import dynamic from 'next/dynamic';

const SkyForceGame = dynamic(
  () => import('@/components/game/SkyForceGame').then(mod => ({ default: mod.SkyForceGame })),
  { ssr: false, loading: () => <div className="min-h-[85vh] md:min-h-[540px] bg-background" /> }
);

export function ClientSkyForceGame() {
  return <SkyForceGame />;
}
