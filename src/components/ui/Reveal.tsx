'use client';

import { motion, useAnimation } from "motion/react";
import { ReactNode, Key, useRef, useEffect } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  width?: "fit-content" | "100%";
  className?: string;
  key?: Key;
}

export const Reveal = ({ children, delay = 0, width = "fit-content", className }: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInViewport) {
      // Already visible (above fold or scroll-restored): skip animation
      return;
    }

    // Below viewport: hide immediately, then reveal on scroll
    controls.set({ opacity: 0, y: 30, scale: 0.98 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          controls.start({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
          });
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [controls, delay]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      className={className}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};
