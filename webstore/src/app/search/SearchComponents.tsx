'use client';

import React from 'react';
import { IFilterState } from '@/types/models';

interface ISearchHeaderProps {
  searchQuery: string;
  totalResults: number;
  isLoading: boolean;
}

export function SearchHeader({ searchQuery, totalResults, isLoading }: ISearchHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic leading-none">
            {searchQuery ? `Scanning: "${searchQuery}"` : 'Global Catalog Index'}
          </h1>
          <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] opacity-80">
            {isLoading ? 'Indexing Marketplace...' : `${totalResults.toLocaleString()} active listings available`}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ISearchControlsProps {
  onOpenSidebar: () => void;
}

export function SearchControls({ onOpenSidebar }: ISearchControlsProps) {
    return (
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSidebar}
                    className="flex lg:hidden items-center gap-2 bg-slate-900 text-white rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                >
                    Apply Filters
                </button>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                    <span className="text-slate-900 underline underline-offset-4 decoration-blue-500">Live Sync Enabled</span>
                </div>
            </div>
        </div>
    );
}
