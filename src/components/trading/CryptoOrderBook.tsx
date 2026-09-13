import React, { useState, useEffect, useMemo } from 'react';
import { formatPrice } from '../../lib/market-data';
import { ArrowDown, ArrowUp, Activity, Layers, Radio } from 'lucide-react';

interface OrderBookRow {
  price: number;
  size: number;
  total: number;
  depthPercent: number;
}

interface RecentTrade {
  id: string;
  price: number;
  amount: number;
  time: string;
  side: 'BUY' | 'SELL';
}

interface CryptoOrderBookProps {
  currentPrice: number;
  symbol: string;
  onSelectPrice?: (price: number) => void;
}

export const CryptoOrderBook: React.FC<CryptoOrderBookProps> = ({
  currentPrice,
  symbol,
  onSelectPrice
}) => {
  const [activeTab, setActiveTab] = useState<'orderbook' | 'trades'>('orderbook');
  const [orderBookMode, setOrderBookMode] = useState<'both' | 'asks' | 'bids'>('both');
  const [precision, setPrecision] = useState<number>(0.1);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);

  // Generate dynamic simulated order book based on currentPrice
  const { asks, bids, spread, spreadPercent } = useMemo(() => {
    const askRows: OrderBookRow[] = [];
    const bidRows: OrderBookRow[] = [];
    const numRows = orderBookMode === 'both' ? 7 : 14;

    const tickSize = currentPrice > 1000 ? 0.5 : currentPrice > 10 ? 0.05 : 0.001;
    let runningAskTotal = 0;
    let runningBidTotal = 0;

    // Asks (higher than current price)
    for (let i = numRows; i >= 1; i--) {
      const p = currentPrice + i * tickSize * (1 + (i % 3) * 0.1);
      const size = Number((Math.random() * (currentPrice > 1000 ? 1.5 : 25) + 0.1).toFixed(3));
      runningAskTotal += size;
      askRows.push({
        price: p,
        size,
        total: runningAskTotal,
        depthPercent: 0
      });
    }

    // Bids (lower than current price)
    for (let i = 1; i <= numRows; i++) {
      const p = Math.max(0.0001, currentPrice - i * tickSize * (1 + (i % 3) * 0.1));
      const size = Number((Math.random() * (currentPrice > 1000 ? 1.5 : 25) + 0.1).toFixed(3));
      runningBidTotal += size;
      bidRows.push({
        price: p,
        size,
        total: runningBidTotal,
        depthPercent: 0
      });
    }

    const maxTotal = Math.max(runningAskTotal, runningBidTotal, 1);
    askRows.forEach(r => { r.depthPercent = Math.min(100, (r.total / maxTotal) * 100); });
    bidRows.forEach(r => { r.depthPercent = Math.min(100, (r.total / maxTotal) * 100); });

    const lowestAsk = askRows[askRows.length - 1]?.price || currentPrice;
    const highestBid = bidRows[0]?.price || currentPrice;
    const rawSpread = Math.max(0, lowestAsk - highestBid);
    const pct = currentPrice > 0 ? (rawSpread / currentPrice) * 100 : 0;

    return {
      asks: askRows,
      bids: bidRows,
      spread: rawSpread,
      spreadPercent: pct
    };
  }, [currentPrice, orderBookMode]);

  // Generate continuous live recent market trades stream
  useEffect(() => {
    // Initial trades seed
    const initialTrades: RecentTrade[] = Array.from({ length: 8 }).map((_, i) => {
      const isBuy = Math.random() > 0.48;
      const p = currentPrice * (1 + (Math.random() - 0.5) * 0.002);
      return {
        id: 't-' + (Date.now() - i * 3000),
        price: p,
        amount: Number((Math.random() * (currentPrice > 1000 ? 0.8 : 40) + 0.05).toFixed(3)),
        time: new Date(Date.now() - i * 3000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        side: isBuy ? 'BUY' : 'SELL'
      };
    });
    setRecentTrades(initialTrades);

    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.48;
      const offset = (Math.random() - 0.5) * 0.001;
      const newPrice = currentPrice * (1 + offset);
      const newTrade: RecentTrade = {
        id: 't-' + Date.now(),
        price: newPrice,
        amount: Number((Math.random() * (currentPrice > 1000 ? 0.9 : 50) + 0.05).toFixed(3)),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        side: isBuy ? 'BUY' : 'SELL'
      };

      setRecentTrades(prev => [newTrade, ...prev.slice(0, 15)]);
    }, 2400);

    return () => clearInterval(interval);
  }, [currentPrice]);

  return (
    <div className="rounded-2xl cb-glass-card border border-blue-500/20 flex flex-col h-[520px] overflow-hidden select-none font-mono text-xs">
      {/* Tab bar header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#030712]/50">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('orderbook')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'orderbook'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Order Book
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trades')}
            className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 ${
              activeTab === 'trades'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Market Trades
          </button>
        </div>

        {activeTab === 'orderbook' && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              title="All Orders"
              onClick={() => setOrderBookMode('both')}
              className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${
                orderBookMode === 'both' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="w-3 h-0.5 bg-rose-400"></span>
                <span className="w-3 h-0.5 bg-emerald-400"></span>
              </div>
            </button>
            <button
              type="button"
              title="Bids Only"
              onClick={() => setOrderBookMode('bids')}
              className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${
                orderBookMode === 'bids' ? 'bg-slate-700 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="w-3 h-1 bg-emerald-400"></span>
              </div>
            </button>
            <button
              type="button"
              title="Asks Only"
              onClick={() => setOrderBookMode('asks')}
              className={`w-6 h-6 rounded flex items-center justify-center text-[10px] ${
                orderBookMode === 'asks' ? 'bg-slate-700 text-rose-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="w-3 h-1 bg-rose-400"></span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Content body */}
      {activeTab === 'orderbook' ? (
        <div className="flex-1 flex flex-col p-3 overflow-hidden">
          {/* Table Headers */}
          <div className="grid grid-cols-3 text-[10px] text-slate-400 font-semibold px-2 pb-2 border-b border-white/5">
            <span>Price (USDT)</span>
            <span className="text-right">Size ({symbol.split('/')[0]})</span>
            <span className="text-right">Total</span>
          </div>

          <div className="flex-1 overflow-y-auto cb-scroll flex flex-col justify-between py-1 space-y-1">
            {/* ASKS (SELL ORDERS - RED) */}
            {(orderBookMode === 'both' || orderBookMode === 'asks') && (
              <div className="space-y-0.5">
                {asks.map((row, idx) => (
                  <button
                    key={`ask-${idx}`}
                    type="button"
                    onClick={() => onSelectPrice?.(row.price)}
                    className="relative w-full grid grid-cols-3 text-[11px] py-0.5 px-2 hover:bg-rose-500/10 rounded transition-colors group text-left cursor-pointer"
                  >
                    {/* Depth Bar (Red from right) */}
                    <div
                      className="absolute inset-y-0 right-0 bg-rose-500/15 group-hover:bg-rose-500/25 transition-all pointer-events-none rounded-r"
                      style={{ width: `${row.depthPercent}%` }}
                    />
                    <span className="text-rose-400 font-bold z-10">{formatPrice(row.price)}</span>
                    <span className="text-right text-slate-300 z-10">{row.size.toFixed(3)}</span>
                    <span className="text-right text-slate-400 z-10">{row.total.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}

            {/* SPREAD & CURRENT MARK PRICE DIVIDER */}
            <div className="my-1.5 py-1.5 px-3 rounded-lg bg-slate-900/90 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold text-white flex items-center gap-1">
                  {formatPrice(currentPrice)}
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                </span>
                <span className="text-[10px] text-slate-400">Mark Price</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>Spread:</span>
                <span className="text-blue-400 font-bold">${spread.toFixed(2)} ({spreadPercent.toFixed(3)}%)</span>
              </div>
            </div>

            {/* BIDS (BUY ORDERS - GREEN) */}
            {(orderBookMode === 'both' || orderBookMode === 'bids') && (
              <div className="space-y-0.5">
                {bids.map((row, idx) => (
                  <button
                    key={`bid-${idx}`}
                    type="button"
                    onClick={() => onSelectPrice?.(row.price)}
                    className="relative w-full grid grid-cols-3 text-[11px] py-0.5 px-2 hover:bg-emerald-500/10 rounded transition-colors group text-left cursor-pointer"
                  >
                    {/* Depth Bar (Green from right) */}
                    <div
                      className="absolute inset-y-0 right-0 bg-emerald-500/15 group-hover:bg-emerald-500/25 transition-all pointer-events-none rounded-r"
                      style={{ width: `${row.depthPercent}%` }}
                    />
                    <span className="text-emerald-400 font-bold z-10">{formatPrice(row.price)}</span>
                    <span className="text-right text-slate-300 z-10">{row.size.toFixed(3)}</span>
                    <span className="text-right text-slate-400 z-10">{row.total.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* RECENT MARKET TRADES STREAM */
        <div className="flex-1 flex flex-col p-3 overflow-hidden">
          <div className="grid grid-cols-3 text-[10px] text-slate-400 font-semibold px-2 pb-2 border-b border-white/5">
            <span>Price (USDT)</span>
            <span className="text-right">Amount ({symbol.split('/')[0]})</span>
            <span className="text-right">Time</span>
          </div>

          <div className="flex-1 overflow-y-auto cb-scroll divide-y divide-white/5 py-1">
            {recentTrades.map(trade => {
              const isBuy = trade.side === 'BUY';
              return (
                <div
                  key={trade.id}
                  className="grid grid-cols-3 text-[11px] py-1 px-2 hover:bg-slate-800/40 transition-colors items-center"
                >
                  <span className={`font-bold ${isBuy ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatPrice(trade.price)}
                  </span>
                  <span className="text-right text-slate-200 font-medium">{trade.amount.toFixed(3)}</span>
                  <span className="text-right text-slate-400 text-[10px]">{trade.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer helper note */}
      <div className="px-4 py-2 border-t border-white/5 bg-[#030712]/40 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1 text-slate-400">
          <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
          Live WebSocket Liquidity
        </span>
        <span className="text-slate-400">Click row to set limit price</span>
      </div>
    </div>
  );
};
