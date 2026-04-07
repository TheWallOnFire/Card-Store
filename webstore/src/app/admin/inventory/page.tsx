'use client';

import React, { useState } from 'react';
import { ICard, ICardGame } from '@/types/models';
import { Table, Modal } from '@/components/admin/AdminComponents';
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, Filter, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cardService } from '@/services/cardService';

const mockGames: ICardGame[] = [
  { id: 'ygo', name: 'Yu-Gi-Oh!', description: '', isActive: true },
  { id: 'pkm', name: 'Pokémon', description: '', isActive: true },
  { id: 'mtg', name: 'MTG', description: '', isActive: true },
  { id: 'op', name: 'One Piece', description: '', isActive: true },
  { id: 'lor', name: 'Disney Lorcana', description: '', isActive: true },
  { id: 'fab', name: 'Flesh and Blood', description: '', isActive: true },
];

export default function InventoryPage() {
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ICard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  React.useEffect(() => {
    cardService.getCards().then(data => {
        setCards(data);
        setLoading(false);
    });
  }, []);

  const filteredCards = cards.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.includes(searchQuery) ||
    c.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { 
      key: 'imageUrl', 
      label: 'Preview', 
      render: (card: ICard) => (
        <div className="w-12 h-16 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
          <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
        </div>
      )
    },
    { key: 'game', label: 'Game', render: (card: ICard) => <Badge variant="secondary" className="font-black text-[9px] uppercase tracking-tighter">{card.game}</Badge> },
    { key: 'name', label: 'Card Identity', render: (card: ICard) => (
        <div className="flex flex-col">
            <span className="font-black text-slate-900 tracking-tight">{card.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{card.set} · #{card.number}</span>
        </div>
    ) },
    { key: 'rarity', label: 'Rarity', render: (card: ICard) => <span className="text-xs font-bold text-slate-500">{card.rarity}</span> },
    { 
        key: 'marketPrice', 
        label: 'Market Val.', 
        render: (card: ICard) => <span className="font-black text-slate-900 tracking-tighter">${card.marketPrice?.toFixed(2)}</span> 
    },
    { 
        key: 'isDirectEligible', 
        label: 'Direct', 
        render: (card: ICard) => card.isDirectEligible ? <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase italic">Eligible</span> : <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">No</span> 
    },
  ];

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cardData: ICard = {
      id: (formData.get('id') as string) || editingCard?.id || Math.random().toString(36).substr(2, 9),
      game: mockGames.find(g => g.name === formData.get('game'))?.name || (formData.get('game') as string),
      name: formData.get('name') as string,
      imageUrl: (formData.get('imageUrl') as string) || imagePreview || '',
      rarity: formData.get('rarity') as string,
      set: formData.get('set') as string,
      number: formData.get('number') as string,
      marketPrice: parseFloat(formData.get('marketPrice') as string) || 0,
      lowPrice: parseFloat(formData.get('lowPrice') as string) || 0,
      buylistPrice: parseFloat(formData.get('buylistPrice') as string) || 0,
      isDirectEligible: formData.get('isDirectEligible') === 'on',
      listedCount: parseInt(formData.get('listedCount') as string) || 0,
      volatility: parseFloat(formData.get('volatility') as string) || 0,
    };

    if (editingCard) {
      setCards(cards.map(c => c.id === editingCard.id ? cardData : c));
    } else {
      setCards([...cards, cardData]);
    }
    setIsModalOpen(false);
    setEditingCard(null);
    setImagePreview(null);
  };

  if (loading) return <div className="py-20 text-center font-black text-slate-400 uppercase tracking-widest">Loading Catalog...</div>;

  return (
    <div className="py-12 px-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Inventory Matrix</h1>
          <p className="text-slate-500 font-medium text-sm mt-2 italic">Global database master control for individual card identities.</p>
        </div>
        <button 
          onClick={() => { setEditingCard(null); setIsModalOpen(true); setImagePreview(null); }}
          className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>New Identity</span>
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search master records by name, ID or game..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black tracking-widest uppercase text-xs hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={18} />
          <span>Filter Grid</span>
          <ChevronDown size={14} className="ml-1 opacity-40" />
        </button>
      </div>

      <Table 
        columns={columns as any} 
        data={filteredCards} 
        actions={(card: ICard) => (
          <div className="flex items-center justify-end gap-2 text-slate-300">
            <button 
              onClick={() => { setEditingCard(card); setIsModalOpen(true); setImagePreview(card.imageUrl); }}
              className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => setCards(cards.filter(c => c.id !== card.id))}
              className="p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCard ? "Edit Inventory Link" : "Register Fresh Identity"}
      >
        <form onSubmit={handleSave} className="space-y-6 max-h-[70vh] overflow-y-auto px-1 scrollbar-hide">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Game Title</label>
              <select name="game" defaultValue={editingCard?.game} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold appearance-none">
                {mockGames.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Master Code (UID)</label>
              <input name="id" defaultValue={editingCard?.id} required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Public Card Name</label>
            <input name="name" defaultValue={editingCard?.name} required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Set / Expansion</label>
              <input name="set" defaultValue={editingCard?.set} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Line #</label>
              <input name="number" defaultValue={editingCard?.number} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" />
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Image Source (Master URL)</label>
            <div className="flex gap-4">
                <input 
                    name="imageUrl" 
                    defaultValue={editingCard?.imageUrl} 
                    onChange={(e) => setImagePreview(e.target.value)} 
                    className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" 
                />
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden shadow-inner">
                    {imagePreview ? (
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="text-slate-300 opacity-40" size={20} />
                    )}
                </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Market ($)</label>
              <input type="number" step="0.01" name="marketPrice" defaultValue={editingCard?.marketPrice} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Low ($)</label>
              <input type="number" step="0.01" name="lowPrice" defaultValue={editingCard?.lowPrice} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Buylist ($)</label>
              <input type="number" step="0.01" name="buylistPrice" defaultValue={editingCard?.buylistPrice} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-blue-50/50 p-5 rounded-3xl border border-blue-100">
            <input type="checkbox" name="isDirectEligible" id="isDirectEligible" defaultChecked={editingCard?.isDirectEligible ?? false} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
            <div className="flex flex-col">
                <label htmlFor="isDirectEligible" className="text-sm font-black text-slate-900 select-none">Direct Eligibility</label>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Eligible for Card Store Direct shipping fulfillment</span>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 text-slate-400 font-black tracking-widest uppercase text-xs hover:bg-slate-50 rounded-2xl transition-colors">Abort</button>
            <button type="submit" className="flex-1 px-4 py-4 bg-slate-900 text-white font-black tracking-widest uppercase text-xs rounded-2xl shadow-2xl shadow-slate-900/20 hover:bg-black transition-all">Resolve Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
