import React from 'react';
import { ProductCard } from '@/features/catalog/ProductCard';
import { mockCards } from '@/services/mockData';

export function TrendingProducts() {
  // Take first 4 cards for trending
  const trendingCards = mockCards.slice(0, 4);

  return (
    <section className="w-full py-16 bg-white border-y border-slate-200 shadow-sm relative z-10">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Hot Market Activity</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 uppercase italic">
              Trending Slabs & Singles
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button className="h-10 w-10 flex items-center justify-center rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              ←
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-sm bg-slate-900 hover:bg-slate-800 text-slate-100 transition-colors">
              →
            </button>
          </div>
        </div>

        {/* Horizontal scroll on mobile, Grid on larger screens */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 snap-x snap-mandatory hide-scrollbar">
          {trendingCards.map((card) => (
            <div key={card.id} className="min-w-[80vw] sm:min-w-0 snap-center">
              <ProductCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
