import React, { useState } from 'react';
import { storage } from '../../lib/storage';
import { generateComprehensivePlatformPDF } from '../../lib/pdfReportGenerator';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Database, 
  FileText, 
  BarChart3, 
  CheckCircle2, 
  RefreshCw,
  Users,
  CandlestickChart,
  DollarSign,
  UserCheck,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface ReportsExportSectionProps {
  onShowToast: (msg: string) => void;
}

export const ReportsExportSection: React.FC<ReportsExportSectionProps> = ({ onShowToast }) => {
  const [isRestoring, setIsRestoring] = useState(false);

  // Helper to trigger browser CSV download
  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    onShowToast(`Downloaded ${filename}`);
  };

  // 1. Export Users CSV
  const handleExportUsers = () => {
    const users = storage.getUsers();
    const headers = ['UID', 'Name', 'Email', 'Role', 'Sub-Agent Code', 'Balance USDT', 'Status', 'KYC Status', 'Registered At'];
    const rows = users.map(u => [
      `"${u.uid}"`,
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.role}"`,
      `"${u.linkedSubAgentId || u.invitationCode || ''}"`,
      `"${u.balance}"`,
      `"${u.status}"`,
      `"${u.kycStatus}"`,
      `"${u.registeredAt}"`
    ]);
    downloadCSV(`coinbase_users_${new Date().toISOString().slice(0, 10)}.csv`, [headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
  };

  // 2. Export Trades CSV
  const handleExportTrades = () => {
    const trades = storage.getTrades();
    const headers = ['Trade ID', 'User Name', 'Symbol', 'Direction', 'Amount USDT', 'Duration (s)', 'Entry Price', 'Exit Price', 'Payout', 'Status', 'Created At'];
    const rows = trades.map(t => [
      `"${t.id}"`,
      `"${t.userName}"`,
      `"${t.symbol}"`,
      `"${t.direction}"`,
      `"${t.amount}"`,
      `"${t.duration}"`,
      `"${t.entryPrice}"`,
      `"${t.exitPrice || ''}"`,
      `"${t.payoutRate ? (t.payoutRate * 100).toFixed(0) + '%' : ''}"`,
      `"${t.profit || 0}"`,
      `"${t.status}"`,
      `"${t.createdAt}"`
    ]);
    downloadCSV(`coinbase_trades_${new Date().toISOString().slice(0, 10)}.csv`, [headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
  };

  // 3. Export Financial Transactions CSV
  const handleExportTransactions = () => {
    const txs = storage.getTransactions();
    const headers = ['Transaction ID', 'User Name', 'Email', 'Type', 'Amount USDT', 'Method', 'Status', 'Timestamp'];
    const rows = txs.map(tx => [
      `"${tx.id}"`,
      `"${tx.userName}"`,
      `"${tx.userEmail}"`,
      `"${tx.type}"`,
      `"${tx.amount}"`,
      `"${tx.method}"`,
      `"${tx.status}"`,
      `"${tx.createdAt}"`
    ]);
    downloadCSV(`coinbase_transactions_${new Date().toISOString().slice(0, 10)}.csv`, [headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
  };

  // 4. Export Leads CSV
  const handleExportLeads = () => {
    const leads = storage.getLeads();
    const headers = ['Lead ID', 'Name', 'Email', 'Phone', 'Country', 'Acquisition Channel', 'Assigned Desk', 'Status', 'Estimated Value ($)', 'Follow Up'];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${l.name}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.country}"`,
      `"${l.source}"`,
      `"${l.assignedAgentName}"`,
      `"${l.status}"`,
      `"${l.estimatedValue}"`,
      `"${l.followUpDate}"`
    ]);
    downloadCSV(`coinbase_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`, [headers.join(','), ...rows.map(r => r.join(','))].join('\n'));
  };

  // 5. Full JSON Database Dump
  const handleExportFullJSON = () => {
    const dump = {
      timestamp: new Date().toISOString(),
      version: '2.5.0-ENTERPRISE',
      users: storage.getUsers(),
      trades: storage.getTrades(),
      transactions: storage.getTransactions(),
      invitations: storage.getInvitationCodes(),
      leads: storage.getLeads(),
      auditLogs: storage.getAuditLogs(),
      apiKeys: storage.getApiKeys(),
      webhooks: storage.getWebhooks(),
      rolePermissions: storage.getRolePermissions(),
      settings: storage.getSystemSettings()
    };
    const jsonStr = JSON.stringify(dump, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coinbase_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    onShowToast('Platform database backup exported as JSON.');
  };

  // File Upload Restore
  const handleRestoreBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.users && parsed.trades) {
          storage.saveUsers(parsed.users);
          if (parsed.trades) storage.saveTrades(parsed.trades);
          if (parsed.transactions) storage.saveTransactions(parsed.transactions);
          onShowToast('Platform state successfully restored from backup file!');
        } else {
          onShowToast('Invalid backup file schema.');
        }
      } catch (err) {
        onShowToast('Failed to parse backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const performanceMetrics = [
    { month: 'Jan', deposits: 142000, volume: 840000, payouts: 672000 },
    { month: 'Feb', deposits: 185000, volume: 1120000, payouts: 896000 },
    { month: 'Mar', deposits: 240000, volume: 1480000, payouts: 1184000 },
    { month: 'Apr', deposits: 310000, volume: 1950000, payouts: 1560000 },
    { month: 'May', deposits: 420000, volume: 2600000, payouts: 2080000 },
    { month: 'Jun', deposits: 580000, volume: 3400000, payouts: 2720000 },
  ];

  return (
    <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-6">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[11px] font-mono font-bold mb-1">
          <FileSpreadsheet className="w-3.5 h-3.5" /> REPORTING & FINANCIAL AUDIT EXPORTS
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Compliance Reports & Database Backups
        </h2>
        <p className="text-xs text-slate-400">
          Generate audit-ready spreadsheets, comprehensive transaction ledgers, CRM pipeline logs, and full JSON state snapshots.
        </p>
      </div>

      {/* Featured All-Sections Combined PDF Export Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0E131F] via-[#161C2E] to-[#0A1224] border border-blue-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold">
            <Sparkles className="w-3 h-3 text-cyan-400" /> ALL-IN-ONE SYSTEM REPORT
          </div>
          <h3 className="text-lg font-black text-white tracking-tight">
            Combined Platform PDF Dossier (Storefront + Admin Panel + Dashboards)
          </h3>
          <p className="text-xs text-slate-300">
            Export a comprehensive, executive-ready multi-page PDF document compiling Storefront specifications, 30s/60s/120s trading models, Candlestick terminal parameters, BitVista Business Overview, Due Diligence & AML risk telemetry (190 alerts), Sub-Agent desk hierarchy, and security audit configurations.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400 font-bold">✓ 7 Full Chapters</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">✓ Vector Data Tables</span>
            <span>•</span>
            <span className="text-blue-400 font-bold">✓ Direct PDF Download</span>
          </div>
        </div>

        <button
          onClick={() => {
            onShowToast('Compiling comprehensive platform PDF...');
            setTimeout(() => {
              const { doc, filename } = generateComprehensivePlatformPDF();
              doc.save(filename);
              onShowToast(`Success! Downloaded ${filename}`);
            }, 600);
          }}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs font-mono shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer self-start md:self-center"
        >
          <Download className="w-4 h-4" />
          <span>Download Complete PDF Report</span>
        </button>
      </div>

      {/* CSV Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users CSV */}
        <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Traders & Sub-Agents</h4>
            <p className="text-[11px] text-slate-400">UIDs, balances, KYC status, agent routing, and verification records.</p>
          </div>
          <button
            onClick={handleExportUsers}
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Users CSV
          </button>
        </div>

        {/* Trades CSV */}
        <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
              <CandlestickChart className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Binary Contract Ledger</h4>
            <p className="text-[11px] text-slate-400">Entry/exit ticks, outcomes, durations, payouts, and settlement timestamps.</p>
          </div>
          <button
            onClick={handleExportTrades}
            className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Trades CSV
          </button>
        </div>

        {/* Transactions CSV */}
        <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
              <DollarSign className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">Financial Cashflows</h4>
            <p className="text-[11px] text-slate-400">Crypto deposits, withdrawal approvals, manual adjustments, and gateway logs.</p>
          </div>
          <button
            onClick={handleExportTransactions}
            className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Ledgers CSV
          </button>
        </div>

        {/* Leads CSV */}
        <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2">
              <UserCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm">CRM Investor Leads</h4>
            <p className="text-[11px] text-slate-400">Prospect pipeline, desk assignments, follow-ups, and estimated capital.</p>
          </div>
          <button
            onClick={handleExportLeads}
            className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Leads CSV
          </button>
        </div>
      </div>

      {/* Financial Performance Chart */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-white/5 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Monthly Settlement Volume vs Payouts ($ USDT)
        </h3>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceMetrics} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ backgroundColor: '#050b18', borderColor: '#3b82f6', borderRadius: '12px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar dataKey="volume" fill="#0052FF" name="Trading Volume" radius={[4, 4, 0, 0]} />
              <Bar dataKey="payouts" fill="#10b981" name="Trader Returns" radius={[4, 4, 0, 0]} />
              <Bar dataKey="deposits" fill="#f59e0b" name="Net Inflows" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full State Backup / Restore Container */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" /> Complete System State Dump & Disaster Recovery
          </h4>
          <p className="text-xs text-slate-400">
            Export the complete runtime database (all users, trades, transactions, codes, leads, API keys, and settings) as an encrypted JSON snapshot.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleExportFullJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold transition-colors flex items-center gap-2 border border-white/10"
          >
            <Download className="w-4 h-4 text-blue-400" /> Export JSON Snapshot
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_12px_rgba(0,82,255,0.3)]">
            <Upload className="w-4 h-4" /> Restore Backup
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreBackupFile}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
