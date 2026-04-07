'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { cardService } from '@/services/cardService';
import { FilterSidebar } from '@/features/catalog/FilterSidebar';
import { CardGrid } from '@/features/catalog/CardGrid';
import { ProductCard } from '@/features/catalog/ProductCard';
import { IFilterState } from '@/types/models';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Loader2, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SearchHeader, SearchControls } from './SearchComponents';

const DEFAULT_FILTERS: IFilterState = {
  searchQuery: '', rarity: [], sets: [], cardType: [], game: [], colors: [],
  priceRange: [0, 5000], sortBy: 'price_asc', isDirectOnly: false,
};

const ITEMS_PER_PAGE = 20;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState<IFilterState>({
    ...DEFAULT_FILTERS,
    searchQuery: initialQuery
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Synchronize initial query from URL only once or when URL query changes significantly
  useEffect(() => {
    if (initialQuery && initialQuery !== filters.searchQuery) {
        setFilters(prev => ({ ...prev, searchQuery: initialQuery }));
    }
  }, [initialQuery]);

  const query = useInfiniteQuery({
    queryKey: ['cards', filters],
    queryFn: ({ pageParam = 1 }) => 
      cardService.getPaginatedCards(pageParam, ITEMS_PER_PAGE, filters),
    getNextPageParam: (lastPage, allPages) => 
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = query;
  const allCards = useMemo(() => data?.pages.flatMap(page => page.cards) || [], [data]);
  const totalResults = data?.pages[0]?.total || 0;

  const { targetRef, isIntersecting } = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage, threshold: 0.1,
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage) {
        fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, fetchNextPage]);

  if (isError) return <SearchError refetch={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchHeader searchQuery={filters.searchQuery} totalResults={totalResults} isLoading={isLoading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-12">
          <aside className="hidden lg:block w-72 shrink-0 sticky top-28 self-start">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <FilterSidebar filters={filters} onFilterChange={setFilters} />
            </div>
          </aside>
          <div className="flex-1 min-w-0">
            <SearchControls onOpenSidebar={() => setSidebarOpen(true)} />
            <CardGrid cards={allCards} isLoading={isLoading} CardComponent={ProductCard} emptyMessage="No matches found." />
            <div ref={targetRef} className="py-16 flex flex-col items-center gap-4">
              {isFetchingNextPage ? (
                 <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              ) : hasNextPage ? (
                <Button variant="ghost" onClick={() => fetchNextPage()}>Load More</Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {sidebarOpen && <MobileSidebar filters={filters} setFilters={setFilters} onClose={() => setSidebarOpen(false)} />}
    </div>
  );
}

function SearchError({ refetch }: { refetch: () => void }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
            <FilterX size={32} />
            <Button onClick={() => refetch()} className="mt-8">Retry</Button>
        </div>
    );
}

function MobileSidebar({ filters, setFilters, onClose }: { filters: IFilterState, setFilters: any, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/60" onClick={onClose} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white p-10 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Filters</h2>
                    <button onClick={onClose} className="text-xs font-black text-blue-600 uppercase">Done</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <FilterSidebar filters={filters} onFilterChange={setFilters} />
                </div>
            </div>
        </div>
    );
}
