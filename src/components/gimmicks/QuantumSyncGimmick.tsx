'use client';

import { useEffect, useState } from "react";

export const QuantumSyncGimmick = ({ isScrolled }: { isScrolled: boolean }) => {
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
      <div className={`absolute inset-0 transition-opacity duration-700 ${isScrolled ? 'opacity-20' : 'opacity-10'}`}>
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/05 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-border/10 overflow-hidden">
         <div
           className="absolute h-full w-64 bg-gradient-to-r from-transparent via-cyan-900/20 to-transparent"
           style={{ animation: 'sweep 15s linear infinite' }}
         />
      </div>

      <div className="absolute left-[10%] top-0 h-full w-[1px] bg-cyan-900/05" />
      <div className="absolute right-[10%] top-0 h-full w-[1px] bg-indigo-900/05" />
    </div>
  );
};
