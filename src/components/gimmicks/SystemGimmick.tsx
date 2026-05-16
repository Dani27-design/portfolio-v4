'use client';

import { motion, useScroll, useTransform } from "motion/react";

export const SystemGimmick = () => {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 1000], [0, 360]);
  const opacity = useTransform(scrollY, [0, 500], [0.1, 0]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 3D Wireframe Cube Background */}
      <motion.div
        style={{ rotate, opacity: 0.60 }}
        className="absolute -right-20 -top-20 md:right-0 md:top-0 w-[450px] h-[450px] sm:w-[540px] sm:h-[540px] md:w-[800px] md:h-[800px]"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-[0.3]">
          <defs>
            <linearGradient id="gimmickGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan 500 */}
              <stop offset="100%" stopColor="#6366f1" /> {/* Indigo 500 */}
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Nested Hexagons for "Architecture" feel */}
          <circle cx="50" cy="50" r="48" stroke="url(#gimmickGradient)" strokeOpacity="0.26" />
          <path
            d="M50 2 L93.3 25 L93.3 75 L50 98 L6.7 75 L6.7 25 Z"
            stroke="url(#gimmickGradient)"
            strokeOpacity="0.60"
            filter="url(#glow)"
          />
          <path
            d="M50 15 L80.3 32 L80.3 68 L50 85 L19.7 68 L19.7 32 Z"
            stroke="#06b6d4"
            strokeOpacity="0.49"
          />

          {/* Connection Lines */}
          <line x1="50" y1="2" x2="50" y2="98" stroke="url(#gimmickGradient)" strokeOpacity="0.31" />
          <line x1="6.7" y1="25" x2="93.3" y2="75" stroke="url(#gimmickGradient)" strokeOpacity="0.31" />
          <line x1="6.7" y1="75" x2="93.3" y2="25" stroke="url(#gimmickGradient)" strokeOpacity="0.31" />

          {/* Pulsing Nodes */}
          {[
            {x: 50, y: 2, color: "#06b6d4"}, {x: 93.3, y: 25, color: "#6366f1"},
            {x: 93.3, y: 75, color: "#06b6d4"}, {x: 50, y: 98, color: "#6366f1"},
            {x: 6.7, y: 75, color: "#06b6d4"}, {x: 6.7, y: 25, color: "#6366f1"}
          ].map((point, i) => (
            <motion.circle
              key={`pulse-node-${i}`}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill={point.color}
              animate={{
                r: [1.5, 3.5, 1.5],
                opacity: [0.50, 0.70, 0.50]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.4
              }}
            />
          ))}
        </svg>

        {/* Technical Annotations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-cyan-500/11" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-indigo-500/11" />

          <div className="absolute top-[10%] left-[10%] font-mono text-[10px] text-cyan-400/45 uppercase font-black tracking-widest bg-cyan-950/15 px-2 py-1 border border-cyan-500/07">
            Sector_01: Integrity_Core
          </div>
          <div className="absolute bottom-[10%] right-[10%] font-mono text-[10px] text-indigo-400/45 uppercase font-black tracking-widest bg-indigo-950/15 px-2 py-1 border border-indigo-500/07">
            Coord_Ref: X-772 / Y-991
          </div>
        </div>
      </motion.div>

      {/* Logic Sweep Scanline */}
      <motion.div
        animate={{ y: ["-100vh", "200vh"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-transparent via-cyan-500/05 to-transparent pointer-events-none z-0"
      />

      {/* Floating Tactical Data */}
      <div className="absolute top-1/4 right-10 hidden xl:block font-mono text-[9px] space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`tactical-data-${i}`}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 + i * 0.2 }}
            className="flex items-center gap-2"
          >
            <span className={`w-1.2 h-1.2 ${i % 2 === 0 ? "bg-cyan-500/45" : "bg-indigo-500/45"}`}></span>
            <span className={`font-bold ${i % 2 === 0 ? "text-cyan-400/45" : "text-indigo-400/45"}`}>0x{Math.random().toString(16).substring(2, 10).toUpperCase()}</span>
            <span className="w-8 h-[1px] bg-white/04"></span>
            <span className="text-white/15 uppercase">SECURE_{i}</span>
          </motion.div>
        ))}
      </div>

      {/* Bottom Right Matrix Rain Hint */}
      <div className="absolute bottom-20 right-12 hidden lg:flex gap-1 overflow-hidden h-32 opacity-16">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`matrix-column-${i}`}
            animate={{ y: [-100, 100] }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
            className={`w-[1px] h-full ${i % 2 === 0 ? "bg-cyan-500" : "bg-indigo-500"} flex flex-col items-center gap-1 text-[8px] font-mono py-2`}
          >
            {["1", "0", "A", "1", "X"].map((char, j) => (
              <span key={`char-${i}-${j}`} className="opacity-80">{char}</span>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
