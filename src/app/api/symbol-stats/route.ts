
import { NextResponse } from 'next/server';
import type { SymbolStat } from '@/lib/types';

export const dynamic = 'force-dynamic';

const RAW_SYMBOLS = [
  'XAUUSD.rh', 'XAUUSD.rb', 'XAUUSD.a', 'XAUUSD.d', 'XAUUSD.c', 'XAUUSD.r', 'XAUUSD', 'XAGUSD.c', 'XAGUSD',
  'XAUUSD.h', 'SP500SEPT25', 'DJ30SEPT25', 'NDQ100SEPT25', 'USDJPY', 'USDCHF', 'USDCAD', 'SP500EPT25.d',
  'NDQ100SEPT25.c', 'NACUSD', 'GOLDDEC25.rb', 'GOLDDEC25.d', 'AUDCAD', 'AUDCHF', 'AUDJPY', 'AUDNZD', 'AUDSGD',
  'AUDUSD', 'BTCEUR', 'BTCUSD', 'CADCHF', 'CHFJPY', 'CHFSGD', 'DJCUSD', 'DJI30SEPT25', 'ETHEUR', 'ETHUSD',
  'EURAUD', 'EURCAD', 'EURCHF', 'EURCZK', 'EURDKK', 'EURGBP', 'EURHKD', 'EURJPY', 'EURMXN', 'EURNOK', 'EURNZD',
  'EURPLN', 'EURSEK', 'EURSGD', 'EURTRY', 'EURUSD', 'EURZAR', 'GBPAUD', 'GBPCAD', 'GBPCHF', 'GBPDKK', 'GBPHKD',
  'GBPJPY', 'GBPNOK', 'GBPNZD', 'GBPPLN', 'GBPSEK', 'GBPSGD', 'GBPTRY', 'GBPUSD', 'GBPZAR', 'GOLDDEC25', 'LTCEUR',
  'LTCUSD', 'MXNJPY', 'NDQ100SEPT25', 'NGASSEPT25', 'NOKJPY', 'NOKSEK', 'NZDCAD', 'NZDCHF', 'NZDJPY', 'NZDSGD',
  'NZDUSD', 'SILSEPT25', 'SOLUSD', 'SP500SEPT25', 'SPCUSD', 'USDCAD', 'USDCHF', 'USDCZK', 'USDDKK', 'USDHKD',
  'USDHUF', 'USDJPY', 'USDTRY', 'USDTUSD', 'USDZAR', 'USOILSEPT25', 'XAGUSD', 'XAUUSD', 'XPDUSD', 'XPTUSD',
  'GOLDDEC25.c', 'EURSEPT2025', 'DJ30SEPT25.c', 'AUDCAD.c', 'AUDCHF.d', 'AUDJPY.d', 'AUDNZD.bg', 'AUDNZD.d',
  'AUDUSD.bg', 'AUDUSD.c', 'AUDUSD.d', 'CADCHF.c2', 'CADCHF.d', 'CHFJPY.bg', 'DAX40SEPT25.k', 'DJCUSD.d',
  'DJCUSD.rb', 'DJI30SEPT25.c', 'DJI30SEPT25.d', 'EURAUD.bg', 'EURAUD.d', 'EURCHF.c2', 'EURCHF.d', 'EURGBP.bg',
  'EURGBP.c2', 'EURGBP.d', 'EURJPY.d', 'EURNOK.i', 'EURNZD.bg', 'EURNZD.d', 'EURSEK.i', 'EURUSD.bg', 'EURUSD.c',
  'EURUSD.d', 'EURUSD.j', 'EURUSD.rh', 'GBPAUD.d', 'GBPAUD.j', 'GBPCAD.d', 'GBPCHF.d', 'GBPJPY.c2', 'GBPJPY.d',
  'GBPNZD.j', 'GBPUSD.bg', 'GBPUSD.c', 'GBPUSD.d', 'GBPUSD.j', 'GECEUR', 'GECEUR.d', 'GOLDDEC25.rh', 'GOOG',
  'HOOD', 'INTC.mix', 'MSFT', 'NACUSD.bg', 'NACUSD.d', 'NACUSD.rb', 'NDQ100SEPT25.d', 'NVDA', 'NZDCAD.d',
  'NZDJPY.bg', 'NZDSGD.rh', 'NZDUSD.bg', 'NZDUSD.d', 'SHBUSD', 'SILSEPT25.c', 'SP500SEPT25.c', 'SP500SEPT25.d',
  'SPCUSD.c', 'SPCUSD.d', 'TRXUSD', 'USDCAD.bg', 'USDCAD.d', 'USDCHF.bg', 'USDCHF.c2', 'USDCHF.d', 'USDCNH.bg',
  'USDCNH.i', 'USDJPY.bg', 'USDJPY.d', 'USDSGD.c2', 'USDZAR.bg', 'USOIL', 'XAGUSD.bg', 'XAGUSD.d', 'XAGUSD.rb',
  'XAGUSD.rh', 'XAUUSD#', 'XAUUSD.bg', 'XAUUSD.c2', 'XAUUSD.ft', 'XAUUSD.gm', 'XAUUSD.i', 'XAUUSD.j', 'XAUUSD.k',
  'XAUUSD.mp', 'XAUUSD.s', 'XAUUSD.tdh1', 'XAUUSD.test', 'XPTUSD.c', 'XRPUSD'
];

export const groupedSymbols: { [key: string]: Set<string> } = {};
RAW_SYMBOLS.forEach(sym => {
    const parent = sym.includes('.') ? sym.split('.')[0] : sym;
    if (!groupedSymbols[parent]) {
        groupedSymbols[parent] = new Set();
    }
    groupedSymbols[parent].add(sym);
});

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
