import { IFilterState } from '@/types/models';

export const DEFAULT_FILTERS: IFilterState = {
  searchQuery: '', rarity: [], sets: [], cardType: [], game: [], colors: [],
  priceRange: [0, 5000], sortBy: 'price_asc', isDirectOnly: false,
};

export function parseCommaParam(params: URLSearchParams, key: string): string[] {
    return params.get(key)?.split(',').filter(Boolean) || [];
}

export function deriveFilters(searchParams: URLSearchParams): IFilterState {
  const minPrice = parseInt(searchParams.get('min') || '0', 10);
  const maxPrice = parseInt(searchParams.get('max') || '5000', 10);

  return {
    ...DEFAULT_FILTERS,
    game: parseCommaParam(searchParams, 'game').map(g => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()),
    rarity: parseCommaParam(searchParams, 'rarity'),
    searchQuery: searchParams.get('q') || '',
    sortBy: searchParams.get('sort') || 'price_asc',
    cardType: parseCommaParam(searchParams, 'cardType'),
    isDirectOnly: searchParams.get('direct') === 'true',
    priceRange: [minPrice, maxPrice]
  };
}

export function serializeFilters(filters: IFilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.searchQuery) {
    params.set('q', filters.searchQuery);
  }
  if (filters.game.length) {
    params.set('game', filters.game.join(',').toLowerCase());
  }
  if (filters.rarity.length) {
    params.set('rarity', filters.rarity.join(','));
  }
  if (filters.sortBy !== 'price_asc') {
    params.set('sort', filters.sortBy);
  }
  if (filters.cardType.length) {
    params.set('type', filters.cardType.join(','));
  }
  if (filters.isDirectOnly) {
    params.set('direct', 'true');
  }
  if (filters.priceRange[0] > 0) {
    params.set('min', filters.priceRange[0].toString());
  }
  if (filters.priceRange[1] < 5000) {
    params.set('max', filters.priceRange[1].toString());
  }
  return params;
}
