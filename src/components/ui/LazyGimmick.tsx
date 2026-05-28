'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface LazyGimmickProps {
  children: ReactNode;
  rootMargin?: string;
}

export const LazyGimmick = ({ children, rootMargin = '50px' }: LazyGimmickProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, reducedMotion]);

  return (
    <>
      {/* Sentinel element for intersection detection — fills parent section via absolute positioning */}
      <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
      {!reducedMotion && visible ? children : null}
    </>
  );
};
