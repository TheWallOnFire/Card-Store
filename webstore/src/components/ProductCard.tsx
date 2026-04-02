'use client';

import Image from 'next/image';

import { CardProduct } from '../services/mockData';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: CardProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useAppContext();

  const rarityColors = {
    Common: 'bg-slate-100 text-slate-600',
    Uncommon: 'bg-green-100 text-green-700',
    Rare: 'bg-blue-100 text-blue-700',
    Epic: 'bg-purple-100 text-purple-700',
    Legendary: 'bg-amber-100 text-amber-700 shadow-[0_0_15px_rgba(251,191,36,0.5)]',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-bold rounded-md ${rarityColors[product.rarity]}`}>
            {product.rarity}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">{product.game}</div>
        <h3 className="font-bold text-lg leading-tight mb-2 text-slate-900 dark:text-slate-100 line-clamp-2">
          {product.name}
        </h3>
        <p className="font-semibold text-blue-600 dark:text-blue-400 text-xl mt-auto">
          ${product.price.toLocaleString()}
        </p>
      </div>

      <button
        onClick={() => addToCart(product)}
        className="absolute bottom-4 right-4 p-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:scale-110"
        aria-label="Add to Cart"
      >
        <Plus className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
