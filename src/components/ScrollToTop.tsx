import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Rocket } from "lucide-react";
import { GameRocket } from "./GameRocket";
import { useTheme } from "../context/ThemeContext";

export const ScrollToTop = () => {
  const { isCodeMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false); // To Top launch
  const [isDeploying, setIsDeploying] = useState(false); // To Game deployment
  const [isGameActive, setIsGameActive] = useState(false);
  const isVisibleRef = useRef(isVisible);
  const isGameActiveRef = useRef(isGameActive);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    isGameActiveRef.current = isGameActive;
  }, [isGameActive]);

  useEffect(() => {
    const handleGameStatus = (e: any) => {
      const active = e.detail.active;
      
      if (active && !isGameActiveRef.current && isVisibleRef.current) {
        // Trigger deployment animation immediately
        setIsDeploying(true);
        setTimeout(() => {
           setIsGameActive(true);
           setIsDeploying(false);
        }, 500); 
      } else if (!active) {
        // Force hide immediately if game is active regardless of animation
        setIsGameActive(false);
      }
    };

    window.addEventListener("game-active", handleGameStatus as any);
    
    const toggleVisibility = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      window.removeEventListener("game-active", handleGameStatus as any);
    };
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    if (isLaunching || isDeploying) {
      e.preventDefault();
      return;
    }
    
    setIsLaunching(true);
    
    // Reset launch state after animation duration
    setTimeout(() => {
      setIsLaunching(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isVisible && !isGameActive && (
        <motion.div
           initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={isLaunching ? { 
            y: -window.innerHeight, 
            scale: [1, 1.2, 0.8],
            opacity: [1, 1, 0],
            transition: { duration: 0.8, ease: "easeIn" }
          } : isDeploying ? {
            y: [0, -40, -600],
            x: [0, 0, -500],
            scale: [1, 1.2, 0.4],
            opacity: [1, 1, 0],
            rotate: [0, 0, -45],
            transition: { 
              duration: 0.5, 
              times: [0, 0.3, 1],
              ease: ["easeOut", "easeIn"] 
            }
          } : { 
            opacity: 1, 
            scale: 1, 
            y: 0 
          }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className="fixed bottom-10 right-6 md:right-10 z-[100]"
        >
          <motion.a
            href="#top"
            onClick={scrollToTop}
            className="relative w-12 h-12 md:w-16 md:h-16 group flex items-center justify-center p-0 outline-none"
            style={{ pointerEvents: (isDeploying || isLaunching) ? 'none' : 'auto' }}
          >
            {/* Launch Pad Brackets */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${(isDeploying || isLaunching) ? 'opacity-0' : 'opacity-100'}`}>
               {/* TL */}
               <motion.div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/20" />
               {/* TR */}
               <motion.div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/20" />
               {/* BL */}
               <motion.div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/20" />
               {/* BR */}
               <motion.div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/20" />
            </div>

            {/* Jet Rocket Engine Glow & Smoke Trail */}
            <AnimatePresence>
              {(isLaunching || isDeploying) && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-4 flex flex-col items-center">
                  {/* Primary Exhaust Flame */}
                  <motion.div 
                    animate={{ 
                      height: [20, 60, 40],
                      opacity: [0.8, 1, 0.4],
                      scaleX: [1, 1.2, 1]
                    }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                    className="w-4 bg-gradient-to-t from-orange-600 via-orange-400 to-yellow-300 blur-[2px] rounded-b-full"
                  />
                  {/* Smoke Trail Particles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={`smoke-particle-${i}`}
                      initial={{ scale: 0.5, opacity: 0.6, y: 0, x: 0 }}
                      animate={{ 
                        scale: [1, 2.5], 
                        opacity: 0, 
                        y: [0, 80],
                        x: [(i % 2 === 0 ? 10 : -10) * Math.random(), (i % 2 === 0 ? 20 : -20) * Math.random()]
                      }}
                      transition={{ duration: 0.4, delay: i * 0.04, repeat: Infinity }}
                      className="absolute top-0 w-3 h-3 bg-white/20 blur-md rounded-full"
                    />
                  ))}
                </div>
              )}
              {(!isLaunching && !isDeploying) && (
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-8 bg-cyan-500/20 blur-lg -z-10 rounded-full group-hover:bg-orange-500/30 transition-colors"
                />
              )}
            </AnimatePresence>

            {/* The Rocket */}
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={(isLaunching || isDeploying) ? { 
                  y: [0, -2, 2, 0],
                  x: [0, 1, -1, 0]
                } : { 
                  y: [0, -4, 0] 
                }}
                transition={(isLaunching || isDeploying) ? { duration: 0.05, repeat: Infinity } : { duration: 2, repeat: Infinity }}
                className="w-10 h-10 md:w-12 md:h-12"
              >
                <GameRocket isLaunching={isLaunching || isDeploying} isCodeMode={isCodeMode} className="w-full h-full" />
              </motion.div>
              
              {/* Technical Data HUD */}
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[7px] font-mono font-black text-orange-500 uppercase tracking-widest whitespace-nowrap">
                  {(isLaunching || isDeploying) ? "ENG_IGNITION" : "READY_FOR_LIFT"}
                </span>
              </div>
            </div>

            {/* Particle Effects (only during launch) */}
            <AnimatePresence>
              {isLaunching && (
                <motion.div className="absolute inset-0">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={`launch-spark-${i}`}
                      initial={{ scale: 1, opacity: 0.8, y: 0 }}
                      animate={{ scale: 0, opacity: 0, y: 40, x: (i - 2) * 20 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="absolute bottom-0 left-1/2 w-2 h-2 bg-orange-400 rounded-full"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
