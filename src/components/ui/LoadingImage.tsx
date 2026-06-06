'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LoadingImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  className?: string;
}

export function LoadingImage({ src, alt, fill, sizes, quality, priority, className }: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-surface animate-pulse">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-border/20 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        onLoad={() => setLoaded(true)}
        className={`${className || ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
}
