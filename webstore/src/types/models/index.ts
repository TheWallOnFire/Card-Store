export interface Card {
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
}

export type Condition = 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';

export interface Listing {
  id: string;
  cardId: string;
  sellerId: string;
  sellerName: string;
  sellerFeedback: number; // 0-100 percentage
  condition: Condition;
  price: number;
  shippingPrice: number;
  quantityAvailable: number;
}

export interface FilterState {
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
