'use client';

import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { CardImage } from '@/components/ui/CardImage';

interface ImageGalleryProps {
  mainImage: string;
  cardName: string;
}

export function ImageGallery({ mainImage, cardName }: ImageGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        {/* Main Image */}
        <div
          className="relative w-full aspect-[7/10] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 cursor-zoom-in shadow-sm"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          onClick={() => setLightboxOpen(true)}
        >
          <CardImage
            src={mainImage}
            alt={cardName}
            size="fill"
            priority
            imgClassName={`p-6 transition-transform duration-200 ease-out ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                : {}
            }
          />

          {/* Zoom hint */}
          {!isZoomed && (
            <div className="absolute bottom-3 right-3 bg-slate-900/70 text-white rounded-full p-2 backdrop-blur-sm pointer-events-none">
              <ZoomIn className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* Condition Labels */}
        <div className="flex gap-2 justify-center flex-wrap">
          {['Near Mint', 'Lightly Played', 'Moderately Played'].map((c) => (
            <span key={c} className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 rounded px-2 py-1">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative w-full max-w-md aspect-[7/10]">
            <CardImage
              src={mainImage}
              alt={cardName}
              size="fill"
            />
          </div>
        </div>
      )}
    </>
  );
}
