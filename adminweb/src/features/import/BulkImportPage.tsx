import React, { useState, useMemo } from 'react';
import { ParsedDeckItem, Card } from '@/types';
import { Table } from '@/components/Common';
import { FileUp, Clipboard, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Mock DB for validation
const mockCardsDb: Card[] = [
  { id: '001', gameId: 'ygo', name: 'Blue-Eyes White Dragon', set: '', rarity: '', image: '' },
  { id: '002', gameId: 'ygo', name: 'Dark Magician', set: '', rarity: '', image: '' },
  { id: '402', gameId: 'mtg', name: 'Island', set: '', rarity: '', image: '' },
];

export function BulkImportPage() {
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
    { key: 'gameId', label: 'Game', render: (i: ParsedDeckItem) => <span className="font-black uppercase text-slate-400 text-[10px] tracking-widest">{i.gameId || '??'}</span> },
    { key: 'cardId', label: 'Card ID', render: (i: ParsedDeckItem) => <span className="font-bold text-slate-700">{i.cardId || '??'}</span> },
    { key: 'cardName', label: 'Resolved Name', render: (i: ParsedDeckItem) => <span className="text-slate-500 italic">{i.cardName || 'N/A'}</span> },
    { key: 'count', label: 'Qty', render: (i: ParsedDeckItem) => <span className="font-black text-blue-600">x{i.count}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      render: (i: ParsedDeckItem) => (
        <span className={`inline-flex items-center gap-1 font-bold text-xs ${i.status === 'valid' ? 'text-emerald-600' : 'text-red-600'}`}>
          {i.status === 'valid' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {i.status === 'valid' ? 'Verified' : 'Error'}
        </span>
      )
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Bulk Decklist Importer <Sparkles className="text-blue-500" size={24} />
          </h1>
          <p className="text-slate-500 text-sm mt-1">Paste your formatted decklists for rapid inventory updates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Side */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border-2 border-slate-200 border-dashed p-1 shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Clipboard size={12} /> Paste Tool Input
                </span>
                <span className="text-[10px] font-bold text-slate-400">FORMAT: [gameid]_[cardid]_[count]</span>
            </div>
            <textarea 
              className="w-full h-80 p-4 bg-transparent outline-none font-mono text-sm resize-none text-slate-700" 
              placeholder="ygo_001_3&#10;mtg_402_1&#10;..."
              value={rawText}
              onChange={(e) => { setRawText(e.target.value); parseInput(e.target.value); }}
              onPaste={handlePaste}
            />
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-xs font-black text-blue-700 tracking-widest uppercase mb-2 flex items-center gap-2">
                <AlertCircle size={14} /> Parsing Logic Instructions
            </h4>
            <p className="text-xs text-blue-600/80 leading-relaxed font-medium">
                Ensure each card entry is on a new line. The tool will automatically validate Game IDs and Card IDs against our master database records in real-time.
            </p>
          </div>
        </div>

        {/* Preview Side */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total</p>
                    <p className="text-xl font-black text-slate-900">{stats.total}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Valid</p>
                    <p className="text-xl font-black text-emerald-600">{stats.valid}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Invalid</p>
                    <p className="text-xl font-black text-red-600">{stats.invalid}</p>
                </div>
            </div>
            <button 
                onClick={handleCommit}
                disabled={stats.valid === 0 || isProcessing}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-900/20 hover:bg-black transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <FileUp size={20} />}
                <span>Commit {stats.valid} Valid to DB</span>
            </button>
          </div>

          <div className="max-h-[500px] overflow-auto rounded-2xl border border-slate-200">
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
