'use client';

import { useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const goPrev = useCallback(() => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const goNext = useCallback(() => {
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (hasMultiple && e.key === 'ArrowLeft') goPrev();
      if (hasMultiple && e.key === 'ArrowRight') goNext();
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

  // Focus trap — focus overlay on mount
  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!item) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectName} media viewer`}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 outline-none"
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close viewer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      {hasMultiple && (
        <div className="absolute top-4 left-4 z-10 text-white/60 text-xs font-mono">
          {currentIndex + 1} / {items.length}
        </div>
      )}

      {/* Prev button */}
      {hasMultiple && (
        <button
          onClick={goPrev}
          className="absolute left-3 md:left-6 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Next button */}
      {hasMultiple && (
        <button
          onClick={goNext}
          className="absolute right-3 md:right-6 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Media content */}
      <div className="w-full h-full flex items-center justify-center p-12 md:p-20">
        {item.type === 'video' ? (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-full rounded-lg"
            aria-label={`${projectName} - video ${currentIndex + 1}`}
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              key={item.url}
              src={item.url}
              alt={`${projectName} - ${currentIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
