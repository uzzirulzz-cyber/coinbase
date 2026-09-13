import React, { useState, useEffect } from 'react';
import { User, AppView, CryptoCoin, CandleData } from '../../types';
import { INITIAL_COINS, generateInitialCandles, tickLatestCandle, formatPrice } from '../../lib/market-data';
import { TradingChart } from './TradingChart';
import { CryptoOrderBook } from './CryptoOrderBook';
import { CryptoTradeConsole } from './CryptoTradeConsole';
import { CryptoSwapWidget } from './CryptoSwapWidget';
import { storage } from '../../lib/storage';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Activity, 
  Layers, 
  ArrowDownUp, 
  ShieldCheck, 
  Maximize2, 
  Sliders, 
  Flame, 
  Zap, 
  ChevronRight,
  History,
  Sparkles
} from 'lucide-react';

interface CryptoProTerminalProps {
  currentUser: User | null;
  onNavigate: (view: AppView) => void;
  selectedSymbol?: string;
}

export const CryptoProTerminal: React.FC<CryptoProTerminalProps> = ({
  currentUser,
  onNavigate,
  selectedSymbol
}) => {
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>(() => {
    if (selectedSymbol) {
      const found = INITIAL_COINS.find(c => c.symbol === selectedSymbol);
      if (found) return found;
    }
    return INITIAL_COINS[0];
  });

  const [candles, setCandles] = useState<CandleData[]>(() => generateInitialCandles(INITIAL_COINS[0].basePrice));
  const [userTrades, setUserTrades] = useState(() => storage.getTrades());
  const [spotOrders, setSpotOrders] = useState(() => storage.getSpotOrders());
  const [activeViewMode, setActiveViewMode] = useState<'terminal' | 'swap'>('terminal');
  const [selectedOrderBookPrice, setSelectedOrderBookPrice] = useState<number | null>(null);
  const [activeLedgerTab, setActiveLedgerTab] = useState<'contracts' | 'spot' | 'history'>('contracts');

  // Sync with selectedSymbol
  useEffect(() => {
    if (selectedSymbol) {
      const found = INITIAL_COINS.find(c => c.symbol === selectedSymbol);
      if (found && found.symbol !== selectedCoin.symbol) {
        setSelectedCoin(found);
      }
    }
  }, [selectedSymbol]);

  // Sync with storage
  useEffect(() => {
    return storage.subscribe(() => {
      setUserTrades(storage.getTrades());
      setSpotOrders(storage.getSpotOrders());
    });
  }, []);

  // Update candles when selected coin changes
  useEffect(() => {
    setCandles(generateInitialCandles(selectedCoin.basePrice));
  }, [selectedCoin.symbol]);

  // Live price tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        const next = tickLatestCandle(prev, selectedCoin.basePrice);
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
  const isUp = selectedCoin.change24h >= 0;

  // Filter user contracts or show platform demo
  const displayTrades = currentUser
    ? userTrades.filter(t => t.userId === currentUser.id)
    : userTrades.slice(0, 6);

  const displaySpotOrders = currentUser
    ? spotOrders.filter(o => o.userId === currentUser.id)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 space-y-4">
      {/* Top Header Bar: Pro Terminal Pairs & Real-Time Stats */}
      <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-4 font-mono text-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Active Symbol & Big Price Display */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Coin selector dropdown/chips */}
            <div className="flex items-center gap-2 overflow-x-auto cb-scroll pb-1 max-w-md">
              {INITIAL_COINS.slice(0, 6).map(c => {
                const isSelected = selectedCoin.symbol === c.symbol;
                return (
                  <button
                    key={c.symbol}
                    type="button"
                    onClick={() => setSelectedCoin(c)}
                    className={`px-3 py-1.5 rounded-xl border font-bold transition-all shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(0,82,255,0.4)]'
                        : 'bg-slate-900/60 text-slate-400 hover:text-white border-white/5 hover:border-slate-700'
                    }`}
                  >
                    {c.symbol.split('/')[0]}
                  </button>
                );
              })}
            </div>

            <div className="h-6 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {formatPrice(currentPrice)}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                isUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
              }`}>
                {isUp ? '+' : ''}{selectedCoin.change24h}%
              </span>
            </div>
          </div>

          {/* Micro Stats (24h High, Low, Volume, Funding Rate) */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto cb-scroll pb-1 text-[11px] text-slate-400">
            <div>
              <span className="text-slate-500 block text-[9px] font-sans">24h High</span>
              <span className="text-white font-bold">{formatPrice(selectedCoin.high24h)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] font-sans">24h Low</span>
              <span className="text-white font-bold">{formatPrice(selectedCoin.low24h)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] font-sans">24h Volume</span>
              <span className="text-white font-bold">{selectedCoin.volume24h}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px] font-sans">Funding / Countdown</span>
              <span className="text-cyan-400 font-bold">0.0100% / 04:12:30</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-slate-500 block text-[9px] font-sans">Engine Status</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 cb-pulse-dot" /> 0.3ms
              </span>
            </div>
          </div>

          {/* View Mode Toggle: Terminal vs Swap */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/5 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setActiveViewMode('terminal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeViewMode === 'terminal'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Pro Terminal
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('swap')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeViewMode === 'swap'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowDownUp className="w-3.5 h-3.5" /> Instant Swap
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Terminal or Swap */}
      {activeViewMode === 'swap' ? (
        <div className="py-6">
          <CryptoSwapWidget
            currentUser={currentUser}
            onRequireAuth={() => onNavigate('login')}
            onRequireDeposit={() => onNavigate('deposit')}
            initialFromSymbol="USDT"
            initialToSymbol={selectedCoin.symbol.split('/')[0]}
            onSwapCompleted={() => {
              // Reload spot orders / balances
            }}
          />
        </div>
      ) : (
        /* PRO CRYPTO FRONTEND TERMINAL GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Column 1: Technical Interactive Candlestick Chart (Span 6 on XL, 7 on LG) */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-4">
            <TradingChart
              candles={candles}
              symbol={selectedCoin.symbol}
              currentPrice={currentPrice}
              currentUser={currentUser}
              onRequireAuth={() => onNavigate('login')}
            />
          </div>

          {/* Column 2: Live Real-Time Order Book & Market Trades (Span 3 on XL, 3 on LG) */}
          <div className="lg:col-span-3 xl:col-span-2">
            <CryptoOrderBook
              currentPrice={currentPrice}
              symbol={selectedCoin.symbol}
              onSelectPrice={(p) => setSelectedOrderBookPrice(p)}
            />
          </div>

          {/* Column 3: Multi-Mode Order Console (Contracts / Spot & Margin) (Span 3 on XL, 3 on LG) */}
          <div className="lg:col-span-3 xl:col-span-3">
            <CryptoTradeConsole
              symbol={selectedCoin.symbol}
              currentPrice={currentPrice}
              currentUser={currentUser}
              onRequireAuth={() => onNavigate('login')}
              onRequireDeposit={() => onNavigate('deposit')}
              selectedOrderBookPrice={selectedOrderBookPrice}
            />
          </div>
        </div>
      )}

      {/* Bottom Positions, Orders & Platform Settlement Feed */}
      <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-5 font-mono text-xs">
        {/* Ledger Tabs Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveLedgerTab('contracts')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeLedgerTab === 'contracts'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Option Contracts ({displayTrades.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveLedgerTab('spot')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                activeLedgerTab === 'spot'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Spot & Margin Orders ({displaySpotOrders.length})
            </button>
          </div>

          {currentUser && (
            <button
              type="button"
              onClick={() => onNavigate('history')}
              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
            >
              Full Account History <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* TAB 1: CONTRACTS */}
        {activeLedgerTab === 'contracts' && (
          displayTrades.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No active contract positions. Place an order above to execute.
            </div>
          ) : (
            <div className="overflow-x-auto cb-scroll">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-[11px]">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Symbol</th>
                    <th className="py-2.5 px-3">Direction</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Entry</th>
                    <th className="py-2.5 px-3">Exit</th>
                    <th className="py-2.5 px-3">Outcome</th>
                    <th className="py-2.5 px-3">Net Profit</th>
                    <th className="py-2.5 px-3">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {displayTrades.map(t => {
                    const isWin = t.result === 'WIN';
                    const isPending = t.status === 'ACTIVE';

                    return (
                      <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-blue-400">{t.id}</td>
                        <td className="py-2.5 px-3 font-bold text-white">{t.symbol}</td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.direction === 'UP' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {t.direction === 'UP' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {t.direction}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">{t.duration}s</td>
                        <td className="py-2.5 px-3 font-bold text-white">${t.amount.toFixed(2)}</td>
                        <td className="py-2.5 px-3">{formatPrice(t.entryPrice)}</td>
                        <td className="py-2.5 px-3">
                          {t.exitPrice ? formatPrice(t.exitPrice) : <span className="text-amber-400">Live...</span>}
                        </td>
                        <td className="py-2.5 px-3">
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
                        <td className="py-2.5 px-3 font-bold">
                          {isPending ? (
                            <span className="text-slate-500">--</span>
                          ) : isWin ? (
                            <span className="text-emerald-400">+${t.profit.toFixed(2)}</span>
                          ) : (
                            <span className="text-rose-400">-${t.amount.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">
                          {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* TAB 2: SPOT & MARGIN ORDERS */}
        {activeLedgerTab === 'spot' && (
          displaySpotOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No spot or margin limit orders placed yet.
            </div>
          ) : (
            <div className="overflow-x-auto cb-scroll">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400 text-[11px]">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Symbol</th>
                    <th className="py-2.5 px-3">Side</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Total Value</th>
                    <th className="py-2.5 px-3">Leverage</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {displaySpotOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-blue-400">{o.id}</td>
                      <td className="py-2.5 px-3 font-bold text-white">{o.symbol}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.side === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {o.side}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{o.type}</td>
                      <td className="py-2.5 px-3">{formatPrice(o.price)}</td>
                      <td className="py-2.5 px-3">{o.amount}</td>
                      <td className="py-2.5 px-3">${o.total.toFixed(2)}</td>
                      <td className="py-2.5 px-3">{o.leverage}x</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.status === 'FILLED' ? 'bg-emerald-500/20 text-emerald-400' :
                          o.status === 'OPEN' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {o.status === 'OPEN' && currentUser && (
                          <button
                            type="button"
                            onClick={() => storage.cancelSpotOrder(o.id, currentUser.id)}
                            className="text-rose-400 hover:text-rose-300 underline text-[11px]"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
};
