import React, { useState, useEffect } from 'react';
import { User, Trade, TradeDirection, TradeDuration } from '../../types';
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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TradeExecutionPanelProps {
  symbol: string;
  currentPrice: number;
  currentUser: User | null;
  onRequireAuth: () => void;
  onRequireDeposit: () => void;
}

export const TradeExecutionPanel: React.FC<TradeExecutionPanelProps> = ({
  symbol,
  currentPrice,
  currentUser,
  onRequireAuth,
  onRequireDeposit
}) => {
  const [direction, setDirection] = useState<TradeDirection>('UP');
  const [duration, setDuration] = useState<TradeDuration>(60);
  const [amount, setAmount] = useState<number>(100);
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [settledResult, setSettledResult] = useState<{ isWin: boolean; profit: number; exitPrice: number } | null>(null);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const payoutRates: Record<TradeDuration, number> = {
    30: 0.80,
    60: 0.85,
    120: 0.90
  };

  const payoutRate = payoutRates[duration];
  const potentialProfit = amount * payoutRate;
  const potentialReturn = amount + potentialProfit;

  // Active countdown timer effect
  useEffect(() => {
    if (!activeTrade) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((activeTrade.expiresAt - now) / 1000));
      setRemainingTime(diff);

      if (diff <= 0) {
        clearInterval(interval);
        // Settle the trade with current price
        const settled = storage.settleTrade(activeTrade.id, currentPrice);
        if (settled) {
          const isWin = settled.result === 'WIN';
          setSettledResult({
            isWin,
            profit: settled.profit,
            exitPrice: settled.exitPrice || currentPrice,
          });

          if (isWin) {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 }
            });
          }
        }
        setActiveTrade(null);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeTrade, currentPrice]);

  const handleExecute = () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    if (currentUser.balance < amount) {
      setErrorMsg('Insufficient balance. Please deposit USDT to trade.');
      return;
    }

    setErrorMsg(null);
    setSettledResult(null);

    const res = storage.executeTrade({
      userId: currentUser.id,
      symbol,
      direction,
      duration,
      amount,
      currentPrice
    });

    if (res.success && res.trade) {
      setActiveTrade(res.trade);
      setRemainingTime(duration);
    } else {
      setErrorMsg(res.error || 'Failed to place trade.');
    }
  };

  return (
    <div className="w-full rounded-2xl cb-glass-card border border-blue-500/20 p-5 md:p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Order Execution</h3>
          <p className="text-xs text-slate-400">Sub-second high-yield digital asset options</p>
        </div>
        {currentUser && (
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-mono block">Wallet Balance</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              ${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Contract Direction (BUY UP / BUY DOWN) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">Forecast Market Direction</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setDirection('UP')}
            className={`py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${
              direction === 'UP'
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400'
                : 'bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40 border border-emerald-500/20'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            BUY UP (CALL)
          </button>

          <button
            type="button"
            onClick={() => setDirection('DOWN')}
            className={`py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm ${
              direction === 'DOWN'
                ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] border border-rose-400'
                : 'bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 border border-rose-500/20'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            BUY DOWN (PUT)
          </button>
        </div>
      </div>

      {/* Duration Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">Contract Expiry</label>
          <span className="text-[11px] text-blue-400 font-mono font-medium">
            Payout Rate: +{(payoutRate * 100).toFixed(0)}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {([30, 60, 120] as TradeDuration[]).map((dur) => (
            <button
              key={dur}
              type="button"
              onClick={() => setDuration(dur)}
              className={`py-2.5 px-2 rounded-xl text-center border font-mono transition-all ${
                duration === dur
                  ? 'bg-blue-600/30 text-white border-blue-400 shadow-[0_0_12px_rgba(0,82,255,0.3)]'
                  : 'bg-slate-900/50 text-slate-400 border-white/5 hover:border-blue-500/20'
              }`}
            >
              <div className="text-xs font-bold">{dur} Seconds</div>
              <div className="text-[10px] text-emerald-400">+{(payoutRates[dur] * 100)}% ROI</div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">Trading Amount (USDT)</label>
          {currentUser && (
            <button
              type="button"
              onClick={() => setAmount(Math.max(10, Math.floor(currentUser.balance)))}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-mono"
            >
              MAX
            </button>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
          <input
            type="number"
            min="10"
            max="50000"
            step="10"
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
            className="w-full pl-8 pr-16 py-2.5 bg-slate-900/80 border border-blue-500/20 rounded-xl text-white font-mono text-base focus:outline-none focus:border-blue-500 transition-colors"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
            USDT
          </span>
        </div>

        {/* Quick Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount(q)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-colors ${
                amount === q
                  ? 'bg-blue-600/30 text-blue-300 border-blue-400'
                  : 'bg-slate-800/40 text-slate-400 border-white/5 hover:bg-slate-800'
              }`}
            >
              +${q}
            </button>
          ))}
        </div>
      </div>

      {/* Profit & Return Estimation Card */}
      <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-2 text-xs font-mono">
        <div className="flex justify-between text-slate-400">
          <span>Entry Price:</span>
          <span className="text-white font-bold">{formatPrice(currentPrice)}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Estimated Profit:</span>
          <span className="text-emerald-400 font-bold">+${potentialProfit.toFixed(2)} USDT</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-white/5 text-slate-300 font-semibold">
          <span>Potential Payout:</span>
          <span className="text-blue-400 font-bold">${potentialReturn.toFixed(2)} USDT</span>
        </div>
      </div>

      {/* Active trade countdown badge */}
      {activeTrade && (
        <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-400/40 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-blue-300 font-semibold">
              <Timer className="w-4 h-4 text-blue-400 animate-spin" />
              Contract Active ({activeTrade.direction})
            </span>
            <span className="text-base font-black text-amber-400">
              {remainingTime}s
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-linear"
              style={{ width: `${(remainingTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Locked: {formatPrice(activeTrade.entryPrice)}</span>
            <span>Current: {formatPrice(currentPrice)}</span>
          </div>
        </div>
      )}

      {/* Settled Result notification */}
      {settledResult && !activeTrade && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 animate-in fade-in duration-300 ${
          settledResult.isWin 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          {settledResult.isWin ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <div className="font-bold text-sm">
              {settledResult.isWin ? 'Trade Contract Won!' : 'Contract Expired Out of Money'}
            </div>
            <div>
              {settledResult.isWin 
                ? `Profit of +$${settledResult.profit.toFixed(2)} USDT credited to your balance.` 
                : `Settled at ${formatPrice(settledResult.exitPrice)}.`}
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          {currentUser && currentUser.balance < amount && (
            <button
              onClick={onRequireDeposit}
              className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px]"
            >
              Deposit
            </button>
          )}
        </div>
      )}

      {/* Main Execution Button */}
      {currentUser ? (
        <button
          type="button"
          onClick={handleExecute}
          disabled={Boolean(activeTrade)}
          className={`w-full py-4 rounded-xl font-extrabold text-base tracking-wide uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
            activeTrade
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              : direction === 'UP'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-white cb-glow-emerald'
              : 'bg-rose-600 hover:bg-rose-500 text-white cb-glow-rose'
          }`}
        >
          {activeTrade ? (
            <>
              <Timer className="w-5 h-5 animate-spin" />
              Settling Contract ({remainingTime}s)
            </>
          ) : (
            <>
              Execute {direction} (${amount} USDT)
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onRequireAuth}
          className="w-full py-4 rounded-xl font-extrabold text-base tracking-wide text-white cb-blue-gradient cb-blue-gradient-hover cb-glow shadow-xl flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Sign In to Place Trade
        </button>
      )}
    </div>
  );
};
