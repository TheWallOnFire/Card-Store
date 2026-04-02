'use client';

import React, { useState, useMemo } from 'react';
import { ParsedDeckItem, Card } from '@/types/models';
import { Table } from '@/components/admin/AdminComponents';
import { FileUp, Clipboard, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Mock DB for validation
const mockCardsDb: Card[] = [
  { id: '001', gameId: 'ygo', game: 'Yu-Gi-Oh!', name: 'Blue-Eyes White Dragon', set: '', number: '', rarity: '', imageUrl: '', marketPrice: 0, lowPrice: 0, buylistPrice: 0, isDirectEligible: false },
  { id: '002', gameId: 'ygo', game: 'Yu-Gi-Oh!', name: 'Dark Magician', set: '', number: '', rarity: '', imageUrl: '', marketPrice: 0, lowPrice: 0, buylistPrice: 0, isDirectEligible: false },
  { id: '402', gameId: 'mtg', game: 'MTG', name: 'Island', set: '', number: '', rarity: '', imageUrl: '', marketPrice: 0, lowPrice: 0, buylistPrice: 0, isDirectEligible: false },
];

export default function BulkImportPage() {
  const [rawText, setRawText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedDeckItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseInput = (text: string) => {
    if (!text.trim()) {
        setParsedItems([]);
        return;
    }

    const lines = text.split('\n').filter(line => line.trim());
    const items: ParsedDeckItem[] = lines.map(line => {
      const parts = line.trim().split('_');
      
      if (parts.length < 3) {
        return { gameId: '', cardId: '', count: 0, status: 'invalid' };
      }

      const [gameId, cardId, countStr] = parts;
      const count = parseInt(countStr, 10);

      // Validate existence in mock DB
      const foundCard = mockCardsDb.find(c => c.gameId === gameId && c.id === cardId);

      return {
        gameId,
        cardId,
        count: isNaN(count) ? 0 : count,
        status: foundCard ? 'valid' : 'invalid',
        cardName: foundCard?.name
      };
    });

    setParsedItems(items);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text');
    parseInput(text);
  };

  const handleCommit = () => {
    const validItems = parsedItems.filter(i => i.status === 'valid');
    if (validItems.length === 0) {
        toast.error("No valid items to import.");
        return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
        setIsProcessing(false);
        toast.success(`Successfully committed ${validItems.length} card(s) to inventory.`);
        setRawText('');
        setParsedItems([]);
    }, 1500);
  };

  const stats = useMemo(() => {
    return {
      total: parsedItems.length,
      valid: parsedItems.filter(i => i.status === 'valid').length,
      invalid: parsedItems.filter(i => i.status === 'invalid').length,
    };
  }, [parsedItems]);

  const columns = [
    { key: 'gameId', label: 'Game', render: (i: ParsedDeckItem) => <span className="font-black uppercase text-slate-400 text-[10px] tracking-widest leading-none">{i.gameId || '??'}</span> },
    { key: 'cardId', label: 'Card ID', render: (i: ParsedDeckItem) => <span className="font-black text-slate-900 tracking-tight leading-none">{i.cardId || '??'}</span> },
    { key: 'cardName', label: 'Resolved Name', render: (i: ParsedDeckItem) => <span className="text-slate-400 font-bold italic text-xs leading-none">{i.cardName || 'N/A'}</span> },
    { key: 'count', label: 'Qty', render: (i: ParsedDeckItem) => <span className="font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">x{i.count}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      render: (i: ParsedDeckItem) => (
        <span className={`inline-flex items-center gap-1 font-black text-[10px] uppercase tracking-widest ${i.status === 'valid' ? 'text-emerald-600' : 'text-red-500'}`}>
          {i.status === 'valid' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {i.status === 'valid' ? 'Verified' : 'Invalid Match'}
        </span>
      )
    },
  ];

  return (
    <div className="py-12 px-10 max-w-7xl mx-auto">
      <Toaster position="top-right" richColors />
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
            Bulk Decklist Importer <Sparkles className="text-blue-500" size={32} />
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-2 italic">Rapidly sync external lists to the global catalog.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        {/* Input Side */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border-2 border-slate-200 border-dashed p-1 shadow-sm overflow-hidden focus-within:border-blue-600 focus-within:ring-8 focus-within:ring-blue-600/5 transition-all duration-300 group">
            <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Clipboard size={14} className="opacity-50" /> System Paste Terminal
                </span>
                <span className="text-[10px] font-bold text-slate-300">SYNTAX: [gameid]_[cardid]_[count]</span>
            </div>
            <textarea 
              className="w-full h-96 p-6 bg-transparent outline-none font-mono text-sm resize-none text-slate-700 leading-relaxed group-hover:bg-white/50 transition-colors" 
              placeholder="ygo_001_3&#10;mtg_402_1&#10;..."
              value={rawText}
              onChange={(e) => { setRawText(e.target.value); parseInput(e.target.value); }}
              onPaste={handlePaste}
            />
          </div>
          <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                <AlertCircle className="text-indigo-600" size={20} />
            </div>
            <div className="space-y-1">
                <h4 className="text-xs font-black text-indigo-700 tracking-widest uppercase">Resolution Logic</h4>
                <p className="text-xs text-indigo-600 leading-relaxed font-bold opacity-80">
                    Each card identity is matched against our master database using the [gameid] and [cardid] pair. Quantities must be positive integers.
                </p>
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className="space-y-8">
          <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex gap-8">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 leading-none">Total</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{stats.total}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1 leading-none text-emerald-500/80">Valid</span>
                    <span className="text-2xl font-black text-emerald-600 tracking-tighter leading-none">{stats.valid}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-red-300 tracking-widest mb-1 leading-none text-red-500/80">Errors</span>
                    <span className="text-2xl font-black text-red-600 tracking-tighter leading-none">{stats.invalid}</span>
                </div>
            </div>
            <button 
                onClick={handleCommit}
                disabled={stats.valid === 0 || isProcessing}
                className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-2xl shadow-slate-900/20 hover:bg-black transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none uppercase text-xs tracking-widest"
            >
                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
                <span>Sync {stats.valid} records</span>
            </button>
          </div>

          <div className="max-h-[600px] overflow-auto rounded-3xl border border-slate-200 shadow-inner bg-slate-50/50">
            <Table 
                columns={columns as any} 
                data={parsedItems.map((item, idx) => ({ ...item, id: `preview-${idx}` }))} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
