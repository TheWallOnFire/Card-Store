'use client';

import React, { useState, useMemo, useActionState, useEffect } from 'react';
import { IParsedDeckItem, ICard } from '@/types/models';
import { FileUp, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { bulkImportAction, IBulkImportResult } from '@/app/actions/bulk-import';
import { ImportTerminal, ImportStats, ImportPreview } from './BulkImportComponents';

const mockCardsDb: ICard[] = [
  { id: '001', gameId: 'ygo', game: 'Yu-Gi-Oh!', name: 'Blue-Eyes White Dragon', set: '', number: '', rarity: '', imageUrl: '', marketPrice: 0, lowPrice: 0, buylistPrice: 0, isDirectEligible: false },
  { id: '402', gameId: 'mtg', game: 'MTG', name: 'Island', set: '', number: '', rarity: '', imageUrl: '', marketPrice: 0, lowPrice: 0, buylistPrice: 0, isDirectEligible: false },
];

export default function BulkImportPage() {
  const [rawText, setRawText] = useState('');
  const [parsedItems, setParsedItems] = useState<IParsedDeckItem[]>([]);
  const [state, dispatch, isPending] = useActionState<IBulkImportResult | null, FormData>(bulkImportAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      // Pushing to next tick to avoid cascading render warning in strict mode
      setTimeout(() => {
        setRawText('');
        setParsedItems([]);
      }, 0);
    } else if (state?.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  const handleParse = (text: string) => {
    const items = parseRawInput(text, mockCardsDb);
    setParsedItems(items);
  };

  const stats = useMemo(() => ({
    total: parsedItems.length,
    valid: parsedItems.filter(i => i.status === 'valid').length,
    invalid: parsedItems.filter(i => i.status === 'invalid').length,
  }), [parsedItems]);

  return (
    <div className="py-12 px-10 max-w-7xl mx-auto">
      <Toaster position="top-right" richColors />
      <Header />
      <form action={dispatch} className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
        <input type="hidden" name="userId" value="admin-id-placeholder" />
        <div className="space-y-6">
          <ImportTerminal 
            rawText={rawText} 
            onTextChange={(t) => { setRawText(t); handleParse(t); }} 
            onPaste={(e) => handleParse(e.clipboardData.getData('text'))} 
          />
          <SupportBox />
        </div>
        <div className="space-y-8">
          <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <ImportStats {...stats} />
            <SubmitButton count={stats.valid} isPending={isPending} disabled={stats.valid === 0} />
          </div>
          <ImportPreview items={parsedItems} />
        </div>
      </form>
    </div>
  );
}

function parseRawInput(text: string, db: ICard[]): IParsedDeckItem[] {
  const lines = text.split('\n').filter(l => l.trim());
  return lines.map(line => {
    const parts = line.trim().split('_');
    if (parts.length < 3) {
      return { gameId: '', cardId: '', count: 0, status: 'invalid' };
    }
    const [gameId, cardId, countStr] = parts;
    const found = db.find(c => c.gameId === gameId && c.id === cardId);
    return { 
      gameId, 
      cardId, 
      count: parseInt(countStr, 10) || 0, 
      status: found ? 'valid' : 'invalid', 
      cardName: found?.name 
    };
  });
}

function Header() {
  return (
    <div className="flex items-center justify-between mb-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
          Bulk Decklist Importer <Sparkles className="text-blue-500" size={32} />
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-2 italic">Rapidly sync external lists to the global catalog.</p>
      </div>
    </div>
  );
}

function SupportBox() {
  return (
    <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex gap-4">
      <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
        <AlertCircle className="text-indigo-600" size={20} />
      </div>
      <div className="space-y-1">
        <h4 className="text-xs font-black text-indigo-700 tracking-widest uppercase text-[10px]">Resolution Logic</h4>
        <p className="text-xs text-indigo-600 leading-relaxed font-bold opacity-80">
          Each card identity is matched against our master database using the [gameid] and [cardid] pair. Quantities must be positive integers.
        </p>
      </div>
    </div>
  );
}

function SubmitButton({ count, isPending, disabled }: { count: number, isPending: boolean, disabled: boolean }) {
  return (
    <button type="submit" disabled={disabled || isPending} className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-2xl shadow-slate-900/20 hover:bg-black transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none uppercase text-xs tracking-widest">
      {isPending ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
      <span>Sync {count} records</span>
    </button>
  );
}
