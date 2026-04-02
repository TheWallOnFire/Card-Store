'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';

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
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Sidebar Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
              <Button variant="ghost" size="icon" onClick={toggleCart} className="text-slate-500 hover:text-slate-900 rounded-full h-8 w-8">
                <X className="h-5 w-5" />
                <span className="sr-only">Close cart</span>
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
                  <div className="rounded-full bg-slate-50 p-6">
                    <ShoppingBag className="h-12 w-12 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-slate-900">Your cart is empty</p>
                    <p className="text-sm text-slate-500">Looks like you haven&apos;t added anything yet.</p>
                  </div>
                  <Button onClick={toggleCart} variant="outline" className="mt-4">
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
                        className="flex gap-4 group"
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-slate-50 border border-slate-100">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="font-semibold text-slate-900 line-clamp-1">{item.title}</h3>
                              <p className="font-bold text-slate-900 ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">{item.category}</p>
                          </div>

                          <div className="flex items-end justify-between">
                            <div className="flex items-center rounded-md border border-slate-200">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs font-medium text-slate-400 hover:text-red-500 underline underline-offset-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
              <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-4">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-slate-500">Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-900">
                  <span>Estimated Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-500 text-center">Taxes calculated at checkout</p>
                <Button className="w-full text-lg py-6 shadow-xl shadow-slate-200">
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
