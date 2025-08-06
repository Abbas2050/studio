export interface Account {
  login: number;
  balance: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  leverage: number;
  profit: number;
  swap: number;
  floatingPnl: number;
  equity: number;
}

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
  buyVolume: number;
  sellVolume: number;
  netVolume: number;
}

export type Trade = {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  volume: number;
  price: number;
  time: string;
};
