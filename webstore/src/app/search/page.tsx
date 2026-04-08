'use client';

import React, { useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
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

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const filters = useMemo(() => deriveFilters(searchParams), [searchParams]);

  const updateFilters = (newFilters: IFilterState) => {
    const params = serializeFilters(newFilters);
    router.push(`${pathname}?${params.toString()}`);
  };

  const query: UseInfiniteQueryResult<InfiniteData<{ cards: ICard[], total: number, hasMore: boolean }>> = useInfiniteQuery({
    queryKey: ['cards', filters],
    queryFn: ({ pageParam = 1 }) => 
      cardService.getPaginatedCards(pageParam as number, ITEMS_PER_PAGE, filters),
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
                <FilterSidebar filters={filters} onFilterChange={updateFilters} />
            </div>
          </aside>
          <SearchContent 
            filters={filters} 
            updateFilters={updateFilters} 
            query={query} 
          />
        </div>
      </div>
    </div>
  );
}

function deriveFilters(searchParams: URLSearchParams): IFilterState {
  const game = searchParams.get('game')?.split(',').filter(Boolean) || [];
  const rarity = searchParams.get('rarity')?.split(',').filter(Boolean) || [];
  const q = searchParams.get('q') || '';
  const sort = searchParams.get('sort') || 'price_asc';
  const type = searchParams.get('type')?.split(',').filter(Boolean) || [];

  return {
    ...DEFAULT_FILTERS,
    game: game.map(g => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()),
    rarity,
    searchQuery: q,
    sortBy: sort,
    cardType: type
  };
}

function serializeFilters(filters: IFilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.searchQuery) {
    params.set('q', filters.searchQuery);
  }
  if (filters.game.length) {
    params.set('game', filters.game.join(',').toLowerCase());
  }
  if (filters.rarity.length) {
    params.set('rarity', filters.rarity.join(','));
  }
  if (filters.sortBy !== 'price_asc') {
    params.set('sort', filters.sortBy);
  }
  if (filters.cardType.length) {
    params.set('type', filters.cardType.join(','));
  }
  return params;
}

export default function SearchPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        </div>
    }>
        <SearchPageContent />
    </Suspense>
  );
}

function SearchContent({ filters, updateFilters, query }: { 
    filters: IFilterState, 
    updateFilters: (f: IFilterState) => void, 
    query: UseInfiniteQueryResult<InfiniteData<{ cards: ICard[], total: number, hasMore: boolean }>>
}) {
    const allCards = useMemo(() => query.data?.pages.flatMap((page) => page.cards) || [], [query.data]);
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
                onOpenSidebar={() => {}} // Mobile sidebar support can be added if needed
                sortBy={filters.sortBy || 'price_asc'}
                onSortChange={(val) => updateFilters({ ...filters, sortBy: val })}
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
