export interface ICardGame {
  id: string; // e.g., "ygo"
  name: string;
  description: string;
  isActive: boolean;
}

export interface ICard {
  id: string;
  name: string;
  set: string;
  setSymbolUrl?: string; // TCGplayers uses symbols
  number: string;
  rarity: string;
  imageUrl: string;
  marketPrice: number;
  lowPrice: number;
  buylistPrice: number;
  isDirectEligible: boolean;
  color?: string; // e.g., 'Red', 'Blue', 'Black', 'Colorless'
  game: string; // e.g. 'Pokémon', 'Yu-Gi-Oh!', 'Flesh and Blood'
  gameId?: string; // Relation to CardGame.id
}

export interface IParsedDeckItem {
  gameId: string;
  cardId: string;
  count: number;
  status: 'valid' | 'invalid' | 'loading';
  cardName?: string; // resolved after validation
}

export type ICondition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';

export interface IListing {
  id: string;
  cardId: string;
  sellerId: string;
  sellerName: string;
  sellerFeedback: number; // 0-100 percentage
  condition: ICondition;
  price: number;
  shippingPrice: number;
  quantityAvailable: number;
}

export interface IFilterState {
  searchQuery: string;
  rarity: string[];
  sets: string[];
  cardType: string[];
  game: string[];
  colors: string[];
  priceRange: [number, number];
  sortBy: string;
  isDirectOnly: boolean;
}
