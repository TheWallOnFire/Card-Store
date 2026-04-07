'use client';

import React, { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/types';
import { cardService } from '@/services/cardService';

export function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cardService.getCards().then(cards => {
        // Pick the top 8 "trending" cards based on volatility and price
        const trending = [...cards]
            .sort((a, b) => (b.volatility || 0) - (a.volatility || 0))
            .slice(0, 8)
            .map(c => ({
                id: c.id,
                title: c.name,
                description: `${c.set} · ${c.rarity}`,
                price: c.marketPrice || 0,
                imageUrl: c.imageUrl,
                stock: c.listedCount || 0,
                category: c.game,
                rating: { rate: 5.0, count: (c.listedCount || 0) * 10 }
            }));
        setProducts(trending);
        setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Trending Now
            </h2>
            <p className="mt-2 text-slate-500 text-lg">Hottest TCG assets in the global spotlight</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
              ←
            </button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
              →
            </button>
          </div>
        </div>

        {/* Horizontal scroll on mobile, Grid on larger screens */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 snap-x snap-mandatory hide-scrollbar">
          {products.map((product) => (
            <div key={product.id} className="min-w-[85vw] sm:min-w-0 snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
