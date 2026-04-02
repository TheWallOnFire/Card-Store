export interface CardGame {
  id: string; // e.g., "ygo"
  name: string;
  description: string;
  isActive: boolean;
}

export interface Card {
  id: string;
  gameId: string;
  name: string;
  image: string;
  rarity?: string;
  set?: string;
  marketPrice?: number;
}

export interface ParsedDeckItem {
  gameId: string;
  cardId: string;
  count: number;
  status: 'valid' | 'invalid' | 'loading';
  cardName?: string; // resolved after validation
}
