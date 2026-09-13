import React, { useState, useEffect } from 'react';
import { User, AppView, CryptoCoin, Transaction, Trade } from '../../types';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import { storage } from '../../lib/storage';
import { CryptoMarketScreener } from '../trading/CryptoMarketScreener';
import { 
  Search, 
  Star, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Layers, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  History, 
  User as UserIcon, 
  Bell, 
  Settings, 
  Check, 
  Copy, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  ExternalLink,
  CheckCircle2,
  Radio,
  Globe,
  Laptop,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

interface CustomerViewProps {
  view: AppView;
  currentUser: User;
  onNavigate: (view: AppView) => void;
  onSelectCoinForTrade?: (symbol: string) => void;
}

export const CustomerViews: React.FC<CustomerViewProps> = ({
  view,
  currentUser,
  onNavigate,
  onSelectCoinForTrade
}) => {
  const [coins, setCoins] = useState<CryptoCoin[]>(INITIAL_COINS);
  const [searchMarket, setSearchMarket] = useState('');
  const [marketCategory, setMarketCategory] = useState<string>('All');
  const [watchlist, setWatchlist] = useState<string[]>(() => storage.getWatchlist());
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [depositMethod, setDepositMethod] = useState<string>('USDT (TRC20)');
  const [depositTxHash, setDepositTxHash] = useState<string>('');

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [withdrawMethod, setWithdrawMethod] = useState<string>('USDT (TRC20)');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  // History Tab
  const [historyTab, setHistoryTab] = useState<'trades' | 'transactions'>('trades');

  useEffect(() => {
    return storage.subscribe(() => {
      setWatchlist(storage.getWatchlist());
    });
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleWatchlist = (symbol: string) => {
    const updated = storage.toggleWatchlist(symbol);
    setWatchlist(updated);
    triggerToast(updated.includes(symbol) ? `Added ${symbol} to watchlist` : `Removed ${symbol} from watchlist`);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;

    storage.depositFunds(currentUser.id, depositAmount, depositMethod, depositTxHash || undefined);
    triggerToast(`Deposit of $${depositAmount.toFixed(2)} USDT credited to trading wallet.`);
    setDepositTxHash('');
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);

    if (!withdrawAddress.trim()) {
      setWithdrawError('Please enter a valid destination wallet address.');
      return;
    }
    if (withdrawAmount > currentUser.balance) {
      setWithdrawError('Insufficient available balance.');
      return;
    }

    const res = storage.requestWithdrawal(currentUser.id, withdrawAmount, withdrawMethod, withdrawAddress.trim());
    if (res.success) {
      triggerToast(`Withdrawal request of $${withdrawAmount.toFixed(2)} USDT submitted.`);
      setWithdrawAddress('');
    } else {
      setWithdrawError(res.error || 'Failed to submit withdrawal.');
    }
  };

  const userTrades = storage.getTrades().filter(t => t.userId === currentUser.id);
  const userTransactions = storage.getTransactions().filter(t => t.userId === currentUser.id);
  const userNotifications = storage.getNotifications(currentUser.id);

  // Deposit Addresses
  const depositAddresses: Record<string, string> = {
    'USDT (TRC20)': 'TYDzsYUEpvnYmQk4zGP9sWWcTEd3GL8Wpx',
    'USDT (ERC20)': '0x71C568772a379134aF2E64c243c3d52Ac0e74e81',
    'Bitcoin (BTC)': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    'Ethereum (ETH)': '0x992B2851c7C31d683792f4B20aF8bF38b301c238',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl cb-glass-card border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. MARKETS VIEW */}
      {view === 'markets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Cryptocurrency Markets & Screener</h1>
              <p className="text-xs text-slate-400">Institutional real-time pricing, multi-chain liquidity, and high-frequency order routing</p>
            </div>
          </div>

          <CryptoMarketScreener
            currentUser={currentUser}
            onNavigate={onNavigate}
            onSelectCoinForTrade={(symbol) => {
              if (onSelectCoinForTrade) onSelectCoinForTrade(symbol);
              onNavigate('trade');
            }}
            onOpenSwap={(token) => {
              onNavigate('swap');
            }}
          />
        </div>
      )}

      {/* 2. WATCHLIST VIEW */}
      {view === 'watchlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Favorite Watchlist</h1>
              <p className="text-xs text-slate-400">Custom pinboard for high-priority trading instruments</p>
            </div>
            <button
              onClick={() => onNavigate('markets')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono"
            >
              Browse All Markets →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coins.filter(c => watchlist.includes(c.symbol)).map(coin => {
              const isPositive = coin.change24h >= 0;
              return (
                <div key={coin.symbol} className="p-5 rounded-2xl cb-glass-card border border-blue-500/20 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-base text-white">{coin.symbol}</h3>
                      <span className="text-xs text-slate-400">{coin.name}</span>
                    </div>
                    <button onClick={() => handleToggleWatchlist(coin.symbol)} className="text-amber-400">
                      <Star className="w-5 h-5 fill-amber-400" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black font-mono text-white">{formatPrice(coin.currentPrice)}</span>
                    <span className={`text-xs font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? '+' : ''}{coin.change24h}%
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectCoinForTrade) onSelectCoinForTrade(coin.symbol);
                      onNavigate('trade');
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5"
                  >
                    Open Live Chart & Trade <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. ASSETS & WALLET VIEW */}
      {(view === 'assets' || view === 'wallet') && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Custodial Assets & Trading Wallet</h1>
            <p className="text-xs text-slate-400">Segregated user equity under certified institutional custody</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl cb-glass-card border border-blue-500/20 space-y-2">
              <span className="text-xs text-slate-400 font-mono">Available Balance</span>
              <div className="text-2xl font-black font-mono text-emerald-400">
                ${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
              </div>
              <span className="text-[11px] text-slate-400">Ready for instant option contract staking</span>
            </div>

            <div className="p-5 rounded-2xl cb-glass-card border border-blue-500/20 space-y-2">
              <span className="text-xs text-slate-400 font-mono">Frozen / In-Settlement</span>
              <div className="text-2xl font-black font-mono text-amber-400">
                ${currentUser.frozenFunds.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
              </div>
              <span className="text-[11px] text-slate-400">Locked in active orders / pending withdrawals</span>
            </div>

            <div className="p-5 rounded-2xl cb-glass-card border border-blue-500/20 space-y-2">
              <span className="text-xs text-slate-400 font-mono">Total Account Equity</span>
              <div className="text-2xl font-black font-mono text-white">
                ${(currentUser.balance + currentUser.frozenFunds).toLocaleString('en-US', { minimumFractionDigits: 2 })} USDT
              </div>
              <span className="text-[11px] text-blue-400 font-mono">Tier-1 Cold Storage 100% Backed</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('deposit')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <ArrowDownToLine className="w-4 h-4" /> Deposit USDT
            </button>
            <button
              onClick={() => onNavigate('withdraw')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <ArrowUpFromLine className="w-4 h-4" /> Withdraw Funds
            </button>
          </div>
        </div>
      )}

      {/* 4. DEPOSIT VIEW */}
      {view === 'deposit' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-black text-white tracking-tight">Instant Crypto Deposit</h1>
            <p className="text-xs text-slate-400">Transfer crypto from your external wallet or exchange to start trading.</p>
          </div>

          <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Select Deposit Cryptocurrency & Network</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(depositAddresses).map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setDepositMethod(method)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      depositMethod === method
                        ? 'bg-blue-600/30 border-blue-400 text-white shadow-md'
                        : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold font-mono">{method}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Address Box with QR Representation */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Coinbase Custodial Deposit Address ({depositMethod})</span>
                <span className="text-emerald-400">12 Block Confirmations</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-blue-300 break-all select-all border border-white/5 flex items-center justify-between">
                <span>{depositAddresses[depositMethod]}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(depositAddresses[depositMethod]);
                    setCopiedAddr(true);
                    setTimeout(() => setCopiedAddr(false), 2000);
                  }}
                  className="p-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white shrink-0 ml-2"
                  title="Copy Address"
                >
                  {copiedAddr ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Fast Test Credit Simulator */}
            <form onSubmit={handleDepositSubmit} className="space-y-4 pt-2 border-t border-white/5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Simulate Deposit Confirmation Amount (USDT)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 500, 1000, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition-colors ${
                        depositAmount === amt
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-400'
                          : 'bg-slate-900 text-slate-400 border-white/5 hover:bg-slate-800'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 cb-glow-emerald shadow-lg transition-all"
              >
                Confirm Blockchain Deposit (+${depositAmount} USDT)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. WITHDRAW VIEW */}
      {view === 'withdraw' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-black text-white tracking-tight">Withdraw Cryptocurrency</h1>
            <p className="text-xs text-slate-400">Withdraw USDT directly to your non-custodial wallet or external exchange.</p>
          </div>

          <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-6 space-y-5">
            {withdrawError && (
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{withdrawError}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-xs font-mono p-3 rounded-xl bg-slate-900 border border-white/5">
              <span className="text-slate-400">Available to Withdraw:</span>
              <span className="text-emerald-400 font-bold">${currentUser.balance.toFixed(2)} USDT</span>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Destination Network</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/20 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                >
                  <option value="USDT (TRC20)">USDT (Tron TRC20 - 0.50 USDT Network Fee)</option>
                  <option value="USDT (ERC20)">USDT (Ethereum ERC20 - 4.50 USDT Network Fee)</option>
                  <option value="Bitcoin (BTC)">Bitcoin Network</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Recipient Wallet Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0x... or T..."
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/20 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-300">Withdrawal Amount (USDT)</label>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(Math.floor(currentUser.balance))}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-mono"
                  >
                    MAX (${currentUser.balance.toFixed(2)})
                  </button>
                </div>
                <input
                  type="number"
                  min="10"
                  max={currentUser.balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/20 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={currentUser.balance < 10}
                className="w-full py-3.5 rounded-xl font-bold text-sm text-white cb-blue-gradient cb-blue-gradient-hover cb-glow shadow-lg transition-all"
              >
                Submit Withdrawal Request (${withdrawAmount} USDT)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. HISTORY VIEW */}
      {view === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Ledger & Transaction History</h1>
              <p className="text-xs text-slate-400">All historical contract executions, deposits, and payouts</p>
            </div>

            <div className="flex rounded-xl bg-slate-900 p-1 border border-white/5">
              <button
                onClick={() => setHistoryTab('trades')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  historyTab === 'trades' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Contract Trades ({userTrades.length})
              </button>
              <button
                onClick={() => setHistoryTab('transactions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  historyTab === 'transactions' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Wallet Transits ({userTransactions.length})
              </button>
            </div>
          </div>

          <div className="rounded-2xl cb-glass-card border border-blue-500/20 overflow-hidden">
            {historyTab === 'trades' ? (
              <div className="overflow-x-auto cb-scroll">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 bg-slate-900/40">
                      <th className="py-3 px-4">Trade ID</th>
                      <th className="py-3 px-4">Symbol</th>
                      <th className="py-3 px-4">Direction</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Entry / Exit</th>
                      <th className="py-3 px-4">Result</th>
                      <th className="py-3 px-4">Net PnL</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {userTrades.map(t => (
                      <tr key={t.id} className="hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 font-bold text-blue-400">{t.id}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{t.symbol}</td>
                        <td className="py-3.5 px-4">
                          <span className={t.direction === 'UP' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {t.direction}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{t.duration}s</td>
                        <td className="py-3.5 px-4 font-bold text-white">${t.amount.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {formatPrice(t.entryPrice)} / {t.exitPrice ? formatPrice(t.exitPrice) : '--'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {t.result}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold">
                          {t.result === 'WIN' ? (
                            <span className="text-emerald-400">+${t.profit.toFixed(2)}</span>
                          ) : (
                            <span className="text-rose-400">-${t.amount.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto cb-scroll">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400 bg-slate-900/40">
                      <th className="py-3 px-4">Tx ID</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {userTransactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 font-bold text-blue-400">{tx.id}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'DEPOSIT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">${tx.amount.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-slate-400">{tx.method}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. PROFILE VIEW */}
      {view === 'profile' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-black text-white tracking-tight">Account Profile & KYC Status</h1>
            <p className="text-xs text-slate-400">Institutional trader credentials and security tier</p>
          </div>

          <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-6 space-y-5">
            <div className="flex items-center gap-4 border-b border-white/5 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-xl font-black text-blue-300">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{currentUser.name}</h3>
                <span className="text-xs text-slate-400 font-mono">{currentUser.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-slate-400 block mb-1">User Identifier (UID)</span>
                <span className="font-bold text-blue-400 text-sm">{currentUser.uid}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-slate-400 block mb-1">Linked Sub-Agent</span>
                <span className="font-bold text-purple-300 text-sm">{currentUser.linkedSubAgentId || 'Direct'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-slate-400 block mb-1">KYC Tier</span>
                <span className="font-bold text-emerald-400 text-sm">LEVEL {currentUser.vipLevel} (VERIFIED)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5">
                <span className="text-slate-400 block mb-1">Country / Region</span>
                <span className="font-bold text-white text-sm">{currentUser.country || 'United States'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. NOTIFICATIONS VIEW */}
      {view === 'notifications' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Notifications Center</h1>
              <p className="text-xs text-slate-400">Platform announcements and trade settlement alerts</p>
            </div>
            <button
              onClick={() => storage.markAllNotificationsRead(currentUser.id)}
              className="text-xs text-blue-400 hover:text-blue-300 font-mono font-bold"
            >
              Mark All Read
            </button>
          </div>

          <div className="space-y-3">
            {userNotifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs font-mono">
                No notifications to display.
              </div>
            ) : (
              userNotifications.map(n => (
                <div key={n.id} className="p-4 rounded-2xl cb-glass-card border border-blue-500/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 9. SETTINGS VIEW */}
      {view === 'settings' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-black text-white tracking-tight">Security & Account Settings</h1>
            <p className="text-xs text-slate-400">Configure two-factor authentication and passwords</p>
          </div>

          <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/5">
              <div>
                <span className="text-xs font-bold text-white block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-slate-400">Require Google Authenticator code on withdrawals</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                ENABLED
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300">Change Password</h4>
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/20 text-white text-xs font-mono"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/20 text-white text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => triggerToast('Password updated successfully.')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Actively Running Devices & Locations Card */}
          <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white tracking-tight">Actively Running Devices & Locations</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
                TELEMETRY ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Your account is currently accessed and verified from the following authorized locations and active devices:
            </p>

            {/* Current Device Session */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Current Running Browser Session</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] font-mono animate-pulse">
                  THIS DEVICE (LIVE)
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 pt-1">
                <div>IP: <span className="text-blue-400">94.200.12.84</span></div>
                <div>Location: <span className="text-slate-200">Dubai, United Arab Emirates</span></div>
                <div>Platform: <span className="text-slate-200">macOS / Chrome 124.0</span></div>
                <div>Status: <span className="text-emerald-400 font-bold">Actively Running</span></div>
              </div>
            </div>

            {/* Other Active Devices */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Other Authorized Active Sessions
              </span>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-white font-bold">iPhone 15 Pro • Safari Mobile</div>
                    <div className="text-[11px] text-slate-400">Abu Dhabi, UAE • Last active 4 mins ago</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                  STANDBY
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/5">
              <span className="text-[11px] text-slate-500 font-mono">Don't recognize a device? Revoke it immediately.</span>
              <button
                type="button"
                onClick={() => triggerToast('Successfully logged out of all other remote device sessions.')}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold transition-colors cursor-pointer"
              >
                Terminate Other Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
