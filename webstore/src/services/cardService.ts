import { ICard, IFilterState } from '@/types/models';
import { mockCards } from '@/services/mockData';

// Point to the business logic layer (Serverside API)
// In development, assume serverside is on 3001, fallback to 3000 (local proxy)
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVERSIDE_API_URL || 'http://localhost:3001/api';

/**
 * Maps the raw database/API Card structure to the ICard interface used in the UI.
 */
function mapApiCardToICard(apiCard: any): ICard {
  const attributes = apiCard.attributes || {};
  return {
    id: apiCard.id,
    name: apiCard.name,
    set: attributes.set || 'Unknown Set',
    number: attributes.number || 'N/A',
    rarity: apiCard.rarity || 'Common',
    imageUrl: apiCard.image_url || '/placeholder-card.png',
    marketPrice: attributes.marketPrice || 0,
    lowPrice: attributes.lowPrice || 0,
    buylistPrice: attributes.buylistPrice || 0,
    game: apiCard.games?.name || 'Unknown Game',
    gameId: apiCard.game_id,
    isDirectEligible: attributes.isDirectEligible || false,
    listedCount: attributes.listedCount || 0,
    volatility: attributes.volatility || 0,
  };
}

export const cardService = {
  async getCards(): Promise<ICard[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/cards/search?limit=1000`).catch(() => null);
        if (!response || !response.ok) {
            return mockCards;
        }
        const data = await response.json();
        const cards = Array.isArray(data) ? data : data.cards || [];
        return cards.map(mapApiCardToICard);
    } catch {
        return mockCards;
    }
  },

  async getCardById(id: string): Promise<ICard | null> {
    try {
        // Concurrently fetch card details and market stats
        const [cardRes, statsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/cards/${id}`).catch(() => null),
            fetch(`${API_BASE_URL}/market/stats/${id}`).catch(() => null)
        ]);

        if (!cardRes || !cardRes.ok) {
            return mockCards.find(c => c.id === id) || null;
        }

        const cardData = await cardRes.json();
        const mappedCard = mapApiCardToICard(cardData);

        // Merge market stats if available
        if (statsRes && statsRes.ok) {
            const statsData = await statsRes.json();
            mappedCard.marketPrice = statsData.market_price || mappedCard.marketPrice;
            mappedCard.lowPrice = statsData.low_price || mappedCard.lowPrice;
            mappedCard.listedCount = statsData.total_listings || mappedCard.listedCount;
        }

        return mappedCard;
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
          ...(filters.game && filters.game.length > 0 && { game: filters.game.join(',') }),
          ...(filters.rarity && filters.rarity.length > 0 && { rarity: filters.rarity.join(',') }),
          ...(filters.sortBy && { sort: filters.sortBy }),
        });

        const response = await fetch(`${API_BASE_URL}/cards/search?${queryParams}`).catch(() => null);
        if (!response || !response.ok) {
            return getMockPaginatedCards(page, limit, filters);
        }
        
        const data = await response.json();
        return {
          cards: (data.cards || []).map(mapApiCardToICard),
          total: data.total || 0,
          hasMore: data.hasMore || false
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
