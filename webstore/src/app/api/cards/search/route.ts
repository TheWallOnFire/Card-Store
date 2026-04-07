import { NextResponse } from 'next/server';
import { mockCards } from '@/services/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const game = searchParams.get('game')?.split(',') || [];
  const rarity = searchParams.get('rarity')?.split(',') || [];
  const sort = searchParams.get('sort') || 'price_asc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  let filtered = [...mockCards];

  if (query) {
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.set.toLowerCase().includes(query)
    );
  }

  if (game.length > 0 && game[0] !== '') {
    filtered = filtered.filter(c => game.includes(c.game));
  }

  if (rarity.length > 0 && rarity[0] !== '') {
    filtered = filtered.filter(c => rarity.includes(c.rarity));
  }

  // Sorting
  filtered.sort((a, b) => {
    if (sort === 'price_asc') return (a.marketPrice || 0) - (b.marketPrice || 0);
    if (sort === 'price_desc') return (b.marketPrice || 0) - (a.marketPrice || 0);
    if (sort === 'name_asc') return a.name.localeCompare(b.name);
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
