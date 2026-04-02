'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, X, ChevronDown, Zap, Star, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { mockCards } from '@/services/mockData';
import { Card } from '@/types/models';

const MEGA_MENU_ITEMS = [
  {
    label: 'Pokémon',
    href: '/search?game=pokemon',
    icon: '⚡',
    color: 'text-yellow-600',
    sub: ['Base Set', 'Evolving Skies', 'Surging Sparks', 'Primos'],
  },
  {
    label: 'Magic: The Gathering',
    href: '/search?game=magic',
    icon: '✨',
    color: 'text-purple-600',
    sub: ['Modern', 'Legacy', 'Standard', 'Commander'],
  },
  {
    label: 'Yu-Gi-Oh!',
    href: '/search?game=yugioh',
    icon: '🐉',
    color: 'text-red-600',
    sub: ['Speed Duel', 'Master Duel', 'Classic', 'Sealed'],
  },
  {
    label: 'Sealed Product',
    href: '/search?type=sealed',
    icon: '📦',
    color: 'text-blue-600',
    sub: ['Booster Boxes', 'ETBs', 'Blister Packs', 'Bundles'],
  },
];

export function Navbar() {
  const router = useRouter();
  const { totalItems, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Card[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Type-ahead search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = mockCards
      .filter((c) => c.name.toLowerCase().includes(q) || c.set.toLowerCase().includes(q))
      .slice(0, 5);
    setSuggestions(filtered);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSuggestions([]);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-slate-900 text-white text-xs font-medium py-2 text-center tracking-wide">
        🔒 Verified Seller Network &nbsp;·&nbsp; Free Shipping on orders over $75 &nbsp;·&nbsp; 30-Day Return Guarantee
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300 border-b',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-slate-200 shadow-sm'
            : 'bg-white border-slate-200'
        )}
      >
        {/* Main Nav Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Left: Logo + Mobile Menu */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900 hidden sm:block">
                  CARD<span className="text-blue-600">VAULT</span>
                </span>
              </Link>
            </div>

            {/* Center: Search Bar */}
            <div ref={searchRef} className="flex-1 max-w-xl relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards, sets, players..."
                  className="w-full pl-10 pr-4 h-10 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </form>

              {/* Type-ahead Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
                  {suggestions.map((card) => (
                    <Link
                      key={card.id}
                      href={`/product/${card.id}`}
                      onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors group"
                    >
                      <Search className="h-4 w-4 text-slate-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{card.name}</p>
                        <p className="text-xs text-slate-500">{card.set} · {card.rarity}</p>
                      </div>
                      <span className="text-sm font-black text-blue-600 shrink-0">${card.market_price.toLocaleString()}</span>
                    </Link>
                  ))}
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setSearchQuery(''); setSuggestions([]); }}
                    className="flex items-center gap-2 px-4 py-3 bg-slate-50 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-slate-100"
                  >
                    <Search className="h-3 w-3" />
                    See all results for &quot;{searchQuery}&quot;
                  </Link>
                </div>
              )}
            </div>

            {/* Right: Nav + Actions */}
            <div className="flex items-center gap-2">
              {/* Desktop Categories Mega Menu */}
              <div ref={megaMenuRef} className="hidden lg:block relative">
                <button
                  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Categories
                  <ChevronDown className={cn('h-4 w-4 transition-transform', megaMenuOpen && 'rotate-180')} />
                </button>

                {megaMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-[600px] bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {MEGA_MENU_ITEMS.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMegaMenuOpen(false)}
                          className="group flex flex-col gap-2 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{item.icon}</span>
                            <span className={cn('font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm', item.color.replace('text-', 'group-hover:text-'))}>
                              {item.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.sub.map((s) => (
                              <span key={s} className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5">
                                {s}
                              </span>
                            ))}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-4">
                      <Link href="/search" onClick={() => setMegaMenuOpen(false)} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wide">
                        <Star className="h-3 w-3" /> Top Sellers
                      </Link>
                      <Link href="/search?sort=newest" onClick={() => setMegaMenuOpen(false)} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase tracking-wide">
                        <Package className="h-3 w-3" /> New Arrivals
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/search" className="hidden md:block text-sm font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 transition-colors">
                All Cards
              </Link>

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                onClick={toggleCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-blue-600 text-white border-2 border-white">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {MEGA_MENU_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-800"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-2">
                <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 text-sm font-semibold text-slate-800">
                  <Search className="h-4 w-4" /> All Cards
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
