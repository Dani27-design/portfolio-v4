'use client';

import { motion } from "motion/react";
import { ReactNode, Key } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  width?: "fit-content" | "100%";
  className?: string;
  key?: Key;
}

export const Reveal = ({ children, delay = 0, width = "fit-content", className }: RevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};
