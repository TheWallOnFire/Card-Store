import React from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Product } from '@/types';

// Mock Data representing products
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Ergonomic Aluminum Laptop Stand",
    description: "Premium space-grade aluminum stand for optimal viewing angle.",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=800&auto=format&fit=crop",
    stock: 24,
    category: "Accessories",
    rating: { rate: 4.8, count: 124 }
  },
  {
    id: "2",
    title: "Matte Black Mechanical Keyboard",
    description: "Tactile switches with custom PBT keycaps.",
    price: 159.00,
    imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop",
    stock: 12,
    category: "Tech",
    rating: { rate: 4.9, count: 89 }
  },
  {
    id: "3",
    title: "Minimalist Leather Backpack",
    description: "Everyday carry reimagined in full-grain Italian leather.",
    price: 245.00,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    stock: 5,
    category: "Lifestyle",
    rating: { rate: 4.7, count: 42 }
  },
  {
    id: "4",
    title: "Wireless Noise-Cancelling Headphones",
    description: "Studio quality sound with 40-hour battery life.",
    price: 299.99,
    imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop",
    stock: 30,
    category: "Audio",
    rating: { rate: 4.6, count: 215 }
  }
];

export function TrendingProducts() {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Trending Now
            </h2>
            <p className="mt-2 text-slate-500 text-lg">Top picks curated for you</p>
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
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="min-w-[85vw] sm:min-w-0 snap-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
