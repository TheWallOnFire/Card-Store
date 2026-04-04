import { ICard, IFilterState } from '@/types/models';
import { mockCards } from './mockData';

export const cardService = {
  async getCards(): Promise<ICard[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCards];
  },

  async getCardById(id: string): Promise<ICard | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const card = mockCards.find(c => c.id === id);
    return card || null;
  },

  async getPaginatedCards(
    page: number, 
    limit: number, 
    filters: Partial<IFilterState> = {}
  ): Promise<{ cards: ICard[], total: number, hasMore: boolean }> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let results = [...mockCards];
    
    // Apply filters (logic moved from client to service/simulated server)
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      results = results.filter(c => c.name.toLowerCase().includes(q) || c.set.toLowerCase().includes(q));
    }
    
    if (filters.game && filters.game.length > 0) {
      results = results.filter(c => filters.game!.includes(c.game));
    }
    
    if (filters.rarity && filters.rarity.length > 0) {
      results = results.filter(c => filters.rarity!.includes(c.rarity));
    }

    if (filters.isDirectOnly) {
        results = results.filter(c => c.isDirectEligible);
    }

    // Sort logic
    if (filters.sortBy === 'price_asc') {
      results.sort((a, b) => a.marketPrice - b.marketPrice);
    } else if (filters.sortBy === 'price_desc') {
      results.sort((a, b) => b.marketPrice - a.marketPrice);
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedCards = results.slice(start, end);

    return {
      cards: paginatedCards,
      total: results.length,
      hasMore: end < results.length
    };
  }
};
