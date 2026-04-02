'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { CardImage } from '@/components/ui/CardImage';

export function CartSidebar() {
  const { isOpen, items, toggleCart, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Sidebar Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl border-l border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <h2 className="text-lg font-black uppercase italic tracking-wide text-slate-900">Cart Details</h2>
              <Button variant="ghost" size="icon" onClick={toggleCart} className="text-slate-500 hover:bg-slate-200 hover:text-slate-900 rounded-sm h-8 w-8">
                <X className="h-5 w-5" />
                <span className="sr-only">Close cart</span>
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-slate-100 p-6">
                    <ShoppingBag className="h-12 w-12 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold uppercase text-slate-900">Your cart is empty</p>
                    <p className="text-sm font-medium text-slate-500">Looks like you haven&apos;t added any cards yet.</p>
                  </div>
                  <Button onClick={toggleCart} variant="outline" className="mt-4 uppercase font-bold tracking-wider text-xs border-2">
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex gap-4 group border border-slate-100 p-3 rounded-md bg-white hover:border-blue-500 transition-colors"
                      >
                        <CardImage
                          cardId={item.id}
                          src={item.image_url}
                          alt={item.name}
                          size="fill"
                          className="h-24 w-16 !aspect-[auto] shrink-0 rounded-sm bg-slate-100 border border-slate-200"
                          imgClassName="p-1"
                        />

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{item.name}</h3>
                              <p className="font-black text-slate-900">${(item.market_price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="text-xs font-semibold uppercase text-slate-400 mt-1">{item.set}</p>
                          </div>

                          <div className="flex items-end justify-between mt-2">
                            <div className="flex items-center rounded-sm border border-slate-200 bg-slate-50">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="border-t border-slate-200 bg-white p-6 space-y-4">
                <div className="space-y-2 text-sm font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-slate-400">Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-black text-slate-900">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <Button className="w-full h-12 text-sm font-bold uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white rounded-sm shadow-lg shadow-blue-500/20">
                  Secure Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
