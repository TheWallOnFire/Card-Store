import { ICard } from '@/types/models';

export interface ICartItem extends ICard {
  quantity: number;
}

export interface ICartState {
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: ICard }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: ICartItem[] };

export const initialCartState: ICartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

export function cartReducer(state: ICartState, action: CartAction): ICartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return handleAddItem(state, action.payload);
    case 'REMOVE_ITEM':
      return handleRemoveItem(state, action.payload);
    case 'UPDATE_QUANTITY':
      return handleUpdateQuantity(state, action.payload.id, action.payload.quantity);
    case 'CLEAR_CART':
      return { ...initialCartState, isOpen: state.isOpen };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'LOAD_CART':
      return { ...state, items: action.payload, ...calculateTotals(action.payload) };
    default:
      return state;
  }
}

function handleAddItem(state: ICartState, card: ICard): ICartState {
    const existing = state.items.find(i => i.id === card.id);
    const newItems = existing 
        ? state.items.map(i => i.id === card.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...state.items, { ...card, quantity: 1 }];
    return { ...state, items: newItems, ...calculateTotals(newItems), isOpen: true };
}

function handleRemoveItem(state: ICartState, id: string): ICartState {
    const newItems = state.items.filter(i => i.id !== id);
    return { ...state, items: newItems, ...calculateTotals(newItems) };
}

function handleUpdateQuantity(state: ICartState, id: string, quantity: number): ICartState {
    const newItems = state.items.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i);
    return { ...state, items: newItems, ...calculateTotals(newItems) };
}

export function calculateTotals(items: ICartItem[]) {
  return items.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + item.marketPrice * item.quantity,
    }),
    { totalItems: 0, totalPrice: 0 }
  );
}
