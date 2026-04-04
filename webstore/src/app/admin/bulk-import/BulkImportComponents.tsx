import React from 'react';
import { IParsedDeckItem } from '@/types/models';
import { Table } from '@/components/admin/AdminComponents';
import { Clipboard, CheckCircle, AlertCircle } from 'lucide-react';

interface IImportTerminalProps {
  rawText: string;
  onTextChange: (text: string) => void;
  onPaste: (e: React.ClipboardEvent) => void;
}

export function ImportTerminal({ rawText, onTextChange, onPaste }: IImportTerminalProps) {
  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 border-dashed p-1 shadow-sm overflow-hidden focus-within:border-blue-600 focus-within:ring-8 focus-within:ring-blue-600/5 transition-all duration-300 group">
      <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Clipboard size={14} className="opacity-50" /> System Paste Terminal
        </span>
        <span className="text-[10px] font-bold text-slate-300">SYNTAX: [gameid]_[cardid]_[count]</span>
      </div>
      <textarea 
        name="rawText"
        className="w-full h-96 p-6 bg-transparent outline-none font-mono text-sm resize-none text-slate-700 leading-relaxed group-hover:bg-white/50 transition-colors" 
        placeholder="ygo_001_3&#10;mtg_402_1&#10;..."
        value={rawText}
        onChange={(e) => onTextChange(e.target.value)}
        onPaste={onPaste}
      />
    </div>
  );
}

export function ImportStats({ total, valid, invalid }: { total: number, valid: number, invalid: number }) {
  return (
    <div className="flex gap-8">
      <StatBox label="Total" value={total} color="slate" />
      <StatBox label="Valid" value={valid} color="emerald" />
      <StatBox label="Errors" value={invalid} color="red" />
    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: number, color: 'slate' | 'emerald' | 'red' }) {
  const colorMap = {
    slate: 'text-slate-900 text-slate-400',
    emerald: 'text-emerald-600 text-emerald-500/80',
    red: 'text-red-600 text-red-500/80',
  };
  
  return (
    <div className="flex flex-col">
      <span className={`text-[10px] font-black uppercase tracking-widest mb-1 leading-none ${colorMap[color].split(' ')[1]}`}>{label}</span>
      <span className={`text-2xl font-black tracking-tighter leading-none ${colorMap[color].split(' ')[0]}`}>{value}</span>
    </div>
  );
}

interface IPreviewItem extends IParsedDeckItem {
  id: string;
}

export function ImportPreview({ items }: { items: IParsedDeckItem[] }) {
  const columns = [
    { key: 'gameId', label: 'Game', render: (i: IPreviewItem) => <span className="font-black uppercase text-slate-400 text-[10px] tracking-widest">{i.gameId || '??'}</span> },
    { key: 'cardId', label: 'ID', render: (i: IPreviewItem) => <span className="font-black text-slate-900 tracking-tight">{i.cardId || '??'}</span> },
    { key: 'cardName', label: 'Name', render: (i: IPreviewItem) => <span className="text-slate-400 font-bold italic text-xs">{i.cardName || 'N/A'}</span> },
    { key: 'count', label: 'Qty', render: (i: IPreviewItem) => <span className="font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">x{i.count}</span> },
    { 
      key: 'status', 
      label: 'Status', 
      render: (i: IPreviewItem) => (
        <span className={`inline-flex items-center gap-1 font-black text-[10px] uppercase tracking-widest ${i.status === 'valid' ? 'text-emerald-600' : 'text-red-500'}`}>
          {i.status === 'valid' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
          {i.status === 'valid' ? 'Verified' : 'Invalid'}
        </span>
      )
    },
  ];

  return (
    <div className="max-h-[600px] overflow-auto rounded-3xl border border-slate-200 shadow-inner bg-slate-50/50">
      <Table<IPreviewItem> 
        columns={columns} 
        data={items.map((item, idx) => ({ ...item, id: `preview-${idx}` }))} 
      />
    </div>
  );
}
