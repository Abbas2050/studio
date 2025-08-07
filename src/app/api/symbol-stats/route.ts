
import { NextResponse } from 'next/server';
import type { SymbolStat } from '@/lib/types';
import { groupedSymbols } from '@/lib/symbol-utils';

export const dynamic = 'force-dynamic';

async function getSymbolStats() {
    const symbolStats: Omit<SymbolStat, 'name' | 'price' | 'change' | 'changePercent' | 'spread' | 'trend' | 'history'>[] = [];

    for (const [parent, subs] of Object.entries(groupedSymbols)) {
        let buyVol = 0;
        let sellVol = 0;

        // Limit concurrent fetches to avoid overwhelming the server
        const batchSize = 10;
        const subsArray = Array.from(subs);
        for (let i = 0; i < subsArray.length; i += batchSize) {
            const batch = subsArray.slice(i, i + batchSize);
            await Promise.all(batch.map(async (sub) => {
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
                    // console.error(`Failed to fetch position for symbol ${sub}:`, error);
                }
            }));
        }

        const netVolume = buyVol - sellVol;
        const totalVolume = buyVol + sellVol;

        symbolStats.push({
            symbol: parent,
            buyVolume: +buyVol.toFixed(2),
            sellVolume: +sellVol.toFixed(2),
            buyVolumePercent: totalVolume > 0 ? (buyVol / totalVolume) * 100 : 0,
            sellVolumePercent: totalVolume > 0 ? (sellVol / totalVolume) * 100 : 0,
            netVolume: +netVolume.toFixed(2),
            isGroup: subs.size > 1,
        });
    }

    return symbolStats;
}

// Dummy data generation for fields not present in the new API
const generateDummyData = (symbol: string) => {
    const basePrice = 1 + Math.random() * 2000;
    const change = (Math.random() - 0.5) * (basePrice * 0.02);
    const price = basePrice + change;
    const changePercent = (change / basePrice) * 100;
    const history = Array.from({ length: 20 }, (_, i) => ({
        name: `T-${20 - i}`,
        value: basePrice + (Math.random() - 0.5) * (basePrice * 0.01) * (i / 2),
    }));
    history.push({ name: 'Now', value: price });

    return {
        name: `${symbol} / USD`,
        price: price,
        change: change,
        changePercent: changePercent,
        spread: (Math.random() * 0.001).toFixed(5),
        trend: change >= 0 ? 'up' : 'down' as 'up' | 'down',
        history: history,
    };
};

export async function GET() {
    try {
        const stats = await getSymbolStats();
        
        const data: SymbolStat[] = stats.map(stat => {
            const dummy = generateDummyData(stat.symbol);
            return {
                ...stat,
                ...dummy,
                spread: parseFloat(dummy.spread),
            };
        });

        // Sort by net volume descending
        data.sort((a,b) => b.netVolume - a.netVolume);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching symbol stats:', error);
        return NextResponse.json({ message: 'Error fetching symbol data' }, { status: 500 });
    }
}
