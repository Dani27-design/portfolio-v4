'use client';

import { motion } from "motion/react";

export const LogStreamGimmick = () => {
  const generateHex = () => {
    return Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 0xFF).toString(16).padStart(2, '0').toUpperCase()
    ).join(' ');
  };

  const rows = 12;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Background Micro-Dots */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Vertical Data Rails */}
      <div className="absolute inset-0 flex justify-around opacity-10">
        {[...Array(4)].map((_, i) => (
          <div key={`data-rail-${i}`} className="w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent relative">
            <motion.div
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: i * 2 }}
              className="absolute top-0 -left-px w-2 h-20 bg-gradient-to-b from-cyan-500 to-transparent blur-sm"
            />
          </div>
        ))}
      </div>

      {/* Scrolling Hex Terminal Blocks */}
      <div className="absolute inset-0 flex flex-col justify-center gap-12 rotate-[-5deg] scale-110 opacity-30">
        {[...Array(rows)].map((_, i) => (
          <motion.div
            key={`hex-row-${i}`}
            animate={{ x: i % 2 === 0 ? [-200, 0] : [0, -200] }}
            transition={{ duration: 25 + i * 2, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap"
          >
            {[...Array(8)].map((_, j) => (
              <div key={`hex-block-${i}-${j}`} className="flex gap-4">
                <span className="font-mono text-[7px] text-indigo-500/40 font-bold tracking-tighter">
                  0x{Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase()}
                </span>
                <span className="font-mono text-[7px] text-white/5 tracking-[0.2em]">
                  {generateHex()} {generateHex()}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Scanning Parsers */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`parser-bracket-${i}`}
          animate={{
            x: ["0%", "100%", "0%"],
            y: ["0%", "100%", "0%"],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-64 h-32 border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-[2px] hidden xl:flex flex-col p-3 gap-2"
          style={{ top: `${20 + i * 25}%`, left: `${10 + i * 20}%` }}
        >
          <div className="flex justify-between items-center border-b border-cyan-500/20 pb-1">
             <span className="font-mono text-[8px] text-cyan-400 font-black tracking-widest uppercase italic">ENTRY_PARSER_0{i}</span>
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          </div>
          <div className="space-y-1">
             <div className="h-1 w-full bg-white/5 overflow-hidden">
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-full w-1/3 bg-cyan-500/40 shadow-[0_0_8px_#06b6d4]"
                />
             </div>
             <div className="font-mono text-[6px] text-white/20 uppercase tracking-tighter">
               Buffer_Read: OK<br />
               Status: Indexing_Logs...
             </div>
          </div>
        </motion.div>
      ))}

      {/* Pulse Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 2], opacity: [0.3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
          className="w-[800px] h-[800px] border border-cyan-500/30 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeOut", delay: 2 }}
          className="w-[800px] h-[800px] border border-indigo-500/20 rounded-full"
        />
      </div>

      {/* Moving Text Rails */}
      <div className="absolute top-4 left-0 w-full overflow-hidden opacity-10">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 whitespace-nowrap font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-[0.5em]"
        >
            {[...Array(10)].map((_, i) => (
              <span key={`text-rail-${i}`}>Documentation_Stream :: Trace_Ref_0{i} :: Log_Index_Validated</span>
            ))}
        </motion.div>
      </div>

      {/* Atmospheric Glitch Scanline */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/05 to-transparent pointer-events-none z-0 skew-x-[-25deg]"
      />
    </div>
  );
};
