'use client';

import React, { useOptimistic, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { IListing, ICard } from '@/types/models';
import { ListingTable } from '@/features/listings/ListingTable';
import { ShoppingCart, Check } from 'lucide-react';

// Separate client component to handle add-to-cart actions with optimistic UI
export function AddToCartButton({ card }: { card: ICard }) {
  const { addItem } = useCart();
  const [isPending, startTransition] = useTransition();
  
  // Optimistic state for the button itself
  const [optimisticAdded, setOptimisticAdded] = useOptimistic(
    false,
    () => true
  );

  const handleAdd = () => {
    startTransition(async () => {
        setOptimisticAdded(true);
        // Simulate a small delay for server sync
        await new Promise(resolve => setTimeout(resolve, 600));
        addItem(card);
    });
  };

  return (
    <Button
      onClick={handleAdd}
      disabled={isPending || optimisticAdded}
      className={`w-full h-14 font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-2xl active:scale-95 border-none ${
        optimisticAdded ? 'bg-green-600 shadow-green-500/20' : 'bg-blue-600 hover:bg-black shadow-blue-500/20'
      }`}
    >
      {optimisticAdded ? <><Check className="h-4 w-4 mr-2" /> Secured</> : <><ShoppingCart className="h-4 w-4 mr-2" /> Add to collection</>}
    </Button>
  );
}

export function ListingsTableClient({ listings, card }: { listings: IListing[]; card: ICard }) {
  const { addItem } = useCart();
  
  const handleAdd = () => {
    addItem(card);
  };

  return <ListingTable listings={listings} onAddToCart={handleAdd} />;
}
