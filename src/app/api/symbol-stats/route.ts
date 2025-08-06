import { NextResponse } from 'next/server';
import type { SymbolStat } from '@/lib/types';

export const dynamic = 'force-dynamic';

const symbols = [
  { symbol: 'EURUSD', name: 'Euro / U.S. Dollar', basePrice: 1.08, spread: 0.0001 },
  { symbol: 'USDCAD', name: 'U.S. Dollar / Canadian Dollar', basePrice: 1.37, spread: 0.0002 },
  { symbol: 'USDJPY', name: 'U.S. Dollar / Japanese Yen', basePrice: 157.5, spread: 0.02 },
  { symbol: 'USDCHF', name: 'U.S. Dollar / Swiss Franc', basePrice: 0.90, spread: 0.0002 },
  { symbol: 'AUDUSD', name: 'Australian Dollar / U.S. Dollar', basePrice: 0.66, spread: 0.0002 },
  { symbol: 'GBPUSD', name: 'British Pound / U.S. Dollar', basePrice: 1.27, spread: 0.0002 },
  { symbol: 'BTCUSD', name: 'Bitcoin / U.S. Dollar', basePrice: 68000, spread: 35.5 },
  { symbol: 'ETHUSD', name: 'Ethereum / U.S. Dollar', basePrice: 3500, spread: 1.25 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 120, spread: 0.05 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', basePrice: 180, spread: 0.1 },
  { symbol: 'XAUUSD', name: 'Gold / U.S. Dollar', basePrice: 2300, spread: 0.45 },
  { symbol: 'SPX500', name: 'S&P 500 Index', basePrice: 5350, spread: 0.5 },
];

const generateSymbolData = (symbolInfo: typeof symbols[0]): SymbolStat => {
  const change = (Math.random() - 0.5) * (symbolInfo.basePrice * 0.02);
  const price = symbolInfo.basePrice + change;
  const changePercent = (change / symbolInfo.basePrice) * 100;

  const history = Array.from({ length: 20 }, (_, i) => {
    const historicalChange = (Math.random() - 0.5) * (symbolInfo.basePrice * 0.01);
    return {
      name: `T-${20 - i}`,
      value: symbolInfo.basePrice + historicalChange * (i / 2),
    };
  });

  history.push({ name: 'Now', value: price });

  const buyVolume = Math.random() * 2500000 + 500000;
  const sellVolume = Math.random() * 2500000 + 500000;
  const totalVolume = buyVolume + sellVolume;

  return {
    symbol: symbolInfo.symbol,
    name: symbolInfo.name,
    price: price,
    change: change,
    changePercent: changePercent,
    spread: symbolInfo.spread + (Math.random() - 0.5) * (symbolInfo.spread * 0.1),
    trend: change >= 0 ? 'up' : 'down',
    history: history.slice(-20),
    buyVolume: buyVolume,
    sellVolume: sellVolume,
    buyVolumePercent: (buyVolume / totalVolume) * 100,
    sellVolumePercent: (sellVolume / totalVolume) * 100,
    netVolume: buyVolume - sellVolume,
  };
};

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = symbols.map(generateSymbolData);

  return NextResponse.json(data);
}
