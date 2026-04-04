import React, { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cardService } from '@/services/cardService';
import { getMockListings, getMockPriceHistory } from '@/services/listingService';
import { ImageGallery } from '@/features/listings/ImageGallery';
import { PriceHistoryChart } from '@/features/listings/PriceHistoryChart';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, TrendingUp, Package, ShieldCheck, Zap, ShoppingCart, type LucideIcon } from 'lucide-react';
import { AddToCartButton, ListingsTableClient } from './ProductClientComponents';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  const card = await cardService.getCardById(id);

  if (!card) {
    return { title: 'Card Not Found' };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${card.name} | ${card.set} Marketplace`,
    description: `Buy ${card.name} (${card.rarity}) from ${card.set}. Market Price: $${card.marketPrice}. Verified sellers and fast shipping.`,
    openGraph: {
      title: `${card.name} - ${card.game}`,
      description: `Market Price: $${card.marketPrice} | ${card.set}`,
      images: [card.imageUrl, ...previousImages],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: card.name,
      description: `Shop ${card.name} on CardVault`,
      images: [card.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const card = await cardService.getCardById(id);

  if (!card) {
    return notFound();
  }

  const listings = getMockListings(card.id);
  const priceHistory = getMockPriceHistory(card.marketPrice);
  const lowestListing = [...listings].sort((a, b) => (a.price + a.shippingPrice) - (b.price + b.shippingPrice))[0];

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
            <span className="text-slate-900 truncate max-w-48 text-ellipsis">{card.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-4 sticky top-24">
            <ErrorBoundary fallback={<div className="h-96 w-full bg-slate-200 animate-pulse rounded-2xl" />}>
               <ImageGallery mainImage={card.imageUrl} cardName={card.name} />
            </ErrorBoundary>
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
              <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none mb-2">
                {card.name}
              </h1>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest hover:underline cursor-pointer transition-all">{card.set}</p>
            </div>

            {/* Price Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <PriceStat label="Market Price" value={card.marketPrice} />
              <PriceStat label="Low Price" value={card.lowPrice} />
              <PriceStat label="Trade-In" value={card.buylistPrice} isPromo />
            </div>

            {/* Quick Buy CTA */}
            {lowestListing && (
              <div className="bg-white rounded-[32px] border-2 border-blue-600 p-8 text-slate-900 shadow-2xl shadow-blue-500/10 relative overflow-hidden group">
                <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                  <ShoppingCart className="h-24 w-24 text-blue-600" />
                </div>
                <div className="relative">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" /> Best Current Value
                  </p>
                  <div className="flex items-end gap-2 mb-1">
                    <p className="text-4xl font-black tracking-tighter">${lowestListing.price.toFixed(2)}</p>
                    <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-tight">
                      + ${lowestListing.shippingPrice.toFixed(2)} Shipping
                    </p>
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 mb-6 uppercase tracking-wider">
                    Sold by <span className="text-slate-900 font-black underline decoration-blue-200 underline-offset-4">{lowestListing.sellerName}</span> ({lowestListing.sellerFeedback}% Feedback)
                  </p>
                  <AddToCartButton card={card} />
                </div>
              </div>
            )}

            {/* Features Row */}
            <div className="grid grid-cols-2 gap-4">
              <FeatureItem icon={ShieldCheck} label="Buyer Protection" sub="30-day guarantee" />
              <FeatureItem icon={Package} label="Tracked Shipping" sub="Insured delivery" />
            </div>
          </div>

          {/* Right: Price Chart */}
          <div className="lg:col-span-3 lg:border-l lg:border-slate-200 lg:pl-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" /> Market Tracing
            </h3>
            <Suspense fallback={<div className="h-48 w-full bg-slate-100 rounded-xl animate-pulse" />}>
                {priceHistory.length > 0 && <PriceHistoryChart data={priceHistory} cardName={card.name} />}
            </Suspense>
            <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <p className="text-[10px] font-bold text-blue-700/60 leading-relaxed uppercase tracking-tight">
                    Market data is synchronized via proprietary TCG indexes every 15 minutes. 
                </p>
            </div>
          </div>
        </div>

        {/* Listings Table Section */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-4 border-slate-900">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 italic">
              Live Marketplace Listings
            </h2>
            <div className="flex items-center gap-8">
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                    <p className="text-lg font-black text-slate-900 leading-none">{listings.length}</p>
                </div>
            </div>
          </div>
          <ErrorBoundary fallback={<div className="p-12 text-center bg-white rounded-3xl border border-slate-200 font-bold">Failed to load marketplace listings.</div>}>
            <ListingsTableClient listings={listings} card={card} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function PriceStat({ label, value, isPromo = false }: { label: string, value: number, isPromo?: boolean }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm group hover:border-blue-400 transition-all hover:shadow-lg hover:shadow-slate-200/50">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</p>
            <p className={`text-2xl font-black tracking-tighter ${isPromo ? 'text-blue-600' : 'text-slate-900'}`}>
                ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
        </div>
    );
}

function FeatureItem({ icon: Icon, label, sub }: { icon: LucideIcon, label: string, sub: string }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 items-center shadow-sm">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <Icon className="h-5 w-5 shrink-0" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1">{label}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight opacity-70">{sub}</p>
            </div>
        </div>
    );
}
