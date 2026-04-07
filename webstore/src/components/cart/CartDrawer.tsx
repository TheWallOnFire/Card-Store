'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, totalPrice, totalItems } = useCart();
  const router = useRouter();

  if (!isOpen) {
      return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        <Backdrop onClose={() => setIsOpen(false)} />
        <motion.div 
          initial={{ x: '100% '}} animate={{ x: 0 }} exit={{ x: '100%' }}
          className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col"
        >
          <CartHeader totalItems={totalItems} onClose={() => setIsOpen(false)} />
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? <EmptyCart onClose={() => setIsOpen(false)} /> : <CartList items={items} />}
          </div>
          {items.length > 0 && <CartFooter totalPrice={totalPrice} onCheckout={() => { setIsOpen(false); router.push('/checkout'); }} />}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Backdrop({ onClose }: { onClose: () => void }) {
    return (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
    );
}

function CartHeader({ totalItems, onClose }: { totalItems: number, onClose: () => void }) {
    return (
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><ShoppingBag className="w-5 h-5" /></div>
                <div>
                   <h2 className="text-lg font-black uppercase tracking-tighter italic">Your Bag</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{totalItems} Items Secured</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
        </div>
    );
}

function EmptyCart({ onClose }: { onClose: () => void }) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4"><ShoppingBag className="w-8 h-8 text-slate-200" /></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Your bag is empty</p>
            <Button variant="ghost" className="mt-4 text-blue-600 font-black uppercase tracking-widest text-[10px]" onClick={onClose}>Start Collecting Cards</Button>
        </div>
    );
}

interface ICartItem {
  id: string;
  name: string;
  set: string;
  imageUrl: string;
  marketPrice: number;
  quantity: number;
}

function CartList({ items }: { items: ICartItem[] }) {
    const { removeItem, updateQuantity } = useCart();
    return (
        <div className="space-y-6">
            {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-28 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100 relative">
                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-tight">{item.set}</p>
                                <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4 text-slate-300 hover:text-red-500" /></button>
                            </div>
                            <h3 className="text-sm font-black text-slate-900 leading-tight uppercase line-clamp-1">{item.name}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">${(item.marketPrice || 0).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:text-blue-600"><Minus className="w-3 h-3" /></button>
                                <span className="px-3 text-xs font-black w-8 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:text-blue-600"><Plus className="w-3 h-3" /></button>
                            </div>
                            <p className="text-sm font-black text-slate-900 uppercase italic">${((item.marketPrice || 0) * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CartFooter({ totalPrice, onCheckout }: { totalPrice: number, onCheckout: () => void }) {
    return (
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Estimated Total</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Inc. Market Index Tax</p>
                </div>
                <p className="text-3xl font-black text-slate-900 italic tracking-tighter">${totalPrice.toFixed(2)}</p>
            </div>
            <Button onClick={onCheckout} className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
            <p className="text-center mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secured by CardVault Logistics</p>
        </div>
    );
}
