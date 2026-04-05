import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';

/**
 * GET /api/cards/search
 * High-performance search endpoint for card lookup.
 */
export async function GET(req: NextRequest) {
  const ip = req.ip || 'unknown';
  if (!checkRateLimit(`search_${ip}`, 60, 60 * 1000)) {
     return rateLimitResponse();
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const game = searchParams.get('game');
  const rarity = searchParams.get('rarity');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  let query = supabase
    .from('cards')
    .select('*, games(name)', { count: 'exact' });

  if (q) {
     query = query.ilike('name', `%${q}%`);
  }

  if (game) {
     query = query.eq('game_id', game);
  }
  if (rarity) {
     query = query.eq('rarity', rarity);
  }

  query = query.range(from, to).order('name', { ascending: true });

  const { data, error, count } = await query;

  if (error) {
     return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    cards: data,
    total: count,
    page,
    limit,
    hasMore: count ? (from + limit < count) : false
  });
}
