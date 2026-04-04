import React from 'react';
import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Define standard utility function locally if missing from project
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Import our new JSON mapping
import cardImageMap from '@/data/cardImageMap.json';

// TCG cards have a standard 2.5" by 3.5" ratio (5:7 ratio).
export type CardImageSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'fill';

interface ICardImageProps {
  cardId?: string;
  src?: string;
  alt?: string;
  size?: CardImageSize;
  className?: string;
  imgClassName?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}

const SIZE_CLASSES: Record<CardImageSize, string> = {
  xs: 'w-12', 
  sm: 'w-24', 
  md: 'w-48', 
  lg: 'w-72', 
  xl: 'w-96', 
  fill: 'w-full h-full', 
};

const BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8AKpTiaXggAAAABJRU5ErkJggg==';

export function CardImage({
  cardId,
  src,
  alt,
  size = 'md',
  className,
  imgClassName,
  style,
  priority = false,
}: ICardImageProps) {
  const { resolvedSrc, resolvedAlt } = resolveImageData(cardId, src, alt);

  return (
    <div
      style={style}
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-100', 
        size !== 'fill' && 'aspect-[5/7]', 
        SIZE_CLASSES[size],
        className
      )}
    >
      <Image
        src={resolvedSrc}
        alt={resolvedAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={cn("object-contain transition-opacity duration-500", imgClassName)}
      />
    </div>
  );
}

function resolveImageData(cardId?: string, src?: string, alt?: string) {
  if (src) {
      return { resolvedSrc: src, resolvedAlt: alt || 'Card Image' };
  }
  
  if (cardId) {
      const mapData = (cardImageMap as Record<string, { imgUrl: string; name: string }>)[cardId];
      if (mapData) {
          return { resolvedSrc: mapData.imgUrl, resolvedAlt: alt || mapData.name };
      }
  }

  return {
    resolvedSrc: 'https://images.unsplash.com/photo-1614728416049-34baeba242f3?auto=format&fit=crop&q=80&w=800', 
    resolvedAlt: alt || 'Unknown Card'
  };
}
