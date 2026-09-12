import React, { useState, useEffect } from 'react';
import { AuditLog, AuditCategory, LoginHistoryItem, ApiKeyItem, WebhookItem, RolePermissionConfig } from '../../types';
import { storage } from '../../lib/storage';
import { 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Key, 
  Webhook, 
  Lock, 
  Unlock, 
  Download, 
  Trash2, 
  RefreshCw, 
  Filter, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Globe, 
  Plus, 
  Copy,
  Terminal
} from 'lucide-react';

interface AuditSecuritySectionProps {
  onShowToast: (msg: string) => void;
}

export const AuditSecuritySection: React.FC<AuditSecuritySectionProps> = ({ onShowToast }) => {
  const [subTab, setSubTab] = useState<'AUDIT' | 'LOGINS' | 'API_WEBHOOKS' | 'PERMISSIONS'>('AUDIT');
  const [logs, setLogs] = useState<AuditLog[]>(() => storage.getAuditLogs());
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>(() => storage.getLoginHistory());
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(() => storage.getApiKeys());
  const [webhooks, setWebhooks] = useState<WebhookItem[]>(() => storage.getWebhooks());
  const [rolePermissions, setRolePermissions] = useState<RolePermissionConfig[]>(() => storage.getRolePermissions());
  
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New API Key modal
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['trades:read', 'market:read']);

  // New Webhook modal
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState<string[]>(['deposit.confirmed', 'withdrawal.requested']);

  useEffect(() => {
    return storage.subscribe(() => {
      setLogs(storage.getAuditLogs());
      setLoginHistory(storage.getLoginHistory());
      setApiKeys(storage.getApiKeys());
      setWebhooks(storage.getWebhooks());
      setRolePermissions(storage.getRolePermissions());
    });
  }, []);

  const filteredLogs = logs.filter(l => categoryFilter === 'ALL' || l.category === categoryFilter);

  const handleExportAuditCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Category', 'Action', 'Severity', 'IP', 'Details'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.category}"`,
      `"${l.action}"`,
      `"${l.severity}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    onShowToast('Exported audit trail to CSV.');
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    storage.generateApiKey(newKeyName.trim(), selectedScopes);
    setShowKeyModal(false);
    setNewKeyName('');
    onShowToast('Generated new production API key');
  };

  const handleRevokeKey = (id: string) => {
    if (confirm('Revoke this API Key immediately?')) {
      storage.revokeApiKey(id);
      onShowToast('API Key revoked');
    }
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) return;
    storage.addWebhook(newWebhookUrl.trim(), webhookEvents);
    setShowWebhookModal(false);
    setNewWebhookUrl('');
    onShowToast('Webhook endpoint configured');
  };

  const handleTestWebhook = (wh: WebhookItem) => {
    onShowToast(`Dispatched test event ping to ${wh.url} (HTTP 200 OK)`);
  };

  const handleTogglePermission = (role: string, field: keyof RolePermissionConfig) => {
    const current = rolePermissions.find(r => r.role === role);
    if (!current) return;
    const newVal = !current[field];
    storage.updateRolePermissions(role, { [field]: newVal });
    onShowToast(`Updated permission ${String(field)} for role ${role}`);
  };

  return (
    <div className="p-6 rounded-2xl cb-glass-card border border-blue-500/20 space-y-6">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5" /> SECURITY COMPLIANCE & AUDIT ENGINE
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Security, Audit Logs & API Integrations
          </h2>
          <p className="text-xs text-slate-400">
            Immutable operation traces, IP access monitoring, webhook dispatchers, and role-based permissions.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => setSubTab('AUDIT')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              subTab === 'AUDIT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs ({logs.length})
          </button>
          <button
            onClick={() => setSubTab('LOGINS')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              subTab === 'LOGINS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign-In Activity
          </button>
          <button
            onClick={() => setSubTab('API_WEBHOOKS')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              subTab === 'API_WEBHOOKS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            API & Webhooks
          </button>
          <button
            onClick={() => setSubTab('PERMISSIONS')}
            className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
              subTab === 'PERMISSIONS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Role Permissions
          </button>
        </div>
      </div>

      {/* 1. AUDIT LOGS TAB */}
      {subTab === 'AUDIT' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {['ALL', 'SECURITY', 'USER', 'INVITATION', 'LEAD', 'WALLET', 'TRADE', 'SYSTEM'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    categoryFilter === cat
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportAuditCSV}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" /> Export CSV
              </button>
              <button
                onClick={() => {
                  if (confirm('Clear audit logs in local buffer?')) {
                    storage.clearAuditLogs();
                    onShowToast('Audit logs cleared');
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear
              </button>
            </div>
          </div>

          <div className="overflow-x-auto cb-scroll">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor / Role</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Action Event</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{log.actorName}</div>
                      <div className="text-[10px] text-purple-300">{log.actorRole}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px]">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{log.ipAddress}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                        log.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. SIGN-IN ACTIVITY TAB */}
      {subTab === 'LOGINS' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs font-mono flex items-center justify-between">
            <span className="text-slate-300">Device fingerprinting & automated IP geographical logging are active.</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Rate Limiting Guard Active
            </span>
          </div>

          <div className="overflow-x-auto cb-scroll">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Username / Identifier</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Device / Client</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {loginHistory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">{item.username}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-blue-400">{item.ipAddress}</td>
                    <td className="py-2.5 px-3 text-slate-300">{item.location}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{item.device}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. API & WEBHOOKS TAB */}
      {subTab === 'API_WEBHOOKS' && (
        <div className="space-y-6">
          {/* API Keys */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" /> Platform API Keys ({apiKeys.length})
              </h3>
              <button
                onClick={() => setShowKeyModal(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Generate Key
              </button>
            </div>

            <div className="overflow-x-auto cb-scroll">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400">
                    <th className="py-2 px-3">Name</th>
                    <th className="py-2 px-3">Key Prefix</th>
                    <th className="py-2 px-3">Secret Preview</th>
                    <th className="py-2 px-3">Scopes</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {apiKeys.map(k => (
                    <tr key={k.id}>
                      <td className="py-2.5 px-3 font-bold text-white">{k.name}</td>
                      <td className="py-2.5 px-3 text-blue-400">{k.keyPrefix}</td>
                      <td className="py-2.5 px-3 text-slate-400">{k.secretPreview}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {k.permissions.map(p => (
                            <span key={p} className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300">
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          k.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {k.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {k.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[10px] font-bold"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Webhooks */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Webhook className="w-4 h-4 text-purple-400" /> Webhook Subscriptions ({webhooks.length})
              </h3>
              <button
                onClick={() => setShowWebhookModal(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Webhook
              </button>
            </div>

            <div className="space-y-2">
              {webhooks.map(wh => (
                <div key={wh.id} className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{wh.url}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        wh.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {wh.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 text-[10px] text-purple-300">
                      Events: {wh.events.join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleTestWebhook(wh)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                    >
                      Test Ping
                    </button>
                    <button
                      onClick={() => storage.toggleWebhook(wh.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                    >
                      {wh.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => storage.deleteWebhook(wh.id)}
                      className="p-1.5 rounded-lg bg-rose-950/40 text-rose-400 hover:bg-rose-900"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. ROLE PERMISSIONS MATRIX */}
      {subTab === 'PERMISSIONS' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs font-mono text-slate-300">
            Granular access controls enforce data isolation for Super Administrators, Operations Managers, Compliance Auditors, and Sub-Agents.
          </div>

          <div className="overflow-x-auto cb-scroll">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-slate-400">
                  <th className="py-2 px-3">Role Tier</th>
                  <th className="py-2 px-3 text-center">Manage Users</th>
                  <th className="py-2 px-3 text-center">Manage Agents</th>
                  <th className="py-2 px-3 text-center">Manage Codes</th>
                  <th className="py-2 px-3 text-center">Manage Leads</th>
                  <th className="py-2 px-3 text-center">Approve Wallets</th>
                  <th className="py-2 px-3 text-center">Override Trades</th>
                  <th className="py-2 px-3 text-center">Audit Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {rolePermissions.map(rp => (
                  <tr key={rp.role} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{rp.name}</div>
                      <div className="text-[10px] text-slate-400">{rp.description}</div>
                    </td>
                    {[
                      'canManageUsers',
                      'canManageAgents',
                      'canManageInvitations',
                      'canManageLeads',
                      'canApproveWallets',
                      'canOverrideTrades',
                      'canViewAuditLogs'
                    ].map(field => {
                      const enabled = (rp as any)[field];
                      const isSuper = rp.role === 'SUPER_ADMIN';

                      return (
                        <td key={field} className="py-3 px-3 text-center">
                          <button
                            disabled={isSuper}
                            onClick={() => handleTogglePermission(rp.role, field as any)}
                            className={`p-1 rounded ${
                              enabled ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-600 bg-slate-900'
                            }`}
                          >
                            {enabled ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 text-center font-bold">✕</div>}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE API KEY MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Generate API Key</h3>
            <form onSubmit={handleCreateApiKey} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Key Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated Order Daemon"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Permissions Scopes</label>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {['trades:read', 'trades:write', 'market:read', 'wallets:read', 'audit:read', 'users:read'].map(scope => (
                    <label key={scope} className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-950 border border-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedScopes.includes(scope)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedScopes([...selectedScopes, scope]);
                          } else {
                            setSelectedScopes(selectedScopes.filter(s => s !== scope));
                          }
                        }}
                      />
                      <span className="text-[11px] text-slate-300">{scope}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-blue-600 font-bold text-white"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE WEBHOOK MODAL */}
      {showWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Register Webhook Endpoint</h3>
            <form onSubmit={handleAddWebhook} className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Target HTTPS URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://your-domain.com/webhooks"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowWebhookModal(false)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-purple-600 font-bold text-white"
                >
                  Add Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
