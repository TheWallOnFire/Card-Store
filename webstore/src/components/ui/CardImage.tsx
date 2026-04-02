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

interface CardImageProps {
  /** Provide the ID of the card to automatically resolve its image from the map */
  cardId?: string;
  /** Explicitly provide a source URL, overriding cardId resolution if provided */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Choose a unified size constraint representing the trading card aspect ratio */
  size?: CardImageSize;
  /** Additional CSS classes for wrapper */
  className?: string;
  /** Additional CSS classes for the inner img element */
  imgClassName?: string;
  /** Inline styles for the wrapper */
  style?: React.CSSProperties;
  /** Priority loading flag for Next.js Image */
  priority?: boolean;
}

const sizeClasses: Record<CardImageSize, string> = {
  xs: 'w-12', // 48px width
  sm: 'w-24', // 96px width
  md: 'w-48', // 192px width
  lg: 'w-72', // 288px width
  xl: 'w-96', // 384px width
  fill: 'w-full h-full', // Take up full parent container size
};

export function CardImage({
  cardId,
  src,
  alt,
  size = 'md',
  className,
  imgClassName,
  style,
  priority = false,
}: CardImageProps) {
  // Try mapping the image from cardId if no explicit src is given
  let resolvedSrc = src;
  let resolvedAlt = alt || 'Card Image';

  if (!resolvedSrc && cardId) {
    const mapData = (cardImageMap as Record<string, { imgUrl: string; name: string }>)[cardId];
    if (mapData) {
      resolvedSrc = mapData.imgUrl;
      resolvedAlt = alt || mapData.name;
    }
  }

  // Fallback image in case nothing is found
  if (!resolvedSrc) {
    resolvedSrc = 'https://images.unsplash.com/photo-1614728416049-34baeba242f3?auto=format&fit=crop&q=80&w=800'; // Generic fallback (e.g. card back)
    resolvedAlt = alt || 'Unknown Card';
  }

  return (
    <div
      style={style}
      className={cn(
        'relative overflow-hidden rounded-md shadow-sm',
        size !== 'fill' && 'aspect-[5/7]', // Enforce standard TCG proportion 2.5 by 3.5 inches
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={resolvedSrc}
        alt={resolvedAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
        className={cn("object-contain", imgClassName)}
      />
    </div>
  );
}
