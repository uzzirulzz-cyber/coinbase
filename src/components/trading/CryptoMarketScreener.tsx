import React, { useState, useMemo } from 'react';
import { CryptoCoin, AppView, User } from '../../types';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import { storage } from '../../lib/storage';
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownUp, 
  Flame, 
  Layers, 
  Activity,
  BarChart3,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface CryptoMarketScreenerProps {
  onSelectCoinForTrade?: (symbol: string) => void;
  onNavigate: (view: AppView) => void;
  currentUser: User | null;
  onOpenSwap?: (symbol: string) => void;
}

export const CryptoMarketScreener: React.FC<CryptoMarketScreenerProps> = ({
  onSelectCoinForTrade,
  onNavigate,
  currentUser,
  onOpenSwap
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [watchlist, setWatchlist] = useState<string[]>(() => storage.getWatchlist());
  const [sortBy, setSortBy] = useState<'volume' | 'gainers' | 'losers' | 'price'>('volume');

  const categories = ['All', 'Hot 🔥', 'Layer 1', 'DeFi', 'AI Coins', 'Memes', 'Watchlist'];

  // Toggle watchlist
  const handleToggleWatchlist = (symbol: string) => {
    const next = storage.toggleWatchlist(symbol);
    setWatchlist(next);
  };

  // Filter & sort coins
  const filteredCoins = useMemo(() => {
    let list = [...INITIAL_COINS];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q));
    }

    if (selectedCategory === 'Watchlist') {
      list = list.filter(c => watchlist.includes(c.symbol));
    } else if (selectedCategory === 'Hot 🔥') {
      list = list.filter(c => Math.abs(c.change24h) > 3);
    } else if (selectedCategory !== 'All') {
      list = list.filter(c => c.category === selectedCategory);
    }

    if (sortBy === 'gainers') {
      list.sort((a, b) => b.change24h - a.change24h);
    } else if (sortBy === 'losers') {
      list.sort((a, b) => a.change24h - b.change24h);
    } else if (sortBy === 'price') {
      list.sort((a, b) => b.currentPrice - a.currentPrice);
    }

    return list;
  }, [search, selectedCategory, watchlist, sortBy]);

  // Mini Sparkline SVG
  const renderSparkline = (points: number[], isUp: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 100;
    const height = 32;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    });

    const strokeColor = isUp ? '#10b981' : '#f43f5e';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords.join(' ')}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Screener Banner & Market Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">🔥 24h Top Gainer</div>
            <div className="text-base font-bold text-white mt-1">DOGE/USDT</div>
            <div className="text-xs text-emerald-400 font-bold mt-0.5">+8.92%</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">💧 Highest 24h Volume</div>
            <div className="text-base font-bold text-white mt-1">Bitcoin (BTC)</div>
            <div className="text-xs text-blue-400 font-bold mt-0.5">$34.8 Billion</div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">⚡ New Layer 1 Performer</div>
            <div className="text-base font-bold text-white mt-1">Solana (SOL)</div>
            <div className="text-xs text-emerald-400 font-bold mt-0.5">$194.80 (+6.84%)</div>
          </div>
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">🛡️ Institutional Liquidity</div>
            <div className="text-base font-bold text-white mt-1">Coinbase Prime v3</div>
            <div className="text-xs text-emerald-400 font-bold mt-0.5">100% Guaranteed Reserve</div>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Category Controls */}
      <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-5 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto cb-scroll pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(0,82,255,0.4)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar & Sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search coin, symbol, ticker..."
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="volume">Sort by Volume</option>
              <option value="gainers">Top Gainers</option>
              <option value="losers">Top Losers</option>
              <option value="price">Highest Price</option>
            </select>
          </div>
        </div>

        {/* Screener Table */}
        <div className="overflow-x-auto cb-scroll">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-[11px]">
                <th className="py-3 px-3 w-10"></th>
                <th className="py-3 px-3">Asset</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">24h Change</th>
                <th className="py-3 px-3 hidden md:table-cell">24h Range (Low / High)</th>
                <th className="py-3 px-3 hidden lg:table-cell">24h Volume</th>
                <th className="py-3 px-3 hidden sm:table-cell text-center">Last 7 Days</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCoins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No cryptocurrency matches found.
                  </td>
                </tr>
              ) : (
                filteredCoins.map(coin => {
                  const isUp = coin.change24h >= 0;
                  const isFavorited = watchlist.includes(coin.symbol);
                  const priceRange = coin.high24h - coin.low24h || 1;
                  const currentPercent = Math.min(100, Math.max(0, ((coin.currentPrice - coin.low24h) / priceRange) * 100));

                  return (
                    <tr key={coin.symbol} className="hover:bg-slate-800/40 transition-colors group">
                      {/* Star Favorite */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => handleToggleWatchlist(coin.symbol)}
                          className="text-slate-500 hover:text-amber-400 transition-colors"
                        >
                          <Star className={`w-4 h-4 ${isFavorited ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </td>

                      {/* Coin Name & Symbol */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-400">
                            {coin.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {coin.name}
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-white/5">
                                {coin.category}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-3 font-bold text-white text-sm">
                        {formatPrice(coin.currentPrice)}
                      </td>

                      {/* 24h Change */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          isUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                        }`}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {isUp ? '+' : ''}{coin.change24h}%
                        </span>
                      </td>

                      {/* 24h High/Low Progress Range */}
                      <td className="py-3 px-3 hidden md:table-cell">
                        <div className="w-36 space-y-1">
                          <div className="flex justify-between text-[9px] text-slate-500">
                            <span>{formatPrice(coin.low24h)}</span>
                            <span>{formatPrice(coin.high24h)}</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: `${currentPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Volume */}
                      <td className="py-3 px-3 hidden lg:table-cell text-slate-300">
                        {coin.volume24h}
                      </td>

                      {/* 7-Day Sparkline */}
                      <td className="py-3 px-3 hidden sm:table-cell text-center">
                        <div className="flex justify-center">
                          {renderSparkline(coin.sparkline, isUp)}
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenSwap?.(coin.symbol.split('/')[0])}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition-colors flex items-center gap-1"
                            title="Instant Swap"
                          >
                            <ArrowDownUp className="w-3 h-3 text-cyan-400" />
                            Swap
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectCoinForTrade?.(coin.symbol)}
                            className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-[0_0_12px_rgba(0,82,255,0.3)] transition-all flex items-center gap-1"
                          >
                            Trade <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
