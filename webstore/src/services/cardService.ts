import { ICard, IFilterState } from '@/types/models';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVERSIDE_API_URL || 'http://localhost:3000/api';

const MOCK_CARDS: ICard[] = [
  {
    id: 'char-001',
    name: 'Charizard Base Set',
    game: 'Pokemon',
    rarity: 'Holo Rare',
    set: 'Base Set',
    number: '4',
    imageUrl: 'https://images.unsplash.com/photo-1613771404721-1f92d799e49f?q=80&w=800',
    marketPrice: 450.00,
    lowPrice: 380.00,
    buylistPrice: 320.00,
    isDirectEligible: true,
    listedCount: 12,
    volatility: 1.2
  },
  {
    id: 'bl-002',
    name: 'Black Lotus',
    game: 'MTG',
    rarity: 'Special',
    set: 'Alpha',
    number: 'A-001',
    imageUrl: 'https://images.unsplash.com/photo-1627634777217-c864268db30c?q=80&w=800',
    marketPrice: 25000.00,
    lowPrice: 22000.00,
    buylistPrice: 18000.00,
    isDirectEligible: false,
    listedCount: 2,
    volatility: 0.5
  },
  {
    id: 'be-003',
    name: 'Blue-Eyes White Dragon',
    game: 'Yu-Gi-Oh',
    rarity: 'Ultra Rare',
    set: 'LOB',
    number: 'LOB-001',
    imageUrl: 'https://images.unsplash.com/photo-1613771402248-cb541a39943f?q=80&w=800',
    marketPrice: 850.00,
    lowPrice: 720.00,
    buylistPrice: 600.00,
    isDirectEligible: true,
    listedCount: 8,
    volatility: 2.1
  }
];

export const cardService = {
  async getCards(): Promise<ICard[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/cards/search`);
        if (!response.ok) {
            return MOCK_CARDS;
        }
        return response.json();
    } catch {
        return MOCK_CARDS;
    }
  },

  async getCardById(id: string): Promise<ICard | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/cards/${id}`);
        if (!response.ok) {
            return MOCK_CARDS.find(c => c.id === id) || null;
        }
        return response.json();
    } catch {
        return MOCK_CARDS.find(c => c.id === id) || null;
    }
  },

  async getPaginatedCards(
    page: number, 
    limit: number, 
    filters: Partial<IFilterState> = {}
  ): Promise<{ cards: ICard[], total: number, hasMore: boolean }> {
    try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(filters.searchQuery && { q: filters.searchQuery }),
          ...(filters.game && { game: filters.game.join(',') }),
          ...(filters.rarity && { rarity: filters.rarity.join(',') }),
          ...(filters.sortBy && { sort: filters.sortBy }),
        });

        const response = await fetch(`${API_BASE_URL}/cards/search?${queryParams}`);
        if (!response.ok) {
            throw new Error();
        }
        
        const data = await response.json();
        return {
          cards: data.cards,
          total: data.total,
          hasMore: data.hasMore
        };
    } catch {
        // Filter mock cards locally for the demo
        let filtered = [...MOCK_CARDS];
        
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(c => c.name.toLowerCase().includes(query));
        }

        if (filters.game && filters.game.length > 0) {
            // Map the sidebar labels to actual mock data game values if needed
            // Our mock data has 'Pokemon', 'MTG', 'Yu-Gi-Oh'
            // Sidebar has 'Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!'
            const gameMap: Record<string, string> = {
                'Pokémon': 'Pokemon',
                'Magic: The Gathering': 'MTG',
                'Yu-Gi-Oh!': 'Yu-Gi-Oh'
            };
            const targetGames = filters.game.map(g => gameMap[g] || g);
            filtered = filtered.filter(c => targetGames.includes(c.game));
        }

        if (filters.rarity && filters.rarity.length > 0) {
            filtered = filtered.filter(c => filters.rarity?.includes(c.rarity));
        }

        return {
            cards: filtered.slice((page - 1) * limit, page * limit),
            total: filtered.length,
            hasMore: page * limit < filtered.length
        };
    }
  }
};
