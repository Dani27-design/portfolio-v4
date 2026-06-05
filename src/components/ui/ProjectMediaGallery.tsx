'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MediaModal } from './MediaModal';
import type { MediaItem } from '@/types';

interface ProjectMediaGalleryProps {
  items: MediaItem[];
  projectName: string;
}

export function ProjectMediaGallery({ items, projectName }: ProjectMediaGalleryProps) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);

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
            {item.type === 'video' ? (
              <video
                src={item.url}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            ) : (
              <Image
                src={item.url}
                alt={`${projectName} - ${idx + 1}`}
                fill
                sizes={items.length === 1
                  ? '(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px'
                  : '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px'}
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
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
