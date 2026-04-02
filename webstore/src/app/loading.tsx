import React from 'react';

export default function Loading() {
  return (
    <div className="w-full animate-pulse space-y-16 px-4 md:px-6">
      {/* Hero Skeleton */}
      <div className="h-[85vh] w-full mt-4 rounded-3xl bg-slate-200" />
      
      {/* Categories Skeleton */}
      <div className="container mx-auto">
        <div className="mb-12 space-y-4">
          <div className="h-10 w-64 rounded-lg bg-slate-200" />
          <div className="h-6 w-96 rounded-lg bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 md:grid-rows-2 gap-4 h-[800px] md:h-[600px]">
          <div className="col-span-1 md:col-span-2 row-span-2 rounded-3xl bg-slate-200" />
          <div className="col-span-1 md:col-span-1 row-span-1 rounded-3xl bg-slate-200" />
          <div className="col-span-1 md:col-span-1 row-span-1 rounded-3xl bg-slate-200" />
          <div className="col-span-1 md:col-span-2 row-span-1 rounded-3xl bg-slate-200" />
        </div>
      </div>

      {/* Trending Skeleton */}
      <div className="container mx-auto">
        <div className="mb-10 space-y-4">
          <div className="h-10 w-48 rounded-lg bg-slate-200" />
          <div className="h-6 w-64 rounded-lg bg-slate-200" />
        </div>
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="min-w-[85vw] sm:min-w-0">
              <div className="aspect-[4/5] rounded-xl bg-slate-200 mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-1/4 rounded bg-slate-200" />
                <div className="h-5 w-3/4 rounded bg-slate-200" />
                <div className="h-6 w-1/3 rounded bg-slate-200 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
