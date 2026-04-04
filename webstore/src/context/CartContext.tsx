'use client';

import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { ICard } from '@/types/models';
import { cartReducer, initialCartState, ICartState } from './cartReducer';

interface ICartContextType extends ICartState {
  addItem: (card: ICard) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<ICartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  useEffect(() => {
    const savedCart = localStorage.getItem('tcg_cart');
    if (savedCart) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
      } catch (err) {
        console.error('Failed to parse cart JSON', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tcg_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (card: ICard) => dispatch({ type: 'ADD_ITEM', payload: card });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: string, quantity: number) => 
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
      throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
