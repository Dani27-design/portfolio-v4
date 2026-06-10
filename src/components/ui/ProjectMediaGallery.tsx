'use client';

import { useState, useCallback } from 'react';
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

  const isMultiple = items.length > 1;

  return (
    <>
      <div className="mb-6 md:mb-10 flex flex-wrap gap-3 justify-center">
        {items.map((item, idx) => (
          <button
            key={`${item.url}-${idx}`}
            type="button"
            onClick={() => setModalIndex(idx)}
            className={`rounded-xl overflow-hidden border border-border/40 bg-background relative cursor-zoom-in group max-w-full ${
              item.type === 'video'
                ? 'w-full aspect-video'
                : `flex items-center justify-center min-h-[100px]${isMultiple ? ' sm:max-w-[calc(50%-6px)]' : ''}`
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
              <img
                src={item.url}
                alt={`${projectName} - ${idx + 1}`}
                loading={idx === 0 ? 'eager' : 'lazy'}
                onLoad={() => markLoaded(idx)}
                className={`max-w-full ${isMultiple ? 'max-h-[350px]' : 'max-h-[400px]'} w-auto object-contain group-hover:scale-[1.02] transition-[transform,opacity] duration-300 ${loadedSet.has(idx) ? 'opacity-100' : 'opacity-0'}`}
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
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
