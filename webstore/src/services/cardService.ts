import { ICard, IFilterState } from '@/types/models';
import { mockCards } from '@/services/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVERSIDE_API_URL || 'http://localhost:3000/api';

export const cardService = {
  async getCards(): Promise<ICard[]> {
    try {
        // Request a high limit to ensure dashboard stats are accurate for the full catalog
        const response = await fetch(`${API_BASE_URL}/cards/search?limit=1000`);
        if (!response.ok) {
            return mockCards;
        }
        const data = await response.json();
        // Extract the cards array from the paginated response
        return Array.isArray(data) ? data : data.cards || mockCards;
    } catch {
        return mockCards;
    }
  },

  async getCardById(id: string): Promise<ICard | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/cards/${id}`);
        if (!response.ok) {
            return mockCards.find(c => c.id === id) || null;
        }
        return response.json();
    } catch {
        return mockCards.find(c => c.id === id) || null;
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
        return getMockPaginatedCards(page, limit, filters);
    }
  }
};

/**
 * Handles multi-faceted filtering and sorting for mock data in demonstration mode.
 */
function getMockPaginatedCards(page: number, limit: number, filters: Partial<IFilterState>) {
    let filtered = [...mockCards];
    
    if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        filtered = filtered.filter(c => c.name.toLowerCase().includes(query));
    }

    if (filters.game && filters.game.length > 0) {
        const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const targetGames = filters.game.map(normalize);
        filtered = filtered.filter(c => targetGames.includes(normalize(c.game)));
    }

    if (filters.rarity && filters.rarity.length > 0) {
        filtered = filtered.filter(c => filters.rarity?.includes(c.rarity));
    }

    const sortBy = filters.sortBy || 'price_asc';
    filtered.sort((a, b) => {
        if (sortBy === 'price_asc') { return (a.marketPrice || 0) - (b.marketPrice || 0); }
        if (sortBy === 'price_desc') { return (b.marketPrice || 0) - (a.marketPrice || 0); }
        if (sortBy === 'name_asc') { return a.name.localeCompare(b.name); }
        if (sortBy === 'date_desc') { return b.id.localeCompare(a.id); }
        return 0;
    });

    return {
        cards: filtered.slice((page - 1) * limit, page * limit),
        total: filtered.length,
        hasMore: page * limit < filtered.length
    };
}
