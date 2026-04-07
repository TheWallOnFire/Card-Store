'use client';

import React from 'react';

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
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function SearchControls({ onOpenSidebar, sortBy, onSortChange }: ISearchControlsProps) {
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

            <div className="flex items-center gap-2">
                <span className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort:</span>
                <select 
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 cursor-pointer appearance-none transition-all"
                >
                    <option value="price_asc">Price Low to High</option>
                    <option value="price_desc">Price High to Low</option>
                    <option value="name_asc">Name A-Z</option>
                    <option value="date_desc">Newest First</option>
                </select>
            </div>
        </div>
    );
}
