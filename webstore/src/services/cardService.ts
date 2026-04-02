import { Card } from '@/types/models';
import { mockCards } from './mockData';

export const cardService = {
  async getCards(): Promise<Card[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockCards];
  },

  async getCardById(id: string): Promise<Card | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const card = mockCards.find(c => c.id === id);
    return card || null;
  }
};
