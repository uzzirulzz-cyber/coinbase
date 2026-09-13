export type UserRole = 
  | 'CUSTOMER' 
  | 'SUB_AGENT' 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'AGENT'
  | 'VIEWER'
  | 'COMPLIANCE_ADMIN'
  | 'FINANCE_ADMIN'
  | 'SUPPORT_AGENT'
  | 'KYC_AGENT'
  | 'RISK_AGENT';

export type AppView = 
  | 'home'
  | 'markets'
  | 'watchlist'
  | 'trade'
  | 'wallet'
  | 'assets'
  | 'deposit'
  | 'withdraw'
  | 'history'
  | 'profile'
  | 'notifications'
  | 'settings'
  | 'login'
  | 'register'
  | 'admin-login'
  | 'subagent'
  | 'admin';

export interface User {
  id: string;
  uid: string;
  username?: string;
  password?: string;
  name: string;
  email: string;
  role: UserRole;
  balance: number;
  frozenFunds: number;
  vipLevel: number;
  invitationCode?: string; // For Sub-Agents (e.g., PBD-AGENT-001)
  linkedSubAgentId?: string; // For Customers who registered with a code
  phone?: string;
  country?: string;
  status: 'ACTIVE' | 'FROZEN' | 'SUSPENDED';
  kycStatus: 'VERIFIED' | 'PENDING' | 'UNVERIFIED';
  walletLocked: boolean;
  registeredAt: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  lastLoginDevice?: string;
  lastLoginLocation?: string;
  twoFactorEnabled?: boolean;
  mustChangePassword?: boolean;
  commissionRate?: number; // e.g. 0.20 (20%)
  permissions?: string[];
}

export type TradeDirection = 'UP' | 'DOWN';
export type TradeDuration = 30 | 60 | 120;
export type TradeResult = 'WIN' | 'LOSE' | 'PENDING';
export type TradeStatus = 'ACTIVE' | 'SETTLED' | 'CANCELLED';

export interface Trade {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  symbol: string;
  direction: TradeDirection;
  duration: TradeDuration;
  amount: number;
  entryPrice: number;
  exitPrice?: number;
  payoutRate: number; // e.g. 0.85 (85% profit on win)
  result: TradeResult;
  profit: number;
  status: TradeStatus;
  createdAt: string;
  settledAt?: string;
  expiresAt: number; // timestamp in ms
  forceOutcome?: 'WIN' | 'LOSE';
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAW' | 'TRADE_PROFIT' | 'TRADE_LOSS' | 'ADMIN_ADJUST';
export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'HOLD';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: TransactionType;
  amount: number;
  method: string;
  status: TransactionStatus;
  txHash?: string;
  walletAddress?: string;
  notes?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string; // 'ALL' or specific user ID
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadAdminCount: number;
  unreadCustomerCount: number;
  status: 'OPEN' | 'RESOLVED';
}

export interface CryptoCoin {
  symbol: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  category: 'Popular' | 'DeFi' | 'Layer 1' | 'Stablecoins';
  sparkline: number[];
  active: boolean;
}

export interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  // Indicator values calculated
  upperBand?: number;
  lowerBand?: number;
  sma?: number;
  ema?: number;
  support?: number;
  resistance?: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers24h: number;
  activeAgents: number;
  totalTrades: number;
  activeTrades: number;
  platformRevenue: number;
  totalDeposits: number;
  totalWithdrawals: number;
  todayDeposits: number;
  todayWithdrawals: number;
  pendingWithdrawalsCount: number;
  newRegistrations24h: number;
  totalLeads: number;
  conversionRate: number;
}

// -------------------------------------------------------------
// COINBASE Institutional Expansion Interfaces
// -------------------------------------------------------------

export interface InvitationCode {
  id: string;
  code: string; // e.g. PBD-AGENT-001
  agentId: string;
  agentName: string;
  type: 'ONE_TIME' | 'UNLIMITED';
  maxUses: number;
  usedCount: number;
  expiresAt: string | null;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
  usedByUsers: {
    userId: string;
    userName: string;
    email: string;
    registeredAt: string;
    totalDeposited: number;
  }[];
}

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';

export interface LeadNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  source: 'WEBSITE' | 'REFERRAL' | 'TELEGRAM' | 'LINKEDIN' | 'OFFLINE_EVENT' | 'DIRECT';
  assignedAgentId: string;
  assignedAgentName: string;
  status: LeadStatus;
  estimatedValue: number;
  followUpDate: string;
  notes: LeadNote[];
  createdAt: string;
  convertedUserId?: string;
}

export type AuditCategory = 
  | 'USER' 
  | 'AGENT' 
  | 'INVITATION' 
  | 'LEAD' 
  | 'WALLET' 
  | 'PERMISSION' 
  | 'SECURITY' 
  | 'SYSTEM'
  | 'TRADE';

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  category: AuditCategory;
  details: string;
  ipAddress: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface LoginHistoryItem {
  id: string;
  userId: string;
  username: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  secretPreview: string;
  permissions: string[];
  createdAt: string;
  lastUsedAt?: string;
  status: 'ACTIVE' | 'REVOKED';
}

export interface WebhookItem {
  id: string;
  url: string;
  events: string[];
  secret: string;
  status: 'ACTIVE' | 'PAUSED';
  lastTriggeredAt?: string;
  lastStatusCode?: number;
}

export interface RolePermissionConfig {
  role: string;
  name: string;
  description: string;
  canManageUsers: boolean;
  canManageAgents: boolean;
  canManageInvitations: boolean;
  canManageLeads: boolean;
  canApproveWallets: boolean;
  canOverrideTrades: boolean;
  canViewAuditLogs: boolean;
  canManageGateways: boolean;
  canManageSettings: boolean;
  canManageApi: boolean;
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  symbol: string;
  network: string;
  depositAddress: string;
  minDeposit: number;
  feePercentage: number;
  enabled: boolean;
  qrCodeUrl?: string;
}

export interface SystemSettings {
  platformName: string;
  brandingSubtitle: string;
  supportEmail: string;
  maintenanceMode: boolean;
  freezeAllWithdrawals: boolean;
  requireKycForTrading: boolean;
  maxDailyWithdrawalLimit: number;
  defaultPayoutRate30s: number;
  defaultPayoutRate60s: number;
  defaultPayoutRate120s: number;
  rateLimitPerMin: number;
  jwtExpiryMinutes: number;
}
