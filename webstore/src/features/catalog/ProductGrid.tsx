import { ProductCard } from './ProductCard';
import { Card } from '@/types/models';

interface ProductGridProps {
  title: string;
  cards: Card[];
}

export function ProductGrid({ title, cards }: ProductGridProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 border-b border-slate-100 pb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
              {title}
            </h2>
            <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">
              Authenticated & Verified Listings
            </p>
          </div>
          <button className="px-6 py-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold text-xs uppercase tracking-widest transition-all duration-300">
            Show More
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {cards.map((card) => (
            <ProductCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
