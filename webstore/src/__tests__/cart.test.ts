import { describe, it, expect } from 'vitest';
import { cartReducer, initialCartState, calculateTotals, ICartItem } from '../context/cartReducer';
import { ICard } from '../types/models';

const mockCard: ICard = {
  id: 'card-1',
  name: 'Test Card',
  set: 'Test Set',
  number: '1',
  rarity: 'Rare',
  imageUrl: 'https://example.com/image.png',
  marketPrice: 10.00,
  lowPrice: 9.00,
  buylistPrice: 5.00,
  isDirectEligible: true,
  game: 'Pokémon',
};

describe('Cart Reducer Logic', () => {
  it('should add a new item to an empty cart', () => {
    const newState = cartReducer(initialCartState, { type: 'ADD_ITEM', payload: mockCard });
    expect(newState.items.length).toBe(1);
    expect(newState.items[0].quantity).toBe(1);
    expect(newState.totalItems).toBe(1);
    expect(newState.totalPrice).toBe(10.00);
  });

  it('should increase quantity when adding an existing item', () => {
    const stateWithOne = cartReducer(initialCartState, { type: 'ADD_ITEM', payload: mockCard });
    const stateWithTwo = cartReducer(stateWithOne, { type: 'ADD_ITEM', payload: mockCard });
    expect(stateWithTwo.items.length).toBe(1);
    expect(stateWithTwo.items[0].quantity).toBe(2);
    expect(stateWithTwo.totalPrice).toBe(20.00);
  });

  it('should calculate totals correctly for multiple items', () => {
    const items: ICartItem[] = [
        { ...mockCard, quantity: 2 },
        { ...mockCard, id: 'card-2', marketPrice: 5, quantity: 1 } as ICartItem
    ];
    const totals = calculateTotals(items);
    expect(totals.totalItems).toBe(3);
    expect(totals.totalPrice).toBe(25.00);
  });
});
