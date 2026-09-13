import React, { useState, useMemo } from 'react';
import { User } from '../../types';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import { storage } from '../../lib/storage';
import { 
  ArrowDownUp, 
  Settings, 
  Zap, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CryptoSwapWidgetProps {
  currentUser: User | null;
  onRequireAuth: () => void;
  onRequireDeposit: () => void;
  initialFromSymbol?: string;
  initialToSymbol?: string;
  onSwapCompleted?: () => void;
}

export const CryptoSwapWidget: React.FC<CryptoSwapWidgetProps> = ({
  currentUser,
  onRequireAuth,
  onRequireDeposit,
  initialFromSymbol = 'USDT',
  initialToSymbol = 'BTC',
  onSwapCompleted
}) => {
  const [fromCoin, setFromCoin] = useState<string>(initialFromSymbol);
  const [toCoin, setToCoin] = useState<string>(initialToSymbol);
  const [fromAmount, setFromAmount] = useState<string>('500');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapSuccess, setSwapSuccess] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);

  // Available swap tokens dictionary
  const availableTokens = useMemo(() => {
    const tokens: Array<{ symbol: string; name: string; price: number }> = [
      { symbol: 'USDT', name: 'Tether USD', price: 1.0 },
      ...INITIAL_COINS.map(c => ({
        symbol: c.symbol.split('/')[0],
        name: c.name,
        price: c.currentPrice
      }))
    ];
    return tokens;
  }, []);

  const fromTokenData = availableTokens.find(t => t.symbol === fromCoin) || availableTokens[0];
  const toTokenData = availableTokens.find(t => t.symbol === toCoin) || availableTokens[1];

  // Calculate dynamic exchange rate and output
  const { exchangeRate, toAmount, minimumReceived, priceImpact, networkFee } = useMemo(() => {
    if (!fromTokenData || !toTokenData || fromTokenData.price <= 0 || toTokenData.price <= 0) {
      return { exchangeRate: 0, toAmount: 0, minimumReceived: 0, priceImpact: 0, networkFee: 0 };
    }

    const rate = fromTokenData.price / toTokenData.price;
    const parsedFrom = parseFloat(fromAmount) || 0;
    const rawTo = parsedFrom * rate;
    const minRec = rawTo * (1 - slippage / 100);
    const impact = parsedFrom > 10000 ? 0.12 : parsedFrom > 1000 ? 0.04 : 0.01;
    const feeUsd = 1.50; // ~$1.50 network routing fee

    return {
      exchangeRate: rate,
      toAmount: rawTo,
      minimumReceived: minRec,
      priceImpact: impact,
      networkFee: feeUsd
    };
  }, [fromTokenData, toTokenData, fromAmount, slippage]);

  // Flip tokens
  const handleFlip = () => {
    const temp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(temp);
  };

  // Quick percentage balance selection
  const handlePercentSelect = (pct: number) => {
    if (!currentUser) return;
    if (fromCoin === 'USDT') {
      const amt = (currentUser.balance * pct) / 100;
      setFromAmount(amt > 0 ? amt.toFixed(2) : '0');
    } else {
      // Demo crypto balance
      const fakeBalance = 2.5;
      const amt = (fakeBalance * pct) / 100;
      setFromAmount(amt.toFixed(4));
    }
  };

  // Execute Swap
  const handleSwapSubmit = () => {
    setSwapError(null);
    setSwapSuccess(null);

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    const numFrom = parseFloat(fromAmount);
    if (!numFrom || numFrom <= 0) {
      setSwapError('Please enter a valid swap amount.');
      return;
    }

    if (fromCoin === 'USDT' && currentUser.balance < numFrom) {
      setSwapError(`Insufficient USDT balance. Current available: $${currentUser.balance.toFixed(2)} USDT.`);
      return;
    }

    setIsSwapping(true);

    // Audio cue
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Audio not supported or blocked
    }

    setTimeout(() => {
      const res = storage.executeSwap(
        currentUser.id,
        fromCoin,
        toCoin,
        numFrom,
        toAmount,
        exchangeRate
      );

      setIsSwapping(false);

      if (res.success) {
        setSwapSuccess(`Successfully swapped ${numFrom} ${fromCoin} for ~${toAmount.toFixed(4)} ${toCoin}!`);
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.6 }
        });
        onSwapCompleted?.();
      } else {
        setSwapError(res.error || 'Failed to complete swap.');
      }
    }, 900);
  };

  return (
    <div className="rounded-3xl cb-glass-card border border-blue-500/30 p-6 max-w-lg mx-auto shadow-2xl relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <ArrowDownUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              DEX Instant Swap & Bridge
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
                0% Gas Rebate
              </span>
            </h2>
            <p className="text-xs text-slate-400">Instant cross-asset execution with zero slippage protection</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-xl border transition-colors ${
            showSettings
              ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
              : 'border-white/5 hover:border-blue-500/30 text-slate-400 hover:text-white'
          }`}
          title="Swap Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Drawer (Slippage) */}
      {showSettings && (
        <div className="mb-4 p-3 rounded-2xl bg-slate-900/90 border border-blue-500/20 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-300">
            <span>Slippage Tolerance</span>
            <span className="text-blue-400 font-bold">{slippage}%</span>
          </div>
          <div className="flex items-center gap-2">
            {[0.1, 0.5, 1.0, 2.0].map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setSlippage(s)}
                className={`flex-1 py-1.5 rounded-lg border text-center transition-all ${
                  slippage === s
                    ? 'bg-blue-600 text-white border-blue-400 font-bold'
                    : 'bg-slate-800 text-slate-300 border-white/5 hover:border-slate-700'
                }`}
              >
                {s}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PAY TOKEN BOX */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-blue-500/30 transition-all space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>You Pay</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span>Balance:</span>
            <span className="text-white font-bold">
              {currentUser ? (fromCoin === 'USDT' ? `$${currentUser.balance.toFixed(2)}` : '2.5000') : '--'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <input
            type="number"
            min="0"
            step="any"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-2xl sm:text-3xl font-bold font-mono text-white placeholder-slate-600 focus:outline-none"
          />

          <select
            value={fromCoin}
            onChange={(e) => {
              if (e.target.value === toCoin) handleFlip();
              else setFromCoin(e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
          >
            {availableTokens.map(t => (
              <option key={t.symbol} value={t.symbol} className="bg-slate-900 text-white">
                {t.symbol} - {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Percentages */}
        {currentUser && (
          <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
            {[25, 50, 75, 100].map(pct => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentSelect(pct)}
                className="px-2.5 py-0.5 rounded bg-slate-800/80 hover:bg-blue-600/30 text-slate-300 hover:text-blue-300 border border-white/5 transition-colors"
              >
                {pct === 100 ? 'MAX' : `${pct}%`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FLIP BUTTON */}
      <div className="flex justify-center -my-3 relative z-10">
        <button
          type="button"
          onClick={handleFlip}
          className="p-2.5 rounded-2xl bg-slate-900 border border-blue-500/40 text-blue-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg hover:rotate-180 duration-300"
          title="Invert Direction"
        >
          <ArrowDownUp className="w-4 h-4" />
        </button>
      </div>

      {/* RECEIVE TOKEN BOX */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-blue-500/30 transition-all space-y-2 mt-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>You Receive (Estimated)</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span>Rate:</span>
            <span className="text-blue-400 font-bold">
              1 {fromCoin} ≈ {exchangeRate.toFixed(4)} {toCoin}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <input
            type="text"
            readOnly
            value={toAmount > 0 ? toAmount.toFixed(4) : '0.0000'}
            className="w-full bg-transparent text-2xl sm:text-3xl font-bold font-mono text-emerald-400 focus:outline-none cursor-default"
          />

          <select
            value={toCoin}
            onChange={(e) => {
              if (e.target.value === fromCoin) handleFlip();
              else setToCoin(e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-blue-500"
          >
            {availableTokens.map(t => (
              <option key={t.symbol} value={t.symbol} className="bg-slate-900 text-white">
                {t.symbol} - {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TRANSACTION BREAKDOWN DETAILS */}
      <div className="mt-4 p-3.5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-slate-400">
          <span>Minimum Received (Guaranteed)</span>
          <span className="text-white font-bold">{minimumReceived.toFixed(4)} {toCoin}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Price Impact</span>
          <span className="text-emerald-400 font-bold">&lt; {priceImpact}%</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Liquidity Provider Fee</span>
          <span className="text-white font-bold">0.15% ($0.00 Gas Subsidy)</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 border-t border-white/5 pt-2">
          <span>Routing Protocol</span>
          <span className="text-blue-400 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400" /> Coinbase DEX Multi-Hop v3
          </span>
        </div>
      </div>

      {/* Error & Success Banners */}
      {swapError && (
        <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{swapError}</span>
        </div>
      )}

      {swapSuccess && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{swapSuccess}</span>
        </div>
      )}

      {/* SWAP EXECUTE BUTTON */}
      <div className="mt-5">
        {!currentUser ? (
          <button
            type="button"
            onClick={onRequireAuth}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white cb-blue-gradient cb-blue-gradient-hover shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            <Lock className="w-4 h-4" /> Connect Trading Wallet to Swap
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSwapSubmit}
            disabled={isSwapping}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white cb-blue-gradient cb-blue-gradient-hover cb-glow shadow-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSwapping ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                Confirming Blockchain Liquidity Route...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                Instant Swap {fromCoin} ➔ {toCoin}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
