import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Download,
  Calendar,
  Search,
  Settings,
  HelpCircle,
  Bell,
  Pencil,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ChevronDown,
  Share2,
  ExternalLink,
  Laptop,
  Smartphone,
  Eye,
  Sliders,
  Filter,
  CreditCard,
  Building,
  Sparkles
} from 'lucide-react';
import { User, Transaction, Trade } from '../../types';
import { generateComprehensivePlatformPDF } from '../../lib/pdfReportGenerator';

interface BitVistaOverviewSectionProps {
  currentUser?: User;
  users?: User[];
  trades?: Trade[];
  transactions?: Transaction[];
  onShowToast?: (msg: string) => void;
}

const SALES_BAR_DATA = [
  { month: 'Jan', profit: 3.2, expense: 1.8 },
  { month: 'Feb', profit: 4.8, expense: 2.4 },
  { month: 'Mar', profit: 3.9, expense: 2.1 },
  { month: 'Apr', profit: 5.4, expense: 2.9 },
  { month: 'May', profit: 6.8, expense: 3.4 },
  { month: 'Jun', profit: 5.1, expense: 2.6 },
  { month: 'Jul', profit: 7.2, expense: 4.1 },
  { month: 'Aug', profit: 4.4, expense: 2.2 },
  { month: 'Sep', profit: 5.9, expense: 3.1 },
  { month: 'Oct', profit: 6.3, expense: 3.6 },
  { month: 'Nov', profit: 7.5, expense: 4.2 },
  { month: 'Dec', profit: 6.1, expense: 3.0 },
];

const DEPARTMENTS_DATA = [
  {
    id: 'dept-1',
    name: 'Analytics Press',
    date: 'Wed, 2 Jan',
    time: '12:54 AM',
    gain: '$534.50',
    pct: 70
  },
  {
    id: 'dept-2',
    name: 'Sprint',
    date: 'Thu, 4 Sept',
    time: '10:20 PM',
    gain: '$234.50',
    pct: 35
  },
  {
    id: 'dept-3',
    name: 'Cortex Risk Engine',
    date: 'Fri, 12 Nov',
    time: '04:15 PM',
    gain: '$890.00',
    pct: 88
  },
  {
    id: 'dept-4',
    name: 'Nexus Settlement',
    date: 'Mon, 18 Dec',
    time: '08:45 AM',
    gain: '$410.20',
    pct: 52
  }
];

export const BitVistaOverviewSection: React.FC<BitVistaOverviewSectionProps> = ({
  currentUser,
  users = [],
  trades = [],
  transactions = [],
  onShowToast
}) => {
  const [currency, setCurrency] = useState<'BTC' | 'USDT' | 'ETH'>('BTC');
  const [performanceTab, setPerformanceTab] = useState<'new_users' | 'online_sales' | 'daily_sales'>('new_users');
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const notify = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      setToastMsg(msg);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  const handleDownloadCompletePDF = () => {
    try {
      setIsExportingPDF(true);
      notify('Compiling comprehensive platform PDF (Storefront, Admin & All Dashboards)...');
      
      setTimeout(() => {
        const { doc, filename } = generateComprehensivePlatformPDF({
          generatedBy: currentUser?.email || 'Super Administrator (admin@coinbase.ae)'
        });
        doc.save(filename);
        setIsExportingPDF(false);
        notify(`Success! ${filename} downloaded.`);
      }, 700);
    } catch (err: any) {
      setIsExportingPDF(false);
      notify('Error generating PDF report. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-blue-500/40 text-blue-400 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER & GLOBAL PDF ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0E131F] border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">
              BV
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Business Overview!
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Here is an overview of your business · Brock Exchange & BitVista Enterprise Telemetry
          </p>
        </div>

        {/* Action Controls & PDF Download Button */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* PRIMARY PDF DOWNLOAD BUTTON */}
          <button
            onClick={handleDownloadCompletePDF}
            disabled={isExportingPDF}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Export complete documentation dossier for all sections"
          >
            <Download className={`w-4 h-4 ${isExportingPDF ? 'animate-bounce' : ''}`} />
            <span>{isExportingPDF ? 'Generating Multi-Page PDF...' : 'Download Complete Platform PDF (All Sections)'}</span>
          </button>

          <button
            onClick={() => notify('Editing business overview dashboard layout parameters...')}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
            title="Edit Dashboard"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => notify('Dossier link copied to clipboard.')}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-white/10 transition-all cursor-pointer"
            title="Share Dashboard"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOP 3 SUMMARY CARDS (Customers, Profit, Expense) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: CUSTOMERS */}
        <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Customers</span>
            <span className="text-slate-500 tracking-widest">•••</span>
          </div>

          <div className="text-3xl font-black text-white font-mono tracking-tight">
            22.343
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-amber-500">20%</span>
            <span className="text-slate-400">4 Days Ago</span>
          </div>

          {/* Orange Progress Slider Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '20%' }} />
          </div>
        </div>

        {/* CARD 2: PROFIT */}
        <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Profit</span>
            <span className="text-slate-500 tracking-widest">•••</span>
          </div>

          <div className="text-3xl font-black text-white font-mono tracking-tight">
            32.234
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-cyan-400">40%</span>
            <span className="text-slate-400">1 Mon</span>
          </div>

          {/* Cyan Progress Slider Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>

        {/* CARD 3: EXPENSE */}
        <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/10 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold">Expense</span>
            <span className="text-slate-500 tracking-widest">•••</span>
          </div>

          <div className="text-3xl font-black text-white font-mono tracking-tight">
            12.537
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-indigo-400">82%</span>
            <span className="text-slate-400">2 Mon</span>
          </div>

          {/* Indigo Progress Slider Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: '82%' }} />
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT (Left 8 cols, Right 4 cols on LG) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: SALES OVERVIEW + DEPARTMENTS OVERVIEW */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. SALES OVERVIEW CARD */}
          <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Sales Overview
              </h3>

              {/* Currency Selector & Filter */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => notify('Filter criteria: institutional accounts.')}
                  className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white text-xs border border-white/5"
                >
                  <Filter className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-white/5 text-xs text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block font-black text-[9px] text-slate-950 text-center leading-none">
                    ₿
                  </span>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="bg-transparent text-white font-mono font-bold text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="BTC" className="bg-slate-900 text-white">BTC</option>
                    <option value="USDT" className="bg-slate-900 text-white">USDT</option>
                    <option value="ETH" className="bg-slate-900 text-white">ETH</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Custom Legend Floating Box Preview (Profit: 4.4k, Expense: 2.2k) */}
            <div className="flex items-center justify-center gap-6 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-white/5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                <span className="text-slate-300">Profit:</span>
                <span className="text-white font-bold">4.4k</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 border border-white/5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-800" />
                <span className="text-slate-300">Expense:</span>
                <span className="text-white font-bold">2.2k</span>
              </div>
            </div>

            {/* Dual Bar Chart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALES_BAR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}k`} domain={[0, 8]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A0D14', borderColor: '#1E2638', borderRadius: '10px', fontSize: '11px' }}
                    formatter={(val: any, name: any) => [`${val}k ${currency}`, name === 'profit' ? 'Profit' : 'Expense']}
                  />
                  <Bar dataKey="profit" fill="#0052FF" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="expense" fill="#1E3A8A" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. DEPARTMENTS OVERVIEW CARD */}
          <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Departments Overview
              </h3>
              <button
                onClick={() => notify('Opening all active department records...')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 text-[11px] border-b border-white/5 pb-2">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 font-medium">Gain</th>
                    <th className="pb-2 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-[11px]">
                  {DEPARTMENTS_DATA.map((dept) => (
                    <tr key={dept.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-sans font-bold text-white">{dept.name}</td>
                      <td className="py-3 text-slate-400">{dept.date}</td>
                      <td className="py-3 text-slate-400">{dept.time}</td>
                      <td className="py-3 text-white font-bold">{dept.gain}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${dept.pct}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-400 w-7">{dept.pct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TOTAL PERFORMANCE, ACTIVITY DONUT, FORTHCOMING TIMETABLE */}
        <div className="lg:col-span-4 space-y-5">
          {/* 1. TOTAL PERFORMANCE */}
          <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Total Performance
            </h3>

            {/* Segmented Filter Pills */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/5">
              <button
                onClick={() => setPerformanceTab('new_users')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  performanceTab === 'new_users' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                New Users
              </button>
              <button
                onClick={() => setPerformanceTab('online_sales')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  performanceTab === 'online_sales' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Online Sales
              </button>
              <button
                onClick={() => setPerformanceTab('daily_sales')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  performanceTab === 'daily_sales' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily Sales
              </button>
            </div>

            {/* Top User Card (Anthony Alverizko) */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
                AA
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Top User</span>
                <h4 className="text-sm font-bold text-white truncate">Anthony Alverizko</h4>
                <p className="text-[10px] text-slate-400 font-mono truncate">anthony.al@gmail.com</p>
              </div>
            </div>

            {/* Exp/New Users & Avatars */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">Exp/New Users</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white font-mono">3,2k</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center">
                    ↑ 4.2%
                  </span>
                </div>
              </div>

              {/* Overlapping Avatars */}
              <div className="flex items-center">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0E131F] bg-blue-500 text-[9px] font-bold text-white flex items-center justify-center">
                    JD
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0E131F] bg-emerald-500 text-[9px] font-bold text-white flex items-center justify-center">
                    MK
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0E131F] bg-amber-500 text-[9px] font-bold text-white flex items-center justify-center">
                    SL
                  </div>
                  <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0E131F] bg-purple-500 text-[9px] font-bold text-white flex items-center justify-center">
                    +8
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ACTIVITY DONUT */}
          <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Activity
              </h3>
              <button
                onClick={() => notify('Inspecting activity logs...')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              {/* Circular Ring Gauge */}
              <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#1E2638" strokeWidth="8" fill="transparent" />
                  {/* Segment 1: Cyan */}
                  <circle cx="50" cy="50" r="40" stroke="#00E5FF" strokeWidth="8" strokeDasharray="100 251.2" strokeDashoffset="0" fill="transparent" strokeLinecap="round" />
                  {/* Segment 2: Amber */}
                  <circle cx="50" cy="50" r="40" stroke="#FFB300" strokeWidth="8" strokeDasharray="60 251.2" strokeDashoffset="-110" fill="transparent" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-black text-white font-mono leading-none">
                    $32,45
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5">Today</span>
                </div>
              </div>

              {/* Activity Categories Breakdown */}
              <div className="space-y-1.5 text-[11px] font-mono flex-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5 font-sans"><span className="w-2 h-2 rounded-full bg-blue-400" />Dinner</span>
                  <span className="font-bold text-white">12%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5 font-sans"><span className="w-2 h-2 rounded-full bg-amber-400" />Food</span>
                  <span className="font-bold text-white">42%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5 font-sans"><span className="w-2 h-2 rounded-full bg-emerald-400" />Housing</span>
                  <span className="font-bold text-white">22%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5 font-sans"><span className="w-2 h-2 rounded-full bg-cyan-400" />Online Shop</span>
                  <span className="font-bold text-white">45%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1.5 font-sans"><span className="w-2 h-2 rounded-full bg-purple-400" />Beauty</span>
                  <span className="font-bold text-white">52%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. FORTHCOMING TIMETABLE (Desktop vs Mobile Users) */}
          <div className="p-5 rounded-2xl bg-[#0E131F] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide border-b border-white/5 pb-2">
              Forthcoming Timetable
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              {/* Desktop Users */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-sans">Desktop Users</span>
                <div className="text-lg font-black text-white">21.54%</div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '21.54%' }} />
                </div>
                <span className="text-[10px] text-amber-500 block">-21% Last Month</span>
              </div>

              {/* Mobile Users */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-sans">Mobile Users</span>
                <div className="text-lg font-black text-white">75.21%</div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75.21%' }} />
                </div>
                <span className="text-[10px] text-blue-400 block">+45% Last Month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
