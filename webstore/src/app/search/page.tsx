'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { cardService } from '@/services/cardService';
import { FilterSidebar } from '@/features/catalog/FilterSidebar';
import { CardGrid } from '@/features/catalog/CardGrid';
import { ProductCard } from '@/features/catalog/ProductCard';
import { IFilterState, ICard } from '@/types/models';
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

  useEffect(() => {
    if (initialQuery && initialQuery !== filters.searchQuery) {
        setFilters(prev => ({ ...prev, searchQuery: initialQuery }));
    }
  }, [initialQuery, filters.searchQuery]);

  const query = useInfiniteQuery({
    queryKey: ['cards', filters],
    queryFn: ({ pageParam = 1 }) => 
      cardService.getPaginatedCards(pageParam, ITEMS_PER_PAGE, filters),
    getNextPageParam: (lastPage, allPages) => 
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  if (query.isError) {
      return <SearchError refetch={query.refetch} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchHeader searchQuery={filters.searchQuery} totalResults={query.data?.pages[0]?.total || 0} isLoading={query.isLoading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-12">
          <aside className="hidden lg:block w-72 shrink-0 sticky top-28 self-start">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <FilterSidebar filters={filters} onFilterChange={setFilters} />
            </div>
          </aside>
          <SearchContent 
            filters={filters} 
            setFilters={setFilters} 
            query={query} 
            onOpenSidebar={() => setSidebarOpen(true)} 
          />
        </div>
      </div>
      {sidebarOpen && <MobileSidebar filters={filters} setFilters={setFilters} onClose={() => setSidebarOpen(false)} />}
    </div>
  );
}

function SearchContent({ filters, setFilters, query, onOpenSidebar }: { 
    filters: IFilterState, 
    setFilters: React.Dispatch<React.SetStateAction<IFilterState>>, 
    query: any, 
    onOpenSidebar: () => void 
}) {
    const allCards = useMemo(() => query.data?.pages.flatMap((page: any) => page.cards) || [], [query.data]);
    const { targetRef, isIntersecting } = useIntersectionObserver({
        enabled: query.hasNextPage && !query.isFetchingNextPage, threshold: 0.1,
    });

    useEffect(() => {
        if (isIntersecting && query.hasNextPage) {
            query.fetchNextPage();
        }
    }, [isIntersecting, query]);

    return (
        <div className="flex-1 min-w-0">
            <SearchControls 
                onOpenSidebar={onOpenSidebar} 
                sortBy={filters.sortBy || 'price_asc'}
                onSortChange={(val) => setFilters(prev => ({ ...prev, sortBy: val }))}
            />
            <CardGrid cards={allCards} isLoading={query.isLoading} CardComponent={ProductCard} emptyMessage="No matches found." />
            <div ref={targetRef} className="py-16 flex flex-col items-center gap-4">
                {query.isFetchingNextPage ? (
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                ) : query.hasNextPage ? (
                    <Button variant="ghost" onClick={() => query.fetchNextPage()}>Load More</Button>
                ) : null}
            </div>
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

function MobileSidebar({ filters, setFilters, onClose }: { 
    filters: IFilterState, 
    setFilters: React.Dispatch<React.SetStateAction<IFilterState>>, 
    onClose: () => void 
}) {
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
