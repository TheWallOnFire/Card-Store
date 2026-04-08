import { NextResponse } from 'next/server';
import { mockCards } from '@/services/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const gameParams = searchParams.get('game')?.split(',').filter(Boolean) || [];
  const rarityParams = searchParams.get('rarity')?.split(',').filter(Boolean) || [];
  const sort = searchParams.get('sort') || 'price_asc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let filtered = [...mockCards];

  if (query) {
    const normalizedQuery = normalize(query);
    filtered = filtered.filter(c => 
      normalize(c.name).includes(normalizedQuery) || 
      normalize(c.set).includes(normalizedQuery)
    );
  }

  if (gameParams.length > 0) {
    const normalizedTargetGames = gameParams.map(normalize);
    filtered = filtered.filter(c => normalizedTargetGames.includes(normalize(c.game)));
  }

  if (rarityParams.length > 0) {
    filtered = filtered.filter(c => rarityParams.includes(c.rarity));
  }

  // Sorting
  filtered.sort((a, b) => {
    if (sort === 'price_asc') {
      return (a.marketPrice || 0) - (b.marketPrice || 0);
    }
    if (sort === 'price_desc') {
      return (b.marketPrice || 0) - (a.marketPrice || 0);
    }
    if (sort === 'name_asc') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    cards: paginated,
    total,
    hasMore: start + limit < total
  });
}
