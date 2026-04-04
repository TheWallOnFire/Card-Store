'use client';

import React, { useMemo, useState } from 'react';
import { IListing } from '@/types/models';
import { Star, ShoppingCart, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CONDITION_COLORS: Record<string, string> = {
  NM: 'bg-green-50 text-green-700 border-green-200',
  LP: 'bg-blue-50 text-blue-700 border-blue-200',
  MP: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  HP: 'bg-orange-50 text-orange-700 border-orange-200',
  DMG: 'bg-red-50 text-red-700 border-red-200',
};

const CONDITION_LABELS: Record<string, string> = {
  NM: 'Near Mint',
  LP: 'Lightly Played',
  MP: 'Moderately Played',
  HP: 'Heavily Played',
  DMG: 'Damaged',
};

interface IListingTableProps {
  listings: IListing[];
  onAddToCart?: (listing: IListing) => void;
}

export function ListingTable({ listings, onAddToCart }: IListingTableProps) {
  const [sortBy, setSortBy] = useState<'price' | 'feedback'>('price');

  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => {
      if (sortBy === 'price') {
        return (a.price + a.shippingPrice) - (b.price + b.shippingPrice);
      }
      return b.sellerFeedback - a.sellerFeedback;
    });
  }, [listings, sortBy]);

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm ring-1 ring-slate-900/5">
      <TableControls sortBy={sortBy} setSortBy={setSortBy} count={sortedListings.length} />
      <TableHeader />
      <div className="divide-y divide-slate-100">
        {sortedListings.map((listing, i) => (
          <ListingRow 
            key={listing.id} 
            listing={listing} 
            isBestValue={i === 0 && sortBy === 'price'} 
            onAddToCart={onAddToCart} 
          />
        ))}
      </div>
    </div>
  );
}

function TableControls({ sortBy, setSortBy, count }: { sortBy: string, setSortBy: (v: 'price' | 'feedback') => void, count: number }) {
  return (
    <div className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
      <div className="relative">
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'price' | 'feedback')}
          className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="price">Price + Shipping: Lowest</option>
          <option value="feedback">Highest Feedback</option>
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
      </div>
      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{count} Listings Found</span>
    </div>
  );
}

function TableHeader() {
  return (
    <div className="grid grid-cols-[1fr_120px_100px_100px_120px] gap-4 items-center px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
      <span>Seller Info</span>
      <span className="text-center">Condition</span>
      <span className="text-right">Price</span>
      <span className="text-right">Shipping</span>
      <span className="text-right pr-4">Total</span>
    </div>
  );
}

function ListingRow({ listing, isBestValue, onAddToCart }: { listing: IListing, isBestValue: boolean, onAddToCart?: (l: IListing) => void }) {
  return (
    <div className={`grid grid-cols-[1fr_120px_100px_100px_120px] gap-4 items-center px-4 py-3.5 transition-all hover:bg-blue-50/40 relative group ${isBestValue ? 'bg-blue-50/20' : ''}`}>
      {isBestValue && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600" />}
      
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-black text-slate-900 truncate hover:text-blue-600 transition-colors cursor-pointer">{listing.sellerName}</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
          {listing.sellerFeedback.toFixed(1)}% Feedback
        </div>
      </div>

      <div className="flex flex-col items-center">
        <span className={`text-[10px] font-black px-2.5 py-1 rounded border uppercase tracking-wider mb-1 ${CONDITION_COLORS[listing.condition]}`}>
          {listing.condition}
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{CONDITION_LABELS[listing.condition]}</span>
      </div>

      <div className="text-right">
        <p className="text-base font-black text-slate-900">${listing.price.toFixed(2)}</p>
        <p className="text-[10px] font-bold text-slate-400">×{listing.quantityAvailable} Avail.</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-black text-slate-600">
          {listing.shippingPrice === 0 ? <span className="text-green-600 flex items-center justify-end gap-1">Free <Shield className="h-3 w-3" /></span> : `+$${listing.shippingPrice.toFixed(2)}`}
        </p>
      </div>

      <div className="flex flex-col items-end pr-1">
        <p className="text-sm font-black text-slate-900 mb-2">${(listing.price + listing.shippingPrice).toFixed(2)} Total</p>
        <Button onClick={() => onAddToCart?.(listing)} className="h-8 w-24 bg-slate-900 hover:bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-lg transition-all shadow-sm hover:shadow-lg group-hover:scale-105">
          <ShoppingCart className="h-3 w-3 mr-1.5" /> Add
        </Button>
      </div>
    </div>
  );
}
