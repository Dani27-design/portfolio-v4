'use client';

import { useRef } from "react";

export const NeuralBridgeGimmick = () => {
  const bubbles = useRef(
    Array.from({ length: 12 }, () => ({
      left: 5 + Math.random() * 90,
      duration: 10 + Math.random() * 5,
    }))
  );
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Deep Space Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cyan-950/05 to-background opacity-40" />

      {/* Background Star-Map Grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(6, 182, 212, 0.4) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating Geometric Constellations */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`bridge-node-${i}`}
          className="absolute opacity-10 xl:opacity-15"
          style={{
            left: `${15 + (i * 15)}%`,
            top: `${20 + (i * 10)}%`,
            animation: `gimmick-constellation ${15 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            '--gx': `${20 * (i % 2 === 0 ? 1 : -1)}px`,
          } as React.CSSProperties}
        >
          <div className="w-48 h-48 relative border border-white/5 rounded-full flex items-center justify-center">
             <div className="w-32 h-32 border border-cyan-500/10 rounded-full animate-spin-slow" />
             <div
               className="absolute w-4 h-4 bg-cyan-500/20 rounded-full"
               style={{
                 animation: `gimmick-pulse-fade 3s ease-out infinite`,
                 animationDelay: `${i * 0.5}s`,
                 '--pf-o': '0.5',
               } as React.CSSProperties}
             />
          </div>
        </div>
      ))}

      {/* Converging Signal Rays */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {[...Array(24)].map((_, i) => (
          <line
            key={`signal-ray-${i}`}
            x1="50%" y1="50%"
            x2={`${Math.cos((i * 15) * Math.PI / 180) * 100 + 50}%`}
            y2={`${Math.sin((i * 15) * Math.PI / 180) * 100 + 50}%`}
            stroke="url(#ringGrad)"
            strokeWidth="0.5"
            strokeDasharray="2 10"
            style={{ animation: `gimmick-dash ${10 + i}s linear infinite` }}
          />
        ))}
      </svg>

      {/* Data Transmission Bubbles */}
      {bubbles.current.map((bubble, i) => (
        <div
           key={`data-bubble-${i}`}
           className="absolute w-px h-12 bg-gradient-to-t from-transparent via-cyan-500/40 to-transparent opacity-0"
           style={{
             left: `${bubble.left}%`,
             animation: `gimmick-bubble ${bubble.duration}s linear infinite`,
             animationDelay: `${i}s`,
           }}
        />
      ))}

      {/* Tactical Status Ring */}
      <div className="absolute bottom-10 right-10 hidden xl:block opacity-40">
         <div className="relative w-40 h-40">
            <div
               className="absolute inset-0 border border-dashed border-indigo-500/30 rounded-full"
               style={{ animation: 'spin 20s linear infinite' }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
               <div className="w-12 h-[1px] bg-cyan-500/30" />
            </div>
         </div>
      </div>

      {/* Lateral Scanning Beam */}
      <div
        className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent pointer-events-none z-0"
        style={{ animation: 'gimmick-scan-v 15s linear infinite' }}
      />
    </div>
  );
};
