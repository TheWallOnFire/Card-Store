import { ProductCard } from './ProductCard';
import { CardProduct } from '../services/mockData';

interface ProductGridProps {
  title: string;
  products: CardProduct[];
}

export function ProductGrid({ title, products }: ProductGridProps) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium text-sm transition-colors">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
