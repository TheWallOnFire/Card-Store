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
import { SearchHeader, SearchControls, ActiveFilters } from './SearchComponents';

import { deriveFilters, serializeFilters } from '@/lib/filters';

const ITEMS_PER_PAGE = 20;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const filters = useMemo(() => deriveFilters(new URLSearchParams(searchParams.toString())), [searchParams]);

  const updateFilters = (newFilters: IFilterState) => {
    const params = serializeFilters(newFilters);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const removeFilter = (key: keyof IFilterState, value: string | boolean | number[]) => {
      const newFilters = { ...filters };
      const currentVal = newFilters[key];
      
      if (Array.isArray(currentVal)) {
          (newFilters[key] as string[]) = (currentVal as string[]).filter(v => v !== value);
      } else if (typeof currentVal === 'boolean') {
          (newFilters[key] as boolean) = false;
      } else if (key === 'searchQuery') {
          newFilters.searchQuery = '';
      }
      updateFilters(newFilters);
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
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="hidden lg:block w-72 shrink-0 sticky top-28 self-start">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <FilterSidebar filters={filters} onFilterChange={updateFilters} onClear={resetFilters} />
            </div>
          </aside>
          <SearchContent 
            filters={filters} 
            updateFilters={updateFilters} 
            onRemoveFilter={removeFilter}
            query={query} 
          />
        </div>
      </div>
    </div>
  );
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

function SearchContent({ filters, updateFilters, onRemoveFilter, query }: { 
    filters: IFilterState, 
    updateFilters: (f: IFilterState) => void, 
    onRemoveFilter: (key: keyof IFilterState, value: string | boolean | number[]) => void,
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
            
            <ActiveFilters filters={filters} onRemove={onRemoveFilter} />

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
