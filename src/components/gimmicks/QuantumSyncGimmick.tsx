'use client';

import { motion } from "motion/react";

export const QuantumSyncGimmick = ({ isScrolled }: { isScrolled: boolean }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <div className={`absolute inset-0 transition-opacity duration-700 ${isScrolled ? 'opacity-20' : 'opacity-10'}`}>
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/05 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-border/10 overflow-hidden">
         <motion.div
           initial={{ x: "-100%" }}
           animate={{ x: "100%" }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute h-full w-64 bg-gradient-to-r from-transparent via-cyan-900/20 to-transparent"
         />
      </div>

      <div className="absolute left-[10%] top-0 h-full w-[1px] bg-cyan-900/05" />
      <div className="absolute right-[10%] top-0 h-full w-[1px] bg-indigo-900/05" />
    </div>
  );
};
