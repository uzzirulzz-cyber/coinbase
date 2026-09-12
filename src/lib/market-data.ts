import { CryptoCoin, CandleData } from '../types';

export const INITIAL_COINS: CryptoCoin[] = [
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    basePrice: 87450.00,
    currentPrice: 87450.00,
    change24h: 3.42,
    high24h: 88920.00,
    low24h: 85800.00,
    volume24h: '$34.8B',
    category: 'Layer 1',
    sparkline: [85800, 86200, 86900, 86400, 87100, 87800, 87450],
    active: true,
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    basePrice: 2680.50,
    currentPrice: 2680.50,
    change24h: 2.15,
    high24h: 2740.00,
    low24h: 2610.00,
    volume24h: '$18.2B',
    category: 'Layer 1',
    sparkline: [2610, 2635, 2670, 2650, 2690, 2715, 2680.5],
    active: true,
  },
  {
    symbol: 'SOL/USDT',
    name: 'Solana',
    basePrice: 194.80,
    currentPrice: 194.80,
    change24h: 6.84,
    high24h: 199.50,
    low24h: 181.20,
    volume24h: '$6.5B',
    category: 'Layer 1',
    sparkline: [181.2, 185.0, 189.4, 186.2, 192.5, 197.8, 194.8],
    active: true,
  },
  {
    symbol: 'BNB/USDT',
    name: 'Binance Coin',
    basePrice: 624.10,
    currentPrice: 624.10,
    change24h: 1.45,
    high24h: 635.00,
    low24h: 615.50,
    volume24h: '$1.4B',
    category: 'Popular',
    sparkline: [616, 619, 622, 620, 627, 626, 624.1],
    active: true,
  },
  {
    symbol: 'XRP/USDT',
    name: 'Ripple',
    basePrice: 2.38,
    currentPrice: 2.38,
    change24h: -1.82,
    high24h: 2.48,
    low24h: 2.29,
    volume24h: '$4.1B',
    category: 'Popular',
    sparkline: [2.44, 2.46, 2.42, 2.39, 2.35, 2.36, 2.38],
    active: true,
  },
  {
    symbol: 'DOGE/USDT',
    name: 'Dogecoin',
    basePrice: 0.264,
    currentPrice: 0.264,
    change24h: 8.92,
    high24h: 0.282,
    low24h: 0.238,
    volume24h: '$2.9B',
    category: 'Popular',
    sparkline: [0.238, 0.245, 0.252, 0.248, 0.269, 0.275, 0.264],
    active: true,
  },
  {
    symbol: 'AVAX/USDT',
    name: 'Avalanche',
    basePrice: 32.75,
    currentPrice: 32.75,
    change24h: 4.12,
    high24h: 33.90,
    low24h: 31.20,
    volume24h: '$840M',
    category: 'Layer 1',
    sparkline: [31.2, 31.8, 32.5, 32.1, 33.2, 33.6, 32.75],
    active: true,
  },
  {
    symbol: 'LINK/USDT',
    name: 'Chainlink',
    basePrice: 18.60,
    currentPrice: 18.60,
    change24h: 5.30,
    high24h: 19.15,
    low24h: 17.50,
    volume24h: '$610M',
    category: 'DeFi',
    sparkline: [17.5, 17.8, 18.2, 18.0, 18.9, 19.0, 18.6],
    active: true,
  },
  {
    symbol: 'SUI/USDT',
    name: 'Sui Network',
    basePrice: 3.12,
    currentPrice: 3.12,
    change24h: 7.45,
    high24h: 3.28,
    low24h: 2.88,
    volume24h: '$980M',
    category: 'Layer 1',
    sparkline: [2.88, 2.95, 3.04, 3.01, 3.19, 3.25, 3.12],
    active: true,
  },
  {
    symbol: 'NEAR/USDT',
    name: 'NEAR Protocol',
    basePrice: 5.45,
    currentPrice: 5.45,
    change24h: -0.95,
    high24h: 5.68,
    low24h: 5.32,
    volume24h: '$430M',
    category: 'Layer 1',
    sparkline: [5.52, 5.60, 5.55, 5.48, 5.41, 5.43, 5.45],
    active: true,
  }
];

export function formatPrice(val: number): string {
  if (val >= 1000) {
    return '$' + val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (val >= 1) {
    return '$' + val.toFixed(2);
  } else {
    return '$' + val.toFixed(4);
  }
}

export function generateInitialCandles(basePrice: number, count = 40): CandleData[] {
  const candles: CandleData[] = [];
  const now = Date.now();
  const intervalMs = 60 * 1000; // 1-minute intervals
  let currentClose = basePrice * 0.985;

  for (let i = count; i >= 0; i--) {
    const timestamp = now - i * intervalMs;
    const dateObj = new Date(timestamp);
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Generate natural random walk
    const volatility = basePrice * 0.003;
    const delta = (Math.random() - 0.485) * volatility;
    const open = currentClose;
    const close = Math.max(open * 0.8, open + delta);
    const high = Math.max(open, close) + Math.random() * volatility * 0.8;
    const low = Math.min(open, close) - Math.random() * volatility * 0.8;
    const volume = Math.floor(Math.random() * 80 + 20);

    candles.push({
      time: timeStr,
      timestamp,
      open,
      high,
      low,
      close,
      volume,
    });

    currentClose = close;
  }

  return calculateIndicators(candles);
}

export function calculateIndicators(candles: CandleData[]): CandleData[] {
  const period = 14;
  const emaPeriod = 9;
  const emaK = 2 / (emaPeriod + 1);

  // Compute Support and Resistance from the window
  let minLow = Infinity;
  let maxHigh = -Infinity;
  candles.forEach(c => {
    if (c.low < minLow) minLow = c.low;
    if (c.high > maxHigh) maxHigh = c.high;
  });

  const supportLevel = minLow * 1.0015;
  const resistanceLevel = maxHigh * 0.9985;

  let currentEma = candles[0]?.close || 0;

  return candles.map((candle, idx) => {
    // SMA & Bollinger Bands
    const startIdx = Math.max(0, idx - period + 1);
    const window = candles.slice(startIdx, idx + 1);
    const sma = window.reduce((sum, c) => sum + c.close, 0) / window.length;

    // Standard deviation
    const variance = window.reduce((sum, c) => sum + Math.pow(c.close - sma, 2), 0) / window.length;
    const stdDev = Math.sqrt(variance);

    // EMA
    currentEma = candle.close * emaK + currentEma * (1 - emaK);

    return {
      ...candle,
      sma: Number(sma.toFixed(2)),
      upperBand: Number((sma + stdDev * 2).toFixed(2)),
      lowerBand: Number((sma - stdDev * 2).toFixed(2)),
      ema: Number(currentEma.toFixed(2)),
      support: Number(supportLevel.toFixed(2)),
      resistance: Number(resistanceLevel.toFixed(2)),
    };
  });
}

export function tickLatestCandle(candles: CandleData[], basePrice: number): CandleData[] {
  if (candles.length === 0) return candles;
  const updated = [...candles];
  const lastIndex = updated.length - 1;
  const last = { ...updated[lastIndex] };

  // Nudge the close
  const tickDelta = (Math.random() - 0.49) * (basePrice * 0.0008);
  last.close = Number((last.close + tickDelta).toFixed(2));
  if (last.close > last.high) last.high = last.close;
  if (last.close < last.low) last.low = last.close;
  last.volume += Math.floor(Math.random() * 3 + 1);

  updated[lastIndex] = last;
  return calculateIndicators(updated);
}
