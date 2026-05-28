'use client';

import { useRef } from "react";

function buildHexData() {
  const generateHex = () =>
    Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 0xFF).toString(16).padStart(2, '0').toUpperCase()
    ).join(' ');

  return Array.from({ length: 12 }, () =>
    Array.from({ length: 8 }, () => ({
      addr: '0x' + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase(),
      hex: generateHex() + ' ' + generateHex(),
    }))
  );
}

export const LogStreamGimmick = () => {
  const hexData = useRef(buildHexData());

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
            <div
              className="absolute top-0 -left-px w-2 h-20 bg-gradient-to-b from-cyan-500 to-transparent blur-sm"
              style={{ animation: `gimmick-scan-v 15s linear infinite`, animationDelay: `${i * 2}s` }}
            />
          </div>
        ))}
      </div>

      {/* Scrolling Hex Terminal Blocks */}
      <div className="absolute inset-0 flex flex-col justify-center gap-12 rotate-[-5deg] scale-110 opacity-30">
        {hexData.current.map((row, i) => (
          <div
            key={`hex-row-${i}`}
            className="flex gap-8 whitespace-nowrap"
            style={{ animation: `${i % 2 === 0 ? 'gimmick-hex-left' : 'gimmick-hex-right'} ${25 + i * 2}s linear infinite` }}
          >
            {row.map((block, j) => (
              <div key={`hex-block-${i}-${j}`} className="flex gap-4">
                <span className="font-mono text-[7px] text-indigo-500/40 font-bold tracking-tighter">
                  {block.addr}
                </span>
                <span className="font-mono text-[7px] text-white/5 tracking-[0.2em]">
                  {block.hex}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Scanning Parsers */}
      {[...Array(3)].map((_, i) => (
        <div
          key={`parser-bracket-${i}`}
          className="absolute w-64 h-32 border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-[2px] hidden xl:flex flex-col p-3 gap-2"
          style={{
            top: `${20 + i * 25}%`,
            left: `${10 + i * 20}%`,
            animation: `gimmick-parser-float ${15 + i * 5}s ease-in-out infinite`,
          }}
        >
          <div className="flex justify-end items-center border-b border-cyan-500/20 pb-1">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          </div>
          <div className="h-1 w-full bg-white/5 overflow-hidden">
             <div
               className="h-full w-1/3 bg-cyan-500/40 shadow-[0_0_8px_#06b6d4] animate-slide-x"
               style={{ animationDuration: '1s' }}
             />
          </div>
        </div>
      ))}

      {/* Pulse Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
        <div
          className="w-[800px] h-[800px] border border-cyan-500/30 rounded-full"
          style={{ animation: 'gimmick-pulse-fade 4s ease-out infinite', '--pf-o': '0.3', '--pf-s': '2' } as React.CSSProperties}
        />
        <div
          className="w-[800px] h-[800px] border border-indigo-500/20 rounded-full"
          style={{ animation: 'gimmick-pulse-fade 4s ease-out infinite 2s', '--pf-o': '0.2', '--pf-s': '1.8' } as React.CSSProperties}
        />
      </div>

      {/* Atmospheric Glitch Scanline */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/05 to-transparent pointer-events-none z-0"
        style={{ animation: 'gimmick-scan-h-skew-neg 8s linear infinite' }}
      />
    </div>
  );
};
