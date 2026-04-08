import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Mock performance data for demonstration
  return NextResponse.json({
    cardId: params.id,
    dailyChange: (Math.random() * 2 - 1).toFixed(2),
    volume24h: Math.floor(Math.random() * 100),
    sparkline: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)),
    lastSold: [
      { price: Math.floor(Math.random() * 1000), date: new Date().toISOString(), condition: 'Near Mint' },
      { price: Math.floor(Math.random() * 1000), date: new Date(Date.now() - 86400000).toISOString(), condition: 'Lightly Played' },
    ]
  });
}
