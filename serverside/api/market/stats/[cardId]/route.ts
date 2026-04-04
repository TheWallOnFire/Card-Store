import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase';

/**
 * GET /api/market/stats/[cardId]
 * Aggregates data from listings to return market_price, low_price, and price_trend.
 */
export async function GET(req: NextRequest, { params }: { params: { cardId: string } }) {
  const cardId = params.cardId;
  const supabase = await createClient();

  try {
     // Fetch all active listings for this card to calculate stats
     const { data: listings, error: dbError } = await supabase
       .from('listings')
       .select('price, quantity, created_at')
       .eq('card_id', cardId)
       .gt('quantity', 0)
       .order('price', { ascending: true });

     if (dbError) {
        return NextResponse.json({ error: 'Market data fetch failed.' }, { status: 500 });
     }

     if (!listings || listings.length === 0) {
        return NextResponse.json({ 
            cardId, 
            market_price: 0, 
            low_price: 0, 
            message: 'No active listings found for this card.' 
        });
     }

     // 1. Calculate Statistics
     const low_price = listings[0].price;
     const totalItems = listings.length;
     const averagePrice = listings.reduce((sum, item) => sum + item.price, 0) / totalItems;
     
     // 2. Trend Logic (Simplified based on chronological order of listing prices)
     const oldestPrice = listings.slice().sort((a,b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
     )[0].price;
     
     const price_trend = averagePrice > oldestPrice ? 'increasing' : 'decreasing';

     return NextResponse.json({
        cardId,
        market_price: Number(averagePrice.toFixed(2)),
        low_price,
        total_listings: totalItems,
        price_trend,
        data_points: listings.length
     });

  } catch (err) {
     return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
