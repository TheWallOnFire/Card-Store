import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVERSIDE_API_URL || 'http://localhost:3000/api';

export interface IMarketStats {
  cardId: string;
  market_price: number;
  low_price: number;
  total_listings: number;
  price_trend: 'increasing' | 'decreasing' | 'stable';
  data_points: number;
}

export function useMarketData(cardId: string) {
  return useQuery<IMarketStats>({
    queryKey: ['market-stats', cardId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/market/stats/${cardId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch market statistics');
      }
      return response.json();
    },
    enabled: !!cardId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
