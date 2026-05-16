import { KernelSubstrateGimmick } from "./KernelSubstrateGimmick";
import { motion } from "motion/react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/60 relative overflow-hidden">
      <KernelSubstrateGimmick />
      
      <div className="container-custom py-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo / Identity Block */}
          <div className="flex flex-col items-center md:items-start gap-2">
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-cyan-700 to-indigo-800 flex items-center justify-center p-1 group cursor-pointer transition-all hover:scale-110">
                   <div className="w-full h-full border border-white/20" />
                </div>
                <div className="flex flex-col">
                   <h3 className="text-[11px] font-black text-text-main tracking-[0.2em] uppercase">DANIANSYAH CHUSYAIDIN</h3>
                   <span className="text-[8px] font-mono text-cyan-500/80 font-bold uppercase tracking-widest leading-none">Senior Systems Engineer</span>
                </div>
             </div>
             <p className="text-[7px] font-mono text-text-muted/60 uppercase tracking-widest text-center md:text-left">
                &copy; {currentYear} ALL_RIGHTS_RESERVED // SYS_INTEGRITY_ACK - [V4.4.2-LDP]
             </p>
          </div>

          {/* Technical Telemetry */}
          <div className="flex gap-6 text-[8px] font-mono text-text-muted uppercase tracking-[0.2em] font-black">
            <div className="flex flex-col items-end opacity-40">
               <span>PING_STABLE</span>
               <span>UPTIME_99.9</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
