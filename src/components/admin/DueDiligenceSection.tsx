import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ShieldAlert,
  Search,
  Settings,
  History,
  HelpCircle,
  Bell,
  Pencil,
  FileText,
  Download,
  Phone,
  Mail,
  Building,
  Calendar,
  Globe,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  Eye,
  Sliders,
  Filter
} from 'lucide-react';
import { User, Transaction } from '../../types';

interface DueDiligenceSectionProps {
  currentUser?: User;
  users?: User[];
  transactions?: Transaction[];
}

interface RelatedParty {
  id: string;
  name: string;
  role: string;
  ownership: string;
  phone: string;
  email: string;
  companyName: string;
  country: string;
  entityType: string;
  accountOpeningDate: string;
  category: 'beneficial' | 'directors' | 'controllers';
}

const SAMPLE_PARTIES: RelatedParty[] = [
  {
    id: 'p-1',
    name: 'Stephanie Georg',
    role: 'Primary Owner',
    ownership: '60% Ownership',
    phone: '+1 410 7122334455',
    email: 'steph@defi.com',
    companyName: 'DeFi Ltd',
    country: 'UK',
    entityType: 'Corporation',
    accountOpeningDate: '05-Jan-2026',
    category: 'beneficial'
  },
  {
    id: 'p-2',
    name: 'Marcus Sterling',
    role: 'Executive Director',
    ownership: '25% Ownership',
    phone: '+44 20 7946 0991',
    email: 'm.sterling@defiltd.co.uk',
    companyName: 'DeFi Ltd',
    country: 'UK',
    entityType: 'Corporation',
    accountOpeningDate: '12-Feb-2026',
    category: 'directors'
  },
  {
    id: 'p-3',
    name: 'Elena Rostova',
    role: 'Chief Risk Officer',
    ownership: 'Key Controller',
    phone: '+971 4 889 0142',
    email: 'compliance@defiltd.ae',
    companyName: 'DeFi Capital ME',
    country: 'United Arab Emirates',
    entityType: 'Holding Entity',
    accountOpeningDate: '28-Jan-2026',
    category: 'controllers'
  }
];

interface MonitoringRow {
  id: string;
  date: string;
  type: 'Credit' | 'Debit';
  amount: string;
  alerts: number;
  alertLevel: 'low' | 'medium' | 'high';
  paymentRef: string;
  time: string;
  attachment: string;
}

const MONITORING_ROWS: MonitoringRow[] = [
  {
    id: 'm-1',
    date: 'Jul 8, 2026',
    type: 'Credit',
    amount: '$10,000',
    alerts: 45,
    alertLevel: 'low',
    paymentRef: 'TRV123456789D',
    time: '03:15:00',
    attachment: 'invoice.pdf'
  },
  {
    id: 'm-2',
    date: 'Jul 21, 2026',
    type: 'Debit',
    amount: '$8,000',
    alerts: 80,
    alertLevel: 'medium',
    paymentRef: 'INV6678544221B',
    time: '02:45:30',
    attachment: 'Receipt.pdf'
  },
  {
    id: 'm-3',
    date: 'Aug 01, 2026',
    type: 'Credit',
    amount: '$24,000',
    alerts: 72,
    alertLevel: 'high',
    paymentRef: 'DEF1122334453',
    time: '04:00:21',
    attachment: 'Statement.pdf'
  },
  {
    id: 'm-4',
    date: 'Aug 08, 2026',
    type: 'Debit',
    amount: '$18,500',
    alerts: 55,
    alertLevel: 'low',
    paymentRef: 'TX990823411A',
    time: '05:22:14',
    attachment: 'WireConfirmation.pdf'
  }
];

const MONITORING_CHART_DATA = [
  { month: 'Jan', credit: 28, debit: 18 },
  { month: 'Feb', credit: 42, debit: 25 },
  { month: 'Mar', credit: 38, debit: 31 },
  { month: 'Apr', credit: 45, debit: 22 },
  { month: 'May', credit: 40, debit: 29 },
  { month: 'Jun', credit: 48, debit: 35 },
  { month: 'Jul', credit: 52, debit: 28 },
  { month: 'Aug', credit: 32, debit: 24 }
];

const TRANSACTION_HISTORY_BARS = [
  { date: 'July 1', suspended: 8, cleared: 14, suspendedVal: 18000, clearedVal: 32000 },
  { date: 'July 5', suspended: 12, cleared: 18, suspendedVal: 22000, clearedVal: 41000 },
  { date: 'July 10', suspended: 22, cleared: 15, suspendedVal: 35000, clearedVal: 28000, highlightSuspended: '$35,000' },
  { date: 'July 15', suspended: 14, cleared: 20, suspendedVal: 19000, clearedVal: 44000 },
  { date: 'Aug 4', suspended: 10, cleared: 28, suspendedVal: 15000, clearedVal: 55000, highlightCleared: '$55,000' },
  { date: 'Aug 6', suspended: 15, cleared: 22, suspendedVal: 21000, clearedVal: 48000 },
  { date: 'Aug 8', suspended: 12, cleared: 24, suspendedVal: 17000, clearedVal: 52000 },
];

export const DueDiligenceSection: React.FC<DueDiligenceSectionProps> = () => {
  const [partyCategory, setPartyCategory] = useState<'beneficial' | 'directors' | 'controllers'>('beneficial');
  const [selectedParty, setSelectedParty] = useState<RelatedParty>(SAMPLE_PARTIES[0]);
  const [isMasked, setIsMasked] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);
  const [viewDetailsModal, setViewDetailsModal] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'SUSPENDED' | 'CLEARED'>('ALL');

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const currentParty = SAMPLE_PARTIES.find(p => p.category === partyCategory) || selectedParty;

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-[#00E676]/40 text-[#00E676] text-xs font-mono shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#00E676]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER GRADIENT RIBBON (Matches screenshot ribbon exactly) */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-0.5 bg-gradient-to-r from-[#9C27B0] via-[#E91E63] via-[#FF5722] via-[#FFCA28] to-[#00E676]">
        <div className="bg-gradient-to-r from-[#8E24AA] via-[#E91E63] via-[#FF5722] via-[#FFB300] to-[#00E676] px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black/25 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shadow-inner">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight drop-shadow-md">
                Due Diligence Dashboard
              </h2>
              <span className="text-[11px] font-semibold text-white/90 drop-shadow">
                FinTech AML/CFT & Institutional Compliance Monitoring System
              </span>
            </div>
          </div>

          {/* Right Utility Bar */}
          <div className="flex items-center gap-2.5">
            {/* Mask Pill Button */}
            <button
              onClick={() => {
                setIsMasked(!isMasked);
                showNotification(isMasked ? 'Customer PII unmasked for privileged auditor.' : 'Customer PII masked for presentation mode.');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFD600] text-slate-950 text-xs font-black shadow-md hover:bg-yellow-300 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isMasked ? 'Unmask PII' : 'Mask'}</span>
            </button>

            <button
              onClick={() => showNotification('Audit trail & compliance log synched.')}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all border border-white/10"
              title="Audit Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewDetailsModal('HISTORY_LOG')}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all border border-white/10"
              title="Change History"
            >
              <History className="w-4 h-4" />
            </button>

            <button
              onClick={() => showNotification('Documentation & FinTech guidelines: FATF & FinCEN compliance standard v4.2')}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all border border-white/10"
              title="Help & Regulatory Guide"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => showNotification('3 suspicious transaction alerts pending review.')}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all border border-white/10"
                title="Alerts"
              >
                <Bell className="w-4 h-4" />
              </button>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            </div>

            {/* Officer Avatar Badge */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-white/30">
              <div className="w-8 h-8 rounded-full bg-slate-950 text-white font-black text-xs flex items-center justify-center border-2 border-white/40 shadow-md">
                PR
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-ROW BENTO GRID MATCHING SCREENSHOT EXACTLY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CARD 1: TRANSACTION OVERVIEW (Col 1-3 on LG) */}
        <div className="lg:col-span-3 rounded-2xl bg-[#0F1420] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Transaction Overview
            </h3>
            <button 
              onClick={() => showNotification('Configuring risk calculation parameters...')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <Pencil className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

          {/* Donut Chart with Inner Badge and Total */}
          <div className="my-5 flex flex-col items-center justify-center relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* Custom SVG Ring matching screenshot gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  stroke="#1E2638"
                  strokeWidth="14"
                  fill="transparent"
                />
                {/* Low level segment (Green) - ~42% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  stroke="#00E676"
                  strokeWidth="14"
                  strokeDasharray="163.6 389.5"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
                {/* Medium level segment (Orange) - ~34% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  stroke="#FF9100"
                  strokeWidth="14"
                  strokeDasharray="132.4 389.5"
                  strokeDashoffset="-170"
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
                {/* High level segment (Red/Pink) - ~24% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  stroke="#FF3D00"
                  strokeWidth="14"
                  strokeDasharray="93.5 389.5"
                  strokeDashoffset="-310"
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700"
                />
              </svg>

              {/* Inner Center Metrics */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF3D00]/20 text-[#FF5252] border border-[#FF3D00]/40 text-[9px] font-black uppercase tracking-wider mb-0.5">
                  High Alert
                </span>
                <span className="text-3xl font-black text-white font-mono leading-none">
                  190
                </span>
                <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  Total
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-xs">
            <div 
              onClick={() => showNotification('Filtering low-level alerts (80 items)')}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 transition-colors cursor-pointer border border-white/5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#00E676]" />
                <span className="text-slate-300 font-sans text-xs">Low Level Alerts</span>
              </div>
              <span className="font-bold text-white text-sm">80</span>
            </div>

            <div 
              onClick={() => showNotification('Filtering medium-level alerts (65 items)')}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 transition-colors cursor-pointer border border-white/5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#FF9100]" />
                <span className="text-slate-300 font-sans text-xs">Medium Level Alerts</span>
              </div>
              <span className="font-bold text-white text-sm">65</span>
            </div>

            <div 
              onClick={() => showNotification('Filtering high-level alerts (45 items)')}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 transition-colors cursor-pointer border border-white/5"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-[3px] bg-[#FF3D00]" />
                <span className="text-slate-300 font-sans text-xs">High Level Alerts</span>
              </div>
              <span className="font-bold text-white text-sm">45</span>
            </div>
          </div>
        </div>

        {/* CARD 2: RELATED PARTIES (Col 4-6 on LG) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0F1420] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Related Parties
              </h3>
              <button 
                onClick={() => setViewDetailsModal('RELATED_PARTIES_EDIT')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {/* Pill Filters */}
            <div className="flex items-center gap-1.5 mb-5 flex-wrap">
              <button
                onClick={() => setPartyCategory('beneficial')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  partyCategory === 'beneficial'
                    ? 'bg-[#9C27B0] text-white shadow-[0_0_12px_rgba(156,39,176,0.5)]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Beneficial Owners
              </button>
              <button
                onClick={() => setPartyCategory('directors')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  partyCategory === 'directors'
                    ? 'bg-[#9C27B0] text-white shadow-[0_0_12px_rgba(156,39,176,0.5)]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Directors
              </button>
              <button
                onClick={() => setPartyCategory('controllers')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  partyCategory === 'controllers'
                    ? 'bg-[#9C27B0] text-white shadow-[0_0_12px_rgba(156,39,176,0.5)]'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Key Controllers
              </button>
            </div>

            {/* Entity Profile Information */}
            <div className="space-y-4">
              <div>
                <h4 className="text-2xl font-black text-white tracking-tight">
                  {isMasked ? '•••••••• •••••' : currentParty.name}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-white/5">
                    {currentParty.role}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-white/5">
                    {currentParty.ownership}
                  </span>
                </div>
              </div>

              {/* Contact Icons Row */}
              <div className="flex items-center gap-4 text-xs font-mono text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isMasked ? '+1 ••• •••••••' : currentParty.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isMasked ? '•••••@defi.com' : currentParty.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2x2 Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5 mt-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[11px]">Name</span>
              <p className="text-white font-semibold font-mono">{currentParty.companyName}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[11px]">Country of Incorporation</span>
              <p className="text-white font-semibold font-mono">{currentParty.country}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[11px]">Entity Type</span>
              <p className="text-white font-semibold font-mono">{currentParty.entityType}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[11px]">Account Opening Date</span>
              <p className="text-white font-semibold font-mono">{currentParty.accountOpeningDate}</p>
            </div>
          </div>
        </div>

        {/* CARD 3: TRANSACTION MONITORING (Col 7-12 on LG) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0F1420] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Transaction Monitoring
              </h3>
              <button 
                onClick={() => showNotification('Exporting monitoring ledger...')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {/* Monitoring Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 text-[11px] border-b border-white/5 pb-2">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Alerts</th>
                    <th className="pb-2 font-medium">Payment Reference</th>
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 font-medium text-right">Attachment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 font-mono text-[11px]">
                  {MONITORING_ROWS.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 text-white">{row.date}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.type === 'Credit' 
                            ? 'text-[#00E676] bg-[#00E676]/10' 
                            : 'text-[#E91E63] bg-[#E91E63]/10'
                        }`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-bold text-white">{row.amount}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white ${
                          row.alertLevel === 'low' 
                            ? 'bg-[#00E676]' 
                            : row.alertLevel === 'medium' 
                            ? 'bg-[#FF9100]' 
                            : 'bg-[#FF3D00]'
                        }`}>
                          {row.alerts}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400">{row.paymentRef}</td>
                      <td className="py-2.5 text-slate-400">{row.time}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => setSelectedAttachment(row.attachment)}
                          className="text-blue-400 hover:text-blue-300 hover:underline flex items-center justify-end gap-1 ml-auto cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>{row.attachment}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dual Line Chart (Credit vs Debit) */}
          <div className="pt-3 border-t border-white/5 mt-3">
            <div className="flex items-center gap-4 text-xs font-mono mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00E676]" />
                <span className="text-slate-300">Credit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E91E63]" />
                <span className="text-slate-300">Debit</span>
              </div>
            </div>

            <div className="w-full h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONITORING_CHART_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}k`} domain={[10, 60]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E2638', borderRadius: '8px', fontSize: '11px' }}
                    formatter={(val: any) => [`$${val},000 USDT`]}
                  />
                  <Line type="monotone" dataKey="credit" stroke="#00E676" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="debit" stroke="#E91E63" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* CARD 4: ONGOING DUE DILIGENCE (Col 1-7 on LG) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0F1420] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Ongoing Due Diligence
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setViewDetailsModal('SCREENING_DETAILS')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => showNotification('Configuration settings for Watchlist and PEP screening...')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Subheader Pill & Stats Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-white/5 text-xs font-bold text-white flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span>Name Screening</span>
              </div>

              {/* 3 Metric Counters */}
              <div className="flex items-center gap-8 font-mono">
                <div className="text-center">
                  <span className="text-2xl font-black text-white leading-none block">14</span>
                  <span className="text-[10px] text-slate-400 font-sans">Screened</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-white leading-none block">05</span>
                  <span className="text-[10px] text-slate-400 font-sans">Alerts</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-white leading-none block">8s</span>
                  <span className="text-[10px] text-slate-400 font-sans">ART</span>
                </div>
              </div>
            </div>
          </div>

          {/* DOT-MATRIX WORLD MAP WITH RADAR PINGS (Matching screenshot) */}
          <div className="relative w-full h-56 rounded-xl bg-[#090D16] border border-white/5 overflow-hidden flex items-center justify-center p-3">
            {/* World Map SVG dot grid background */}
            <svg className="w-full h-full opacity-60" viewBox="0 0 800 400" fill="none">
              {/* North America Dots */}
              <g fill="#475569">
                <circle cx="160" cy="110" r="2.5" /><circle cx="180" cy="110" r="2.5" /><circle cx="200" cy="110" r="2.5" /><circle cx="220" cy="110" r="2.5" /><circle cx="240" cy="110" r="2.5" />
                <circle cx="150" cy="130" r="2.5" /><circle cx="170" cy="130" r="2.5" /><circle cx="190" cy="130" r="2.5" /><circle cx="210" cy="130" r="2.5" /><circle cx="230" cy="130" r="2.5" /><circle cx="250" cy="130" r="2.5" />
                <circle cx="160" cy="150" r="2.5" /><circle cx="180" cy="150" r="2.5" /><circle cx="200" cy="150" r="2.5" /><circle cx="220" cy="150" r="2.5" /><circle cx="240" cy="150" r="2.5" /><circle cx="260" cy="150" r="2.5" />
                <circle cx="170" cy="170" r="2.5" /><circle cx="190" cy="170" r="2.5" /><circle cx="210" cy="170" r="2.5" /><circle cx="230" cy="170" r="2.5" /><circle cx="250" cy="170" r="2.5" />
                <circle cx="180" cy="190" r="2.5" /><circle cx="200" cy="190" r="2.5" /><circle cx="220" cy="190" r="2.5" /><circle cx="240" cy="190" r="2.5" />
                
                {/* South America Dots */}
                <circle cx="260" cy="240" r="2.5" /><circle cx="280" cy="240" r="2.5" /><circle cx="300" cy="240" r="2.5" />
                <circle cx="270" cy="260" r="2.5" /><circle cx="290" cy="260" r="2.5" /><circle cx="310" cy="260" r="2.5" />
                <circle cx="280" cy="280" r="2.5" /><circle cx="300" cy="280" r="2.5" /><circle cx="320" cy="280" r="2.5" />
                <circle cx="290" cy="300" r="2.5" /><circle cx="310" cy="300" r="2.5" />
                <circle cx="300" cy="320" r="2.5" /><circle cx="310" cy="340" r="2.5" />

                {/* Europe Dots */}
                <circle cx="410" cy="110" r="2.5" /><circle cx="430" cy="110" r="2.5" /><circle cx="450" cy="110" r="2.5" /><circle cx="470" cy="110" r="2.5" />
                <circle cx="400" cy="130" r="2.5" /><circle cx="420" cy="130" r="2.5" /><circle cx="440" cy="130" r="2.5" /><circle cx="460" cy="130" r="2.5" /><circle cx="480" cy="130" r="2.5" />
                <circle cx="410" cy="150" r="2.5" /><circle cx="430" cy="150" r="2.5" /><circle cx="450" cy="150" r="2.5" /><circle cx="470" cy="150" r="2.5" />

                {/* Africa Dots */}
                <circle cx="420" cy="190" r="2.5" /><circle cx="440" cy="190" r="2.5" /><circle cx="460" cy="190" r="2.5" /><circle cx="480" cy="190" r="2.5" />
                <circle cx="430" cy="210" r="2.5" /><circle cx="450" cy="210" r="2.5" /><circle cx="470" cy="210" r="2.5" />
                <circle cx="440" cy="230" r="2.5" /><circle cx="460" cy="230" r="2.5" /><circle cx="480" cy="230" r="2.5" />
                <circle cx="450" cy="250" r="2.5" /><circle cx="470" cy="250" r="2.5" />
                <circle cx="460" cy="270" r="2.5" />

                {/* Asia Dots */}
                <circle cx="520" cy="100" r="2.5" /><circle cx="540" cy="100" r="2.5" /><circle cx="560" cy="100" r="2.5" /><circle cx="580" cy="100" r="2.5" /><circle cx="600" cy="100" r="2.5" />
                <circle cx="510" cy="120" r="2.5" /><circle cx="530" cy="120" r="2.5" /><circle cx="550" cy="120" r="2.5" /><circle cx="570" cy="120" r="2.5" /><circle cx="590" cy="120" r="2.5" /><circle cx="610" cy="120" r="2.5" />
                <circle cx="520" cy="140" r="2.5" /><circle cx="540" cy="140" r="2.5" /><circle cx="560" cy="140" r="2.5" /><circle cx="580" cy="140" r="2.5" /><circle cx="600" cy="140" r="2.5" /><circle cx="620" cy="140" r="2.5" />
                <circle cx="530" cy="160" r="2.5" /><circle cx="550" cy="160" r="2.5" /><circle cx="570" cy="160" r="2.5" /><circle cx="590" cy="160" r="2.5" /><circle cx="610" cy="160" r="2.5" />
                <circle cx="560" cy="190" r="2.5" /><circle cx="580" cy="190" r="2.5" /><circle cx="600" cy="190" r="2.5" />

                {/* Australia Dots */}
                <circle cx="660" cy="270" r="2.5" /><circle cx="680" cy="270" r="2.5" /><circle cx="700" cy="270" r="2.5" />
                <circle cx="650" cy="290" r="2.5" /><circle cx="670" cy="290" r="2.5" /><circle cx="690" cy="290" r="2.5" />
                <circle cx="660" cy="310" r="2.5" /><circle cx="680" cy="310" r="2.5" />
              </g>

              {/* RADAR PIN MARKERS MATCHING SCREENSHOT (Green radar caps + beacon rings) */}
              {/* 1. North America / USA */}
              <g transform="translate(200, 140)">
                <ellipse cx="0" cy="0" rx="16" ry="7" fill="none" stroke="#00E676" strokeWidth="1.5" className="animate-ping opacity-75" />
                <path d="M-8 0 L8 0 L4 -14 L-4 -14 Z" fill="#00E676" fillOpacity="0.85" />
                <circle cx="0" cy="-14" r="3" fill="#FFFFFF" />
              </g>

              {/* 2. Europe / UK */}
              <g transform="translate(420, 130)">
                <ellipse cx="0" cy="0" rx="16" ry="7" fill="none" stroke="#00E676" strokeWidth="1.5" className="animate-ping opacity-75" />
                <path d="M-8 0 L8 0 L4 -14 L-4 -14 Z" fill="#00E676" fillOpacity="0.85" />
                <circle cx="0" cy="-14" r="3" fill="#FFFFFF" />
              </g>

              {/* 3. South America */}
              <g transform="translate(290, 270)">
                <ellipse cx="0" cy="0" rx="16" ry="7" fill="none" stroke="#00E676" strokeWidth="1.5" className="animate-ping opacity-75" />
                <path d="M-8 0 L8 0 L4 -14 L-4 -14 Z" fill="#00E676" fillOpacity="0.85" />
                <circle cx="0" cy="-14" r="3" fill="#FFFFFF" />
              </g>

              {/* 4. India / South Asia */}
              <g transform="translate(560, 180)">
                <ellipse cx="0" cy="0" rx="16" ry="7" fill="none" stroke="#00E676" strokeWidth="1.5" className="animate-ping opacity-75" />
                <path d="M-8 0 L8 0 L4 -14 L-4 -14 Z" fill="#00E676" fillOpacity="0.85" />
                <circle cx="0" cy="-14" r="3" fill="#FFFFFF" />
              </g>

              {/* 5. Australia */}
              <g transform="translate(680, 290)">
                <ellipse cx="0" cy="0" rx="16" ry="7" fill="none" stroke="#00E676" strokeWidth="1.5" className="animate-ping opacity-75" />
                <path d="M-8 0 L8 0 L4 -14 L-4 -14 Z" fill="#00E676" fillOpacity="0.85" />
                <circle cx="0" cy="-14" r="3" fill="#FFFFFF" />
              </g>
            </svg>

            {/* TOP COUNTRIES FLOATING CARD (Matches bottom right box in screenshot) */}
            <div className="absolute bottom-3 right-3 p-3 rounded-xl bg-[#0B0F19]/90 backdrop-blur-md border border-white/10 shadow-lg text-xs space-y-2 min-w-[130px]">
              <span className="text-[11px] font-bold text-white block border-b border-white/10 pb-1">
                Top Countries
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF3D00]" />
                  <span className="text-slate-300 font-sans">India</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFB300]" />
                  <span className="text-slate-300 font-sans">UK</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E676]" />
                  <span className="text-slate-300 font-sans">United States</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00E676]" />
                  <span className="text-slate-300 font-sans">Australia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: TRANSACTION HISTORY (Col 8-12 on LG) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0F1420] border border-white/10 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Transaction History
              </h3>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setViewDetailsModal('HISTORY_DETAILS')}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => showNotification('Filtering transaction history parameter ranges...')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>

            {/* Quick Metrics: Suspended (12) and Cleared (15) */}
            <div className="flex items-center gap-8 mb-4 font-mono">
              <div 
                onClick={() => setHistoryFilter(historyFilter === 'SUSPENDED' ? 'ALL' : 'SUSPENDED')}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                  historyFilter === 'SUSPENDED' ? 'bg-rose-500/20 border border-rose-500/40' : 'hover:bg-slate-800/40'
                }`}
              >
                <span className="text-3xl font-black text-white leading-none">12</span>
                <div className="flex items-center gap-1.5 text-xs font-sans">
                  <span className="w-2 h-2 rounded-full bg-[#FF3D00]" />
                  <span className="text-slate-400">Suspended</span>
                </div>
              </div>

              <div 
                onClick={() => setHistoryFilter(historyFilter === 'CLEARED' ? 'ALL' : 'CLEARED')}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                  historyFilter === 'CLEARED' ? 'bg-emerald-500/20 border border-emerald-500/40' : 'hover:bg-slate-800/40'
                }`}
              >
                <span className="text-3xl font-black text-white leading-none">15</span>
                <div className="flex items-center gap-1.5 text-xs font-sans">
                  <span className="w-2 h-2 rounded-full bg-[#00E676]" />
                  <span className="text-slate-400">Cleared</span>
                </div>
              </div>
            </div>
          </div>

          {/* DUAL COLOR BAR CHART WITH HIGHLIGHT BADGES ($35,000 and $55,000) */}
          <div className="relative w-full h-56 pt-2">
            {/* Callout badges matching screenshot exactly */}
            <div className="absolute top-2 left-[36%] -translate-x-1/2 z-10">
              <span className="px-2 py-0.5 rounded bg-[#FF5252] text-white text-[10px] font-black font-mono shadow-md">
                $35,000
              </span>
            </div>
            <div className="absolute top-0 left-[68%] -translate-x-1/2 z-10">
              <span className="px-2 py-0.5 rounded bg-[#00E676] text-slate-950 text-[10px] font-black font-mono shadow-md">
                $55,000
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TRANSACTION_HISTORY_BARS} margin={{ top: 25, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 30]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E2638', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(val: any, name: any) => [
                    `${val} transactions`, 
                    name === 'cleared' ? 'Cleared' : 'Suspended'
                  ]}
                />
                <Bar 
                  dataKey="suspended" 
                  fill="#FF5252" 
                  radius={[3, 3, 0, 0]} 
                  opacity={historyFilter === 'CLEARED' ? 0.2 : 1}
                />
                <Bar 
                  dataKey="cleared" 
                  fill="#00E676" 
                  radius={[3, 3, 0, 0]} 
                  opacity={historyFilter === 'SUSPENDED' ? 0.2 : 1}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* DOCUMENT ATTACHMENT PREVIEW MODAL */}
      {selectedAttachment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#0F1420] border border-white/10 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Document Preview: {selectedAttachment}</span>
              </div>
              <button 
                onClick={() => setSelectedAttachment(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#090D16] border border-white/5 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Verification Authority:</span>
                <span className="text-[#00E676] font-bold">Secured & Digitally Signed</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>File Format:</span>
                <span className="text-white">Adobe PDF (Encrypted AES-256)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Hash (SHA-256):</span>
                <span className="text-slate-400 text-[10px]">7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f...</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>AML Clearance:</span>
                <span className="text-[#00E676]">PASSED (Sanctions & PEP Clear)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedAttachment(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showNotification(`Downloading authenticated copy of ${selectedAttachment}...`);
                  setSelectedAttachment(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-500/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Authenticated Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-[#0F1420] border border-white/10 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>
                  {viewDetailsModal === 'SCREENING_DETAILS' && 'Ongoing Screening & Watchlist Hits'}
                  {viewDetailsModal === 'HISTORY_DETAILS' && 'Suspended Transaction Review Queue'}
                  {viewDetailsModal === 'HISTORY_LOG' && 'Audit History & Compliance Events'}
                  {viewDetailsModal === 'RELATED_PARTIES_EDIT' && 'Beneficial Ownership & Corporate Registry'}
                </span>
              </h3>
              <button 
                onClick={() => setViewDetailsModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              {viewDetailsModal === 'SCREENING_DETAILS' && (
                <div className="space-y-3">
                  <p className="text-slate-400">
                    Continuous sanctions list matching against OFAC, EU Financial Sanctions, UK HMT, and Interpol Red Notices:
                  </p>
                  <div className="divide-y divide-white/5 border border-white/5 rounded-xl bg-slate-900/60 font-mono">
                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <div className="text-white font-bold font-sans">Apex Holdings Trust</div>
                        <div className="text-slate-400 text-[11px]">Match Score: 89% · Potential Politically Exposed Person (PEP)</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px]">Under Review</span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <div>
                        <div className="text-white font-bold font-sans">David Reynolds Corp</div>
                        <div className="text-slate-400 text-[11px]">Match Score: 12% · False Positive Resolved</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">Cleared</span>
                    </div>
                  </div>
                </div>
              )}

              {viewDetailsModal === 'HISTORY_DETAILS' && (
                <div className="space-y-3">
                  <p className="text-slate-400">
                    12 transactions currently suspended pending secondary verification or Source of Wealth declarations:
                  </p>
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex justify-between items-center">
                      <div>
                        <span className="text-rose-400 font-bold">$35,000 USDT (Wire Deposit)</span>
                        <div className="text-slate-400 text-[10px]">Ref: TX-9021882 · High velocity transfer from high-risk jurisdiction</div>
                      </div>
                      <button 
                        onClick={() => {
                          showNotification('Transaction released and credited to customer account.');
                          setViewDetailsModal(null);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs"
                      >
                        Release Funds
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {viewDetailsModal === 'HISTORY_LOG' && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                    <span className="text-slate-300">2026-08-08 14:15:02</span>
                    <span className="text-white">Admin approved $55,000 institutional withdrawal for DeFi Ltd</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                    <span className="text-slate-300">2026-08-06 09:20:11</span>
                    <span className="text-white">PEP screening threshold updated to 85% by Compliance Officer</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/5 flex justify-between">
                    <span className="text-slate-300">2026-08-01 18:44:30</span>
                    <span className="text-rose-400">Automated suspension triggered on $35,000 unverified inbound transaction</span>
                  </div>
                </div>
              )}

              {viewDetailsModal === 'RELATED_PARTIES_EDIT' && (
                <div className="space-y-3 font-sans">
                  <p className="text-slate-400">
                    Verify official Companies House & corporate ownership records for primary account holder:
                  </p>
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[10px]">Registry Certificate:</span>
                      <span className="text-white font-bold">UK Companies House #1289943</span>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-white/5">
                      <span className="text-slate-400 block text-[10px]">Ultimate Beneficial Owner (UBO):</span>
                      <span className="text-white font-bold">Stephanie Georg (60%)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setViewDetailsModal(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
