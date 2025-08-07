
import { NextResponse } from 'next/server';
import type { SymbolStat, Position, Account } from '@/lib/types';
import { groupedSymbols } from '@/lib/symbol-utils';

export const dynamic = 'force-dynamic';

async function getSymbolStats(): Promise<Omit<SymbolStat, 'name' | 'price' | 'change' | 'changePercent' | 'spread' | 'trend' | 'history'>[]> {
    try {
        const accountsResponse = await fetch('https://api.skylinkstrader.com/Account/GetAllAccounts');
        if (!accountsResponse.ok) {
            throw new Error('Failed to fetch accounts');
        }
        const accounts: Account[] = await accountsResponse.json();
        const logins = accounts.map(acc => acc.login);

        const allPositions: Position[] = [];

        // Fetch all positions for all accounts in parallel batches
        const batchSize = 20;
        for (let i = 0; i < logins.length; i += batchSize) {
            const batchLogins = logins.slice(i, i + batchSize);
            const positionPromises = batchLogins.map(login =>
                fetch(`https://api.skylinkstrader.com/Position/GetPositionsByLogin?login=${login}`)
                    .then(res => res.ok ? res.json() : [])
                    .catch(() => [])
            );
            const positionsResults = await Promise.all(positionPromises);
            positionsResults.forEach(positions => allPositions.push(...positions));
        }

        const volumes: { [symbol: string]: { buyVolume: number, sellVolume: number } } = {};

        // Aggregate volumes from all positions
        allPositions.forEach(pos => {
            if (!volumes[pos.symbol]) {
                volumes[pos.symbol] = { buyVolume: 0, sellVolume: 0 };
            }
            if (pos.action === 0) { // BUY
                volumes[pos.symbol].buyVolume += (pos.volume / 10000);
            } else if (pos.action === 1) { // SELL
                volumes[pos.symbol].sellVolume += (pos.volume / 10000);
            }
        });
        
        const parentSymbolVolumes: { [parent: string]: { buyVolume: number, sellVolume: number } } = {};

        // Aggregate volumes into parent symbols
        for (const [parent, subs] of Object.entries(groupedSymbols)) {
            parentSymbolVolumes[parent] = { buyVolume: 0, sellVolume: 0 };
            subs.forEach(subSymbol => {
                if (volumes[subSymbol]) {
                    parentSymbolVolumes[parent].buyVolume += volumes[subSymbol].buyVolume;
                    parentSymbolVolumes[parent].sellVolume += volumes[subSymbol].sellVolume;
                }
            });
        }
        
        const symbolStats: Omit<SymbolStat, 'name' | 'price' | 'change' | 'changePercent' | 'spread' | 'trend' | 'history'>[] = [];

        for (const [parent, { buyVolume, sellVolume }] of Object.entries(parentSymbolVolumes)) {
            const netVolume = buyVolume - sellVolume;
            const totalVolume = buyVolume + sellVolume;

            if (netVolume !== 0) {
                 symbolStats.push({
                    symbol: parent,
                    buyVolume: +buyVolume.toFixed(2),
                    sellVolume: +sellVolume.toFixed(2),
                    buyVolumePercent: totalVolume > 0 ? (buyVolume / totalVolume) * 100 : 0,
                    sellVolumePercent: totalVolume > 0 ? (sellVolume / totalVolume) * 100 : 0,
                    netVolume: +netVolume.toFixed(2),
                    isGroup: groupedSymbols[parent]?.size > 1,
                });
            }
        }

        return symbolStats;

    } catch (error) {
        console.error("Error in getSymbolStats:", error);
        return [];
    }
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
        data.sort((a,b) => Math.abs(b.netVolume) - Math.abs(a.netVolume));

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching symbol stats:', error);
        return NextResponse.json({ message: 'Error fetching symbol data' }, { status: 500 });
    }
}
