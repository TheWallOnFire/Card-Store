import React from 'react';
import { HeroSection } from '@/components/shared/HeroSection';
import { FeaturedCategories } from '@/features/catalog/FeaturedCategories';
import { TrendingProducts } from '@/features/catalog/TrendingProducts';
import { ProductGrid } from '@/features/catalog/ProductGrid';
import { mockCards } from '@/services/mockData';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full pb-10 bg-slate-50 min-h-screen">
      <HeroSection />
      
      <div className="w-full mt-10">
        <TrendingProducts />
      </div>
      
      <div className="w-full">
        <FeaturedCategories />
      </div>

      <div className="w-full mt-4">
        {/* We can pass down newly added cards as a grid example */}
        <ProductGrid title="Just Added" cards={mockCards} />
      </div>
    </div>
  );
}
