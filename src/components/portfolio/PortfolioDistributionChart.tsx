import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Sector,
} from 'recharts';
import { User, AppView } from '../../types';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import {
  PieChart as PieIcon,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  Wallet,
  Layers,
  Sparkles,
  Info,
  ArrowDownToLine,
  ArrowUpFromLine,
} from 'lucide-react';

interface PortfolioDistributionChartProps {
  currentUser: User;
  onNavigate: (view: AppView) => void;
  onSelectCoinForTrade?: (symbol: string) => void;
  variant?: 'full' | 'compact';
}

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  category: string;
  percentage: number;
  usdValue: number;
  amount: number;
  color: string;
  change24h: number;
  tradeSymbol?: string;
}

export const PortfolioDistributionChart: React.FC<PortfolioDistributionChartProps> = ({
  currentUser,
  onNavigate,
  onSelectCoinForTrade,
  variant = 'full',
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'asset' | 'storage'>('asset');

  // Compute total equity from user balance and frozen funds
  const totalEquity = useMemo(() => {
    const total = currentUser.balance + currentUser.frozenFunds;
    return total > 0 ? total : 10000; // Baseline demo value if 0
  }, [currentUser.balance, currentUser.frozenFunds]);

  // Asset price lookups
  const btcPrice = INITIAL_COINS.find(c => c.symbol === 'BTC/USDT')?.currentPrice || 87450;
  const ethPrice = INITIAL_COINS.find(c => c.symbol === 'ETH/USDT')?.currentPrice || 2680.5;
  const solPrice = INITIAL_COINS.find(c => c.symbol === 'SOL/USDT')?.currentPrice || 194.8;
  const bnbPrice = INITIAL_COINS.find(c => c.symbol === 'BNB/USDT')?.currentPrice || 624.1;

  // Breakdown by cryptocurrency asset
  const assetDistribution: PortfolioAsset[] = useMemo(() => {
    // Dynamic allocations based on whether user has frozen funds
    const frozenRatio = currentUser.frozenFunds > 0
      ? Math.min(0.35, currentUser.frozenFunds / totalEquity)
      : 0;

    const remainingRatio = 1 - frozenRatio;

    // Proportional breakdown of remaining equity
    const usdtWeight = 0.46 * remainingRatio;
    const btcWeight = 0.28 * remainingRatio;
    const ethWeight = 0.15 * remainingRatio;
    const solWeight = 0.07 * remainingRatio;
    const bnbWeight = 0.04 * remainingRatio;

    const items: PortfolioAsset[] = [
      {
        id: 'usdt',
        symbol: 'USDT',
        name: 'Tether USD (Liquid Trading)',
        category: 'Stablecoin / Spot Capital',
        percentage: Number((usdtWeight * 100).toFixed(1)),
        usdValue: totalEquity * usdtWeight,
        amount: totalEquity * usdtWeight,
        color: '#0052FF', // Coinbase Electric Blue
        change24h: 0.0,
      },
      {
        id: 'btc',
        symbol: 'BTC',
        name: 'Bitcoin (Tier-1 Reserve)',
        category: 'Layer 1 / Cold Vault',
        percentage: Number((btcWeight * 100).toFixed(1)),
        usdValue: totalEquity * btcWeight,
        amount: (totalEquity * btcWeight) / btcPrice,
        color: '#F59E0B', // Amber Gold
        change24h: 3.42,
        tradeSymbol: 'BTC/USDT',
      },
      {
        id: 'eth',
        symbol: 'ETH',
        name: 'Ethereum (Staked Collateral)',
        category: 'Smart Contract / DeFi',
        percentage: Number((ethWeight * 100).toFixed(1)),
        usdValue: totalEquity * ethWeight,
        amount: (totalEquity * ethWeight) / ethPrice,
        color: '#8B5CF6', // Purple
        change24h: 2.15,
        tradeSymbol: 'ETH/USDT',
      },
      {
        id: 'sol',
        symbol: 'SOL',
        name: 'Solana (High-Speed Pool)',
        category: 'Layer 1 / Proof of History',
        percentage: Number((solWeight * 100).toFixed(1)),
        usdValue: totalEquity * solWeight,
        amount: (totalEquity * solWeight) / solPrice,
        color: '#06B6D4', // Cyan
        change24h: 6.84,
        tradeSymbol: 'SOL/USDT',
      },
      {
        id: 'bnb',
        symbol: 'BNB',
        name: 'BNB Chain (Liquidity Reserve)',
        category: 'Exchange Token',
        percentage: Number((bnbWeight * 100).toFixed(1)),
        usdValue: totalEquity * bnbWeight,
        amount: (totalEquity * bnbWeight) / bnbPrice,
        color: '#EAB308', // Yellow
        change24h: 1.45,
        tradeSymbol: 'BNB/USDT',
      },
    ];

    if (frozenRatio > 0) {
      items.push({
        id: 'frozen',
        symbol: 'MARGIN',
        name: 'Locked Orders & Pending Escrow',
        category: 'Trading Contract Collateral',
        percentage: Number((frozenRatio * 100).toFixed(1)),
        usdValue: totalEquity * frozenRatio,
        amount: totalEquity * frozenRatio,
        color: '#F43F5E', // Rose
        change24h: 0.0,
      });
    }

    return items;
  }, [totalEquity, currentUser.frozenFunds, btcPrice, ethPrice, solPrice, bnbPrice]);

  // Breakdown by Storage Security Tier
  const storageDistribution: PortfolioAsset[] = useMemo(() => {
    return [
      {
        id: 'cold-vault',
        symbol: 'VAULT',
        name: 'Institutional Cold Storage (Offline MPC)',
        category: 'FIPS 140-2 Level 3 Hardware Security',
        percentage: 58.0,
        usdValue: totalEquity * 0.58,
        amount: totalEquity * 0.58,
        color: '#10B981', // Emerald
        change24h: 0.0,
      },
      {
        id: 'liquid-margin',
        symbol: 'SPOT',
        name: 'Hot Wallet & Instant Order Buffer',
        category: 'Millisecond High-Throughput Liquidity',
        percentage: 30.0,
        usdValue: totalEquity * 0.30,
        amount: totalEquity * 0.30,
        color: '#0052FF', // Blue
        change24h: 0.0,
      },
      {
        id: 'staking-yield',
        symbol: 'STAKE',
        name: 'Institutional Staking & Earn Collateral',
        category: 'Regulated Validator Rewards Pool',
        percentage: 12.0,
        usdValue: totalEquity * 0.12,
        amount: totalEquity * 0.12,
        color: '#8B5CF6', // Purple
        change24h: 4.8,
      },
    ];
  }, [totalEquity]);

  const activeData = viewMode === 'asset' ? assetDistribution : storageDistribution;

  // Active slice data for center text
  const highlightedAsset = activeIndex !== null && activeData[activeIndex]
    ? activeData[activeIndex]
    : null;

  // Render custom sector on active hover
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 3}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: `drop-shadow(0 0 10px ${fill}90)` }}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 13}
          fill={fill}
        />
      </g>
    );
  };

  // Custom rich Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: PortfolioAsset = payload[0].payload;
      return (
        <div className="cb-glass-card p-3 rounded-xl border border-blue-500/30 text-xs font-mono shadow-2xl space-y-1 z-50 pointer-events-none">
          <div className="flex items-center gap-2 border-b border-white/10 pb-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-bold text-white">{data.symbol}</span>
            <span className="text-[10px] text-slate-400 font-sans">{data.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-[11px]">
            <span className="text-slate-400">Allocation:</span>
            <span className="text-right font-bold text-blue-300">{data.percentage}%</span>
            <span className="text-slate-400">USD Valuation:</span>
            <span className="text-right font-bold text-emerald-400">${formatPrice(data.usdValue)}</span>
            {data.symbol !== 'USDT' && data.symbol !== 'MARGIN' && (
              <>
                <span className="text-slate-400">Quantity:</span>
                <span className="text-right text-slate-200">
                  {data.amount < 1 ? data.amount.toFixed(4) : data.amount.toFixed(2)} {data.symbol}
                </span>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Compact Variant (e.g. for Profile View summary)
  if (variant === 'compact') {
    return (
      <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Portfolio Allocation</h3>
              <p className="text-[10px] text-slate-400">Asset distribution across custodial accounts</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('assets')}
            className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            Manage Wallet <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Mini Donut */}
          <div className="sm:col-span-5 relative h-[180px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="usdValue"
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {assetDistribution.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} stroke="rgba(5,11,24,0.6)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] text-slate-400 font-mono uppercase">
                {highlightedAsset ? highlightedAsset.symbol : 'TOTAL'}
              </span>
              <span className="text-sm font-black font-mono text-white">
                {highlightedAsset ? `${highlightedAsset.percentage}%` : `$${formatPrice(totalEquity)}`}
              </span>
            </div>
          </div>

          {/* Quick Bar Breakdown */}
          <div className="sm:col-span-7 space-y-2">
            {assetDistribution.slice(0, 4).map((asset) => (
              <div
                key={asset.id}
                onMouseEnter={() => {
                  const idx = assetDistribution.findIndex(a => a.id === asset.id);
                  setActiveIndex(idx);
                }}
                onMouseLeave={() => setActiveIndex(null)}
                className="p-2 rounded-xl bg-slate-900/60 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                    {asset.symbol}
                  </span>
                  <span className="text-blue-300 font-semibold">{asset.percentage}%</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${asset.percentage}%`,
                      backgroundColor: asset.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Full Variant (for Custodial Assets & Trading Wallet View)
  return (
    <div className="rounded-2xl cb-glass-card border border-blue-500/20 p-5 md:p-6 space-y-6">
      {/* Header Bar with View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl cb-blue-gradient cb-glow flex items-center justify-center text-white shadow-lg">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight">
                Portfolio Distribution & Asset Allocation
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive allocation percentages, custody breakdown, and spot valuation
            </p>
          </div>
        </div>

        {/* View Segmented Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
          <button
            onClick={() => {
              setViewMode('asset');
              setActiveIndex(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'asset'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            By Asset
          </button>
          <button
            onClick={() => {
              setViewMode('storage');
              setActiveIndex(null);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'storage'
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            By Custody Tier
          </button>
        </div>
      </div>

      {/* Main Visual Layout: Donut Chart Left + Allocation Breakdown Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Recharts Donut Chart with Center Data Readout */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={96}
                  paddingAngle={4}
                  dataKey="usdValue"
                  activeIndex={activeIndex ?? undefined}
                  activeShape={renderActiveShape}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {activeData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={entry.color}
                      stroke="rgba(5, 11, 24, 0.8)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Dynamic Readout inside the Donut Hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center px-4">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                {highlightedAsset ? highlightedAsset.symbol : 'TOTAL EQUITY'}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight mt-0.5">
                {highlightedAsset
                  ? `${highlightedAsset.percentage}%`
                  : `$${formatPrice(totalEquity)}`}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 mt-0.5">
                {highlightedAsset
                  ? `$${formatPrice(highlightedAsset.usdValue)}`
                  : '100% Backed Reserve'}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono text-center flex items-center gap-1.5 mt-1">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Hover on slices to inspect specific asset weighting</span>
          </div>
        </div>

        {/* Right Column: Asset Allocation Progress List & Action Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2 pb-1 border-b border-white/5">
            <span>Asset / Tier</span>
            <div className="flex items-center gap-6">
              <span className="w-20 text-right">Allocation</span>
              <span className="w-24 text-right">USD Value</span>
              <span className="w-16 text-right hidden sm:block">Action</span>
            </div>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto cb-scroll pr-1">
            {activeData.map((item, idx) => {
              const isHovered = activeIndex === idx;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-blue-900/30 border-blue-400 shadow-[0_0_16px_rgba(0,82,255,0.25)]'
                      : 'bg-slate-900/60 border-white/5 hover:border-blue-500/20 hover:bg-slate-900/90'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Symbol & Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs font-mono text-white">{item.symbol}</span>
                          <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Numerical Stats & Actions */}
                    <div className="flex items-center gap-6 shrink-0 font-mono text-xs">
                      {/* Percentage & Progress */}
                      <div className="w-20 text-right">
                        <span className="font-bold text-white">{item.percentage}%</span>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>

                      {/* USD Valuation */}
                      <div className="w-24 text-right">
                        <span className="font-bold text-emerald-400 block">
                          ${formatPrice(item.usdValue)}
                        </span>
                        {item.symbol !== 'USDT' && item.symbol !== 'MARGIN' && item.amount > 0 && (
                          <span className="text-[10px] text-slate-400 block truncate">
                            {item.amount < 1 ? item.amount.toFixed(4) : item.amount.toFixed(2)} {item.symbol}
                          </span>
                        )}
                      </div>

                      {/* Action: Quick Trade or Deposit */}
                      <div className="w-16 text-right hidden sm:block">
                        {item.tradeSymbol ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectCoinForTrade && item.tradeSymbol) {
                                onSelectCoinForTrade(item.tradeSymbol);
                              }
                              onNavigate('trade');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[10px] font-bold transition-colors inline-flex items-center gap-1"
                          >
                            Trade <ArrowUpRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Hold</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Portfolio Health & Key Metrics Footer Strip */}
      <div className="pt-4 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">Risk Exposure Rating</span>
            <span className="font-bold text-emerald-400">Institutional Grade (A+)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">Primary Allocation</span>
            <span className="font-bold text-white">USDT Liquid Capital (46.0%)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">24h Portfolio Gain</span>
            <span className="font-bold text-emerald-400">+$342.80 (+3.4%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
