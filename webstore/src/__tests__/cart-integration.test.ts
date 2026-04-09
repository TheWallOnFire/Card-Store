import { describe, it, expect } from 'vitest';
import { calculateTotals } from '../context/CartContext';
import { ICard } from '@/types/models';

describe('Cart Calculation Logic (calculateTotals)', () => {
  
  const mockCard: ICard = {
    id: '1',
    name: 'Pikachu',
    game: 'Pokemon',
    game_id: 'pkm',
    rarity: 'Rare',
    imageUrl: '',
    marketPrice: 10.50,
    lowPrice: 9.00,
    set: 'Base',
    number: '25'
  };

  it('calculates total for a single item correctly', () => {
    const items = [{ ...mockCard, quantity: 2 }];
    const { totalItems, totalPrice } = calculateTotals(items);
    
    expect(totalItems).toBe(2);
    expect(totalPrice).toBe(21.00);
  });

  it('handles decimal precision (e.g., $0.05)', () => {
    const cheapCard = { ...mockCard, id: '2', marketPrice: 0.05 };
    const items = [{ ...cheapCard, quantity: 3 }];
    const { totalPrice } = calculateTotals(items);
    
    // 0.05 * 3 = 0.15
    expect(totalPrice).toBeCloseTo(0.15, 2);
  });

  it('calculates sum of multiple different items', () => {
    const items = [
      { ...mockCard, id: '1', marketPrice: 10.00, quantity: 1 },
      { ...mockCard, id: '2', marketPrice: 5.50, quantity: 2 }
    ];
    const { totalItems, totalPrice } = calculateTotals(items);
    
    expect(totalItems).toBe(3);
    expect(totalPrice).toBe(21.00);
  });

  it('returns 0 for an empty cart', () => {
    const { totalItems, totalPrice } = calculateTotals([]);
    expect(totalItems).toBe(0);
    expect(totalPrice).toBe(0);
  });

  it('handles items with missing marketPrice by defaulting to 0', () => {
    const brokenCard = { ...mockCard, marketPrice: undefined } as any;
    const items = [{ ...brokenCard, quantity: 5 }];
    const { totalPrice } = calculateTotals(items);
    
    expect(totalPrice).toBe(0);
  });
});
