import React, { useState, useEffect } from 'react';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import { TrendingUp, TrendingDown, Flame, Zap, Gauge, Activity, ShieldCheck } from 'lucide-react';

interface CryptoMarketTickerProps {
  onSelectCoin?: (symbol: string) => void;
  selectedSymbol?: string;
}

export const CryptoMarketTicker: React.FC<CryptoMarketTickerProps> = ({
  onSelectCoin,
  selectedSymbol
}) => {
  const [coins, setCoins] = useState(() => INITIAL_COINS);
  const [lastTickSymbol, setLastTickSymbol] = useState<string | null>(null);

  // Micro-fluctuation simulation for live ticker excitement
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * coins.length);
      const targetCoin = coins[randomIndex];
      const deltaPercent = (Math.random() - 0.49) * 0.2; // slight shift
      const deltaPrice = targetCoin.currentPrice * (deltaPercent / 100);
      const newPrice = Math.max(0.0001, targetCoin.currentPrice + deltaPrice);

      setCoins(prev => {
        const updated = [...prev];
        updated[randomIndex] = {
          ...updated[randomIndex],
          currentPrice: newPrice,
          change24h: Number((updated[randomIndex].change24h + deltaPercent * 0.1).toFixed(2))
        };
        return updated;
      });

      setLastTickSymbol(targetCoin.symbol);
      setTimeout(() => setLastTickSymbol(null), 800);
    }, 2200);

    return () => clearInterval(interval);
  }, [coins]);

  return (
    <div className="w-full bg-[#030712]/90 border-b border-blue-900/30 overflow-hidden select-none font-mono text-xs">
      {/* Top row: Macro indices and global crypto market health */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between border-b border-white/5 text-[11px] text-slate-400">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto cb-scroll whitespace-nowrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 cb-pulse-dot" />
            <span className="text-slate-300 font-sans">Market Pulse:</span> Bullish
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-sans">Global 24h Vol:</span>
            <span className="text-white font-bold">$94.82B</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-sans">BTC Dominance:</span>
            <span className="text-blue-400 font-bold">54.8%</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Gauge className="w-3 h-3 text-amber-400" />
            <span className="text-slate-500 font-sans">Fear & Greed:</span>
            <span className="text-amber-300 font-bold">76 (Extreme Greed)</span>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-500 font-sans">Gas:</span>
            <span className="text-cyan-300 font-bold">14 Gwei</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-3 text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <Activity className="w-3 h-3" /> Coinbase Liquid v3 Feed
          </span>
        </div>
      </div>

      {/* Main scrolling market coins ticker */}
      <div className="flex items-center overflow-x-auto cb-scroll py-2 px-4 gap-3">
        {coins.map(coin => {
          const isUp = coin.change24h >= 0;
          const isSelected = selectedSymbol === coin.symbol;
          const isTicking = lastTickSymbol === coin.symbol;

          return (
            <button
              key={coin.symbol}
              type="button"
              onClick={() => onSelectCoin?.(coin.symbol)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all shrink-0 text-left ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500/60 shadow-[0_0_12px_rgba(0,82,255,0.25)]'
                  : 'bg-slate-900/40 hover:bg-slate-800/60 border-white/5 hover:border-blue-500/30'
              } ${isTicking ? (isUp ? 'ring-1 ring-emerald-400/50 bg-emerald-500/10' : 'ring-1 ring-rose-400/50 bg-rose-500/10') : ''}`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-[11px]">{coin.symbol.split('/')[0]}</span>
                  <span className="text-[9px] text-slate-400">/{coin.symbol.split('/')[1]}</span>
                </div>
                <span className={`text-[11px] font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatPrice(coin.currentPrice)}
                </span>
              </div>

              <div className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
              }`}>
                {isUp ? <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> : <TrendingDown className="w-2.5 h-2.5 mr-0.5" />}
                {isUp ? '+' : ''}{coin.change24h}%
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
