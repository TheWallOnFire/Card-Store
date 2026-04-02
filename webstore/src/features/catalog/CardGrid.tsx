import React from 'react';
import { Card } from '@/types/models';

// Skeleton for loading state
function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white border border-slate-200 animate-pulse h-full">
      <div className="aspect-[7/10] bg-slate-100 p-4">
        <div className="w-full h-full bg-slate-200 rounded-md" />
      </div>
      <div className="p-3 flex flex-col gap-2.5 flex-grow">
        <div className="flex gap-1.5">
            <div className="h-2.5 bg-slate-100 rounded-full w-12" />
            <div className="h-2.5 bg-slate-100 rounded-full w-8" />
        </div>
        <div className="space-y-1.5">
            <div className="h-4 bg-slate-200 rounded-md w-full" />
            <div className="h-4 bg-slate-200 rounded-md w-2/3" />
        </div>
        <div className="mt-auto flex justify-between items-end pt-2">
          <div className="space-y-1.5">
            <div className="h-2 bg-slate-100 rounded-full w-8" />
            <div className="h-5 bg-slate-300 rounded-md w-20" />
          </div>
          <div className="h-9 w-9 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

interface CardGridProps {
  cards: Card[];
  isLoading?: boolean;
  emptyMessage?: string;
  CardComponent: React.ComponentType<{ card: Card }>;
}

export function CardGrid({ cards, isLoading, emptyMessage = 'No cards found.', CardComponent }: CardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-6">🃏</div>
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide mb-2">No Results Found</h3>
        <p className="text-slate-500 text-sm max-w-sm">{emptyMessage} Try adjusting your filters or searching for something else.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {cards.map((card) => (
        <CardComponent key={card.id} card={card} />
      ))}
    </div>
  );
}
