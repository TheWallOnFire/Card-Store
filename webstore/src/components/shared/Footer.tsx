'use client';

import React, { useEffect, useState } from 'react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0a0a] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-extrabold tracking-tight text-gradient mb-4 block">
              CardStore.
            </span>
            <p className="text-slate-600 dark:text-slate-400 max-w-sm">
              The premium destination for collectors to discover, buy, and trade the rarest cards in existence.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Marketplace</h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">All Cards</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Trending</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sellers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Company</h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p>© {year || '2024'} CardStore. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Instagram</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
