import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export const ArchitectureSchematicGimmick = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax and rotation effects based on scroll
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
        <div className="absolute top-4 left-4 font-mono text-[8px] text-cyan-400 font-bold uppercase">Module_Ref: Core_Engine</div>
        {/* Internal CAD Details */}
        <div className="absolute inset-10 border border-dashed border-cyan-500/35 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/25" />
        <div className="absolute left-1/2 top-0 h-full w-[1px] bg-cyan-500/25" />
      </motion.div>

      <motion.div 
        style={{ y: y2, rotate: -rotate }}
        className="absolute bottom-1/4 -right-20 w-96 h-64 border border-indigo-500/25 rounded-lg hidden lg:block"
      >
        <div className="absolute inset-0 bg-indigo-500/15 [mask-image:linear-gradient(to_top,black,transparent)]" />
        <div className="absolute bottom-4 right-4 font-mono text-[8px] text-indigo-400 font-bold uppercase">Cluster_Deployment: Node_LTS</div>
        {/* Logic Gate Visuals */}
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

      {/* Tactical HUD Overlays */}
      <div className="absolute bottom-10 left-10 space-y-3 hidden md:block">
        <div className="flex items-center gap-4">
          <div className="w-16 h-[2px] bg-cyan-500/60 shadow-[0_0_8px_#06b6d4]" />
          <span className="font-mono text-[10px] text-cyan-400 font-black uppercase tracking-widest bg-cyan-950/40 px-3 py-1 border border-cyan-500/30">
            Integrity_Check: Verified
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-[1px] bg-indigo-500/50" />
          <span className="font-mono text-[9px] text-indigo-400 font-bold uppercase tracking-widest">
            System_Load: 0.04ms / Optimized
          </span>
        </div>
      </div>
    </div>
  );
};
