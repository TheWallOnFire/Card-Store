'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-xl hover:ring-slate-300"
    >
      {/* Image Container with "Glass" Quick Add */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-50 mb-4">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex justify-center">
          <Button 
            onClick={handleAddToCart}
            variant="glass" 
            className="w-full gap-2 font-semibold shadow-lg backdrop-blur-md"
            disabled={isAdded}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Added</span>
                </motion.div>
              ) : (
                <motion.div
                  key="cart"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Quick Add</span>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {product.category}
          </span>
          {product.rating && (
            <div className="flex items-center gap-1 text-slate-600">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{product.rating.rate}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-tight mb-2">
          {product.title}
        </h3>
        
        <div className="mt-auto flex items-end justify-between">
          <p className="text-lg font-extrabold text-slate-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
