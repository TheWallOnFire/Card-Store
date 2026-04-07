'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ICard } from '@/types/models';

interface ICartItem extends ICard {
  quantity: number;
}

interface ICartContext {
  items: ICartItem[];
  addItem: (card: ICard) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

function useCartStore() {
  const [items, setItems] = useState<ICartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse cart', e);
        }
      }
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (card: ICard) => {
    if (!card.id || (card.marketPrice === undefined && card.lowPrice === undefined)) {
        console.error('Incomplete card data rejected:', card);
        return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.id === card.id);
      if (existing) {
        return prev.map((item) => 
          item.id === card.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...card, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty >= 1) {
      setItems((prev) => prev.map((item) => 
        item.id === id ? { ...item, quantity: qty } : item
      ));
    }
  };
  const clearCart = () => setItems([]);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + ((item.marketPrice || 0) * item.quantity), 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, isOpen, setIsOpen, toggleCart, totalItems, totalPrice };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCartStore();
  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
