export interface AccountStats {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
}

export interface SymbolStat {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  spread: number;
  trend: 'up' | 'down';
  history: {
    name: string;
    value: number;
  }[];
}
