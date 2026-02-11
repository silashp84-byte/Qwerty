
export interface TradingSignal {
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  confidence: number;
  price: string;
  reasoning: string;
  indicators: {
    rsi: number;
    macd: string;
    trend: string;
  };
  timestamp: string;
}

export interface MarketData {
  time: string;
  price: number;
}

export enum MarketType {
  CRYPTO = 'Crypto',
  FOREX = 'Forex',
  STOCKS = 'Stocks'
}
