'use client';

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export const ArchitectureSchematicGimmick = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Background CAD Grid */}
      <div className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Floating Blueprint Modules */}
      <motion.div
        style={{ y: y1, rotate }}
        className="absolute top-1/4 -left-20 w-80 h-80 border border-cyan-500/25 rounded-lg hidden lg:block"
      >
        <div className="absolute inset-0 bg-cyan-500/15 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute inset-10 border border-dashed border-cyan-500/35 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/25" />
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-cyan-500/25" />
      </motion.div>

      <motion.div
        style={{ y: y2, rotate: -rotate }}
        className="absolute bottom-1/4 -right-20 w-96 h-64 border border-indigo-500/25 rounded-lg hidden lg:block"
      >
        <div className="absolute inset-0 bg-indigo-500/15 [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div className="absolute inset-8 flex items-center justify-around">
          {[...Array(4)].map((_, i) => (
            <div key={`logic-gate-${i}`} className="w-1.5 h-full bg-indigo-500/20 relative">
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-400 rounded-full blur-sm"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* High-Speed Logic Tracers (PCB Style) */}
      <svg className="absolute inset-0 w-full h-full opacity-45">
        <defs>
          <linearGradient id="tracerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {[...Array(6)].map((_, i) => (
          <motion.path
            key={`schematic-tracer-${i}`}
            d={`M -100 ${15 + i * 18} L ${25 + i * 12} ${15 + i * 18} L ${35 + i * 12} ${35 + i * 18} L 1200 ${35 + i * 18}`}
            fill="none"
            stroke="url(#tracerGradient)"
            strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2.5 + Math.random() * 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.8
            }}
          />
        ))}
      </svg>

      {/* Center Radar / Scanning Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-35">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-cyan-500/20 rounded-full"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-1/2 bg-gradient-to-t from-cyan-500 to-transparent" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 border border-indigo-500/30 rounded-full"
        />
      </div>

    </div>
  );
};
