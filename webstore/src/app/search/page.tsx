'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterSidebar } from '@/features/catalog/FilterSidebar';
import { CardGrid } from '@/features/catalog/CardGrid';
import { ProductCard } from '@/features/catalog/ProductCard';
import { FilterState, Card } from '@/types/models';
import { SlidersHorizontal, Grid2x2, LayoutList } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cardService } from '@/services/cardService';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  rarity: [],
  sets: [],
  cardType: [],
  game: [],
  colors: [],
  priceRange: [0, 5000],
  sortBy: 'price_asc',
  isDirectOnly: false,
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const queryParam = searchParams.get('q') || '';

  const { data: allCards = [], isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: () => cardService.getCards(),
  });

  const activeFilters = useMemo(() => ({
    ...filters,
    searchQuery: queryParam || filters.searchQuery
  }), [filters, queryParam]);

  const filteredCards = useMemo<Card[]>(() => {
    let results = [...allCards];
    
    // 1. Text Search (AND)
    if (activeFilters.searchQuery) {
      const q = activeFilters.searchQuery.toLowerCase();
      results = results.filter(
        (c) => c.name.toLowerCase().includes(q) || c.set.toLowerCase().includes(q)
      );
    }

    // 2. Faceted Filters (AND between groups, OR within groups)
    // Rarity Group
    if (activeFilters.rarity?.length > 0) {
      results = results.filter((c) => activeFilters.rarity.includes(c.rarity));
    }

    // Sets Group
    if (activeFilters.sets?.length > 0) {
      results = results.filter((c) => activeFilters.sets.includes(c.set));
    }

    // Game Group
    if (activeFilters.game?.length > 0) {
      results = results.filter((c) => activeFilters.game.includes(c.game));
    }

    // Color Group
    if (activeFilters.colors?.length > 0) {
      results = results.filter((c) => c.color && activeFilters.colors.includes(c.color));
    }

    // Direct Eligible (Toggle)
    if (activeFilters.isDirectOnly) {
      results = results.filter((c) => c.isDirectEligible);
    }

    // Price Range (Range)
    if (activeFilters.priceRange) {
      results = results.filter(
        (c) => c.marketPrice >= activeFilters.priceRange[0] && c.marketPrice <= activeFilters.priceRange[1]
      );
    }
    
    // 3. Sort
    const sortResults = [...results];
    if (activeFilters.sortBy === 'price_asc') {
      sortResults.sort((a, b) => a.marketPrice - b.marketPrice);
    } else if (activeFilters.sortBy === 'price_desc') {
      sortResults.sort((a, b) => b.marketPrice - a.marketPrice);
    } else if (activeFilters.sortBy === 'name_asc') {
      sortResults.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return sortResults;
  }, [allCards, activeFilters]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
            {activeFilters.searchQuery ? `Results: "${activeFilters.searchQuery}"` : 'Browse All Cards'}
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500 uppercase tracking-wide">
            {isLoading ? 'Searching...' : `${filteredCards.length} listings found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar — Desktop */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex lg:hidden items-center gap-2 border border-slate-300 rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-md border border-slate-200 bg-white text-blue-600 hover:bg-blue-50 transition-colors">
                  <Grid2x2 className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>

            <CardGrid
              cards={filteredCards}
              isLoading={isLoading}
              CardComponent={ProductCard}
              emptyMessage="No cards match your current filters."
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black uppercase tracking-widest text-sm">Filters</h2>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-slate-900">✕</button>
            </div>
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>
        </div>
      )}
    </div>
  );
}
