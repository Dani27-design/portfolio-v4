import { motion } from "motion/react";

export const KernelSubstrateGimmick = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-10">
      {/* Horizontal Data Slabs (Base Layers) */}
      {[...Array(3)].map((_, i) => (
        <motion.div
           key={`substrate-slab-${i}`}
           animate={{ x: i % 2 === 0 ? ["-50%", "0%"] : ["0%", "-50%"] }}
           transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
           className="absolute w-[200%] h-px bg-gradient-to-r from-transparent via-cyan-900/05 to-transparent"
           style={{ top: `${30 + i * 20}%` }}
        />
      ))}

      {/* Atmospheric Scanning Beam (Horizontal bottom sweep) */}
      <motion.div 
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-900/10"
      />
    </div>
  );
};
