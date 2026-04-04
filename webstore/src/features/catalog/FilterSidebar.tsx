'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, Zap, Check } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Slider from '@radix-ui/react-slider';
import { IFilterState } from '@/types/models';

interface IFilterSidebarProps {
  filters: IFilterState;
  onFilterChange: (filters: IFilterState) => void;
}

const GAME_OPTIONS = ['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'One Piece', 'Disney Lorcana', 'Flesh and Blood'];
const RARITY_OPTIONS = ['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Ultra Rare', 'Secret Rare'];

export function FilterSidebar({ filters, onFilterChange }: IFilterSidebarProps) {
  const activeCount = calculateActiveFilters(filters);

  return (
    <aside className="w-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <SidebarHeader activeCount={activeCount} onClear={() => clearFilters(filters, onFilterChange)} />
      <DirectToggle isDirect={filters.isDirectOnly} onChange={(v) => onFilterChange({ ...filters, isDirectOnly: v })} />
      
      <div className="space-y-4">
        <PriceRangeSection range={filters.priceRange} onChange={(r) => onFilterChange({ ...filters, priceRange: r })} />
        <FilterGroup title="Game" options={GAME_OPTIONS} selected={filters.game || []} onToggle={(v) => toggleFilterItem(filters, 'game', v, onFilterChange)} />
        <FilterGroup title="Rarity" options={RARITY_OPTIONS} selected={filters.rarity || []} onToggle={(v) => toggleFilterItem(filters, 'rarity', v, onFilterChange)} />
      </div>
    </aside>
  );
}

function calculateActiveFilters(f: IFilterState) {
    return (f.game?.length || 0) + (f.rarity?.length || 0) + (f.isDirectOnly ? 1 : 0);
}

function toggleFilterItem(f: IFilterState, key: keyof IFilterState, value: string, onChange: (f: IFilterState) => void) {
    const current = f[key] as string[];
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    onChange({ ...f, [key]: updated });
}

function clearFilters(f: IFilterState, onChange: (f: IFilterState) => void) {
    onChange({ ...f, rarity: [], game: [], isDirectOnly: false, priceRange: [0, 5000] });
}

function SidebarHeader({ activeCount, onClear }: { activeCount: number, onClear: () => void }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-900">Refine</h2>
                {activeCount > 0 && <span className="h-5 w-5 text-[10px] font-bold bg-blue-600 text-white rounded-full flex items-center justify-center">{activeCount}</span>}
            </div>
            {activeCount > 0 && <button onClick={onClear} className="text-[10px] font-black text-red-500 uppercase tracking-widest">Clear</button>}
        </div>
    );
}

function DirectToggle({ isDirect, onChange }: { isDirect: boolean, onChange: (v: boolean) => void }) {
    return (
        <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 mb-6 flex items-center justify-between cursor-pointer" onClick={() => onChange(!isDirect)}>
            <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600 fill-current" />
                <span className="text-sm font-bold text-slate-900">Direct</span>
            </div>
            <Switch.Root checked={isDirect} onCheckedChange={onChange} className="w-[32px] h-[18px] bg-slate-300 rounded-full relative data-[state=checked]:bg-blue-600 transition-colors">
                <Switch.Thumb className="block w-[14px] h-[14px] bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-[17px]" />
            </Switch.Root>
        </div>
    );
}

function FilterGroup({ title, options, selected, onToggle }: { title: string, options: string[], selected: string[], onToggle: (v: string) => void }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="border-b border-slate-100 py-3 last:border-0">
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between mb-3">
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</span>
                {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {open && (
                <div className="space-y-2">
                    {options.map(opt => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                            <Checkbox.Root checked={selected.includes(opt)} onCheckedChange={() => onToggle(opt)} className="h-4 w-4 rounded border border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 flex items-center justify-center">
                                <Checkbox.Indicator><Check className="h-3 w-3 text-white" /></Checkbox.Indicator>
                            </Checkbox.Root>
                            <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-600">{opt}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

function PriceRangeSection({ range, onChange }: { range: [number, number], onChange: (r: [number, number]) => void }) {
    return (
        <div className="py-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Price Range</span>
            <Slider.Root className="relative flex items-center w-full h-5" value={[range[0], range[1]]} max={5000} step={10} onValueChange={(v) => onChange([v[0], v[1]])}>
                <Slider.Track className="bg-slate-100 relative grow rounded-full h-[4px]">
                    <Slider.Range className="absolute bg-blue-600 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm" />
                <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-sm" />
            </Slider.Root>
            <div className="flex justify-between mt-3 text-[10px] font-black text-slate-900">
                <span>${range[0]}</span>
                <span>${range[1]}+</span>
            </div>
        </div>
    );
}
