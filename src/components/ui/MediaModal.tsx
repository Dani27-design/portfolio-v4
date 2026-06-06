'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { MediaItem } from '@/types';

interface MediaModalProps {
  items: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  projectName: string;
}

export function MediaModal({ items, currentIndex, onClose, onNavigate, projectName }: MediaModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const item = items[currentIndex];
  const hasMultiple = items.length > 1;
  const [loaded, setLoaded] = useState(false);

  // Reset loaded state when navigating
  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  // Keyboard navigation + focus trapping
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (hasMultiple && e.key === 'ArrowLeft') goPrev();
      if (hasMultiple && e.key === 'ArrowRight') goNext();

      if (e.key === 'Tab') {
        const modal = overlayRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"]), video[controls]'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === modal) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goPrev, goNext, hasMultiple]);

  // Body scroll lock
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);

  // Focus overlay on mount
  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  if (!item) return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectName} media viewer`}
      tabIndex={-1}
      className="fixed inset-0 z-[60] outline-none"
    >
      {/* Backdrop — click to close */}
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />

      {/* Loading spinner */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
        </div>
      )}

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close viewer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      {hasMultiple && (
        <div className="absolute top-4 left-4 z-20 text-white/60 text-xs font-mono">
          {currentIndex + 1} / {items.length}
        </div>
      )}

      {/* Prev button */}
      {hasMultiple && (
        <button
          onClick={goPrev}
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Next button */}
      {hasMultiple && (
        <button
          onClick={goNext}
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Media content */}
      <div className="absolute inset-0 flex items-center justify-center p-12 md:p-20 pointer-events-none z-10">
        {item.type === 'video' ? (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            playsInline
            onLoadedData={() => setLoaded(true)}
            className={`max-w-full max-h-full rounded-lg pointer-events-auto transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            aria-label={`${projectName} - video ${currentIndex + 1}`}
          />
        ) : (
          <div className="relative w-full h-full pointer-events-auto">
            <Image
              key={item.url}
              src={item.url}
              alt={`${projectName} - ${currentIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              onLoad={() => setLoaded(true)}
              className={`object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              priority
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
