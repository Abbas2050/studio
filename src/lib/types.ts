
export interface Account {
  login: number;
  balance: number;
  margin: number;
  marginFree: number;
  marginLevel: number;
  marginLeverage: number;
  profit: number;
  swap: number;
  floatingPnl: number;
  equity: number;
  currency: string;
  credit: number;
}

export interface AccountStats {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  profit: number;
  floatingPnl: number;
  credit: number;
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
  buyVolume: number;
  sellVolume: number;
  buyVolumePercent: number;
  sellVolumePercent: number;
  netVolume: number;
  isGroup: boolean;
}

export interface Position {
  login: number;
  symbol: string;
  action: number; // 0 for Buy, 1 for Sell
  volume: number;
  openPrice: number;
  openTime: string;
  profit: number;
  swap: number;
  commission: number;
}
