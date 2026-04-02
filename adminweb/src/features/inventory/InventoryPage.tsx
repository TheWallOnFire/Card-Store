import React, { useState } from 'react';
import { Card, CardGame } from '@/types';
import { Table, Modal } from '@/components/Common';
import { Search, Plus, Edit2, Trash2, Image as ImageIcon, Filter, ChevronDown } from 'lucide-react';

const mockCards: Card[] = [
  { id: '001', gameId: 'ygo', name: 'Blue-Eyes White Dragon', set: 'LOB-001', rarity: 'Ultra Rare', image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg', marketPrice: 15.50 },
  { id: '002', gameId: 'ygo', name: 'Dark Magician', set: 'LOB-005', rarity: 'Ultra Rare', image: 'https://images.ygoprodeck.com/images/cards/46986414.jpg', marketPrice: 12.00 },
  { id: '001', gameId: 'pkm', name: 'Charizard', set: 'Base Set', rarity: 'Holo', image: 'https://images.pokemontcg.io/base1/4.png', marketPrice: 450.00 },
];

const mockGames: CardGame[] = [
  { id: 'ygo', name: 'Yu-Gi-Oh!', description: '', isActive: true },
  { id: 'pkm', name: 'Pokémon', description: '', isActive: true },
  { id: 'mtg', name: 'MTG', description: '', isActive: true },
];

export function InventoryPage() {
  const [cards, setCards] = useState<Card[]>(mockCards);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredCards = cards.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.includes(searchQuery) ||
    c.gameId.includes(searchQuery)
  );

  const columns = [
    { 
      key: 'image', 
      label: 'Preview', 
      render: (card: Card) => (
        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
        </div>
      )
    },
    { key: 'gameId', label: 'Game', render: (card: Card) => <span className="font-black uppercase text-slate-400 text-[10px] tracking-widest">{card.gameId}</span> },
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Card Name', render: (card: Card) => <span className="font-bold text-slate-900">{card.name}</span> },
    { key: 'rarity', label: 'Rarity' },
    { 
        key: 'marketPrice', 
        label: 'Price', 
        render: (card: Card) => <span className="font-black text-slate-900">${card.marketPrice?.toFixed(2)}</span> 
    },
  ];

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cardData: Card = {
      id: (formData.get('id') as string) || editingCard?.id || '',
      gameId: formData.get('gameId') as string,
      name: formData.get('name') as string,
      image: (formData.get('image') as string) || imagePreview || '',
      rarity: formData.get('rarity') as string,
      set: formData.get('set') as string,
      marketPrice: parseFloat(formData.get('price') as string) || 0,
    };

    if (editingCard) {
      setCards(cards.map(c => c.id === editingCard.id && c.gameId === editingCard.gameId ? cardData : c));
    } else {
      setCards([...cards, cardData]);
    }
    setIsModalOpen(false);
    setEditingCard(null);
    setImagePreview(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Control</h1>
          <p className="text-slate-500 text-sm mt-1">Manage the global database of cards and variations.</p>
        </div>
        <button 
          onClick={() => { setEditingCard(null); setIsModalOpen(true); setImagePreview(null); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>Add Individual Card</span>
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search cards by name, ID or game..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">
          <Filter size={18} />
          <span>Filters</span>
          <ChevronDown size={14} className="ml-1" />
        </button>
      </div>

      <Table 
        columns={columns} 
        data={filteredCards} 
        actions={(card: Card) => (
          <div className="flex items-center justify-end gap-2 text-slate-400">
            <button 
              onClick={() => { setEditingCard(card); setIsModalOpen(true); setImagePreview(card.image); }}
              className="p-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => setCards(cards.filter(c => !(c.id === card.id && c.gameId === card.gameId)))}
              className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingCard ? "Edit Card Meta" : "Add New Card to Library"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Game Title</label>
              <select name="gameId" defaultValue={editingCard?.gameId} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold appearance-none">
                {mockGames.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Card ID (Code)</label>
              <input name="id" defaultValue={editingCard?.id} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Card Name</label>
            <input name="name" defaultValue={editingCard?.name} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Set / Expansion</label>
              <input name="set" defaultValue={editingCard?.set} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Rarity</label>
              <input name="rarity" defaultValue={editingCard?.rarity} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Image Source (URL)</label>
            <div className="flex gap-4">
                <input 
                    name="image" 
                    defaultValue={editingCard?.image} 
                    onChange={(e) => setImagePreview(e.target.value)} 
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" 
                />
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden">
                    {imagePreview ? (
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="text-slate-300" size={20} />
                    )}
                </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Market Price ($)</label>
            <input type="number" step="0.01" name="price" defaultValue={editingCard?.marketPrice} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">Save Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
