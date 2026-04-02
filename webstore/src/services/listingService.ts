import { mockCards } from '@/services/mockData';
import { Listing, Condition } from '@/types/models';

// Generate mock listings for a given card
export function getMockListings(cardId: string): Listing[] {
  const sellers = [
    { id: 's1', name: 'PokeVault_Pro', feedback: 99.8 },
    { id: 's2', name: 'CardKing_MTG', feedback: 97.5 },
    { id: 's3', name: 'SlabsDynasty', feedback: 95.2 },
    { id: 's4', name: 'HoloHunter', feedback: 100 },
    { id: 's5', name: 'VintageVault', feedback: 88.9 },
  ];
  const conditions: Condition[] = ['NM', 'NM', 'LP', 'LP', 'MP'];
  const card = mockCards.find((c) => c.id === cardId);
  const basePrice = card?.marketPrice ?? 100;

  return sellers.map((seller, idx) => ({
    id: `listing-${cardId}-${idx}`,
    cardId: cardId,
    sellerId: seller.id,
    sellerName: seller.name,
    sellerFeedback: seller.feedback,
    condition: conditions[idx],
    price: parseFloat((basePrice * (0.9 + idx * 0.05)).toFixed(2)),
    shippingPrice: idx === 0 ? 0 : 4.99,
    quantityAvailable: Math.floor(Math.random() * 5) + 1,
  }));
}

// Generate mock price history data for Recharts
export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export function getMockPriceHistory(basePrice: number): PriceHistoryPoint[] {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  return months.map((month) => {
    const variance = 0.8 + Math.random() * 0.4;
    const price = parseFloat((basePrice * variance).toFixed(2));
    return {
      date: month,
      price,
    };
  });
}
