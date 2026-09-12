import React, { useState, useEffect } from 'react';
import { User, AppView, CryptoCoin, CandleData } from '../../types';
import { INITIAL_COINS, generateInitialCandles, tickLatestCandle, formatPrice } from '../../lib/market-data';
import { TradingChart } from '../trading/TradingChart';
import { TradeExecutionPanel } from '../trading/TradeExecutionPanel';
import { storage } from '../../lib/storage';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  History, 
  Layers, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface TradeViewProps {
  currentUser: User | null;
  onNavigate: (view: AppView) => void;
  selectedSymbol?: string;
}

export const TradeView: React.FC<TradeViewProps> = ({ currentUser, onNavigate, selectedSymbol }) => {
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>(() => {
    if (selectedSymbol) {
      const found = INITIAL_COINS.find(c => c.symbol === selectedSymbol);
      if (found) return found;
    }
    return INITIAL_COINS[0];
  });

  useEffect(() => {
    if (selectedSymbol) {
      const found = INITIAL_COINS.find(c => c.symbol === selectedSymbol);
      if (found && found.symbol !== selectedCoin.symbol) {
        setSelectedCoin(found);
      }
    }
  }, [selectedSymbol]);
  const [candles, setCandles] = useState<CandleData[]>(() => generateInitialCandles(INITIAL_COINS[0].basePrice));
  const [userTrades, setUserTrades] = useState(() => storage.getTrades());

  // Listen to storage changes
  useEffect(() => {
    return storage.subscribe(() => {
      setUserTrades(storage.getTrades());
    });
  }, []);

  // When selected coin changes, re-generate candle history
  useEffect(() => {
    setCandles(generateInitialCandles(selectedCoin.basePrice));
  }, [selectedCoin.symbol]);

  // Live tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        const next = tickLatestCandle(prev, selectedCoin.basePrice);
        // Update selected coin's currentPrice
        const latestClose = next[next.length - 1]?.close;
        if (latestClose) {
          setSelectedCoin(sc => ({
            ...sc,
            currentPrice: latestClose
          }));
        }
        return next;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [selectedCoin.basePrice]);

  const currentPrice = candles[candles.length - 1]?.close || selectedCoin.basePrice;

  // Filter trades for the current user or show recent demo trades
  const displayTrades = currentUser
    ? userTrades.filter(t => t.userId === currentUser.id)
    : userTrades.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Coin Selector Carousel Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 cb-scroll">
        {INITIAL_COINS.map(coin => {
          const isSelected = selectedCoin.symbol === coin.symbol;
          const isPositive = coin.change24h >= 0;
          return (
            <button
              key={coin.symbol}
              onClick={() => setSelectedCoin(coin)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all shrink-0 ${
                isSelected
                  ? 'cb-blue-gradient border-blue-400 text-white shadow-[0_0_16px_rgba(0,82,255,0.4)]'
                  : 'cb-glass border-white/5 text-slate-300 hover:border-blue-500/30 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex flex-col text-left">
                <span className="font-bold text-xs font-mono tracking-tight">{coin.symbol}</span>
                <span className={`text-[11px] font-mono font-medium ${
                  isSelected ? 'text-blue-100' : isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {formatPrice(coin.currentPrice)}
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isSelected ? 'bg-white/20 text-white' : isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {isPositive ? '+' : ''}{coin.change24h}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Trading Terminal: Chart & Order Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Interactive Technical Chart (Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <TradingChart
            candles={candles}
            symbol={selectedCoin.symbol}
            currentPrice={currentPrice}
            currentUser={currentUser}
            onRequireAuth={() => onNavigate('login')}
          />
        </div>

        {/* Right Column: Fast Execution Panel */}
        <div className="lg:col-span-1 space-y-4">
          <TradeExecutionPanel
            symbol={selectedCoin.symbol}
            currentPrice={currentPrice}
            currentUser={currentUser}
            onRequireAuth={() => onNavigate('login')}
            onRequireDeposit={() => onNavigate('deposit')}
          />
        </div>
      </div>

      {/* Bottom Section: Order Logs & Platform Settlement Feed */}
      <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-5">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {currentUser ? 'My Trading History' : 'Live Platform Trade Settlement Stream'}
            </h3>
          </div>
          {currentUser && (
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono"
            >
              View Full History <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {displayTrades.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No trades executed yet. Select contract direction above to place your first trade.
          </div>
        ) : (
          <div className="overflow-x-auto cb-scroll">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="py-2.5 px-3">Trade ID</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Direction</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Entry</th>
                  <th className="py-2.5 px-3">Exit</th>
                  <th className="py-2.5 px-3">Outcome</th>
                  <th className="py-2.5 px-3">Profit / Loss</th>
                  <th className="py-2.5 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {displayTrades.map(t => {
                  const isUp = t.direction === 'UP';
                  const isWin = t.result === 'WIN';
                  const isPending = t.status === 'ACTIVE';

                  return (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-semibold text-blue-400">{t.id}</td>
                      <td className="py-3 px-3 font-bold text-white">{t.symbol}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {t.direction}
                        </span>
                      </td>
                      <td className="py-3 px-3">{t.duration}s</td>
                      <td className="py-3 px-3 font-bold text-white">${t.amount.toFixed(2)}</td>
                      <td className="py-3 px-3 text-slate-300">{formatPrice(t.entryPrice)}</td>
                      <td className="py-3 px-3 text-slate-300">
                        {t.exitPrice ? formatPrice(t.exitPrice) : <span className="text-amber-400">Trading...</span>}
                      </td>
                      <td className="py-3 px-3">
                        {isPending ? (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold animate-pulse">
                            ACTIVE
                          </span>
                        ) : isWin ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                            WIN
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                            LOSE
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold">
                        {isPending ? (
                          <span className="text-slate-500">--</span>
                        ) : isWin ? (
                          <span className="text-emerald-400">+${t.profit.toFixed(2)}</span>
                        ) : (
                          <span className="text-rose-400">-${t.amount.toFixed(2)}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
