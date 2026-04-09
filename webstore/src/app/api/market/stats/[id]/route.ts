import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Mock performance data for demonstration
  return NextResponse.json({
    cardId: id,
    dailyChange: (Math.random() * 2 - 1).toFixed(2),
    volume24h: Math.floor(Math.random() * 100),
    sparkline: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)),
    low_price: Math.floor(Math.random() * 500) + 10,
    total_listings: Math.floor(Math.random() * 50) + 1,
    lastSold: [
      { price: Math.floor(Math.random() * 1000), date: new Date().toISOString(), condition: 'Near Mint' },
      { price: Math.floor(Math.random() * 1000), date: new Date(Date.now() - 86400000).toISOString(), condition: 'Lightly Played' },
    ]
  });
}
