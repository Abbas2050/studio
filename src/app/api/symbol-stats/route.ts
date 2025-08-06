import { NextResponse } from 'next/server';
import type { SymbolStat } from '@/lib/types';

export const dynamic = 'force-dynamic';

const symbols = [
  { symbol: 'BTCUSD', name: 'Bitcoin / U.S. Dollar', basePrice: 68000, spread: 35.5 },
  { symbol: 'ETHUSD', name: 'Ethereum / U.S. Dollar', basePrice: 3500, spread: 1.25 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', basePrice: 120, spread: 0.05 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', basePrice: 180, spread: 0.1 },
  { symbol: 'EURUSD', name: 'Euro / U.S. Dollar', basePrice: 1.08, spread: 0.0001 },
  { symbol: 'GBPUSD', name: 'British Pound / U.S. Dollar', basePrice: 1.27, spread: 0.0002 },
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
      value: symbolInfo.basePrice + historicalChange * (i/2),
    };
  });
  
  history.push({ name: 'Now', value: price });

  return {
    symbol: symbolInfo.symbol,
    name: symbolInfo.name,
    price: price,
    change: change,
    changePercent: changePercent,
    spread: symbolInfo.spread + (Math.random() - 0.5) * (symbolInfo.spread * 0.1),
    trend: change >= 0 ? 'up' : 'down',
    history: history.slice(-20),
  };
};

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = symbols.map(generateSymbolData);

  return NextResponse.json(data);
}
