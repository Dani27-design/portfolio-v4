'use client';

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export const ServiceClusterGimmick = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);

  const meshPoints = [
    { x: 10, y: 20 }, { x: 30, y: 15 }, { x: 50, y: 25 },
    { x: 70, y: 10 }, { x: 90, y: 20 }, { x: 20, y: 60 },
    { x: 40, y: 80 }, { x: 60, y: 70 }, { x: 80, y: 85 }
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Background Micro-Coordinate System */}
      <div className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      >
      </div>

      {/* Neural Mesh Network Connections */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        <defs>
          <linearGradient id="meshGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Connection Lines */}
        {meshPoints.map((p1, i) =>
          meshPoints.slice(i + 1, i + 3).map((p2, j) => (
            <motion.line
              key={`${i}-${j}`}
              x1={`${p1.x}%`} y1={`${p1.y}%`}
              x2={`${p2.x}%`} y2={`${p2.y}%`}
              stroke="url(#meshGrad)"
              strokeWidth="0.5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: (i + j) * 0.1 }}
            />
          ))
        )}

        {/* Moving Data Packets on Mesh — SVG cx/cy requires JS */}
        {meshPoints.slice(0, 5).map((p, i) => {
          const nextP = meshPoints[i + 1] || meshPoints[0];
          return (
            <motion.circle
              key={`packet-${i}`}
              r="1"
              fill="#06b6d4"
              animate={{
                cx: [`${p.x}%`, `${nextP.x}%`],
                cy: [`${p.y}%`, `${nextP.y}%`],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5
              }}
            />
          );
        })}
      </svg>

      {/* Floating Isometric Clusters — CSS animation */}
      <motion.div style={{ scale, rotate }} className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <div
            key={`iso-cluster-${i}`}
            className="absolute hidden lg:block"
            style={{
              left: `${15 + (i * 9)}%`,
              top: `${20 + (i * 7)}%`,
              animation: `gimmick-float-y ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              '--fy': `${-20 * (i % 2 === 0 ? 1 : -1)}px`,
            } as React.CSSProperties}
          >
            <div className="w-32 h-32 relative">
               <svg viewBox="0 0 100 100" className="w-full h-full stroke-cyan-500 fill-none stroke-[0.3]">
                  <path d="M50 5 L95 27.5 L95 72.5 L50 95 L5 72.5 L5 27.5 Z" strokeOpacity="0.4" />
                  <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" strokeOpacity="0.8" />
                  <line x1="50" y1="5" x2="50" y2="95" strokeOpacity="0.2" />
                  <line x1="5" y1="27.5" x2="95" y2="72.5" strokeOpacity="0.2" />
                  <line x1="95" y1="27.5" x2="5" y2="72.5" strokeOpacity="0.2" />
               </svg>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Massive Scanning UI Overlays — CSS rotation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none">
        <div
          className="absolute inset-0 border border-dashed border-cyan-500/10 rounded-full"
          style={{ animation: 'spin 40s linear infinite' }}
        />
        <div
          className="absolute inset-10 border border-indigo-500/10 rounded-full"
          style={{ animation: 'spin 30s linear infinite reverse' }}
        />

        {/* Scanning Sweeps — CSS translate */}
        <div
          className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent top-1/3"
          style={{ animation: 'sweep 6s ease-in-out infinite' }}
        />
        <div
          className="absolute inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-indigo-500/40 to-transparent left-2/3"
          style={{ animation: 'gimmick-scan-v 8s ease-in-out infinite' }}
        />
      </div>

      {/* Atmospheric Scanning Beam — CSS translate with skew */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-500/05 to-transparent pointer-events-none z-0"
        style={{ animation: 'gimmick-scan-h-skew-pos 10s linear infinite' }}
      />
    </div>
  );
};
