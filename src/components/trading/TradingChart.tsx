import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Area,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { CandleData, User } from '../../types';
import { formatPrice } from '../../lib/market-data';
import { Lock, Eye, EyeOff, Activity, Sliders, ShieldCheck } from 'lucide-react';

interface TradingChartProps {
  candles: CandleData[];
  symbol: string;
  currentPrice: number;
  currentUser: User | null;
  onRequireAuth: () => void;
}

// Custom SVG Candlestick renderer for the composed chart
const CandlestickRenderer = (props: any) => {
  const { x, y, width, height, payload, yDomain } = props;
  if (!payload || !yDomain) return null;

  const [yMin, yMax] = yDomain;
  const plotRange = yMax - yMin;
  if (plotRange <= 0) return null;

  const open = payload.open;
  const close = payload.close;
  const high = payload.high;
  const low = payload.low;

  const isGreen = close >= open;
  const color = isGreen ? '#10b981' : '#f43f5e';

  // Map price to y-coordinate within the container height
  const getY = (val: number) => {
    const fraction = (yMax - val) / plotRange;
    return y + fraction * height;
  };

  const candleX = x + width / 2;
  const bodyTop = getY(Math.max(open, close));
  const bodyBottom = getY(Math.min(open, close));
  const bodyHeight = Math.max(2, bodyBottom - bodyTop);
  const candleWidth = Math.max(3, Math.min(10, width * 0.7));

  const wickTop = getY(high);
  const wickBottom = getY(low);

  return (
    <g>
      {/* Wick line */}
      <line
        x1={candleX}
        y1={wickTop}
        x2={candleX}
        y2={wickBottom}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Candle body */}
      <rect
        x={candleX - candleWidth / 2}
        y={bodyTop}
        width={candleWidth}
        height={bodyHeight}
        fill={color}
        rx={1}
      />
    </g>
  );
};

export const TradingChart: React.FC<TradingChartProps> = ({
  candles,
  symbol,
  currentPrice,
  currentUser,
  onRequireAuth
}) => {
  const [showBollinger, setShowBollinger] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [showSMA, setShowSMA] = useState(true);
  const [showSR, setShowSR] = useState(true);

  const isGuest = !currentUser;

  // Calculate dynamic domain with padding
  const { yDomain, supportVal, resistanceVal } = useMemo(() => {
    if (candles.length === 0) return { yDomain: [0, 100], supportVal: 0, resistanceVal: 0 };
    let min = Infinity;
    let max = -Infinity;

    candles.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.lowerBand && c.lowerBand < min) min = c.lowerBand;
      if (c.upperBand && c.upperBand > max) max = c.upperBand;
    });

    const padding = (max - min) * 0.08 || 1;
    const yMin = min - padding;
    const yMax = max + padding;
    const last = candles[candles.length - 1];

    return {
      yDomain: [yMin, yMax],
      supportVal: last?.support || min,
      resistanceVal: last?.resistance || max
    };
  }, [candles]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: CandleData = payload[0].payload;
      const isGreen = data.close >= data.open;
      return (
        <div className="cb-glass-card p-3 rounded-lg border border-blue-500/30 text-xs font-mono shadow-xl space-y-1">
          <div className="text-slate-400 font-sans font-semibold border-b border-white/10 pb-1">
            {symbol} • {data.time}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
            <span>Open: <strong className="text-white">{formatPrice(data.open)}</strong></span>
            <span>High: <strong className="text-emerald-400">{formatPrice(data.high)}</strong></span>
            <span>Low: <strong className="text-rose-400">{formatPrice(data.low)}</strong></span>
            <span>Close: <strong className={isGreen ? 'text-emerald-400' : 'text-rose-400'}>{formatPrice(data.close)}</strong></span>
          </div>
          {!isGuest && (
            <div className="border-t border-white/10 pt-1 text-[10px] space-y-0.5 text-slate-300">
              {data.sma && <div>SMA (20): <span className="text-amber-400">{formatPrice(data.sma)}</span></div>}
              {data.ema && <div>EMA (9): <span className="text-purple-400">{formatPrice(data.ema)}</span></div>}
              {data.upperBand && <div>Bollinger Upper: <span className="text-blue-400">{formatPrice(data.upperBand)}</span></div>}
              {data.lowerBand && <div>Bollinger Lower: <span className="text-blue-400">{formatPrice(data.lowerBand)}</span></div>}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full rounded-2xl cb-glass-card border border-blue-500/20 p-4 md:p-6 overflow-hidden">
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl md:text-2xl font-black text-white font-mono tracking-tight">{symbol}</h2>
            <span className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
              {formatPrice(currentPrice)}
            </span>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 cb-pulse-dot" />
            LIVE TICK
          </span>
        </div>

        {/* Technical Indicator Controls (Locked/Unlocked) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {!isGuest ? (
            <>
              <span className="text-slate-400 flex items-center gap-1 mr-1 text-[11px] uppercase tracking-wider font-sans">
                <Sliders className="w-3.5 h-3.5 text-blue-400" /> Indicators:
              </span>
              <button
                onClick={() => setShowBollinger(!showBollinger)}
                className={`px-2.5 py-1 rounded-md border transition-all ${
                  showBollinger 
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 shadow-[0_0_8px_rgba(0,82,255,0.3)]' 
                    : 'bg-slate-800/40 text-slate-500 border-white/5'
                }`}
              >
                BB(20,2)
              </button>
              <button
                onClick={() => setShowEMA(!showEMA)}
                className={`px-2.5 py-1 rounded-md border transition-all ${
                  showEMA 
                    ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.3)]' 
                    : 'bg-slate-800/40 text-slate-500 border-white/5'
                }`}
              >
                EMA(9)
              </button>
              <button
                onClick={() => setShowSMA(!showSMA)}
                className={`px-2.5 py-1 rounded-md border transition-all ${
                  showSMA 
                    ? 'bg-amber-600/30 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]' 
                    : 'bg-slate-800/40 text-slate-500 border-white/5'
                }`}
              >
                SMA(20)
              </button>
              <button
                onClick={() => setShowSR(!showSR)}
                className={`px-2.5 py-1 rounded-md border transition-all ${
                  showSR 
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50' 
                    : 'bg-slate-800/40 text-slate-500 border-white/5'
                }`}
              >
                Support / Res
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Pattern Locked (Sign in to unlock)</span>
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full h-[420px]">
        {/* Underneath: Candlestick and indicators */}
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={candles} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid stroke="rgba(59, 130, 246, 0.08)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              domain={yDomain}
              orientation="right"
              stroke="#64748b"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={(v) => formatPrice(v)}
              tickLine={false}
              axisLine={false}
              width={75}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Support and Resistance horizontal reference levels */}
            {!isGuest && showSR && (
              <>
                <ReferenceLine 
                  y={resistanceVal} 
                  stroke="#f43f5e" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{ 
                    value: `Res: ${formatPrice(resistanceVal)}`, 
                    fill: '#f43f5e', 
                    fontSize: 10, 
                    position: 'insideTopLeft' 
                  }} 
                />
                <ReferenceLine 
                  y={supportVal} 
                  stroke="#10b981" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{ 
                    value: `Sup: ${formatPrice(supportVal)}`, 
                    fill: '#10b981', 
                    fontSize: 10, 
                    position: 'insideBottomLeft' 
                  }} 
                />
              </>
            )}

            {/* Bollinger Bands Shaded Area */}
            {!isGuest && showBollinger && (
              <Area
                type="monotone"
                dataKey="upperBand"
                stroke="#38bdf8"
                strokeWidth={1}
                strokeDasharray="2 2"
                fill="#0052FF"
                fillOpacity={0.06}
                isAnimationActive={false}
              />
            )}
            {!isGuest && showBollinger && (
              <Line
                type="monotone"
                dataKey="lowerBand"
                stroke="#38bdf8"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* Moving Averages */}
            {!isGuest && showSMA && (
              <Line
                type="monotone"
                dataKey="sma"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            )}
            {!isGuest && showEMA && (
              <Line
                type="monotone"
                dataKey="ema"
                stroke="#c084fc"
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {/* Custom Candlesticks */}
            <Line
              dataKey="high"
              stroke="transparent"
              dot={(dotProps) => (
                <CandlestickRenderer
                  key={dotProps.index}
                  {...dotProps}
                  yDomain={yDomain}
                  width={20}
                  height={380}
                />
              )}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* LOCKED OVERLAY for Guest Users */}
        {isGuest && (
          <div className="absolute inset-0 bg-[#050b18]/65 backdrop-blur-md rounded-xl flex flex-col items-center justify-center p-6 text-center z-30 border border-blue-500/30">
            <div className="w-14 h-14 rounded-2xl cb-blue-gradient cb-glow flex items-center justify-center mb-4 text-white shadow-xl">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2 tracking-tight">
              Trading Indicators & Pattern Locked
            </h3>
            <p className="text-slate-300 text-sm max-w-md leading-relaxed mb-6">
              Institutional Bollinger Bands, Exponential Moving Averages, and algorithmic Support & Resistance levels are reserved for registered traders.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onRequireAuth}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white cb-blue-gradient cb-blue-gradient-hover cb-glow shadow-lg transition-all"
              >
                Sign In to Unlock
              </button>
              <button
                onClick={onRequireAuth}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition-colors"
              >
                Register Account
              </button>
            </div>
            <div className="flex items-center gap-4 mt-6 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Free Registration
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-emerald-400" /> Sub-Second Live Data
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Indicator Legend Bar */}
      <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" /> Bullish Candle
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm" /> Bearish Candle
          </span>
          {!isGuest && (
            <>
              <span className="flex items-center gap-1.5 text-blue-300">
                <span className="w-3 h-0.5 border-t border-dashed border-blue-400" /> Bollinger Bands
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-3 h-0.5 bg-amber-400" /> SMA (20)
              </span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-3 h-0.5 bg-purple-400" /> EMA (9)
              </span>
            </>
          )}
        </div>
        <div>
          <span>Interval: <strong>1m</strong> • Volume: High Liquidity</span>
        </div>
      </div>
    </div>
  );
};
