'use client';

import React from 'react';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts';
import { PriceHistoryPoint } from '@/services/listingService';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface PriceHistoryChartProps {
  data: PriceHistoryPoint[];
  cardName: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl px-3 py-2 text-white">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-sm font-black">
          ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export function PriceHistoryChart({ data }: Omit<PriceHistoryChartProps, 'cardName'>) {
  const latestPrice = data[data.length - 1]?.price ?? 0;
  const firstPrice = data[0]?.price ?? 0;
  const changePct = firstPrice > 0 ? (((latestPrice - firstPrice) / firstPrice) * 100).toFixed(1) : '0';
  const isUp = latestPrice >= firstPrice;

  return (
    <div className="w-full">
      {/* Mini Header Inside Sidebar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
            <span className="text-[22px] font-black text-slate-900 leading-none mb-1">
                ${latestPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`h-3 w-3 ${!isUp && 'rotate-180'}`} />
                {isUp ? '+' : ''}{changePct}% (6mo)
            </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[180px] w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity={0.2} />
                <stop offset="95%" stopColor={isUp ? '#10b981' : '#ef4444'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              hide
            />
            <YAxis
              hide
              domain={['dataMin - 50', 'dataMax + 50']}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isUp ? '#10b981' : '#ef4444'}
              strokeWidth={3}
              fill="url(#priceGrad)"
              dot={false}
              activeDot={{ r: 5, fill: isUp ? '#10b981' : '#ef4444', stroke: '#fff', strokeWidth: 2 }}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-100 pt-4">
        <AlertCircle className="h-3 w-3" />
        Verified Marketplace Data
      </div>
    </div>
  );
}
