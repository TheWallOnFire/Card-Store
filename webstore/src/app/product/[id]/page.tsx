'use client';

import React, { useMemo, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { cardService } from '@/services/cardService';
import { getMockListings, getMockPriceHistory } from '@/services/listingService';
import { ImageGallery } from '@/features/listings/ImageGallery';
import { ListingTable } from '@/features/listings/ListingTable';
import { PriceHistoryChart } from '@/features/listings/PriceHistoryChart';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ChevronRight, TrendingUp, Package, ShieldCheck, Loader2, Zap, ShoppingCart } from 'lucide-react';
import { Listing, Card } from '@/types/models';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);

  const { data: card, isLoading, isError } = useQuery({
    queryKey: ['card', resolvedParams.id],
    queryFn: () => cardService.getCardById(resolvedParams.id),
  });

  const listings = useMemo(() => {
    if (!card) return [];
    return getMockListings(card.id);
  }, [card]);

  const priceHistory = useMemo(() => {
    if (!card) return [];
    return getMockPriceHistory(card.marketPrice);
  }, [card]);

  const lowestListing = useMemo(() => {
    if (listings.length === 0) return null;
    return [...listings].sort((a, b) => (a.price + a.shippingPrice) - (b.price + b.shippingPrice))[0];
  }, [listings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Loading card details...</p>
        </div>
      </div>
    );
  }

  if (isError || !card) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/search" className="hover:text-blue-600 transition-colors">Marketplace</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 truncate max-w-48">{card.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-4 sticky top-24">
            <ImageGallery mainImage={card.imageUrl} cardName={card.name} />
          </div>

          {/* Middle: Card Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Title + Badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider">
                  {card.rarity}
                </Badge>
                <Badge className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider">
                  #{card.number}
                </Badge>
                {card.isDirectEligible && (
                  <Badge className="bg-blue-600 text-white border-blue-700 text-[10px] font-black px-2.5 py-0.5 uppercase tracking-widest flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 fill-current" />
                    Direct Eligible
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight mb-2">
                {card.name}
              </h1>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest hover:underline cursor-pointer transition-all">{card.set}</p>
            </div>

            {/* Price Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm group hover:border-blue-400 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Market Price</p>
                <p className="text-xl font-black text-slate-900">${card.marketPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm group hover:border-blue-400 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Low Price</p>
                <p className="text-xl font-black text-slate-900">${card.lowPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm group hover:border-blue-400 transition-colors">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Trade-In</p>
                <p className="text-xl font-black text-blue-600">${card.buylistPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Quick Buy CTA */}
            {lowestListing && (
              <div className="bg-white rounded-xl border-2 border-blue-600 p-5 text-slate-900 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ShoppingCart className="h-12 w-12 text-blue-600" />
                </div>
                <div className="relative">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3" /> Best Current Value
                  </p>
                  <div className="flex items-end gap-2 mb-1">
                    <p className="text-3xl font-black">${lowestListing.price.toFixed(2)}</p>
                    <p className="text-xs font-bold text-slate-400 mb-1">
                      + ${lowestListing.shippingPrice.toFixed(2)} Shipping
                    </p>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 mb-5">
                    Sold by <span className="text-slate-900">{lowestListing.sellerName}</span> ({lowestListing.sellerFeedback}% Feedback)
                  </p>
                  <AddToCartButton listing={lowestListing} card={card} />
                </div>
              </div>
            )}

            {/* Features Row */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: 'Buyer Protection', sub: '30-day guarantee' },
                { icon: Package, label: 'Tracked Shipping', sub: 'Insured delivery' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-slate-50 rounded-lg border border-slate-200 p-3 flex gap-3 items-center">
                  <Icon className="h-5 w-5 text-blue-600 shrink-0" />
                  <div>
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-wide leading-none mb-0.5">{label}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter opacity-70">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Price Chart */}
          <div className="lg:col-span-3 lg:border-l lg:border-slate-200 lg:pl-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" /> Price History
            </h3>
            {priceHistory.length > 0 && <PriceHistoryChart data={priceHistory} cardName={card.name} />}
            <div className="mt-6 p-4 bg-slate-100 rounded-lg border border-slate-200">
                <p className="text-[10px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                    Market data is updated every 15 minutes. Prices shown reflect recent sales on TCGplayer.
                </p>
            </div>
          </div>
        </div>

        {/* Listings Table Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-slate-900">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
              Live Marketplace Listings
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Available</p>
                <p className="text-sm font-black text-slate-900">{listings.length}</p>
              </div>
            </div>
          </div>
          <ListingsTableClient listings={listings} card={card} />
        </div>
      </div>
    </div>
  );
}

// Separate client component to handle cart actions
function AddToCartButton({ card }: { listing: Listing; card: Card }) {
  const { addItem } = useCart();
  return (
    <Button
      onClick={() => addItem(card)}
      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
    >
      Add to Cart
    </Button>
  );
}

function ListingsTableClient({ listings, card }: { listings: Listing[]; card: Card }) {
  const { addItem } = useCart();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAdd = (listing: Listing) => {
    addItem(card);
  };
  return <ListingTable listings={listings} onAddToCart={handleAdd} />;
}
