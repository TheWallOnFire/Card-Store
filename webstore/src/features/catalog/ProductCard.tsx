'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Check, Zap } from 'lucide-react';
import { Card } from '@/types/models';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/Badge';
import { CardImage } from '@/components/ui/CardImage';

interface ProductCardProps {
  card: Card;
}

export function ProductCard({ card }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(card);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Link href={`/product/${card.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative flex flex-col overflow-hidden rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-0 text-[9px] uppercase tracking-wider font-black px-2 py-0.5 w-fit">
            {card.rarity}
          </Badge>
          {card.isDirectEligible && (
            <Badge className="bg-blue-600/90 backdrop-blur-md text-white border-0 text-[8px] uppercase tracking-tighter font-black px-1.5 py-0.5 w-fit flex items-center gap-0.5">
              <Zap className="h-2 w-2 fill-current" />
              Direct
            </Badge>
          )}
        </div>

        {/* Image */}
        <div className="relative">
          <CardImage
            cardId={card.id}
            src={card.imageUrl}
            alt={card.name}
            size="fill"
            className="bg-slate-100 p-4 aspect-[7/10] rounded-none border-b border-slate-100"
            imgClassName="p-2 transition-transform duration-500 group-hover:scale-105"
          />
          {/* Direct toggle icon */}
          <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm pointer-events-none">
            <Zap className="h-3 w-3 fill-current" />
          </div>
        </div>

        {/* Card Details */}
        <div className="flex flex-col p-3 flex-grow bg-white">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-semibold text-slate-400 truncate">
              {card.set} · #{card.number}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
            {card.name}
          </h3>

          <div className="mt-auto flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wide block leading-none mb-0.5">Market Price</span>
              <p className="text-base font-black text-slate-900">
                ${card.marketPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className={`h-9 w-9 flex items-center justify-center rounded-lg transition-all duration-300 shrink-0 ${
                isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-900 hover:bg-blue-600'
              }`}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="h-4 w-4 text-white" />
                  </motion.div>
                ) : (
                  <motion.div key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
