import React, { useState, useEffect } from 'react';
import { 
  User, 
  Trade, 
  Transaction, 
  AppNotification, 
  Conversation, 
  ChatMessage, 
  AdminStats 
} from '../../types';
import { storage } from '../../lib/storage';
import { INITIAL_COINS, formatPrice } from '../../lib/market-data';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  LayoutDashboard, 
  Users, 
  CandlestickChart, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  MessageSquare, 
  Megaphone, 
  FileText, 
  ShieldCheck, 
  Settings, 
  Search, 
  Plus, 
  Filter, 
  Check, 
  X, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  DollarSign, 
  Bell, 
  Send, 
  Download, 
  RefreshCw,
  Eye,
  Key,
  Globe,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  UserCheck,
  Coins,
  Server,
  ShieldAlert,
  Sparkles,
  Radio
} from 'lucide-react';
import { AgentManagementSection } from '../admin/AgentManagementSection';
import { InvitationManagementSection } from '../admin/InvitationManagementSection';
import { LeadManagementSection } from '../admin/LeadManagementSection';
import { AuditSecuritySection } from '../admin/AuditSecuritySection';
import { ReportsExportSection } from '../admin/ReportsExportSection';
import { DueDiligenceSection } from '../admin/DueDiligenceSection';
import { BitVistaOverviewSection } from '../admin/BitVistaOverviewSection';
import { DeviceAnalyticsSection } from '../admin/DeviceAnalyticsSection';
import { generateComprehensivePlatformPDF } from '../../lib/pdfReportGenerator';
import { PaymentGatewayConfig, SystemSettings } from '../../types';

interface AdminDashboardProps {
  currentUser: User;
}

type AdminSection = 
  | 'dashboard'
  | 'analytics'
  | 'duediligence'
  | 'users'
  | 'agents'
  | 'invitations'
  | 'leads'
  | 'trades'
  | 'wallet'
  | 'market'
  | 'payments'
  | 'messages'
  | 'broadcast'
  | 'reports'
  | 'security'
  | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [users, setUsers] = useState<User[]>(() => storage.getUsers());
  const [trades, setTrades] = useState<Trade[]>(() => storage.getTrades());
  const [transactions, setTransactions] = useState<Transaction[]>(() => storage.getTransactions());
  const [conversations, setConversations] = useState<Conversation[]>(() => storage.getConversations());
  const [stats, setStats] = useState<AdminStats>(() => storage.getAdminStats());
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(() => storage.getPaymentGateways());
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => storage.getSystemSettings());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dashboardSubView, setDashboardSubView] = useState<'due_diligence' | 'bitvista' | 'operations' | 'analytics'>('analytics');
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleDownloadPDF = () => {
    try {
      setIsExportingPDF(true);
      showToast('Compiling comprehensive platform PDF (Storefront, Admin & All Dashboards)...');
      setTimeout(() => {
        const { doc, filename } = generateComprehensivePlatformPDF({
          generatedBy: currentUser?.email || 'Super Administrator'
        });
        doc.save(filename);
        setIsExportingPDF(false);
        showToast(`Success! Downloaded ${filename}`);
      }, 600);
    } catch (e) {
      setIsExportingPDF(false);
      showToast('Failed to compile PDF report.');
    }
  };

  // Modals & Action States
  const [searchUser, setSearchUser] = useState('');
  const [selectedUserForAction, setSelectedUserForAction] = useState<User | null>(null);
  const [balanceAdjustAmount, setBalanceAdjustAmount] = useState<number>(500);
  const [balanceAdjustAction, setBalanceAdjustAction] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [freezeWithdrawalsMaster, setFreezeWithdrawalsMaster] = useState(false);
  const [maintenanceModeMaster, setMaintenanceModeMaster] = useState(false);

  // Messaging active conversation
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>(() => 
    conversations[0] ? storage.getMessages(conversations[0].id) : []
  );

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');

  // IP Whitelist
  const [ipList, setIpList] = useState<string[]>(['192.168.1.1/32', '10.0.0.1/24', '172.16.0.44']);
  const [newIp, setNewIp] = useState('');

  // Sync with storage service
  useEffect(() => {
    return storage.subscribe(() => {
      setUsers(storage.getUsers());
      setTrades(storage.getTrades());
      setTransactions(storage.getTransactions());
      setConversations(storage.getConversations());
      setStats(storage.getAdminStats());
      setGateways(storage.getPaymentGateways());
      setSystemSettings(storage.getSystemSettings());
    });
  }, []);

  useEffect(() => {
    if (activeConvId) {
      setActiveMessages(storage.getMessages(activeConvId));
    }
  }, [activeConvId, conversations]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const navMenuItems = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Device & Location Analytics', icon: Radio, badge: storage.getActiveDevices().filter(d => d.status === 'ONLINE').length },
    { id: 'bitvista', label: 'BitVista Business Overview', icon: Sparkles },
    { id: 'duediligence', label: 'Due Diligence & AML', icon: ShieldAlert, badge: 190 },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'agents', label: 'Sub-Agents (5 Desks)', icon: ShieldCheck, badge: users.filter(u => u.role === 'SUB_AGENT').length },
    { id: 'invitations', label: 'Invitation Codes', icon: Key },
    { id: 'leads', label: 'Investor CRM Leads', icon: UserCheck, badge: storage.getLeads().filter(l => l.status === 'NEW').length },
    { id: 'trades', label: 'Trade Contracts', icon: CandlestickChart, badge: trades.filter(t => t.status === 'ACTIVE').length },
    { id: 'wallet', label: 'Wallet & Liquidity', icon: Wallet, badge: transactions.filter(t => t.status === 'PENDING').length },
    { id: 'market', label: 'Market Pairs', icon: TrendingUp },
    { id: 'payments', label: 'Payment Gateways', icon: CreditCard },
    { id: 'messages', label: 'Customer Support Desk', icon: MessageSquare, badge: conversations.reduce((a, c) => a + c.unreadAdminCount, 0) },
    { id: 'broadcast', label: 'Broadcast & Alerts', icon: Megaphone },
    { id: 'reports', label: 'Reports & CSV Exports', icon: FileSpreadsheet },
    { id: 'security', label: 'Security & Audit Logs', icon: ShieldAlert },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ];

  // User Actions
  const handleApplyBalanceAdjust = () => {
    if (!selectedUserForAction) return;
    const current = selectedUserForAction.balance;
    const updated = balanceAdjustAction === 'CREDIT'
      ? Number((current + balanceAdjustAmount).toFixed(2))
      : Math.max(0, Number((current - balanceAdjustAmount).toFixed(2)));

    storage.updateUser(selectedUserForAction.id, { balance: updated });
    storage.addTransaction({
      userId: selectedUserForAction.id,
      userName: selectedUserForAction.name,
      userEmail: selectedUserForAction.email,
      type: 'ADMIN_ADJUST',
      amount: balanceAdjustAmount,
      method: 'Super Admin Manual Adjustment',
      status: 'APPROVED',
      notes: `${balanceAdjustAction} $${balanceAdjustAmount} USDT applied by Super Admin.`,
    });

    storage.addNotification({
      userId: selectedUserForAction.id,
      title: 'Wallet Balance Adjusted by Operations',
      body: `Your account balance was adjusted by ${balanceAdjustAction === 'CREDIT' ? '+' : '-'}$${balanceAdjustAmount} USDT. Current balance: $${updated} USDT.`,
      type: 'info',
    });

    showToast(`Successfully ${balanceAdjustAction.toLowerCase()}ed $${balanceAdjustAmount} USDT for ${selectedUserForAction.name}`);
    setSelectedUserForAction(null);
  };

  const handleToggleUserFreeze = (targetUser: User) => {
    const next = targetUser.status === 'ACTIVE' ? 'FROZEN' : 'ACTIVE';
    storage.updateUser(targetUser.id, { status: next });
    showToast(`User ${targetUser.name} status updated to ${next}.`);
  };

  // Trade Actions
  const handleForceTrade = (tradeId: string, outcome: 'WIN' | 'LOSE') => {
    const all = storage.getTrades();
    const trade = all.find(t => t.id === tradeId);
    if (!trade) return;

    // Simulate exit price to produce forced outcome
    const exitPrice = outcome === 'WIN'
      ? (trade.direction === 'UP' ? trade.entryPrice * 1.01 : trade.entryPrice * 0.99)
      : (trade.direction === 'UP' ? trade.entryPrice * 0.99 : trade.entryPrice * 1.01);

    storage.settleTrade(tradeId, Number(exitPrice.toFixed(2)));
    showToast(`Trade ${tradeId} manually forced to ${outcome}`);
  };

  // Messaging reply
  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !activeConvId) return;

    storage.sendMessage(activeConvId, currentUser, adminReplyText.trim());
    setAdminReplyText('');
    showToast('Reply dispatched to customer live desk.');
  };

  // Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastBody.trim()) return;

    storage.addNotification({
      userId: 'ALL',
      title: broadcastTitle.trim(),
      body: broadcastBody.trim(),
      type: 'info',
    });

    setBroadcastTitle('');
    setBroadcastBody('');
    showToast('Broadcast alert successfully published to all platform members.');
  };

  // 7-day revenue chart series
  const revenueSeries = [
    { day: 'Mon', revenue: 6420, volume: 48200 },
    { day: 'Tue', revenue: 7850, volume: 56400 },
    { day: 'Wed', revenue: 9120, volume: 72100 },
    { day: 'Thu', revenue: 8400, volume: 65900 },
    { day: 'Fri', revenue: 11200, volume: 89400 },
    { day: 'Sat', revenue: 13500, volume: 104000 },
    { day: 'Sun', revenue: 14800, volume: 118000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl cb-glass-card border border-emerald-500/50 text-emerald-300 text-xs font-mono shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Shell Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> SUPER ADMIN ENTERPRISE CONTROL
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            COINBASE Operations & Compliance Center
          </h1>
          <p className="text-slate-400 text-sm">
            Institutional compliance, due diligence monitoring, transaction risk analytics, and multi-tier controls.
          </p>
        </div>

        {/* Quick System Status Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Complete Combined Dossier PDF Download */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs font-mono shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Download complete documentation and report covering storefront, admin and all dashboards"
          >
            <Download className={`w-3.5 h-3.5 ${isExportingPDF ? 'animate-bounce' : ''}`} />
            <span>{isExportingPDF ? 'Compiling PDF...' : 'Download Complete PDF (All Sections)'}</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
            <span className="text-slate-400">Withdrawal Gateway:</span>
            <button
              onClick={() => {
                setFreezeWithdrawalsMaster(!freezeWithdrawalsMaster);
                showToast(`Withdrawal master switch set to ${!freezeWithdrawalsMaster ? 'FROZEN' : 'ACTIVE'}`);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                freezeWithdrawalsMaster 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}
            >
              {freezeWithdrawalsMaster ? 'FROZEN' : 'ACTIVE'}
            </button>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono">
            <span className="text-slate-400">Maintenance:</span>
            <button
              onClick={() => {
                setMaintenanceModeMaster(!maintenanceModeMaster);
                showToast(`Platform maintenance mode set to ${!maintenanceModeMaster ? 'ON' : 'OFF'}`);
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                maintenanceModeMaster 
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                  : 'bg-slate-800 text-slate-400 border border-white/5'
              }`}
            >
              {maintenanceModeMaster ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Admin Grid: Sidebar Navigation (Left) + Section Content (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Column */}
        <div className="lg:col-span-1 rounded-2xl cb-glass-card border border-blue-500/20 p-3 space-y-1">
          {navMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as AdminSection)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-[0_0_16px_rgba(0,82,255,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-mono">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Content Column (Span 3) */}
        <div className="lg:col-span-3 space-y-6">
          {/* SECTION 1: DASHBOARD OVERVIEW */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              {/* Top View Mode Switcher */}
              <div className="flex items-center justify-between flex-wrap gap-3 p-1.5 rounded-2xl bg-[#090D16] border border-white/10">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setDashboardSubView('bitvista')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      dashboardSubView === 'bitvista'
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(0,82,255,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>BitVista Business Overview</span>
                  </button>

                  <button
                    onClick={() => setDashboardSubView('due_diligence')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      dashboardSubView === 'due_diligence'
                        ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white shadow-[0_0_20px_rgba(156,39,176,0.5)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>Due Diligence & AML</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-mono font-black">
                      190 ALERTS
                    </span>
                  </button>

                  <button
                    onClick={() => setDashboardSubView('operations')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      dashboardSubView === 'operations'
                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(0,82,255,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                    <span>Trading Operations & Settlement Metrics</span>
                  </button>

                  <button
                    onClick={() => setDashboardSubView('analytics')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      dashboardSubView === 'analytics'
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-[0_0_20px_rgba(0,82,255,0.4)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>Actively Running Devices & Locations</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[9px] font-mono font-black border border-emerald-500/40">
                      LIVE
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 pr-3 hidden sm:flex">
                  <span>Compliance Engine:</span>
                  <span className="text-[#00E676] font-bold">FATF Tier-1 AML/CFT Live</span>
                </div>
              </div>

              {dashboardSubView === 'bitvista' ? (
                <BitVistaOverviewSection currentUser={currentUser} users={users} trades={trades} transactions={transactions} onShowToast={showToast} />
              ) : dashboardSubView === 'due_diligence' ? (
                <DueDiligenceSection currentUser={currentUser} users={users} transactions={transactions} />
              ) : dashboardSubView === 'analytics' ? (
                <DeviceAnalyticsSection onShowToast={showToast} />
              ) : (
                <div className="space-y-6">
                  {/* 8 KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl cb-glass-card border border-blue-500/20 space-y-1">
                      <span className="text-[11px] text-slate-400 font-mono">Total Users</span>
                      <div className="text-xl font-black font-mono text-white">{stats.totalUsers}</div>
                      <span className="text-[10px] text-emerald-400 font-mono">+{stats.activeUsers24h} 24h active</span>
                    </div>

                    <div className="p-4 rounded-2xl cb-glass-card border border-blue-500/20 space-y-1">
                      <span className="text-[11px] text-slate-400 font-mono">Platform Revenue</span>
                      <div className="text-xl font-black font-mono text-emerald-400">
                        ${stats.platformRevenue.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Net house surplus</span>
                    </div>

                    <div className="p-4 rounded-2xl cb-glass-card border border-blue-500/20 space-y-1">
                      <span className="text-[11px] text-slate-400 font-mono">Total Contracts</span>
                      <div className="text-xl font-black font-mono text-blue-400">{stats.totalTrades}</div>
                      <span className="text-[10px] text-blue-300 font-mono">{stats.activeTrades} active</span>
                    </div>

                    <div className="p-4 rounded-2xl cb-glass-card border border-blue-500/20 space-y-1">
                      <span className="text-[11px] text-slate-400 font-mono">Pending Withdrawals</span>
                      <div className="text-xl font-black font-mono text-amber-400">{stats.pendingWithdrawalsCount}</div>
                      <span className="text-[10px] text-amber-300 font-mono">Requires approval</span>
                    </div>
                  </div>

                  {/* 7-Day Revenue Area Chart */}
                  <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          7-Day Platform Net Yield & Settlement Volume
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">Institutional trading spread and contract payouts</p>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        Daily Average: $10,195 USDT
                      </span>
                    </div>

                    <div className="w-full h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueSeries} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0052FF" stopOpacity={0.5}/>
                              <stop offset="95%" stopColor="#0052FF" stopOpacity={0.0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="rgba(59, 130, 246, 0.08)" strokeDasharray="3 3" />
                          <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                          <Tooltip contentStyle={{ backgroundColor: '#050b18', borderColor: '#3b82f6', borderRadius: '12px', fontSize: '12px' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#0052FF" strokeWidth={2.5} fillOpacity={1} fill="url(#adminRevGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Coin Volume Breakdown */}
                  <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-3">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                      Top Active Pair Volumes (24h)
                    </h3>
                    <div className="space-y-3 pt-2">
                      {[
                        { pair: 'BTC/USDT', vol: '$34.8B', pct: 64 },
                        { pair: 'ETH/USDT', vol: '$18.2B', pct: 45 },
                        { pair: 'SOL/USDT', vol: '$6.5B', pct: 28 },
                        { pair: 'BNB/USDT', vol: '$1.4B', pct: 14 },
                      ].map((c) => (
                        <div key={c.pair} className="space-y-1 font-mono text-xs">
                          <div className="flex justify-between text-slate-300">
                            <span className="font-bold">{c.pair}</span>
                            <span>{c.vol}</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${c.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION: DEVICE & GEOLOCATION ANALYTICS */}
          {activeSection === 'analytics' && (
            <DeviceAnalyticsSection onShowToast={showToast} />
          )}

          {/* SECTION 1.4: BITVISTA BUSINESS OVERVIEW */}
          {activeSection === 'bitvista' && (
            <BitVistaOverviewSection currentUser={currentUser} users={users} trades={trades} transactions={transactions} onShowToast={showToast} />
          )}

          {/* SECTION 1.5: DIRECT DUE DILIGENCE & AML SECTION */}
          {activeSection === 'duediligence' && (
            <DueDiligenceSection currentUser={currentUser} users={users} transactions={transactions} />
          )}

          {/* SECTION 2: USER MANAGEMENT */}
          {activeSection === 'users' && (
            <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Platform User Directory ({users.length})</h2>
                  <p className="text-xs text-slate-400">View roles, balance adjustments, freeze permissions, and audit logs.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by UID, email, name..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-blue-500/20 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto cb-scroll">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400">
                      <th className="py-2.5 px-3">UID</th>
                      <th className="py-2.5 px-3">Name / Email</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">Sub-Agent Code</th>
                      <th className="py-2.5 px-3">Balance</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {users
                      .filter(u => 
                        u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
                        u.uid.toLowerCase().includes(searchUser.toLowerCase())
                      )
                      .map(u => {
                        const isFrozen = u.status === 'FROZEN';
                        return (
                          <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-3 font-bold text-blue-400">{u.uid}</td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-white">{u.name}</div>
                              <div className="text-[10px] text-slate-500">{u.email}</div>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                u.role === 'SUPER_ADMIN' 
                                  ? 'bg-amber-500/20 text-amber-300' 
                                  : u.role === 'SUB_AGENT' 
                                  ? 'bg-purple-500/20 text-purple-300' 
                                  : 'bg-blue-500/20 text-blue-300'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              {u.linkedSubAgentId || u.invitationCode || '--'}
                            </td>
                            <td className="py-3 px-3 font-bold text-emerald-400">
                              ${u.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-3">
                              {isFrozen ? (
                                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold">
                                  FROZEN
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                  ACTIVE
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right space-x-1.5">
                              <button
                                onClick={() => setSelectedUserForAction(u)}
                                className="px-2.5 py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-[10px] font-bold border border-blue-500/30"
                              >
                                Adjust Funds
                              </button>
                              {u.role !== 'SUPER_ADMIN' && (
                                <button
                                  onClick={() => handleToggleUserFreeze(u)}
                                  className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                                    isFrozen
                                      ? 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border-emerald-500/30'
                                      : 'bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border-rose-500/30'
                                  }`}
                                >
                                  {isFrozen ? 'Unfreeze' : 'Freeze'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              {/* Adjust Balance Modal */}
              {selectedUserForAction && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-md rounded-2xl cb-glass-card border border-blue-500/30 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="text-base font-bold text-white">Adjust User Balance</h3>
                      <button onClick={() => setSelectedUserForAction(null)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-1 text-xs font-mono">
                      <div className="text-slate-400">Target User: <strong className="text-white">{selectedUserForAction.name} ({selectedUserForAction.uid})</strong></div>
                      <div className="text-slate-400">Current Balance: <strong className="text-emerald-400">${selectedUserForAction.balance.toFixed(2)} USDT</strong></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBalanceAdjustAction('CREDIT')}
                        className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                          balanceAdjustAction === 'CREDIT' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        + CREDIT (Add Funds)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBalanceAdjustAction('DEBIT')}
                        className={`py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                          balanceAdjustAction === 'DEBIT' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        - DEBIT (Deduct)
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-mono">Amount (USDT)</label>
                      <input
                        type="number"
                        min="1"
                        value={balanceAdjustAmount}
                        onChange={(e) => setBalanceAdjustAmount(Math.max(1, Number(e.target.value)))}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-blue-500/30 rounded-xl text-white font-mono text-sm"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setSelectedUserForAction(null)}
                        className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApplyBalanceAdjust}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-white cb-blue-gradient cb-glow"
                      >
                        Apply Adjustment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 3: TRADE MANAGEMENT */}
          {activeSection === 'trades' && (
            <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Contract Execution Management ({trades.length})</h2>
                  <p className="text-xs text-slate-400">Override settlements, inspect active trades, or cancel contract orders.</p>
                </div>
              </div>

              <div className="overflow-x-auto cb-scroll">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400">
                      <th className="py-2.5 px-3">Trade ID</th>
                      <th className="py-2.5 px-3">Trader</th>
                      <th className="py-2.5 px-3">Symbol</th>
                      <th className="py-2.5 px-3">Direction</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status / Result</th>
                      <th className="py-2.5 px-3 text-right">Force Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {trades.map(t => (
                      <tr key={t.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-bold text-blue-400">{t.id}</td>
                        <td className="py-3 px-3 text-white font-semibold">{t.userName}</td>
                        <td className="py-3 px-3">{t.symbol}</td>
                        <td className="py-3 px-3">
                          <span className={t.direction === 'UP' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {t.direction} ({t.duration}s)
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-white">${t.amount.toFixed(2)}</td>
                        <td className="py-3 px-3">
                          {t.status === 'ACTIVE' ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold animate-pulse">
                              ACTIVE (Trading)
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.result === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {t.result} ({t.result === 'WIN' ? `+$${t.profit}` : `-$${t.amount}`})
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          {t.status === 'ACTIVE' ? (
                            <>
                              <button
                                onClick={() => handleForceTrade(t.id, 'WIN')}
                                className="px-2 py-1 rounded bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 text-[10px] font-bold"
                              >
                                Force WIN
                              </button>
                              <button
                                onClick={() => handleForceTrade(t.id, 'LOSE')}
                                className="px-2 py-1 rounded bg-rose-600/30 hover:bg-rose-600 text-rose-300 text-[10px] font-bold"
                              >
                                Force LOSE
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Settled</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 4: WALLET & LIQUIDITY */}
          {activeSection === 'wallet' && (
            <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Deposit & Withdrawal Queue</h2>
                  <p className="text-xs text-slate-400">Audit blockchain deposits and process outgoing wire/crypto transactions.</p>
                </div>
              </div>

              {/* Transactions list */}
              <div className="overflow-x-auto cb-scroll">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400">
                      <th className="py-2.5 px-3">Tx ID</th>
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-bold text-blue-400">{tx.id}</td>
                        <td className="py-3 px-3 text-white font-semibold">{tx.userName}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'DEPOSIT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-bold text-white">${tx.amount.toFixed(2)}</td>
                        <td className="py-3 px-3 text-slate-400">{tx.method}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                            tx.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          {tx.status === 'PENDING' ? (
                            <>
                              <button
                                onClick={() => {
                                  storage.processWithdrawalAction(tx.id, 'APPROVE');
                                  showToast(`Approved ${tx.type} for ${tx.userName}`);
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  storage.processWithdrawalAction(tx.id, 'REJECT');
                                  showToast(`Rejected transaction ${tx.id}`);
                                }}
                                className="px-2.5 py-1 rounded bg-rose-600 text-white font-bold text-[10px]"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-500 text-[10px]">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 5: CUSTOMER LIVE MESSAGES DESK */}
          {activeSection === 'messages' && (
            <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h2 className="text-lg font-bold text-white tracking-tight">Support Desk & Live Messages</h2>
                <p className="text-xs text-slate-400">Bidirectional real-time communication between customers and operations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[440px]">
                {/* Conversations column */}
                <div className="md:col-span-1 rounded-xl bg-slate-950/80 border border-white/5 p-2 overflow-y-auto cb-scroll space-y-1">
                  {conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all space-y-1 ${
                        activeConvId === conv.id
                          ? 'bg-blue-600/30 border border-blue-500/50'
                          : 'hover:bg-slate-900 border border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{conv.customerName}</span>
                        {conv.unreadAdminCount > 0 && (
                          <span className="w-2 h-2 rounded-full bg-blue-400 cb-pulse-dot" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{conv.lastMessage}</p>
                    </button>
                  ))}
                </div>

                {/* Chat thread column */}
                <div className="md:col-span-2 rounded-xl bg-slate-950/80 border border-white/5 p-4 flex flex-col justify-between">
                  <div className="overflow-y-auto cb-scroll space-y-3 pr-2 flex-1 max-h-[340px]">
                    {activeMessages.map(m => {
                      const isAdmin = m.senderRole === 'SUPER_ADMIN';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                        >
                          <div className={`p-3 rounded-2xl max-w-sm text-xs font-sans ${
                            isAdmin
                              ? 'bg-blue-600 text-white rounded-br-none'
                              : 'bg-slate-800 text-slate-200 rounded-bl-none'
                          }`}>
                            <div className="text-[10px] opacity-70 font-mono mb-1">{m.senderName}</div>
                            {m.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Composer */}
                  <form onSubmit={handleSendAdminReply} className="flex gap-2 pt-3 border-t border-white/5">
                    <input
                      type="text"
                      placeholder="Type official response to customer..."
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/20 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Reply
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: BROADCAST & ALERTS */}
          {activeSection === 'broadcast' && (
            <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <h2 className="text-lg font-bold text-white tracking-tight">Publish System Announcements</h2>
                <p className="text-xs text-slate-400">Push instant alerts to all registered customer notification feeds.</p>
              </div>

              <form onSubmit={handleSendBroadcast} className="space-y-4 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Announcement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scheduled Network Upgrade"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/20 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Alert Message Body</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about platform upgrades, liquidity updates, or bonus yields..."
                    value={broadcastBody}
                    onChange={(e) => setBroadcastBody(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-blue-500/20 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white cb-blue-gradient cb-glow"
                >
                  Broadcast Announcement
                </button>
              </form>
            </div>
          )}

          {/* SECTION: SUB-AGENTS (5 DESKS) */}
          {activeSection === 'agents' && (
            <AgentManagementSection onShowToast={showToast} />
          )}

          {/* SECTION: INVITATION CODES */}
          {activeSection === 'invitations' && (
            <InvitationManagementSection onShowToast={showToast} />
          )}

          {/* SECTION: INVESTOR CRM LEADS */}
          {activeSection === 'leads' && (
            <LeadManagementSection onShowToast={showToast} />
          )}

          {/* SECTION: REPORTS & EXPORTS */}
          {activeSection === 'reports' && (
            <ReportsExportSection onShowToast={showToast} />
          )}

          {/* SECTION: SECURITY & AUDIT TRAIL */}
          {activeSection === 'security' && (
            <AuditSecuritySection onShowToast={showToast} />
          )}

          {/* SECTION: PAYMENT GATEWAYS */}
          {activeSection === 'payments' && (
            <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-6">
              <div className="border-b border-white/5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Institutional Custody & Payment Gateways</h2>
                  <p className="text-xs text-slate-400">Configure cold storage deposit addresses, network fees, and settlement rails.</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                  {gateways.filter(g => g.enabled).length} / {gateways.length} Gateways Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gateways.map(gw => (
                  <div key={gw.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white font-mono">{gw.name}</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
                          {gw.network}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const next = !gw.enabled;
                          storage.updatePaymentGateway(gw.id, { enabled: next });
                          setGateways(storage.getPaymentGateways());
                          showToast(`${gw.name} gateway ${next ? 'enabled' : 'disabled'}`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                          gw.enabled 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {gw.enabled ? 'ENABLED' : 'DISABLED'}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Master Custody Address</label>
                      <input
                        type="text"
                        defaultValue={gw.depositAddress}
                        onBlur={(e) => {
                          if (e.target.value !== gw.depositAddress) {
                            storage.updatePaymentGateway(gw.id, { depositAddress: e.target.value });
                            setGateways(storage.getPaymentGateways());
                            showToast(`Updated ${gw.name} deposit address`);
                          }
                        }}
                        className="w-full p-2 rounded-lg bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400">Min Deposit</span>
                        <div className="font-bold text-white">${gw.minDeposit} USDT</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Gateway Fee</span>
                        <div className="font-bold text-amber-400">{gw.feePercentage}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: PLATFORM SYSTEM SETTINGS */}
          {activeSection === 'settings' && (
            <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-6">
              <div className="border-b border-white/5 pb-3">
                <h2 className="text-lg font-bold text-white tracking-tight">Platform Global System Configuration</h2>
                <p className="text-xs text-slate-400">Brand identity, binary options return yields, and risk controls.</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  storage.updateSystemSettings(systemSettings);
                  showToast('Platform system configuration updated successfully.');
                }}
                className="space-y-4 max-w-2xl text-xs font-mono"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Platform Brand Title</label>
                    <input
                      type="text"
                      value={systemSettings.platformName}
                      onChange={(e) => setSystemSettings({ ...systemSettings, platformName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Branding Subtitle</label>
                    <input
                      type="text"
                      value={systemSettings.brandingSubtitle}
                      onChange={(e) => setSystemSettings({ ...systemSettings, brandingSubtitle: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Operations Support Email</label>
                    <input
                      type="email"
                      value={systemSettings.supportEmail}
                      onChange={(e) => setSystemSettings({ ...systemSettings, supportEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-bold">Max Daily Withdrawal Limit ($)</label>
                    <input
                      type="number"
                      value={systemSettings.maxDailyWithdrawalLimit}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maxDailyWithdrawalLimit: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-3">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Default Binary Option Payout Rates</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-400 text-[11px]">30 Seconds</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="50"
                          max="95"
                          value={systemSettings.defaultPayoutRate30s}
                          onChange={(e) => setSystemSettings({ ...systemSettings, defaultPayoutRate30s: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                        />
                        <span className="text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 text-[11px]">60 Seconds</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="50"
                          max="95"
                          value={systemSettings.defaultPayoutRate60s}
                          onChange={(e) => setSystemSettings({ ...systemSettings, defaultPayoutRate60s: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                        />
                        <span className="text-slate-400">%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 text-[11px]">120 Seconds</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="50"
                          max="95"
                          value={systemSettings.defaultPayoutRate120s}
                          onChange={(e) => setSystemSettings({ ...systemSettings, defaultPayoutRate120s: Number(e.target.value) })}
                          className="w-full p-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                        />
                        <span className="text-slate-400">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-white/5 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.requireKycForTrading}
                      onChange={(e) => setSystemSettings({ ...systemSettings, requireKycForTrading: e.target.checked })}
                      className="rounded text-blue-500"
                    />
                    <span className="text-slate-300 font-bold">Enforce Mandatory KYC Verification Before Trading</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                    <span className="text-amber-300 font-bold">Global Maintenance Mode (Restricts Customer Login)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={systemSettings.freezeAllWithdrawals}
                      onChange={(e) => setSystemSettings({ ...systemSettings, freezeAllWithdrawals: e.target.checked })}
                      className="rounded text-rose-500"
                    />
                    <span className="text-rose-400 font-bold">Freeze All Outbound Withdrawals Platform-Wide</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-[0_0_16px_rgba(0,82,255,0.4)]"
                >
                  Save Platform System Configuration
                </button>
              </form>
            </div>
          )}

          {/* SECTION: MARKET PAIRS */}
          {activeSection === 'market' && (
            <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h2 className="text-lg font-bold text-white tracking-tight">Cryptocurrency Trading Pairs ({INITIAL_COINS.length})</h2>
                <p className="text-xs text-slate-400">Real-time quote feeds, spread configurations, and liquidity depth.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {INITIAL_COINS.map(c => (
                  <div key={c.symbol} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm">{c.symbol}</div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        ACTIVE POOL
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px]">{c.name}</div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-slate-400">Baseline Quote:</span>
                      <span className="font-bold text-emerald-400">${c.basePrice.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
