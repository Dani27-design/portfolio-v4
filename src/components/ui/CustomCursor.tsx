'use client';

import { useEffect, useRef } from "react";

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current && followerRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        followerRef.current.style.transform = `translate(${e.clientX - 11}px, ${e.clientY - 11}px)`;
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <>
      <div id="cursor" ref={cursorRef} className="hidden md:block" />
      <div id="cursor-follower" ref={followerRef} className="hidden md:block" />
    </>
  );
};
