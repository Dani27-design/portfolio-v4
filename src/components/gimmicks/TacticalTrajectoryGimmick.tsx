'use client';

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export const TacticalTrajectoryGimmick = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const gridY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [45, 65]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* 3D Perspective Grid Floor */}
      <div className="absolute inset-0 [perspective:1000px] opacity-10">
        <motion.div
          style={{
            rotateX,
            y: gridY,
            backgroundImage: `linear-gradient(to right, #0891b2 1px, transparent 1px), linear-gradient(to bottom, #0891b2 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
          className="absolute inset-x-[-50%] top-[-50%] h-[200%] w-[200%] origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background" />
      </div>

      {/* Vertical Timeline Signal Beam */}
      <div className="absolute top-0 left-2 md:left-40 h-full w-px bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute inset-0 bg-cyan-500/20 w-[1px] -left-[0.5px] blur-sm"
        />
      </div>

      {/* Floating Tactical HUD Brackets */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`hud-bracket-${i}`}
          initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 0.6, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: i * 0.3 }}
          className={`absolute hidden xl:flex flex-col gap-1 ${i % 2 === 0 ? "left-10" : "right-10"}`}
          style={{ top: `${20 + i * 20}%` }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-cyan-500/10" />
          </div>
          <div className="flex gap-3">
            <div className="w-px h-6 bg-gradient-to-b from-cyan-900/30 to-transparent" />
          </div>
        </motion.div>
      ))}

      {/* High-Impact Radial Sonar Pings */}
      <div className="absolute top-0 left-2 md:left-40 h-full w-full pointer-events-none">
        {[0.12, 0.42, 0.72].map((top, i) => (
          <div key={`sonar-ping-${i}`} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ top: `${top * 100}%` }}>
            <motion.div
              animate={{ scale: [1, 2], opacity: [0.3, 0] }}
              transition={{ duration: 6, repeat: Infinity, delay: i * 2 }}
              className="w-40 h-40 border border-cyan-500/10 rounded-full"
            />
            <div className="w-1.5 h-1.5 bg-cyan-900 rounded-full opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
        ))}
      </div>

      {/* Moving Signal Blobs */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <filter id="currentGlow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {[...Array(2)].map((_, i) => (
          <motion.path
            key={`signal-blob-${i}`}
            d={`M ${150 + i * 100} -100 Q ${300 + i * 100} 500, ${-50 + i * 50} 1200`}
            fill="none"
            stroke={i % 2 === 0 ? "#083344" : "#1e1b4b"}
            strokeWidth="1"
            strokeDasharray="5 60"
            filter="url(#currentGlow)"
            animate={{ strokeDashoffset: [-100, 100] }}
            transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>

      {/* Floating Tactical Brackets on Timeline Line */}
      <div className="absolute top-0 left-2 md:left-40 h-full w-px">
        <motion.div
          animate={{ y: ["0%", "1000%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -left-10 top-0 flex items-center gap-2"
        >
          <div className="w-3 h-[1px] bg-cyan-900" />
        </motion.div>
      </div>

    </div>
  );
};
