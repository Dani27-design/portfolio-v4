'use client';

import { useEffect, useState } from "react";

export const MobileMenuGimmick = () => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/05 to-transparent z-10"
        style={{ animation: 'gimmick-scan-v 10s linear infinite' }}
      />

      <div
        className="absolute inset-0 opacity-[0.01]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="absolute right-6 inset-y-0 w-[1px] bg-white/5 flex flex-col justify-around py-32 opacity-15">
        {[...Array(4)].map((_, i) => (
          <div key={`menu-section-${i}`} className="flex items-center gap-2 -mr-1 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
             <div className="w-1 h-1 rounded-full bg-slate-700" />
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/[0.02] rounded-full pointer-events-none">
        <div
          className="absolute inset-0 border border-t-cyan-500/10 border-r-transparent border-b-transparent border-l-transparent rounded-full"
          style={{ animation: 'spin 40s linear infinite' }}
        />
        <div
          className="absolute inset-8 border border-b-slate-500/10 border-r-transparent border-t-transparent border-l-transparent rounded-full"
          style={{ animation: 'spin 60s linear infinite reverse' }}
        />
      </div>
    </div>
  );
};
