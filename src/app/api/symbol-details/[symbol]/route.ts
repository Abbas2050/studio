
import { NextResponse } from 'next/server';
import { groupedSymbols } from '../symbol-stats/route';

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
    await Promise.all(subSymbols.map(async (sub) => {
        let buyVol = 0;
        let sellVol = 0;
        try {
            const encodedSymbol = encodeURIComponent(sub);
            const res = await fetch(`https://api.skylinkstrader.com/Position/GetPositionsBySymbol?symbol=${encodedSymbol}`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    data.forEach(pos => {
                        if (pos.action === 0) { // BUY
                            buyVol += (pos.volume / 10000);
                        } else if (pos.action === 1) { // SELL
                            sellVol += (pos.volume / 10000);
                        }
                    });
                }
            }
        } catch (error) {
            console.error(`Failed to fetch position for sub-symbol ${sub}:`, error);
        }
        
        subSymbolStats.push({
            symbol: sub,
            buyVolume: +buyVol.toFixed(2),
            sellVolume: +sellVol.toFixed(2),
            netVolume: +(buyVol - sellVol).toFixed(2),
        });
    }));

    // Sort by net volume descending
    subSymbolStats.sort((a,b) => b.netVolume - a.netVolume);

    return NextResponse.json(subSymbolStats);
  } catch (error) {
    console.error(`Error fetching symbol details for ${parentSymbol}:`, error);
    return NextResponse.json({ message: `Error fetching symbol details for ${parentSymbol}` }, { status: 500 });
  }
}
