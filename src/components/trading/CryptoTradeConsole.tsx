import React, { useState, useEffect } from 'react';
import { User, Trade, TradeDirection, TradeDuration, OrderType, OrderSide, SpotOrder } from '../../types';
import { storage } from '../../lib/storage';
import { formatPrice } from '../../lib/market-data';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Timer, 
  Lock, 
  Sliders, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CryptoTradeConsoleProps {
  symbol: string;
  currentPrice: number;
  currentUser: User | null;
  onRequireAuth: () => void;
  onRequireDeposit: () => void;
  selectedOrderBookPrice?: number | null;
}

export const CryptoTradeConsole: React.FC<CryptoTradeConsoleProps> = ({
  symbol,
  currentPrice,
  currentUser,
  onRequireAuth,
  onRequireDeposit,
  selectedOrderBookPrice
}) => {
  const [consoleTab, setConsoleTab] = useState<'contracts' | 'spot'>('contracts');

  // Binary options state
  const [direction, setDirection] = useState<TradeDirection>('UP');
  const [duration, setDuration] = useState<TradeDuration>(60);
  const [contractAmount, setContractAmount] = useState<number>(100);
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [contractError, setContractError] = useState<string | null>(null);
  const [settledResult, setSettledResult] = useState<{ isWin: boolean; profit: number; exitPrice: number } | null>(null);

  // Spot / Margin trading state
  const [spotSide, setSpotSide] = useState<OrderSide>('BUY');
  const [spotType, setSpotType] = useState<OrderType>('MARKET');
  const [spotPrice, setSpotPrice] = useState<string>(currentPrice.toString());
  const [spotAmount, setSpotAmount] = useState<string>('0.05');
  const [spotLeverage, setSpotLeverage] = useState<number>(10);
  const [spotTP, setSpotTP] = useState<string>('');
  const [spotSL, setSpotSL] = useState<string>('');
  const [spotError, setSpotError] = useState<string | null>(null);
  const [spotSuccess, setSpotSuccess] = useState<string | null>(null);

  // When orderbook price is clicked, fill spotPrice
  useEffect(() => {
    if (selectedOrderBookPrice) {
      setSpotPrice(selectedOrderBookPrice.toString());
      setSpotType('LIMIT');
      setConsoleTab('spot');
    }
  }, [selectedOrderBookPrice]);

  // Keep market price updated for spot if MARKET order
  useEffect(() => {
    if (spotType === 'MARKET') {
      setSpotPrice(currentPrice.toString());
    }
  }, [currentPrice, spotType]);

  const payoutRates: Record<TradeDuration, number> = {
    30: 0.80,
    60: 0.85,
    120: 0.90
  };

  const payoutRate = payoutRates[duration];
  const potentialProfit = contractAmount * payoutRate;
  const potentialReturn = contractAmount + potentialProfit;

  // Sound generator
  const playSound = (freq1: number, freq2: number, type: OscillatorType = 'sine') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq1, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq2, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Ignore
    }
  };

  // Active contract countdown
  useEffect(() => {
    if (!activeTrade) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((activeTrade.expiresAt - now) / 1000));
      setRemainingTime(diff);

      if (diff <= 0) {
        clearInterval(interval);
        const settled = storage.settleTrade(activeTrade.id, currentPrice);
        if (settled) {
          const isWin = settled.result === 'WIN';
          setSettledResult({
            isWin,
            profit: settled.profit,
            exitPrice: settled.exitPrice || currentPrice,
          });

          if (isWin) {
            playSound(523.25, 1046.5);
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 }
            });
          } else {
            playSound(300, 150, 'sawtooth');
          }
        }
        setActiveTrade(null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeTrade, currentPrice]);

  // Execute Binary Contract
  const handleExecuteContract = () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (currentUser.balance < contractAmount) {
      setContractError('Insufficient balance. Please deposit funds to trade.');
      return;
    }

    setContractError(null);
    setSettledResult(null);
    playSound(440, 880);

    const res = storage.executeTrade({
      userId: currentUser.id,
      symbol,
      direction,
      duration,
      amount: contractAmount,
      currentPrice
    });

    if (res.success && res.trade) {
      setActiveTrade(res.trade);
      setRemainingTime(duration);
    } else {
      setContractError(res.error || 'Failed to place trade.');
    }
  };

  // Execute Spot Order
  const handleExecuteSpotOrder = () => {
    setSpotError(null);
    setSpotSuccess(null);

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    const priceNum = parseFloat(spotPrice) || currentPrice;
    const amountNum = parseFloat(spotAmount);

    if (!amountNum || amountNum <= 0) {
      setSpotError('Please enter a valid amount.');
      return;
    }

    const totalVal = priceNum * amountNum;
    const reqMargin = totalVal / spotLeverage;

    if (currentUser.balance < reqMargin) {
      setSpotError(`Insufficient balance. Required margin: $${reqMargin.toFixed(2)} USDT.`);
      return;
    }

    playSound(600, 900);

    const res = storage.createSpotOrder({
      userId: currentUser.id,
      symbol,
      side: spotSide,
      type: spotType,
      price: priceNum,
      amount: amountNum,
      total: totalVal,
      leverage: spotLeverage,
      takeProfit: spotTP ? parseFloat(spotTP) : undefined,
      stopLoss: spotSL ? parseFloat(spotSL) : undefined,
    });

    if (res.success) {
      setSpotSuccess(`${spotSide} ${amountNum} ${symbol} order successfully placed!`);
      setTimeout(() => setSpotSuccess(null), 4000);
    } else {
      setSpotError(res.error || 'Failed to place order.');
    }
  };

  const parsedSpotPrice = parseFloat(spotPrice) || currentPrice;
  const parsedSpotAmount = parseFloat(spotAmount) || 0;
  const calculatedTotal = parsedSpotPrice * parsedSpotAmount;
  const calculatedMargin = calculatedTotal / (spotLeverage || 1);

  return (
    <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-5 flex flex-col justify-between select-none">
      <div>
        {/* Top Header Mode Tabs */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#030712]/60 border border-white/5">
            <button
              type="button"
              onClick={() => setConsoleTab('contracts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                consoleTab === 'contracts'
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(0,82,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              ⚡ Fast Options (30s-120s)
            </button>
            <button
              type="button"
              onClick={() => setConsoleTab('spot')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                consoleTab === 'spot'
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(0,82,255,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              📊 Spot & Margin (100x)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Direct Execution
          </div>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: FAST CONTRACT OPTIONS                             */}
        {/* ======================================================== */}
        {consoleTab === 'contracts' && (
          <div className="space-y-4 font-mono">
            {/* Direction UP/DOWN Buttons */}
            <div>
              <label className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Contract Direction
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDirection('UP')}
                  className={`py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    direction === 'UP'
                      ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  BUY / CALL (UP)
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('DOWN')}
                  className={`py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    direction === 'DOWN'
                      ? 'bg-rose-600/30 border-rose-500 text-rose-300 shadow-[0_0_16px_rgba(244,63,94,0.3)] ring-1 ring-rose-400'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-rose-500/40 hover:text-rose-400'
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  SELL / PUT (DOWN)
                </button>
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                  Expiration Duration
                </label>
                <span className="text-xs text-blue-400 font-bold">
                  Yield: {(payoutRate * 100).toFixed(0)}% Profit
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([30, 60, 120] as TradeDuration[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                      duration === d
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                        : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-blue-500/30 hover:text-white'
                    }`}
                  >
                    <span>{d} Seconds</span>
                    <span className="text-[10px] text-blue-200 font-normal">
                      +{(payoutRates[d] * 100).toFixed(0)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Contract Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-sans font-bold text-slate-400 uppercase tracking-wider">
                  Investment Amount (USDT)
                </label>
                <div className="text-xs text-slate-400 font-mono">
                  Wallet: <span className="text-white font-bold">${currentUser ? currentUser.balance.toFixed(2) : '0.00'}</span>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  step="10"
                  value={contractAmount}
                  onChange={(e) => setContractAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono font-bold text-base focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Quick Amounts */}
              <div className="grid grid-cols-6 gap-1.5 mt-2">
                {[10, 25, 50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setContractAmount(amt)}
                    className={`py-1 rounded text-center text-[11px] font-bold border transition-colors ${
                      contractAmount === amt
                        ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                        : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Potential Payout Summary */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Entry Price</span>
                <span className="text-white font-bold">{formatPrice(currentPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Est. Net Profit</span>
                <span className="text-emerald-400 font-bold">+${potentialProfit.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 border-t border-white/5 pt-1.5">
                <span>Total Expected Return</span>
                <span className="text-white font-bold">${potentialReturn.toFixed(2)}</span>
              </div>
            </div>

            {/* Error Banner */}
            {contractError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
                <span>{contractError}</span>
                {contractError.includes('deposit') && (
                  <button
                    type="button"
                    onClick={onRequireDeposit}
                    className="underline text-blue-400 hover:text-blue-300 font-bold ml-2 whitespace-nowrap"
                  >
                    Deposit Now
                  </button>
                )}
              </div>
            )}

            {/* Settled Result Banner */}
            {settledResult && (
              <div className={`p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${
                settledResult.isWin
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {settledResult.isWin ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
                <div className="text-xs">
                  <div className="font-bold">
                    {settledResult.isWin ? 'Trade Settled - Profit Won!' : 'Trade Settled - Out of Money'}
                  </div>
                  <div>
                    Exit Price: {formatPrice(settledResult.exitPrice)} | Outcome: {settledResult.isWin ? `+$${settledResult.profit.toFixed(2)}` : `-$${contractAmount.toFixed(2)}`}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button / Active Countdown */}
            {activeTrade ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-bold">
                  <Timer className="w-4 h-4 animate-spin" />
                  CONTRACT IN PROGRESS: {remainingTime}s REMAINING
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all duration-500"
                    style={{ width: `${(remainingTime / duration) * 100}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  Entry: {formatPrice(activeTrade.entryPrice)} | Current: {formatPrice(currentPrice)}
                </div>
              </div>
            ) : !currentUser ? (
              <button
                type="button"
                onClick={onRequireAuth}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white cb-blue-gradient cb-blue-gradient-hover shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4" /> Sign In to Trade
              </button>
            ) : (
              <button
                type="button"
                onClick={handleExecuteContract}
                className={`w-full py-4 rounded-xl font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2 transition-all ${
                  direction === 'UP'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                }`}
              >
                {direction === 'UP' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                EXECUTE {duration}s {direction} CONTRACT (${contractAmount})
              </button>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SPOT & MARGIN TRADING                             */}
        {/* ======================================================== */}
        {consoleTab === 'spot' && (
          <div className="space-y-4 font-mono text-xs">
            {/* BUY / SELL Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSpotSide('BUY')}
                className={`py-2.5 rounded-xl font-bold transition-all text-center ${
                  spotSide === 'BUY'
                    ? 'bg-emerald-600 text-white shadow-[0_0_16px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                BUY / LONG
              </button>
              <button
                type="button"
                onClick={() => setSpotSide('SELL')}
                className={`py-2.5 rounded-xl font-bold transition-all text-center ${
                  spotSide === 'SELL'
                    ? 'bg-rose-600 text-white shadow-[0_0_16px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                SELL / SHORT
              </button>
            </div>

            {/* Order Type Buttons */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-white/5">
              {(['MARKET', 'LIMIT', 'STOP_LIMIT'] as OrderType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSpotType(t)}
                  className={`flex-1 py-1 rounded text-center text-[10px] font-bold transition-colors ${
                    spotType === t
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Price Field */}
            <div>
              <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                <span>Order Price (USDT)</span>
                {spotType === 'MARKET' && (
                  <span className="text-emerald-400 font-bold">Best Market Execution</span>
                )}
              </div>
              <input
                type="number"
                step="any"
                disabled={spotType === 'MARKET'}
                value={spotPrice}
                onChange={(e) => setSpotPrice(e.target.value)}
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-blue-500 disabled:opacity-60"
              />
            </div>

            {/* Amount Field */}
            <div>
              <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                <span>Quantity ({symbol.split('/')[0]})</span>
                <span className="text-white">
                  Wallet: ${currentUser ? currentUser.balance.toFixed(2) : '0.00'}
                </span>
              </div>
              <input
                type="number"
                step="any"
                value={spotAmount}
                onChange={(e) => setSpotAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Leverage Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                <span>Leverage Multiplier</span>
                <span className="text-blue-400 font-bold">{spotLeverage}x</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 5, 10, 25, 50, 100].map((lev) => (
                  <button
                    key={lev}
                    type="button"
                    onClick={() => setSpotLeverage(lev)}
                    className={`flex-1 py-1 rounded text-center text-[10px] font-bold border transition-colors ${
                      spotLeverage === lev
                        ? 'bg-blue-600/40 border-blue-400 text-blue-300'
                        : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lev}x
                  </button>
                ))}
              </div>
            </div>

            {/* TP / SL Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Take Profit (USDT)</label>
                <input
                  type="number"
                  placeholder="Optional TP"
                  value={spotTP}
                  onChange={(e) => setSpotTP(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Stop Loss (USDT)</label>
                <input
                  type="number"
                  placeholder="Optional SL"
                  value={spotSL}
                  onChange={(e) => setSpotSL(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Order Margin Breakdown */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>Notional Value</span>
                <span className="text-white font-bold">${calculatedTotal.toFixed(2)} USDT</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Required Margin ({spotLeverage}x)</span>
                <span className="text-emerald-400 font-bold">${calculatedMargin.toFixed(2)} USDT</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Maker / Taker Fee</span>
                <span className="text-white">0.02% / 0.04%</span>
              </div>
            </div>

            {/* Error or Success Banners */}
            {spotError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {spotError}
              </div>
            )}
            {spotSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {spotSuccess}
              </div>
            )}

            {/* Submit Spot Order */}
            {!currentUser ? (
              <button
                type="button"
                onClick={onRequireAuth}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white cb-blue-gradient cb-blue-gradient-hover shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <Lock className="w-4 h-4" /> Sign In to Place Order
              </button>
            ) : (
              <button
                type="button"
                onClick={handleExecuteSpotOrder}
                className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-xl flex items-center justify-center gap-2 transition-all ${
                  spotSide === 'BUY'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.4)]'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_16px_rgba(244,63,94,0.4)]'
                }`}
              >
                {spotSide === 'BUY' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {spotSide} {spotAmount} {symbol.split('/')[0]} ({spotType})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Trust & Engine Badge */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Coinbase Institutional Liquidity
        </span>
        <span className="text-slate-400">Execution: 0.2ms</span>
      </div>
    </div>
  );
};
