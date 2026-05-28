'use client';

import { useEffect, useState } from "react";

export const KernelSubstrateGimmick = () => {
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-10">
      {[...Array(3)].map((_, i) => (
        <div
           key={`substrate-slab-${i}`}
           className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-cyan-900/05 to-transparent"
           style={{
             top: `${30 + i * 20}%`,
             animation: `${i % 2 === 0 ? 'gimmick-slab-left' : 'gimmick-slab-right'} ${30 + i * 10}s linear infinite`,
           }}
        />
      ))}

      <div
        className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-900/10"
        style={{ animation: 'gimmick-scan-h 15s linear infinite' }}
      />
    </div>
  );
};
