import { motion } from "motion/react";

export const NeuralBridgeGimmick = () => {
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

      {/* Floating Geometric Constellations (Connecting nodes) */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`bridge-node-${i}`}
          animate={{ 
            x: [0, 20 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 15 + i * 2, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: i * 0.4
          }}
          className="absolute opacity-10 xl:opacity-15"
          style={{ 
            left: `${15 + (i * 15)}%`, 
            top: `${20 + (i * 10)}%` 
          }}
        >
          <div className="w-48 h-48 relative border border-white/5 rounded-full flex items-center justify-center">
             <div className="w-32 h-32 border border-cyan-500/10 rounded-full animate-spin-slow" />
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 font-mono text-[6px] text-cyan-500/40 uppercase tracking-[0.4em]">BRIDGE_NODE_0{i}</div>
             
             {/* Micro-pings */}
             <motion.div 
               animate={{ scale: [1, 2], opacity: [0.5, 0] }}
               transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
               className="absolute w-4 h-4 bg-cyan-500/20 rounded-full"
             />
          </div>
        </motion.div>
      ))}

      {/* Converging Signal Rays (Focusing towards the form center) */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {[...Array(24)].map((_, i) => (
          <motion.line
            key={`signal-ray-${i}`}
            x1="50%" y1="50%"
            x2={`${Math.cos((i * 15) * Math.PI / 180) * 100 + 50}%`}
            y2={`${Math.sin((i * 15) * Math.PI / 180) * 100 + 50}%`}
            stroke="url(#ringGrad)"
            strokeWidth="0.5"
            strokeDasharray="2 10"
            animate={{ strokeDashoffset: [-50, 50] }}
            transition={{ duration: 10 + i, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>

      {/* Data Transmission Bubbles (Moving Upwards) */}
      {[...Array(12)].map((_, i) => (
        <motion.div
           key={`data-bubble-${i}`}
           initial={{ y: "110%", opacity: 0 }}
           animate={{ 
             y: "-10%", 
             opacity: [0, 0.4, 0],
             scale: [0.5, 1, 0.5]
           }}
           transition={{ 
             duration: 10 + Math.random() * 5, 
             repeat: Infinity, 
             delay: i * 1,
             ease: "linear"
           }}
           className="absolute w-px h-12 bg-gradient-to-t from-transparent via-cyan-500/40 to-transparent"
           style={{ left: `${5 + Math.random() * 90}%` }}
        />
      ))}

      {/* Tactical Status Ring (Bottom Right) */}
      <div className="absolute bottom-10 right-10 hidden xl:block opacity-40">
         <div className="relative w-40 h-40">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border border-dashed border-indigo-500/30 rounded-full"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
               <span className="font-mono text-[8px] text-cyan-400 font-black uppercase tracking-widest">BRIDGE_STATE</span>
               <motion.span 
                 animate={{ opacity: [1, 0.4, 1] }}
                 transition={{ duration: 2, repeat: Infinity }}
                 className="font-mono text-[10px] text-white/40 font-bold uppercase"
               >
                 LISTEN_MODE
               </motion.span>
               <div className="w-12 h-[1px] bg-cyan-500/30 mt-2" />
            </div>
         </div>
      </div>

      {/* Lateral Scanning Beam (Slow vertical sweep) */}
      <motion.div 
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-transparent via-indigo-500/[0.03] to-transparent pointer-events-none z-0"
      />
    </div>
  );
};
