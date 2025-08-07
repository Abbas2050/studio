
import { NextResponse } from 'next/server';
import { groupedSymbols } from '@/lib/symbol-utils';

export const dynamic = 'force-dynamic';

interface SubSymbolStat {
    symbol: string;
    buyVolume: number;
    sellVolume: number;
    netVolume: number;
}

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const parentSymbol = params.symbol;
  if (!parentSymbol || !groupedSymbols[parentSymbol]) {
    return NextResponse.json({ message: 'Symbol not found' }, { status: 404 });
  }

  const subSymbols = Array.from(groupedSymbols[parentSymbol]);
  const subSymbolStats: SubSymbolStat[] = [];
  
  try {
      const allPositionsPromises = subSymbols.map(async (sub) => {
        try {
            const encodedSymbol = encodeURIComponent(sub);
            const res = await fetch(`https://api.skylinkstrader.com/Position/GetPositionsBySymbol?symbol=${encodedSymbol}`);
            if (res.ok) {
                const data = await res.json();
                return { symbol: sub, positions: Array.isArray(data) ? data : [] };
            }
        } catch (error) {
            console.error(`Failed to fetch position for sub-symbol ${sub}:`, error);
        }
        return { symbol: sub, positions: [] };
    });

    const results = await Promise.all(allPositionsPromises);

    results.forEach(result => {
        let buyVol = 0;
        let sellVol = 0;
        
        result.positions.forEach(pos => {
            if (pos.action === 0) { // BUY
                buyVol += (pos.volume / 10000);
            } else if (pos.action === 1) { // SELL
                sellVol += (pos.volume / 10000);
            }
        });

        subSymbolStats.push({
            symbol: result.symbol,
            buyVolume: +buyVol.toFixed(2),
            sellVolume: +sellVol.toFixed(2),
            netVolume: +(buyVol - sellVol).toFixed(2),
        });
    });


    // Sort by net volume descending
    subSymbolStats.sort((a,b) => b.netVolume - a.netVolume);

    return NextResponse.json(subSymbolStats);
  } catch (error) {
    console.error(`Error fetching symbol details for ${parentSymbol}:`, error);
    return NextResponse.json({ message: `Error fetching symbol details for ${parentSymbol}` }, { status: 500 });
  }
}
