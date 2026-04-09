import React from 'react';
import { X, Globe, Zap, Search } from 'lucide-react';
import { IFilterState } from '@/types/models';

interface ISearchHeaderProps {
  searchQuery: string;
  totalResults: number;
  isLoading: boolean;
}

export function SearchHeader({ searchQuery, totalResults, isLoading }: ISearchHeaderProps) {
  const [latency, setLatency] = React.useState(12);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => {
        const jitter = Math.floor(Math.random() * 5) - 2;
        const next = prev + jitter;
        return Math.max(8, Math.min(42, next));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white border-b border-slate-200 overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">System.LiveIndex_v4</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
              {searchQuery ? (
                <>Scanning: <span className="text-blue-600">&quot;{searchQuery}&quot;</span></>
              ) : 'Global Catalog Index'}
            </h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                {isLoading ? 'Synchronizing regional data...' : `${totalResults.toLocaleString()} verified listings located`}
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <SearchStat label="Network Latency" value={`${latency}ms`} />
            <SearchStat label="Global Nodes" value="24/24" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchStat({ label, value }: { label: string, value: string }) {
    return (
        <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{value}</p>
        </div>
    );
}

interface IActiveFiltersProps {
  filters: IFilterState;
  onRemove: (key: keyof IFilterState, value: string | boolean | number[]) => void;
}

export function ActiveFilters({ filters, onRemove }: IActiveFiltersProps) {
  const chips: Array<{ key: keyof IFilterState, label: string, value: string | boolean | number[], icon?: React.ElementType }> = [];

  if (filters.game?.length) {
    filters.game.forEach(g => chips.push({ key: 'game', label: g, value: g }));
  }
  if (filters.rarity?.length) {
    filters.rarity.forEach(r => chips.push({ key: 'rarity', label: r, value: r }));
  }
  if (filters.isDirectOnly) {
    chips.push({ key: 'isDirectOnly', label: 'Direct Eligible', value: true, icon: Zap });
  }
  if (filters.searchQuery && filters.searchQuery.length > 0) {
    chips.push({ key: 'searchQuery', label: `&quot;${filters.searchQuery}&quot;`, value: filters.searchQuery, icon: Search });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Filters:</span>
      {chips.map((chip, i) => (
        <button
          key={`${chip.key}-${i}`}
          onClick={() => onRemove(chip.key, chip.value)}
          className="group flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 rounded-full pl-3 pr-2 py-1.5 transition-all shadow-sm hover:shadow-md"
        >
          {chip.icon && <chip.icon className="h-3 w-3 text-blue-600 fill-current" />}
          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wide group-hover:text-blue-600">
            {chip.label}
          </span>
          <div className="h-4 w-4 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <X className="h-2.5 w-2.5 text-slate-400 group-hover:text-blue-600" />
          </div>
        </button>
      ))}
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
        <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative z-20">
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSidebar}
                    className="flex lg:hidden items-center gap-2 bg-slate-900 text-white rounded-xl px-5 py-3 text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
                >
                    Refine Search
                </button>
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Real-time Node: Online</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort:</span>
                    <div className="relative">
                        <select 
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 cursor-pointer appearance-none transition-all hover:bg-white"
                        >
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="name_asc">Alphabetical: A-Z</option>
                            <option value="date_desc">Released: Newest</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChevronDown({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>
    );
}
