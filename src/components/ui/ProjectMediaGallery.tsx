'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { MediaModal } from './MediaModal';
import type { MediaItem } from '@/types';

interface ProjectMediaGalleryProps {
  items: MediaItem[];
  projectName: string;
}

function MediaSkeleton() {
  return (
    <div className="absolute inset-0 bg-surface animate-pulse">
      <div className="w-full h-full bg-gradient-to-r from-transparent via-border/20 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}

export function ProjectMediaGallery({ items, projectName }: ProjectMediaGalleryProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [loadedSet, setLoadedSet] = useState<Set<number>>(new Set());

  const markLoaded = useCallback((idx: number) => {
    setLoadedSet(prev => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      <div className={`mb-8 md:mb-12 ${items.length === 1 ? '' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}`}>
        {items.map((item, idx) => (
          <button
            key={`${item.url}-${idx}`}
            type="button"
            onClick={() => setModalIndex(idx)}
            className={`rounded-xl overflow-hidden border border-border/40 bg-background relative aspect-video cursor-zoom-in group ${
              items.length === 1 ? '' : idx === 0 && items.length > 2 ? 'md:col-span-2' : ''
            }`}
            aria-label={`View ${item.type === 'video' ? 'video' : 'image'} ${idx + 1} fullscreen`}
          >
            {!loadedSet.has(idx) && <MediaSkeleton />}
            {item.type === 'video' ? (
              <video
                src={item.url}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                onLoadedData={() => markLoaded(idx)}
                className={`w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ${loadedSet.has(idx) ? '' : 'opacity-0'}`}
              />
            ) : (
              <Image
                src={item.url}
                alt={`${projectName} - ${idx + 1}`}
                fill
                sizes={items.length === 1
                  ? '(max-width: 768px) 95vw, (max-width: 1280px) 80vw, 1200px'
                  : '(max-width: 768px) 95vw, (max-width: 1280px) 45vw, 600px'}
                quality={80}
                onLoad={() => markLoaded(idx)}
                className={`object-cover group-hover:scale-[1.02] transition-[transform,opacity] duration-300 ${loadedSet.has(idx) ? 'opacity-100' : 'opacity-0'}`}
                priority={idx === 0}
              />
            )}
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      {modalIndex !== null && (
        <MediaModal
          items={items}
          currentIndex={modalIndex}
          onClose={() => setModalIndex(null)}
          onNavigate={setModalIndex}
          projectName={projectName}
        />
      )}
    </>
  );
}
