'use client';

import React, { useMemo } from 'react';
import { useMarketData } from '@/hooks/useMarketData';
import { PriceHistoryChart } from '@/features/market/PriceHistoryChart';

interface IMarketAnalyticsSectionProps {
  cardId: string;
  initialPrice: number;
}

export function MarketAnalyticsSection({ cardId, initialPrice }: IMarketAnalyticsSectionProps) {
  const { data, isLoading, isError } = useMarketData(cardId);

  const chartData = useMemo(() => {
    if (!data) {
        return [];
    }
    
    // Generate deterministic historical points based on cardId and initialPrice
    // to satisfy React purity rules for mock data until a real historical endpoint exists.
    const points = [];
    const now = new Date();
    const idNum = cardId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        // Deterministic variation based on index and cardId
        const variation = 0.95 + ((idNum + i) % 10) / 100;
        points.push({
            date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: initialPrice * variation
        });
    }
    return points;
  }, [data, initialPrice, cardId]);

  if (isLoading) {
      return <div className="h-48 w-full bg-slate-100 rounded-3xl animate-pulse" />;
  }
  
  if (isError || !data) {
      return (
        <div className="h-48 w-full bg-slate-50 rounded-3xl border border-dashed border-slate-200 flex items-center justify-center p-6 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Market Analytics Unavailable</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col gap-4">
      <PriceHistoryChart data={chartData} />
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-2xl border border-slate-100">
            <p className="text-sm font-black text-slate-900">${data?.low_price?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-100">
            <p className="text-sm font-black text-slate-900">{data?.total_listings || 0} List.</p>
        </div>
      </div>
    </div>
  );
}
