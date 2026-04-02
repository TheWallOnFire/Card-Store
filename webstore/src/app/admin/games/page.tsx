'use client';

import React, { useState } from 'react';
import { CardGame } from '@/types/models';
import { Table, Modal } from '@/components/admin/AdminComponents';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Search } from 'lucide-react';

const mockGames: CardGame[] = [
  { id: 'ygo', name: 'Yu-Gi-Oh!', description: 'Duel Monsters card game', isActive: true },
  { id: 'pkm', name: 'Pokémon', description: 'Pocket Monsters TCG', isActive: true },
  { id: 'mtg', name: 'Magic: The Gathering', description: 'The original trading card game', isActive: false },
  { id: 'fab', name: 'Flesh and Blood', description: 'Hero-based combat TCG', isActive: true },
];

export default function GamesPage() {
  const [games, setGames] = useState<CardGame[]>(mockGames);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<CardGame | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Game Name', render: (game: CardGame) => <span className="font-black text-slate-900 tracking-tight">{game.name}</span> },
    { key: 'description', label: 'Description' },
    { 
      key: 'isActive', 
      label: 'Status', 
      render: (game: CardGame) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
          game.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
        }`}>
          {game.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {game.isActive ? 'Live' : 'Inactive'}
        </span>
      )
    },
  ];

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const gameData: CardGame = {
      id: (formData.get('id') as string) || editingGame?.id || '',
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      isActive: formData.get('isActive') === 'on',
    };

    if (editingGame) {
      setGames(games.map(g => g.id === editingGame.id ? gameData : g));
    } else {
      setGames([...games, gameData]);
    }
    setIsModalOpen(false);
    setEditingGame(null);
  };

  return (
    <div className="py-12 px-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Card Games</h1>
          <p className="text-slate-500 font-medium text-sm mt-2 italic">Register and manage TCG titles across the ecosystem.</p>
        </div>
        <button 
          onClick={() => { setEditingGame(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={20} />
          <span>Add New Title</span>
        </button>
      </div>

      <div className="relative mb-8 max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
            type="text" 
            placeholder="Search titles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold placeholder:text-slate-300 shadow-sm"
        />
      </div>

      <Table 
        columns={columns as any} 
        data={filteredGames} 
        actions={(game: CardGame) => (
          <div className="flex items-center justify-end gap-2 text-slate-300">
            <button 
              onClick={() => { setEditingGame(game); setIsModalOpen(true); }}
              className="p-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all hover:shadow-lg hover:shadow-blue-600/10"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => setGames(games.filter(g => g.id !== game.id))}
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
        title={editingGame ? "Edit Catalog Entry" : "Register New Game"}
      >
        <form onSubmit={handleSave} className="space-y-6">
          {!editingGame && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Game Identifier (Slug)</label>
              <input name="id" required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" placeholder="e.g., ygo" />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Public Name</label>
            <input name="name" defaultValue={editingGame?.name} required className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold" placeholder="e.g., Yu-Gi-Oh!" />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Summary Description</label>
            <textarea name="description" defaultValue={editingGame?.description} rows={3} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-sm font-bold resize-none" placeholder="Provide a brief game overview..." />
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <input type="checkbox" name="isActive" id="isActive" defaultChecked={editingGame?.isActive ?? true} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
            <div className="flex flex-col">
                <label htmlFor="isActive" className="text-sm font-black text-slate-900 select-none">Active Toggle</label>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Enable public browsing for this game</span>
            </div>
          </div>
          <div className="pt-6 flex gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 text-slate-400 font-black tracking-widest uppercase text-xs hover:bg-slate-50 rounded-2xl transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-4 bg-slate-900 text-white font-black tracking-widest uppercase text-xs rounded-2xl shadow-2xl shadow-slate-900/20 hover:bg-black transition-all">Commit Changes</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
