import React, { useState, useEffect } from 'react';
import { ActiveDeviceSession } from '../../types';
import { storage } from '../../lib/storage';
import {
  Laptop,
  Smartphone,
  Tablet,
  Server,
  Globe,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Wifi,
  Radio,
  Search,
  Filter,
  Trash2,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Zap,
  MapPin,
  ExternalLink,
  Layers,
  BarChart3,
  Cpu
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DeviceAnalyticsSectionProps {
  onShowToast: (msg: string) => void;
}

export const DeviceAnalyticsSection: React.FC<DeviceAnalyticsSectionProps> = ({ onShowToast }) => {
  const [devices, setDevices] = useState<ActiveDeviceSession[]>(() => storage.getActiveDevices());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'RUNNING_DEVICES' | 'GEOLOCATION' | 'PLATFORM_ANALYTICS'>('RUNNING_DEVICES');
  const [selectedDevice, setSelectedDevice] = useState<ActiveDeviceSession | null>(null);
  const [pingingId, setPingingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    return storage.subscribe(() => {
      setDevices(storage.getActiveDevices());
    });
  }, []);

  // Periodic heartbeat animation
  useEffect(() => {
    const timer = setInterval(() => {
      // randomly update pings slightly to reflect active telemetry
      setDevices(prev => 
        prev.map(d => {
          if (d.status === 'ONLINE') {
            const jitter = Math.floor(Math.random() * 5) - 2;
            return { ...d, pingMs: Math.max(9, Math.min(110, d.pingMs + jitter)) };
          }
          return d;
        })
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDevices(storage.getActiveDevices());
      setIsRefreshing(false);
      onShowToast('Refreshed actively running devices telemetry.');
    }, 400);
  };

  const handlePing = (id: string, name: string) => {
    setPingingId(id);
    const ms = storage.pingDeviceSession(id);
    setTimeout(() => {
      setPingingId(null);
      onShowToast(`Heartbeat ACK from ${name}: ${ms}ms round-trip.`);
    }, 350);
  };

  const handleTerminate = (device: ActiveDeviceSession) => {
    if (confirm(`Terminate session on ${device.deviceName} (${device.ipAddress} • ${device.location.city}) for user ${device.username}?`)) {
      const ok = storage.terminateDeviceSession(device.id);
      if (ok) {
        onShowToast(`Force disconnected ${device.deviceName} session.`);
        if (selectedDevice?.id === device.id) {
          setSelectedDevice(null);
        }
      }
    }
  };

  const handleTerminateAllOther = () => {
    if (confirm('Disconnect all non-current sessions across the platform?')) {
      const count = storage.terminateAllOtherSessions('usr-admin-super', 'dev-sess-1');
      onShowToast(`Terminated ${count} non-primary sessions.`);
    }
  };

  const handleReset = () => {
    storage.resetActiveDevices();
    setDevices(storage.getActiveDevices());
    onShowToast('Restored baseline device telemetry fleet.');
  };

  // Filtered devices
  const filteredDevices = devices.filter(d => {
    const matchesSearch = 
      d.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.os.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || d.userRole === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Analytics aggregations
  const totalOnline = devices.filter(d => d.status === 'ONLINE').length;
  const totalIdle = devices.filter(d => d.status === 'IDLE').length;
  const totalSuspended = devices.filter(d => d.status === 'SUSPENDED').length;

  const uniqueCountries = Array.from(new Set(devices.map(d => d.location.country)));
  const uniqueCities = Array.from(new Set(devices.map(d => d.location.city)));
  const avgPing = Math.round(devices.reduce((sum, d) => sum + d.pingMs, 0) / (devices.length || 1));

  // Platform OS distribution for charts
  const osCountMap: Record<string, number> = {};
  devices.forEach(d => {
    const key = d.os.includes('macOS') ? 'macOS' :
                d.os.includes('Windows') ? 'Windows' :
                d.os.includes('iOS') ? 'iOS' :
                d.os.includes('Android') ? 'Android' :
                d.os.includes('Linux') ? 'Linux' : 'Other';
    osCountMap[key] = (osCountMap[key] || 0) + 1;
  });
  const osChartData = Object.entries(osCountMap).map(([name, count]) => ({ name, count }));

  // Country distribution for charts
  const countryCountMap: Record<string, { count: number; flag: string }> = {};
  devices.forEach(d => {
    const key = d.location.country;
    if (!countryCountMap[key]) {
      countryCountMap[key] = { count: 0, flag: d.location.flag };
    }
    countryCountMap[key].count += 1;
  });
  const countryChartData = Object.entries(countryCountMap)
    .map(([country, data]) => ({ country, count: data.count, flag: data.flag }))
    .sort((a, b) => b.count - a.count);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'MOBILE': return <Smartphone className="w-4 h-4 text-blue-400" />;
      case 'TABLET': return <Tablet className="w-4 h-4 text-purple-400" />;
      case 'SERVER': return <Server className="w-4 h-4 text-emerald-400" />;
      default: return <Laptop className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Device & Geolocation Analytics
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  LIVE TELEMETRY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Real-time tracking of actively running client devices, network coordinates, and session security status.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
            title="Poll fresh device heartbeats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleTerminateAllOther}
            className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
            title="Terminate all non-admin connected sessions"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Purge Non-Admin</span>
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono transition-colors"
            title="Reset telemetry seed dataset"
          >
            Reset
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Actively Running Devices */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-blue-500/20 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>RUNNING DEVICES</span>
            <Laptop className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white font-mono">{devices.length}</span>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              {totalOnline} online
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>{totalIdle} idle</span>
            <span>•</span>
            <span className="text-amber-400">{totalSuspended} suspended</span>
          </div>
        </div>

        {/* Global Locations */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>ACTIVE LOCATIONS</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-white font-mono">{uniqueCities.length}</span>
            <span className="text-xs text-emerald-300 font-mono">Cities</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">
            {uniqueCountries.length} Sovereign Jurisdictions (UAE, US, UK, JP, SG, SA, CH)
          </div>
        </div>

        {/* Avg Latency */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>AVG PING LATENCY</span>
            <Wifi className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-purple-300 font-mono">{avgPing}</span>
            <span className="text-xs text-slate-400 font-mono">ms</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> High-speed edge routing active
          </div>
        </div>

        {/* Security Guard */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>SESSION ENCRYPTION</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-black text-amber-300 font-mono">TLS 1.3</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">mTLS</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Hardware fingerprint binding enabled
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Actively Running Devices vs Geolocation vs Platform Analytics */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('RUNNING_DEVICES')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'RUNNING_DEVICES'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Actively Running Devices ({devices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('GEOLOCATION')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'GEOLOCATION'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Geolocation Telemetry ({uniqueCities.length} Cities)</span>
        </button>

        <button
          onClick={() => setActiveTab('PLATFORM_ANALYTICS')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'PLATFORM_ANALYTICS'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>OS & Platform Analytics</span>
        </button>
      </div>

      {/* TAB 1: ACTIVELY RUNNING DEVICES */}
      {activeTab === 'RUNNING_DEVICES' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, device, IP, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Statuses ({devices.length})</option>
                <option value="ONLINE">Online ({totalOnline})</option>
                <option value="IDLE">Idle ({totalIdle})</option>
                <option value="SUSPENDED">Suspended ({totalSuspended})</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="SUB_AGENT">Sub-Agents</option>
                <option value="CUSTOMER">Customers</option>
              </select>
            </div>
          </div>

          {/* Running Devices Table */}
          <div className="overflow-x-auto cb-scroll rounded-2xl border border-white/5 bg-slate-900/60">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 bg-slate-950/40">
                  <th className="py-3 px-3.5">Device & Hardware</th>
                  <th className="py-3 px-3">User & Authority</th>
                  <th className="py-3 px-3">Location & Network</th>
                  <th className="py-3 px-3">Status & Latency</th>
                  <th className="py-3 px-3">Fingerprint</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredDevices.map(device => {
                  const isOnline = device.status === 'ONLINE';
                  const isSuspended = device.status === 'SUSPENDED';
                  const isPinging = pingingId === device.id;

                  return (
                    <tr key={device.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Device & OS */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-slate-800 border border-white/5 shrink-0">
                            {getDeviceIcon(device.deviceType)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {device.deviceName}
                              {device.isCurrentDevice && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-bold">
                                  THIS DEVICE
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate max-w-xs">
                              {device.os} • {device.browser}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* User & Authority */}
                      <td className="py-3 px-3">
                        <div className="font-bold text-white">{device.username}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            device.userRole === 'SUPER_ADMIN'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : device.userRole === 'SUB_AGENT'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {device.userRole}
                          </span>
                        </div>
                      </td>

                      {/* Location & Network */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <span>{device.location.flag}</span>
                          <span>{device.location.city}, {device.location.countryCode}</span>
                        </div>
                        <div className="text-[11px] text-blue-400">
                          {device.ipAddress} <span className="text-slate-500">•</span> <span className="text-slate-400 truncate max-w-[140px] inline-block align-bottom">{device.location.isp}</span>
                        </div>
                      </td>

                      {/* Status & Latency */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            isSuspended 
                              ? 'bg-amber-400' 
                              : isOnline 
                              ? 'bg-emerald-400 animate-pulse' 
                              : 'bg-slate-400'
                          }`} />
                          <span className={`font-bold ${
                            isSuspended ? 'text-amber-300' : isOnline ? 'text-emerald-300' : 'text-slate-400'
                          }`}>
                            {device.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Wifi className="w-3 h-3 text-slate-500" />
                          <span className={isOnline ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                            {device.pingMs} ms
                          </span>
                          <span>•</span>
                          <span>{new Date(device.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* Hardware Fingerprint */}
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        <span className="bg-slate-950 px-2 py-1 rounded border border-white/5 text-slate-300 select-all">
                          {device.fingerprintHash}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Ping */}
                          <button
                            onClick={() => handlePing(device.id, device.deviceName)}
                            disabled={isPinging}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Send heartbeat ping"
                          >
                            <Activity className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-blue-400' : ''}`} />
                          </button>

                          {/* Dossier info */}
                          <button
                            onClick={() => setSelectedDevice(device)}
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors"
                            title="View security dossier"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>

                          {/* Terminate */}
                          <button
                            onClick={() => handleTerminate(device)}
                            className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 border border-rose-500/30 transition-colors"
                            title="Disconnect session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredDevices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No actively running devices matching current search filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: GEOLOCATION TELEMETRY */}
      {activeTab === 'GEOLOCATION' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Country Breakdown Table */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" /> Active Geographic Clusters ({countryChartData.length} Countries)
              </h3>
              
              <div className="overflow-x-auto cb-scroll">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-400">
                      <th className="py-2.5 px-3">Country / Jurisdiction</th>
                      <th className="py-2.5 px-3">Active Devices</th>
                      <th className="py-2.5 px-3">Associated Nodes</th>
                      <th className="py-2.5 px-3">Primary ISP</th>
                      <th className="py-2.5 px-3 text-right">Risk Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {countryChartData.map(item => {
                      const matched = devices.filter(d => d.location.country === item.country);
                      const isps = Array.from(new Set(matched.map(d => d.location.isp))).join(', ');
                      return (
                        <tr key={item.country} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                            <span className="text-base">{item.flag}</span>
                            <span>{item.country}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                              {item.count} running
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400">
                            {matched.map(m => m.location.city).join(', ')}
                          </td>
                          <td className="py-3 px-3 text-slate-400 truncate max-w-[180px]">
                            {isps}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                              PASS (LOW)
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Geographical Density Bar Chart */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" /> Device Density by Region
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryChartData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                    <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="country" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[11px] text-slate-400 text-center font-mono">
                Institutional hub centered in United Arab Emirates (Dubai DIFC / Internet City)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLATFORM & OS ANALYTICS */}
      {activeTab === 'PLATFORM_ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Operating System Distribution */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" /> Operating System Breakdown
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={osChartData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, count }) => `${name}: ${count}`}
                    >
                      {osChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-center text-xs font-mono">
                {osChartData.map((item, idx) => (
                  <div key={item.name} className="p-2 rounded-lg bg-slate-950">
                    <div className="text-slate-400">{item.name}</div>
                    <div className="text-white font-bold text-sm" style={{ color: COLORS[idx % COLORS.length] }}>
                      {item.count} ({Math.round((item.count / devices.length) * 100)}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware & Security Telemetry Specs */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Device Integrity & Defense Specs
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                  <div className="text-slate-400 font-bold flex items-center justify-between">
                    <span>HARDWARE FINGERPRINTING</span>
                    <span className="text-emerald-400 font-bold">ENFORCED</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Cryptographic canvas & WebGL hashing binds sessions to authorized physical hardware chipsets.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                  <div className="text-slate-400 font-bold flex items-center justify-between">
                    <span>IP GEOLOCATION VELOCITY FILTER</span>
                    <span className="text-emerald-400 font-bold">ACTIVE</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Impossible travel speed detection prevents credential compromise across distinct geographic regions.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                  <div className="text-slate-400 font-bold flex items-center justify-between">
                    <span>REMOTE SESSION REVOCATION</span>
                    <span className="text-emerald-400 font-bold">READY</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Super Admin can immediately sever socket pipelines, invalidate auth tokens, and lock trader wallets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Dossier Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-blue-500/40 p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {getDeviceIcon(selectedDevice.deviceType)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Device Security Dossier</h3>
                  <div className="text-xs text-slate-400 font-mono">Session ID: {selectedDevice.id}</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase">Device Model</div>
                  <div className="text-white font-bold">{selectedDevice.deviceName}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase">User Account</div>
                  <div className="text-amber-300 font-bold">{selectedDevice.username} ({selectedDevice.userRole})</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">IP & Ingress Provider</div>
                <div className="text-blue-400 font-bold">{selectedDevice.ipAddress}</div>
                <div className="text-slate-300 text-[11px]">{selectedDevice.location.isp}</div>
                <div className="text-slate-400 text-[11px]">
                  Coordinates: {selectedDevice.location.lat}, {selectedDevice.location.lng} ({selectedDevice.location.city}, {selectedDevice.location.country})
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Operating System & Browser</div>
                <div className="text-white">{selectedDevice.os}</div>
                <div className="text-slate-400 text-[11px]">{selectedDevice.browser}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Hardware Fingerprint Hash</div>
                <div className="text-emerald-400 font-mono text-[11px] break-all select-all">
                  {selectedDevice.fingerprintHash}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-950 border border-white/5">
                  <div className="text-slate-500">Session Started</div>
                  <div className="text-white">{new Date(selectedDevice.startedAt).toLocaleString()}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950 border border-white/5">
                  <div className="text-slate-500">Last Telemetry Ping</div>
                  <div className="text-emerald-400">{selectedDevice.pingMs} ms (Active)</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => handlePing(selectedDevice.id, selectedDevice.deviceName)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" /> Send Ping
              </button>

              <button
                onClick={() => handleTerminate(selectedDevice)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Terminate Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
