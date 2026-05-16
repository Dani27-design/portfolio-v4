'use client';

import { motion } from "motion/react";

interface GameRocketProps {
  className?: string;
  isLaunching?: boolean;
  isCodeMode?: boolean;
}

export const GameRocket = ({ className = "", isLaunching = false, isCodeMode = false }: GameRocketProps) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="-20 -30 40 60"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M-3 14 Q0 28 3 14"
          fill="url(#thrusterGradient)"
          animate={{
            d: isLaunching ? ["M-4 14 Q0 45 4 14", "M-4 14 Q0 35 4 14"] : ["M-3 14 Q0 24 3 14", "M-3 14 Q0 20 3 14"],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ duration: 0.1, repeat: Infinity }}
        />

        <path
          d="M-6 4 Q-12 6 -12 14 L-6 11 Z"
          fill={isCodeMode ? "#9d174d" : "#0e7490"}
        />
        <path
          d="M6 4 Q12 6 12 14 L6 11 Z"
          fill={isCodeMode ? "#9d174d" : "#0e7490"}
        />

        <path
          d="M0 -16 Q8 -6 8 6 L6 11 L-6 11 L-8 6 Q-8 -6 0 -16 Z"
          fill="url(#bodyGradient)"
        />

        <ellipse
          cx="0" cy="-4" rx="2" ry="3.5"
          fill="rgba(255, 255, 255, 0.3)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="0.5"
        />

        <defs>
          <linearGradient id="bodyGradient" x1="-10" y1="0" x2="10" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={isCodeMode ? "#be185d" : "#0891b2"} />
            <stop offset="0.5" stopColor={isCodeMode ? "#ec4899" : "#06b6d4"} />
            <stop offset="1" stopColor={isCodeMode ? "#9d174d" : "#0e7490"} />
          </linearGradient>
          <linearGradient id="thrusterGradient" x1="0" y1="11" x2="0" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fbbf24" />
            <stop offset="0.4" stopColor="#f59e0b" />
            <stop offset="1" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
