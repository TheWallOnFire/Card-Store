'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, Zap } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import * as Switch from '@radix-ui/react-switch';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { FilterState } from '@/types/models';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const RARITY_OPTIONS = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Ultra Rare', 'Secret Rare', 'Legendary'];
const SET_OPTIONS = [
  'Base Set', 'Evolving Skies', 'Surging Sparks', 'Alpha', 'Beta', 
  'Legend of Blue Eyes White Dragon', 'Starter Deck Yugi', 'Romance Dawn', 
  'The First Chapter', 'Welcome to Rathe'
];
const GAME_OPTIONS = ['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'One Piece', 'Disney Lorcana', 'Flesh and Blood'];
const TYPE_OPTIONS = ['Single Card', 'Sealed Product'];
const COLOR_OPTIONS = ['Red', 'Blue', 'Black', 'Yellow', 'White', 'Colorless'];
const SORT_OPTIONS = [
  { label: 'Market Price: Low to High', value: 'price_asc' },
  { label: 'Market Price: High to Low', value: 'price_desc' },
  { label: 'Newest Listed', value: 'newest' },
  { label: 'Name: A-Z', value: 'name_asc' },
];

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 py-4 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between group mb-3"
      >
        <span className="text-xs font-black text-slate-900 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
        )}
      </button>
      {open && <div className="space-y-1.5">{children}</div>}
    </div>
  );
}

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const toggleFilter = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[];
    if (!Array.isArray(current)) return;
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFilterChange({ ...filters, priceRange: [value[0], value[1]] });
  };

  const clearAll = () => {
    onFilterChange({
      searchQuery: filters.searchQuery,
      rarity: [],
      sets: [],
      cardType: [],
      game: [],
      colors: [],
      priceRange: [0, 5000],
      sortBy: 'price_asc',
      isDirectOnly: false,
    });
  };

  const activeCount = 
    (filters.rarity?.length || 0) + 
    (filters.sets?.length || 0) + 
    (filters.cardType?.length || 0) + 
    (filters.game?.length || 0) + 
    (filters.colors?.length || 0) + 
    (filters.isDirectOnly ? 1 : 0);

  return (
    <aside className="w-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Refine Results</h2>
          {activeCount > 0 && (
            <span className="h-5 w-5 text-[10px] font-bold bg-blue-600 text-white rounded-full flex items-center justify-center animate-in zoom-in duration-300">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[10px] font-black text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest flex items-center gap-1.5"
          >
            Clear All
          </button>
        )}
      </div>

      {/* TCGplayer Direct Toggle */}
      <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 mb-6 group cursor-pointer" onClick={() => onFilterChange({ ...filters, isDirectOnly: !filters.isDirectOnly })}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600 fill-current" />
            <span className="text-sm font-bold text-slate-900">Direct</span>
          </div>
          <Switch.Root
            checked={filters.isDirectOnly}
            onCheckedChange={(checked: boolean) => onFilterChange({ ...filters, isDirectOnly: checked })}
            className="w-[32px] h-[18px] bg-slate-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors cursor-pointer outline-none"
          >
            <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[17px]" />
          </Switch.Root>
        </div>
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
          Only show inventory fulfilled by TCGplayer. Guaranteed condition and faster shipping.
        </p>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sort Results</label>
        </div>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="w-full h-10 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Price Range Slider */}
      <FilterSection title="Price Range">
        <div className="px-1 py-4">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[filters.priceRange[0], filters.priceRange[1]]}
            max={5000}
            step={10}
            onValueChange={handlePriceRangeChange}
          >
            <Slider.Track className="bg-slate-100 relative grow rounded-full h-[4px]">
              <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-4 h-4 bg-white border-2 border-blue-600 shadow-sm rounded-full hover:scale-110 focus:outline-none cursor-grab active:cursor-grabbing transition-all"
              aria-label="Min price"
            />
            <Slider.Thumb
              className="block w-4 h-4 bg-white border-2 border-blue-600 shadow-sm rounded-full hover:scale-110 focus:outline-none cursor-grab active:cursor-grabbing transition-all"
              aria-label="Max price"
            />
          </Slider.Root>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <span className="text-[9px] font-black text-slate-400 block uppercase mb-0.5">Min</span>
              <span className="text-xs font-black text-slate-900">${filters.priceRange[0]}</span>
            </div>
            <div className="text-slate-300 font-bold">/</div>
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
              <span className="text-[9px] font-black text-slate-400 block uppercase mb-0.5">Max</span>
              <span className="text-xs font-black text-slate-900">${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Game">
        {GAME_OPTIONS.map((opt) => (
          <FilterCheckbox
            key={opt}
            label={opt}
            checked={filters.game?.includes(opt) ?? false}
            onChange={() => toggleFilter('game', opt)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Card Type">
        {TYPE_OPTIONS.map((opt) => (
          <FilterCheckbox
            key={opt}
            label={opt}
            checked={filters.cardType?.includes(opt) ?? false}
            onChange={() => toggleFilter('cardType', opt)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Color">
        {COLOR_OPTIONS.map((color) => (
          <FilterCheckbox
            key={color}
            label={color}
            checked={filters.colors?.includes(color) ?? false}
            onChange={() => toggleFilter('colors', color)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Rarity">
        {RARITY_OPTIONS.map((rarity) => (
          <FilterCheckbox
            key={rarity}
            label={rarity}
            checked={filters.rarity?.includes(rarity) ?? false}
            onChange={() => toggleFilter('rarity', rarity)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Set">
        {SET_OPTIONS.map((set) => (
          <FilterCheckbox
            key={set}
            label={set}
            checked={filters.sets?.includes(set) ?? false}
            onChange={() => toggleFilter('sets', set)}
          />
        ))}
      </FilterSection>
    </aside>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-0.5">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={onChange}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 bg-white data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all group-hover:border-blue-400 outline-none"
      >
        <Checkbox.Indicator>
          <Check className="h-3 w-3 text-white stroke-[3px]" />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600 transition-colors select-none">
        {label}
      </span>
    </label>
  );
}
