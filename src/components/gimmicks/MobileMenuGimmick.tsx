'use client';

import { useEffect, useState } from "react";
import { motion } from "motion/react";

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
      <motion.div
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/05 to-transparent z-10"
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
             <span className="font-mono text-[6px] text-slate-500 rotate-90 whitespace-nowrap tracking-widest uppercase">
                SEC_0{i}
             </span>
             <div className="w-1 h-1 rounded-full bg-slate-700" />
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end border-t border-white/5 pt-4 opacity-20">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
            <span className="font-mono text-[7px] text-slate-400 uppercase tracking-widest">Status_Nominal</span>
          </div>
          <div className="font-mono text-[5px] text-slate-500 uppercase tracking-tight">
            Enc: AES_256_V2<br />
            Sig: OK
          </div>
        </div>
        <div className="text-right">
          <span className="font-mono text-[8px] text-slate-600 font-bold tracking-[0.2em] uppercase">
            SYS_ACK_NULL
          </span>
        </div>
      </div>

      <div className="absolute top-10 left-10 opacity-[0.05] font-mono text-[7px] text-slate-400 space-y-0.5">
        <div>[ 00 00 01 ]</div>
        <div>[ FF 00 X1 ]</div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white/[0.02] rounded-full pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-t-cyan-500/10 border-r-transparent border-b-transparent border-l-transparent rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-8 border border-b-slate-500/10 border-r-transparent border-t-transparent border-l-transparent rounded-full"
        />
      </div>
    </div>
  );
};
