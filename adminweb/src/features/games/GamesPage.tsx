import React, { useState, useEffect } from 'react';
import { CardGame } from '@/types';
import { Table, Modal } from '@/components/Common';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';

const mockGames: CardGame[] = [
  { id: 'ygo', name: 'Yu-Gi-Oh!', description: 'Duel Monsters card game', isActive: true },
  { id: 'pkm', name: 'Pokémon', description: 'Pocket Monsters TCG', isActive: true },
  { id: 'mtg', name: 'Magic: The Gathering', description: 'The original trading card game', isActive: false },
];

export function GamesPage() {
  const [games, setGames] = useState<CardGame[]>(mockGames);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<CardGame | null>(null);

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { 
      key: 'isActive', 
      label: 'Status', 
      render: (game: CardGame) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
          game.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
        }`}>
          {game.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {game.isActive ? 'Active' : 'Inactive'}
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
    <div className="max-w-6xl mx-auto py-8 px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Card Games</h1>
          <p className="text-slate-500 text-sm mt-1">Manage supported TCG titles and their availability.</p>
        </div>
        <button 
          onClick={() => { setEditingGame(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={20} />
          <span>Add New Game</span>
        </button>
      </div>

      <Table 
        columns={columns} 
        data={games} 
        actions={(game: CardGame) => (
          <div className="flex items-center justify-end gap-2 text-slate-400">
            <button 
              onClick={() => { setEditingGame(game); setIsModalOpen(true); }}
              className="p-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button 
              onClick={() => setGames(games.filter(g => g.id !== game.id))}
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
        title={editingGame ? "Edit Card Game" : "Add New Card Game"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {!editingGame && (
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Game ID (Slug)</label>
              <input name="id" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" placeholder="e.g., ygo" />
            </div>
          )}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Display Name</label>
            <input name="name" defaultValue={editingGame?.name} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold" placeholder="e.g., Yu-Gi-Oh!" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</label>
            <textarea name="description" defaultValue={editingGame?.description} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold resize-none" placeholder="Enter brief description..." />
          </div>
          <div className="flex items-center gap-3 py-2">
            <input type="checkbox" name="isActive" id="isActive" defaultChecked={editingGame?.isActive ?? true} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="isActive" className="text-sm font-bold text-slate-700 select-none">Active for Public Access</label>
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
