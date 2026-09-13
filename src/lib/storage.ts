import { 
  User, 
  UserRole,
  Trade, 
  Transaction, 
  AppNotification, 
  Conversation, 
  ChatMessage,
  AdminStats,
  InvitationCode,
  Lead,
  LeadStatus,
  AuditLog,
  LoginHistoryItem,
  ApiKeyItem,
  WebhookItem,
  RolePermissionConfig,
  PaymentGatewayConfig,
  SystemSettings
} from '../types';

const STORAGE_KEYS = {
  USERS: 'pbd_coinbase_users_v3',
  CURRENT_USER: 'pbd_coinbase_current_user_v3',
  TRADES: 'pbd_coinbase_trades_v3',
  TRANSACTIONS: 'pbd_coinbase_transactions_v3',
  NOTIFICATIONS: 'pbd_coinbase_notifications_v3',
  CONVERSATIONS: 'pbd_coinbase_conversations_v3',
  MESSAGES: 'pbd_coinbase_messages_v3',
  WATCHLIST: 'pbd_coinbase_watchlist_v3',
  INVITATIONS: 'pbd_coinbase_invitations_v3',
  LEADS: 'pbd_coinbase_leads_v3',
  AUDIT_LOGS: 'pbd_coinbase_audit_logs_v3',
  LOGIN_HISTORY: 'pbd_coinbase_login_history_v3',
  API_KEYS: 'pbd_coinbase_api_keys_v3',
  WEBHOOKS: 'pbd_coinbase_webhooks_v3',
  ROLE_PERMISSIONS: 'pbd_coinbase_role_permissions_v3',
  GATEWAYS: 'pbd_coinbase_gateways_v3',
  SETTINGS: 'pbd_coinbase_settings_v3',
  ACTIVE_THEME: 'pbd_coinbase_theme_v3'
};

// ==========================================
// 1. SUPER ADMIN SEED
// ==========================================
const SEED_SUPER_ADMIN: User = {
  id: 'usr-admin-super',
  uid: 'CB100001',
  username: 'admin@coinbase.ae',
  password: 'coinbaseeae11',
  name: 'Super Administrator',
  email: 'admin@coinbase.ae',
  role: 'SUPER_ADMIN',
  balance: 999999.00,
  frozenFunds: 0,
  vipLevel: 99,
  phone: '+971 4 888 0100',
  country: 'United Arab Emirates',
  status: 'ACTIVE',
  kycStatus: 'VERIFIED',
  walletLocked: false,
  registeredAt: '2025-11-01T00:00:00.000Z',
  lastLoginAt: new Date().toISOString(),
  lastLoginIp: '192.168.1.100',
  lastLoginDevice: 'MacBook Pro 16" (macOS / Chrome 124)',
  lastLoginLocation: 'Dubai, AE',
  twoFactorEnabled: true,
  mustChangePassword: false,
  permissions: ['ALL_PERMISSIONS'],
};

// ==========================================
// 2. DEFAULT SUB-AGENTS (5 AGENTS)
// ==========================================
const SEED_SUBAGENTS: User[] = [
  {
    id: 'agent-001',
    uid: 'CB901101',
    username: 'agentae001',
    password: 'Agentae@001',
    name: 'Agent 1',
    email: 'agentae001@coinbase.ae',
    role: 'SUB_AGENT',
    balance: 50000,
    frozenFunds: 0,
    vipLevel: 5,
    invitationCode: 'PBD-AGENT-ae001',
    phone: '+971 4 555 0101',
    country: 'United Arab Emirates',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    walletLocked: false,
    registeredAt: '2026-01-10T08:00:00.000Z',
    lastLoginAt: '2026-03-11T14:20:00.000Z',
    lastLoginIp: '72.229.28.185',
    lastLoginDevice: 'Windows 11 PC (Firefox 125)',
    lastLoginLocation: 'Dubai, AE',
    twoFactorEnabled: true,
    mustChangePassword: false,
    commissionRate: 0.25, // 25% commission on trade fee volume
    permissions: ['VIEW_CLIENTS', 'FREEZE_CLIENTS', 'GENERATE_CODES', 'VIEW_TRADES'],
  },
  {
    id: 'agent-002',
    uid: 'CB901102',
    username: 'agentae002',
    password: 'Agentae@002',
    name: 'Agent 2',
    email: 'agentae002@coinbase.ae',
    role: 'SUB_AGENT',
    balance: 38500,
    frozenFunds: 0,
    vipLevel: 4,
    invitationCode: 'PBD-AGENT-ae002',
    phone: '+971 4 555 0102',
    country: 'United Arab Emirates',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    walletLocked: false,
    registeredAt: '2026-01-15T09:30:00.000Z',
    lastLoginAt: '2026-03-10T11:45:00.000Z',
    lastLoginIp: '86.154.12.90',
    lastLoginDevice: 'Apple iMac 27" (Safari 17.4)',
    lastLoginLocation: 'Dubai, AE',
    twoFactorEnabled: false,
    mustChangePassword: false,
    commissionRate: 0.20,
    permissions: ['VIEW_CLIENTS', 'FREEZE_CLIENTS', 'GENERATE_CODES', 'VIEW_TRADES'],
  },
  {
    id: 'agent-003',
    uid: 'CB901103',
    username: 'agentae003',
    password: 'Agentae@003',
    name: 'Agent 3',
    email: 'agentae003@coinbase.ae',
    role: 'SUB_AGENT',
    balance: 42000,
    frozenFunds: 0,
    vipLevel: 4,
    invitationCode: 'PBD-AGENT-ae003',
    phone: '+971 4 555 0103',
    country: 'United Arab Emirates',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    walletLocked: false,
    registeredAt: '2026-02-01T11:00:00.000Z',
    lastLoginAt: '2026-03-12T03:15:00.000Z',
    lastLoginIp: '133.242.18.4',
    lastLoginDevice: 'Ubuntu Linux 24.04 (Brave 1.64)',
    lastLoginLocation: 'Dubai, AE',
    twoFactorEnabled: true,
    mustChangePassword: false,
    commissionRate: 0.20,
    permissions: ['VIEW_CLIENTS', 'FREEZE_CLIENTS', 'GENERATE_CODES', 'VIEW_TRADES'],
  },
  {
    id: 'agent-004',
    uid: 'CB901104',
    username: 'agentae004',
    password: 'Agentae@004',
    name: 'Agent 4',
    email: 'agentae004@coinbase.ae',
    role: 'SUB_AGENT',
    balance: 29000,
    frozenFunds: 0,
    vipLevel: 3,
    invitationCode: 'PBD-AGENT-ae004',
    phone: '+971 4 555 0104',
    country: 'United Arab Emirates',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    walletLocked: false,
    registeredAt: '2026-02-10T14:15:00.000Z',
    lastLoginAt: '2026-03-11T18:00:00.000Z',
    lastLoginIp: '94.200.15.82',
    lastLoginDevice: 'iPad Pro 13" (Safari / iPadOS)',
    lastLoginLocation: 'Dubai, AE',
    twoFactorEnabled: false,
    mustChangePassword: false,
    commissionRate: 0.18,
    permissions: ['VIEW_CLIENTS', 'FREEZE_CLIENTS', 'GENERATE_CODES', 'VIEW_TRADES'],
  },
  {
    id: 'agent-005',
    uid: 'CB901105',
    username: 'agentae005',
    password: 'Agentae@005',
    name: 'Agent 5',
    email: 'agentae005@coinbase.ae',
    role: 'SUB_AGENT',
    balance: 35000,
    frozenFunds: 0,
    vipLevel: 4,
    invitationCode: 'PBD-AGENT-ae005',
    phone: '+971 4 555 0105',
    country: 'United Arab Emirates',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    walletLocked: false,
    registeredAt: '2026-02-18T16:00:00.000Z',
    lastLoginAt: '2026-03-12T01:10:00.000Z',
    lastLoginIp: '177.18.220.10',
    lastLoginDevice: 'Windows 11 Laptop (Edge 123)',
    lastLoginLocation: 'Dubai, AE',
    twoFactorEnabled: false,
    mustChangePassword: false,
    commissionRate: 0.20,
    permissions: ['VIEW_CLIENTS', 'FREEZE_CLIENTS', 'GENERATE_CODES', 'VIEW_TRADES'],
  },
];

// ==========================================
// 3. SEED TRADERS / CUSTOMERS
// ==========================================
const SEED_CUSTOMERS: User[] = [
  {
    id: 'cust-1',
    uid: 'CB500201',
    username: 'alex_mercer',
    password: 'Password@123',
    name: 'Alexandre Mercer',
    email: 'customer@coinbase.io', // Primary customer test
    role: 'CUSTOMER',
    balance: 14250.75,
    frozenFunds: 0,
    vipLevel: 2,
    linkedSubAgentId: 'PBD-AGENT-ae001',
    phone: '+1 646 555 0188',
    country: 'United States',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    walletLocked: false,
    registeredAt: '2026-02-20T10:00:00.000Z',
    lastLoginAt: '2026-03-12T09:30:00.000Z',
    lastLoginIp: '198.51.100.42',
    lastLoginDevice: 'iPhone 15 Pro (Safari Mobile)',
    lastLoginLocation: 'New York, US',
  },
  {
    id: 'cust-2',
    uid: 'CB500202',
    username: 'sarah_trader',
    password: 'Password@123',
    name: 'Sarah Chen',
    email: 'sarah.trader@yahoo.com',
    role: 'CUSTOMER',
    balance: 8900.00,
    frozenFunds: 0,
    vipLevel: 1,
    linkedSubAgentId: 'PBD-AGENT-ae001',
    phone: '+1 415 555 0177',
    country: 'United States',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    walletLocked: false,
    registeredAt: '2026-03-01T12:30:00.000Z',
    lastLoginAt: '2026-03-11T20:10:00.000Z',
  },
  {
    id: 'cust-3',
    uid: 'CB500203',
    username: 'david_btc',
    password: 'Password@123',
    name: 'David Reynolds',
    email: 'david.btc@outlook.com',
    role: 'CUSTOMER',
    balance: 24100.50,
    frozenFunds: 500,
    vipLevel: 3,
    linkedSubAgentId: 'PBD-AGENT-ae002',
    phone: '+44 7700 900123',
    country: 'United Kingdom',
    status: 'ACTIVE',
    kycStatus: 'VERIFIED',
    walletLocked: false,
    registeredAt: '2026-02-25T15:20:00.000Z',
    lastLoginAt: '2026-03-12T07:45:00.000Z',
  },
  {
    id: 'cust-4',
    uid: 'CB500204',
    username: 'tarik_invest',
    password: 'Password@123',
    name: 'Tarik Mansour',
    email: 'tarik.mansour@invest.ae',
    role: 'CUSTOMER',
    balance: 31200.00,
    frozenFunds: 0,
    vipLevel: 4,
    linkedSubAgentId: 'PBD-AGENT-ae004',
    phone: '+971 50 123 4567',
    country: 'United Arab Emirates',
    status: 'ACTIVE',
    kycStatus: 'PENDING',
    walletLocked: false,
    registeredAt: '2026-03-05T08:00:00.000Z',
  }
];

// ==========================================
// 4. INVITATION CODES SEED
// ==========================================
const SEED_INVITATIONS: InvitationCode[] = [
  {
    id: 'inv-001',
    code: 'PBD-AGENT-ae001',
    agentId: 'agent-001',
    agentName: 'Agent 1',
    type: 'UNLIMITED',
    maxUses: 9999,
    usedCount: 18,
    expiresAt: null,
    status: 'ACTIVE',
    createdAt: '2026-01-10T08:00:00.000Z',
    usedByUsers: [
      { userId: 'cust-1', userName: 'Alexandre Mercer', email: 'customer@coinbase.io', registeredAt: '2026-02-20T10:00:00.000Z', totalDeposited: 15000 },
      { userId: 'cust-2', userName: 'Sarah Chen', email: 'sarah.trader@yahoo.com', registeredAt: '2026-03-01T12:30:00.000Z', totalDeposited: 9500 },
    ]
  },
  {
    id: 'inv-002',
    code: 'PBD-AGENT-ae002',
    agentId: 'agent-002',
    agentName: 'Agent 2',
    type: 'UNLIMITED',
    maxUses: 9999,
    usedCount: 12,
    expiresAt: null,
    status: 'ACTIVE',
    createdAt: '2026-01-15T09:30:00.000Z',
    usedByUsers: [
      { userId: 'cust-3', userName: 'David Reynolds', email: 'david.btc@outlook.com', registeredAt: '2026-02-25T15:20:00.000Z', totalDeposited: 25000 }
    ]
  },
  {
    id: 'inv-003',
    code: 'PBD-AGENT-ae003',
    agentId: 'agent-003',
    agentName: 'Agent 3',
    type: 'UNLIMITED',
    maxUses: 9999,
    usedCount: 9,
    expiresAt: null,
    status: 'ACTIVE',
    createdAt: '2026-02-01T11:00:00.000Z',
    usedByUsers: []
  },
  {
    id: 'inv-004',
    code: 'PBD-AGENT-ae004',
    agentId: 'agent-004',
    agentName: 'Agent 4',
    type: 'UNLIMITED',
    maxUses: 9999,
    usedCount: 15,
    expiresAt: null,
    status: 'ACTIVE',
    createdAt: '2026-02-10T14:15:00.000Z',
    usedByUsers: [
      { userId: 'cust-4', userName: 'Tarik Mansour', email: 'tarik.mansour@invest.ae', registeredAt: '2026-03-05T08:00:00.000Z', totalDeposited: 32000 }
    ]
  },
  {
    id: 'inv-005',
    code: 'PBD-AGENT-ae005',
    agentId: 'agent-005',
    agentName: 'Agent 5',
    type: 'UNLIMITED',
    maxUses: 9999,
    usedCount: 7,
    expiresAt: null,
    status: 'ACTIVE',
    createdAt: '2026-02-18T16:00:00.000Z',
    usedByUsers: []
  },
  {
    id: 'inv-006',
    code: 'VIP-ONETIME-2026',
    agentId: 'agent-001',
    agentName: 'Agent 1',
    type: 'ONE_TIME',
    maxUses: 1,
    usedCount: 0,
    expiresAt: '2026-12-31T23:59:59.000Z',
    status: 'ACTIVE',
    createdAt: '2026-03-01T10:00:00.000Z',
    usedByUsers: []
  }
];

// ==========================================
// 5. CRM LEADS SEED
// ==========================================
const SEED_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Julian Montgomery',
    email: 'j.montgomery@hedgecap.ch',
    phone: '+41 22 819 9000',
    country: 'Switzerland',
    source: 'REFERRAL',
    assignedAgentId: 'agent-001',
    assignedAgentName: 'Agent 1',
    status: 'QUALIFIED',
    estimatedValue: 150000,
    followUpDate: '2026-03-16',
    notes: [
      { id: 'n1', author: 'Agent 1', content: 'Institutional family office looking to deploy $150k across high-speed binary options and OTC desks.', createdAt: '2026-03-10T14:30:00.000Z' },
      { id: 'n2', author: 'Super Admin', content: 'Approved for VIP Level 4 onboarding upon initial $50k deposit.', createdAt: '2026-03-11T09:15:00.000Z' }
    ],
    createdAt: '2026-03-08T11:00:00.000Z'
  },
  {
    id: 'lead-102',
    name: 'Chloe Tremblay',
    email: 'chloe.tremblay@apexcapital.ca',
    phone: '+1 514 555 0142',
    country: 'Canada',
    source: 'WEBSITE',
    assignedAgentId: 'agent-002',
    assignedAgentName: 'Agent 2',
    status: 'CONTACTED',
    estimatedValue: 65000,
    followUpDate: '2026-03-14',
    notes: [
      { id: 'n3', author: 'Agent 2', content: 'Scheduled demo call to present automated technical indicators and payout rates.', createdAt: '2026-03-11T16:00:00.000Z' }
    ],
    createdAt: '2026-03-09T15:20:00.000Z'
  },
  {
    id: 'lead-103',
    name: 'Hiroshi Tanaka',
    email: 'tanaka.h@tokyo-ventures.jp',
    phone: '+81 90 1234 5678',
    country: 'Japan',
    source: 'TELEGRAM',
    assignedAgentId: 'agent-003',
    assignedAgentName: 'Agent 3',
    status: 'NEW',
    estimatedValue: 80000,
    followUpDate: '2026-03-15',
    notes: [],
    createdAt: '2026-03-12T04:10:00.000Z'
  },
  {
    id: 'lead-104',
    name: 'Fatima Al-Nuaimi',
    email: 'fatima@nuaimi-holdings.ae',
    phone: '+971 52 987 6543',
    country: 'United Arab Emirates',
    source: 'OFFLINE_EVENT',
    assignedAgentId: 'agent-004',
    assignedAgentName: 'Agent 4',
    status: 'QUALIFIED',
    estimatedValue: 200000,
    followUpDate: '2026-03-18',
    notes: [
      { id: 'n4', author: 'Agent 4', content: 'Met at Dubai Crypto Summit 2026. Requested sub-second execution contract test for BTC/USDT pair.', createdAt: '2026-03-10T19:00:00.000Z' }
    ],
    createdAt: '2026-03-06T13:40:00.000Z'
  },
  {
    id: 'lead-105',
    name: 'Mateo Rossi',
    email: 'mateo.rossi@milano-fx.it',
    phone: '+39 02 8765 4321',
    country: 'Italy',
    source: 'LINKEDIN',
    assignedAgentId: 'agent-005',
    assignedAgentName: 'Agent 5',
    status: 'CONVERTED',
    estimatedValue: 45000,
    followUpDate: '2026-03-12',
    notes: [
      { id: 'n5', author: 'Agent 5', content: 'Lead converted into active trader account via PBD-AGENT-ae005 code.', createdAt: '2026-03-08T10:00:00.000Z' }
    ],
    createdAt: '2026-03-02T09:00:00.000Z'
  }
];

// ==========================================
// 6. AUDIT LOGS SEED
// ==========================================
const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-901',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    actorName: 'admin@coinbase.ae',
    actorRole: 'SUPER_ADMIN',
    action: 'SESSION_AUTHENTICATED',
    category: 'SECURITY',
    details: 'Master credentials authenticated via high-security 2FA challenge from IP 192.168.1.100',
    ipAddress: '192.168.1.100',
    severity: 'INFO'
  },
  {
    id: 'aud-902',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    actorName: 'agentae001',
    actorRole: 'SUB_AGENT',
    action: 'INVITATION_GENERATED',
    category: 'INVITATION',
    details: 'Generated high-priority broker invitation code PBD-AGENT-ae001 with unlimited usage capability',
    ipAddress: '72.229.28.185',
    severity: 'INFO'
  },
  {
    id: 'aud-903',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    actorName: 'admin@coinbase.ae',
    actorRole: 'SUPER_ADMIN',
    action: 'WALLET_DEPOSIT_APPROVED',
    category: 'WALLET',
    details: 'Verified and approved TRC20 deposit for Alexandre Mercer of 5,000.00 USDT (TxHash: 0x8f72a4d19a)',
    ipAddress: '192.168.1.100',
    severity: 'INFO'
  },
  {
    id: 'aud-904',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    actorName: 'admin@coinbase.ae',
    actorRole: 'SUPER_ADMIN',
    action: 'KYC_STATUS_UPDATED',
    category: 'USER',
    details: 'Approved institutional KYC Level 2 documentation for David Reynolds (Passport + Proof of Address)',
    ipAddress: '192.168.1.100',
    severity: 'INFO'
  },
  {
    id: 'aud-905',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    actorName: 'SYSTEM_DAEMON',
    actorRole: 'SYSTEM',
    action: 'DATABASE_BACKUP_COMPLETED',
    category: 'SYSTEM',
    details: 'Automated snapshot backup created successfully (Size: 4.8MB, Hash: sha256:7e91c...b021)',
    ipAddress: '127.0.0.1',
    severity: 'INFO'
  },
  {
    id: 'aud-906',
    timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    actorName: 'agentae004',
    actorRole: 'SUB_AGENT',
    action: 'LEAD_ASSIGNED',
    category: 'LEAD',
    details: 'Assigned high-net-worth lead Fatima Al-Nuaimi ($200,000 target) to Dubai Institutional Desk',
    ipAddress: '94.200.15.82',
    severity: 'INFO'
  }
];

// ==========================================
// 7. LOGIN HISTORY SEED
// ==========================================
const SEED_LOGIN_HISTORY: LoginHistoryItem[] = [
  {
    id: 'log-1',
    userId: 'usr-admin-super',
    username: 'admin@coinbase.ae',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    ipAddress: '192.168.1.100',
    device: 'MacBook Pro 16" (macOS / Chrome)',
    browser: 'Chrome 124.0.0',
    location: 'Dubai, AE',
    status: 'SUCCESS'
  },
  {
    id: 'log-2',
    userId: 'agent-001',
    username: 'agentae001',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    ipAddress: '72.229.28.185',
    device: 'Windows 11 Workstation',
    browser: 'Firefox 125.0',
    location: 'Dubai, AE',
    status: 'SUCCESS'
  },
  {
    id: 'log-3',
    userId: 'agent-003',
    username: 'agentae003',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    ipAddress: '133.242.18.4',
    device: 'Ubuntu Linux Desktop',
    browser: 'Brave 1.64',
    location: 'Dubai, AE',
    status: 'SUCCESS'
  },
  {
    id: 'log-4',
    userId: 'unknown',
    username: 'root_admin_attempt',
    timestamp: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    ipAddress: '185.220.101.5',
    device: 'Unknown Client (Tor Exit Node)',
    browser: 'Python-Requests/2.31',
    location: 'Frankfurt, DE',
    status: 'FAILED'
  },
  {
    id: 'log-5',
    userId: 'cust-1',
    username: 'alex_mercer',
    timestamp: new Date(Date.now() - 1000 * 60 * 750).toISOString(),
    ipAddress: '198.51.100.42',
    device: 'Apple iPhone 15 Pro',
    browser: 'Mobile Safari 17.2',
    location: 'New York, US',
    status: 'SUCCESS'
  }
];

// ==========================================
// 8. ROLE PERMISSIONS MATRIX
// ==========================================
const SEED_ROLE_PERMISSIONS: RolePermissionConfig[] = [
  {
    role: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Full unconstrained system authority over users, agents, leads, finances, contracts, and system engine.',
    canManageUsers: true,
    canManageAgents: true,
    canManageInvitations: true,
    canManageLeads: true,
    canApproveWallets: true,
    canOverrideTrades: true,
    canViewAuditLogs: true,
    canManageGateways: true,
    canManageSettings: true,
    canManageApi: true,
  },
  {
    role: 'ADMIN',
    name: 'Operations Administrator',
    description: 'Manages user accounts, leads, invitations, and wallet reviews without system root settings access.',
    canManageUsers: true,
    canManageAgents: true,
    canManageInvitations: true,
    canManageLeads: true,
    canApproveWallets: true,
    canOverrideTrades: false,
    canViewAuditLogs: true,
    canManageGateways: false,
    canManageSettings: false,
    canManageApi: true,
  },
  {
    role: 'MANAGER',
    name: 'Brokerage Manager',
    description: 'Supervises sub-agents, leads distribution, and high-level client onboarding performance.',
    canManageUsers: true,
    canManageAgents: true,
    canManageInvitations: true,
    canManageLeads: true,
    canApproveWallets: false,
    canOverrideTrades: false,
    canViewAuditLogs: true,
    canManageGateways: false,
    canManageSettings: false,
    canManageApi: false,
  },
  {
    role: 'AGENT',
    name: 'Sub-Agent / Desk Broker',
    description: 'Owns invitation codes, tracks invited client trades, communicates with traders, and manages leads.',
    canManageUsers: false,
    canManageAgents: false,
    canManageInvitations: true,
    canManageLeads: true,
    canApproveWallets: false,
    canOverrideTrades: false,
    canViewAuditLogs: false,
    canManageGateways: false,
    canManageSettings: false,
    canManageApi: false,
  },
  {
    role: 'VIEWER',
    name: 'Compliance & Audit Viewer',
    description: 'Read-only access to audit logs, transaction feeds, and compliance reports.',
    canManageUsers: false,
    canManageAgents: false,
    canManageInvitations: false,
    canManageLeads: false,
    canApproveWallets: false,
    canOverrideTrades: false,
    canViewAuditLogs: true,
    canManageGateways: false,
    canManageSettings: false,
    canManageApi: false,
  }
];

// ==========================================
// 9. PAYMENT GATEWAYS SEED
// ==========================================
const SEED_GATEWAYS: PaymentGatewayConfig[] = [
  {
    id: 'gw-usdt-trc20',
    name: 'Tether (USDT)',
    symbol: 'USDT',
    network: 'TRC20 (Tron High-Speed)',
    depositAddress: 'TPLB98XmK7zYQW89A12J900vBdCoinBase99',
    minDeposit: 50,
    feePercentage: 0,
    enabled: true,
  },
  {
    id: 'gw-usdt-erc20',
    name: 'Tether (USDT)',
    symbol: 'USDT',
    network: 'ERC20 (Ethereum Network)',
    depositAddress: '0x71C2546B0A5E2E10976189Ac764956C2f689B001',
    minDeposit: 100,
    feePercentage: 0.5,
    enabled: true,
  },
  {
    id: 'gw-btc',
    name: 'Bitcoin (BTC)',
    symbol: 'BTC',
    network: 'Bitcoin Native SegWit',
    depositAddress: 'bc1qplaybeatdigitalcb9988273xkw09123847',
    minDeposit: 200,
    feePercentage: 0,
    enabled: true,
  },
  {
    id: 'gw-eth',
    name: 'Ethereum (ETH)',
    symbol: 'ETH',
    network: 'Ethereum Mainnet',
    depositAddress: '0x3F8a920531c3639891000b0F1E29cB07238122A1',
    minDeposit: 150,
    feePercentage: 0,
    enabled: true,
  },
  {
    id: 'gw-wire',
    name: 'Institutional Bank Wire',
    symbol: 'USD/EUR',
    network: 'SWIFT / FedWire / SEPA Instant',
    depositAddress: 'JP Morgan Chase NA / Acct: 8901239841 / Routing: 021000021',
    minDeposit: 1000,
    feePercentage: 0,
    enabled: true,
  }
];

// ==========================================
// 10. SYSTEM SETTINGS SEED
// ==========================================
const SEED_SETTINGS: SystemSettings = {
  platformName: 'Coinbase Institutional Exchange',
  brandingSubtitle: 'Powered by Playbeat Digital Enterprise Infrastructure',
  supportEmail: 'support@playbeat.digital',
  maintenanceMode: false,
  freezeAllWithdrawals: false,
  requireKycForTrading: false,
  maxDailyWithdrawalLimit: 50000,
  defaultPayoutRate30s: 0.80,
  defaultPayoutRate60s: 0.85,
  defaultPayoutRate120s: 0.90,
  rateLimitPerMin: 1200,
  jwtExpiryMinutes: 60,
};

// ==========================================
// STORAGE SERVICE SINGLETON
// ==========================================
class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.initSeeds();
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  private initSeeds() {
    // 1. Users initialization with guarantee of superadmin and agentae001-agentae005
    const existingUsersRaw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existingUsersRaw) {
      const allUsers = [SEED_SUPER_ADMIN, ...SEED_SUBAGENTS, ...SEED_CUSTOMERS];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
    } else {
      // Ensure superadmin and 5 default agents exist with exact credentials
      try {
        const parsedUsers: User[] = JSON.parse(existingUsersRaw);
        let updated = false;

        const superAdminIdx = parsedUsers.findIndex(u => 
          u.role === 'SUPER_ADMIN' || 
          u.username === 'admin@coinbase.ae' || 
          u.email === 'admin@coinbase.ae' ||
          u.username === 'superadmin' ||
          u.email === 'admin@coinbase.io'
        );

        if (superAdminIdx === -1) {
          parsedUsers.unshift(SEED_SUPER_ADMIN);
          updated = true;
        } else {
          parsedUsers[superAdminIdx].username = SEED_SUPER_ADMIN.username;
          parsedUsers[superAdminIdx].email = SEED_SUPER_ADMIN.email;
          parsedUsers[superAdminIdx].password = SEED_SUPER_ADMIN.password;
          parsedUsers[superAdminIdx].role = 'SUPER_ADMIN';
          updated = true;
        }

        SEED_SUBAGENTS.forEach((seedAgent, i) => {
          const idx = parsedUsers.findIndex(u => 
            u.id === seedAgent.id || 
            u.username === seedAgent.username || 
            u.invitationCode === seedAgent.invitationCode ||
            u.username === `agent00${i + 1}` ||
            u.invitationCode === `PBD-AGENT-00${i + 1}`
          );
          if (idx === -1) {
            parsedUsers.push(seedAgent);
            updated = true;
          } else {
            // Update credentials & code
            parsedUsers[idx].username = seedAgent.username;
            parsedUsers[idx].password = seedAgent.password;
            parsedUsers[idx].invitationCode = seedAgent.invitationCode;
            parsedUsers[idx].email = seedAgent.email;
            parsedUsers[idx].name = seedAgent.name;
            updated = true;
          }
        });

        if (updated) {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(parsedUsers));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([SEED_SUPER_ADMIN, ...SEED_SUBAGENTS, ...SEED_CUSTOMERS]));
      }
    }

    // 2. Invitations initialization
    const existingInvsRaw = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
    if (!existingInvsRaw) {
      localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(SEED_INVITATIONS));
    } else {
      try {
        const parsedInvs: InvitationCode[] = JSON.parse(existingInvsRaw);
        let invUpdated = false;
        SEED_INVITATIONS.forEach(seedInv => {
          const idx = parsedInvs.findIndex(inv => inv.id === seedInv.id || inv.code === seedInv.code);
          if (idx === -1) {
            parsedInvs.push(seedInv);
            invUpdated = true;
          } else {
            parsedInvs[idx].code = seedInv.code;
            parsedInvs[idx].agentName = seedInv.agentName;
            invUpdated = true;
          }
        });
        if (invUpdated) {
          localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(parsedInvs));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(SEED_INVITATIONS));
      }
    }

    // 3. Leads initialization
    if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(SEED_LEADS));
    }

    // 4. Audit Logs initialization
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(SEED_AUDIT_LOGS));
    }

    // 5. Login History initialization
    if (!localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(SEED_LOGIN_HISTORY));
    }

    // 6. Role Permissions initialization
    if (!localStorage.getItem(STORAGE_KEYS.ROLE_PERMISSIONS)) {
      localStorage.setItem(STORAGE_KEYS.ROLE_PERMISSIONS, JSON.stringify(SEED_ROLE_PERMISSIONS));
    }

    // 7. Gateways initialization
    if (!localStorage.getItem(STORAGE_KEYS.GATEWAYS)) {
      localStorage.setItem(STORAGE_KEYS.GATEWAYS, JSON.stringify(SEED_GATEWAYS));
    }

    // 8. Settings initialization
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(SEED_SETTINGS));
    }

    // 9. API Keys initialization
    if (!localStorage.getItem(STORAGE_KEYS.API_KEYS)) {
      const initialKeys: ApiKeyItem[] = [
        {
          id: 'key-live-1',
          name: 'Playbeat Trading Engine Daemon',
          keyPrefix: 'pbd_live_9981',
          secretPreview: 'pbd_live_9981********************77a2',
          permissions: ['trades:read', 'trades:write', 'market:read'],
          createdAt: '2026-02-01T00:00:00.000Z',
          lastUsedAt: new Date().toISOString(),
          status: 'ACTIVE'
        },
        {
          id: 'key-read-2',
          name: 'Compliance Audit Exporter',
          keyPrefix: 'pbd_ro_4412',
          secretPreview: 'pbd_ro_4412********************99b1',
          permissions: ['audit:read', 'users:read', 'wallets:read'],
          createdAt: '2026-02-15T00:00:00.000Z',
          lastUsedAt: '2026-03-10T12:00:00.000Z',
          status: 'ACTIVE'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(initialKeys));
    }

    // 10. Webhooks initialization
    if (!localStorage.getItem(STORAGE_KEYS.WEBHOOKS)) {
      const initialWebhooks: WebhookItem[] = [
        {
          id: 'wh-1',
          url: 'https://api.playbeat.digital/v1/integrations/coinbase-alerts',
          events: ['deposit.confirmed', 'withdrawal.requested', 'trade.executed'],
          secret: 'whsec_77a98bc1902f...',
          status: 'ACTIVE',
          lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          lastStatusCode: 200
        }
      ];
      localStorage.setItem(STORAGE_KEYS.WEBHOOKS, JSON.stringify(initialWebhooks));
    }

    // 11. Initial Trades
    if (!localStorage.getItem(STORAGE_KEYS.TRADES)) {
      const now = Date.now();
      const initialTrades: Trade[] = [
        {
          id: 'TR-9081',
          userId: 'cust-1',
          userName: 'Alexandre Mercer',
          userEmail: 'customer@coinbase.io',
          symbol: 'BTC/USDT',
          direction: 'UP',
          duration: 60,
          amount: 250,
          entryPrice: 87120,
          exitPrice: 87440,
          payoutRate: 0.85,
          result: 'WIN',
          profit: 212.50,
          status: 'SETTLED',
          createdAt: new Date(now - 1000 * 60 * 15).toISOString(),
          settledAt: new Date(now - 1000 * 60 * 14).toISOString(),
          expiresAt: now - 1000 * 60 * 14,
        },
        {
          id: 'TR-9082',
          userId: 'cust-2',
          userName: 'Sarah Chen',
          userEmail: 'sarah.trader@yahoo.com',
          symbol: 'ETH/USDT',
          direction: 'DOWN',
          duration: 30,
          amount: 100,
          entryPrice: 2685,
          exitPrice: 2688,
          payoutRate: 0.80,
          result: 'LOSE',
          profit: -100,
          status: 'SETTLED',
          createdAt: new Date(now - 1000 * 60 * 8).toISOString(),
          settledAt: new Date(now - 1000 * 60 * 7.5).toISOString(),
          expiresAt: now - 1000 * 60 * 7.5,
        },
        {
          id: 'TR-9083',
          userId: 'cust-3',
          userName: 'David Reynolds',
          userEmail: 'david.btc@outlook.com',
          symbol: 'SOL/USDT',
          direction: 'UP',
          duration: 120,
          amount: 500,
          entryPrice: 191.50,
          exitPrice: 194.80,
          payoutRate: 0.90,
          result: 'WIN',
          profit: 450,
          status: 'SETTLED',
          createdAt: new Date(now - 1000 * 60 * 4).toISOString(),
          settledAt: new Date(now - 1000 * 60 * 2).toISOString(),
          expiresAt: now - 1000 * 60 * 2,
        }
      ];
      localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(initialTrades));
    }

    // 12. Initial Transactions
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      const now = Date.now();
      const initialTx: Transaction[] = [
        {
          id: 'TX-4011',
          userId: 'cust-1',
          userName: 'Alexandre Mercer',
          userEmail: 'customer@coinbase.io',
          type: 'DEPOSIT',
          amount: 5000,
          method: 'USDT (TRC20)',
          status: 'APPROVED',
          txHash: '0x8f72a4...d19a',
          createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: 'TX-4012',
          userId: 'cust-3',
          userName: 'David Reynolds',
          userEmail: 'david.btc@outlook.com',
          type: 'DEPOSIT',
          amount: 10000,
          method: 'Bitcoin (BTC)',
          status: 'APPROVED',
          txHash: '0x3c99a1...fa4b',
          createdAt: new Date(now - 1000 * 60 * 60 * 18).toISOString(),
        },
        {
          id: 'TX-4013',
          userId: 'cust-2',
          userName: 'Sarah Chen',
          userEmail: 'sarah.trader@yahoo.com',
          type: 'WITHDRAW',
          amount: 1200,
          method: 'USDT (ERC20)',
          status: 'PENDING',
          walletAddress: '0x71C...4e81',
          createdAt: new Date(now - 1000 * 60 * 45).toISOString(),
        }
      ];
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTx));
    }

    // 13. Notifications
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      const initialNotes: AppNotification[] = [
        {
          id: 'NOTIF-1',
          userId: 'ALL',
          title: 'Welcome to Coinbase & Playbeat Digital Platform',
          body: 'Sub-agent brokers, high-speed contract indicators, CRM leads, and multi-tier invitations are fully operational.',
          type: 'info',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        }
      ];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotes));
    }
  }

  // ==========================================
  // USER METHODS
  // ==========================================
  public getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  }

  public saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notify();
  }

  public getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  }

  public setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notify();
  }

  public authenticate(identifier: string, passwordAttempt: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanId = identifier.trim().toLowerCase();
    
    // Find user by username or email
    const user = users.find(u => 
      (u.username && u.username.toLowerCase() === cleanId) ||
      (u.email && u.email.toLowerCase() === cleanId) ||
      (cleanId === 'superadmin' && (u.username === 'admin@coinbase.ae' || u.role === 'SUPER_ADMIN'))
    );

    if (!user) {
      this.recordLoginAttempt(cleanId, 'FAILED', 'Account not found');
      return { success: false, error: 'No account found matching this username or email.' };
    }

    // Check account status
    if (user.status === 'SUSPENDED' || user.status === 'FROZEN') {
      this.recordLoginAttempt(cleanId, 'FAILED', `Account is ${user.status}`);
      return { success: false, error: `Account is currently ${user.status}. Please contact compliance.` };
    }

    // Check password if set
    if (user.password && user.password !== passwordAttempt) {
      this.recordLoginAttempt(cleanId, 'FAILED', 'Incorrect password');
      return { success: false, error: 'Invalid password. Please verify your credentials.' };
    }

    // Update login timestamp
    user.lastLoginAt = new Date().toISOString();
    user.lastLoginIp = '192.168.1.' + Math.floor(Math.random() * 200 + 10);
    this.updateUser(user.id, {
      lastLoginAt: user.lastLoginAt,
      lastLoginIp: user.lastLoginIp,
    });

    this.setCurrentUser(user);
    this.recordLoginAttempt(cleanId, 'SUCCESS', 'Authenticated successfully', user.id);
    
    this.addAuditLog({
      actorName: user.username || user.name,
      actorRole: user.role,
      action: 'USER_LOGIN',
      category: 'SECURITY',
      details: `User ${user.name} (${user.role}) logged in successfully.`,
      ipAddress: user.lastLoginIp,
      severity: 'INFO'
    });

    return { success: true, user };
  }

  public updateUser(userId: string, partial: Partial<User>) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...partial };
      this.saveUsers(users);

      const cur = this.getCurrentUser();
      if (cur && cur.id === userId) {
        this.setCurrentUser(users[idx]);
      }
    }
  }

  public deleteUser(userId: string): boolean {
    let users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (!target) return false;

    users = users.filter(u => u.id !== userId);
    this.saveUsers(users);

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'USER_DELETED',
      category: 'USER',
      details: `Permanently deleted user ${target.name} (${target.email}, Role: ${target.role})`,
      ipAddress: '127.0.0.1',
      severity: 'WARNING'
    });

    return true;
  }

  public resetUserPassword(userId: string, newPass?: string): string {
    const tempPass = newPass || 'Pass-' + Math.floor(100000 + Math.random() * 900000);
    this.updateUser(userId, {
      password: tempPass,
      mustChangePassword: true,
    });

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'PASSWORD_RESET',
      category: 'SECURITY',
      details: `Reset password for user ID ${userId}`,
      ipAddress: '127.0.0.1',
      severity: 'WARNING'
    });

    return tempPass;
  }

  public createUser(data: {
    username: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    phone?: string;
    country?: string;
    initialBalance?: number;
  }): User {
    const users = this.getUsers();
    const newUser: User = {
      id: 'usr-' + Date.now(),
      uid: 'CB' + Math.floor(100000 + Math.random() * 900000),
      username: data.username.trim().toLowerCase(),
      password: data.password || 'Coinbase@2026',
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      balance: data.initialBalance || 0,
      frozenFunds: 0,
      vipLevel: data.role === 'SUPER_ADMIN' ? 99 : 1,
      phone: data.phone,
      country: data.country || 'United States',
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
      walletLocked: false,
      registeredAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'USER_CREATED',
      category: 'USER',
      details: `Created new user ${newUser.name} with role ${newUser.role} and username ${newUser.username}`,
      ipAddress: '127.0.0.1',
      severity: 'INFO'
    });

    return newUser;
  }

  // ==========================================
  // INVITATION CODE METHODS
  // ==========================================
  public getInvitationCodes(): InvitationCode[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVITATIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public saveInvitationCodes(codes: InvitationCode[]) {
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(codes));
    this.notify();
  }

  public findInvitationCode(codeStr: string): InvitationCode | undefined {
    const codes = this.getInvitationCodes();
    const clean = codeStr.trim().toUpperCase();
    return codes.find(c => c.code.toUpperCase() === clean);
  }

  public createInvitationCode(data: {
    code: string;
    agentId: string;
    type: 'ONE_TIME' | 'UNLIMITED';
    maxUses?: number;
    expiresAt?: string | null;
  }): InvitationCode {
    const users = this.getUsers();
    const agent = users.find(u => u.id === data.agentId);
    const agentName = agent ? agent.name : 'Unassigned Agent';

    const newInv: InvitationCode = {
      id: 'inv-' + Date.now(),
      code: data.code.trim().toUpperCase(),
      agentId: data.agentId,
      agentName,
      type: data.type,
      maxUses: data.type === 'ONE_TIME' ? 1 : (data.maxUses || 9999),
      usedCount: 0,
      expiresAt: data.expiresAt || null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      usedByUsers: []
    };

    const codes = this.getInvitationCodes();
    codes.unshift(newInv);
    this.saveInvitationCodes(codes);

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'INVITATION_CODE_CREATED',
      category: 'INVITATION',
      details: `Created invitation code ${newInv.code} for agent ${agentName} (${newInv.type})`,
      ipAddress: '127.0.0.1',
      severity: 'INFO'
    });

    return newInv;
  }

  public toggleInvitationStatus(id: string): boolean {
    const codes = this.getInvitationCodes();
    const inv = codes.find(c => c.id === id);
    if (!inv) return false;

    inv.status = inv.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
    this.saveInvitationCodes(codes);

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'INVITATION_CODE_TOGGLED',
      category: 'INVITATION',
      details: `Changed status of code ${inv.code} to ${inv.status}`,
      ipAddress: '127.0.0.1',
      severity: 'WARNING'
    });

    return true;
  }

  public deleteInvitationCode(id: string): boolean {
    let codes = this.getInvitationCodes();
    const target = codes.find(c => c.id === id);
    if (!target) return false;

    codes = codes.filter(c => c.id !== id);
    this.saveInvitationCodes(codes);

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'INVITATION_CODE_DELETED',
      category: 'INVITATION',
      details: `Deleted invitation code ${target.code}`,
      ipAddress: '127.0.0.1',
      severity: 'WARNING'
    });

    return true;
  }

  // Registration of Customer with Invitation Code Verification
  public registerCustomer(data: {
    name: string;
    email: string;
    phone?: string;
    country?: string;
    invitationCode: string;
    password?: string;
    username?: string;
  }): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const cleanEmail = data.email.trim().toLowerCase();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const cleanCode = data.invitationCode.trim().toUpperCase();
    const inv = this.findInvitationCode(cleanCode);

    // Also accept matching by subagent user's invitationCode directly
    const agentUser = users.find(u => u.role === 'SUB_AGENT' && u.invitationCode?.toUpperCase() === cleanCode);

    if (!inv && !agentUser) {
      return { 
        success: false, 
        error: `Invalid Invitation Code "${data.invitationCode}". A certified broker invitation code (e.g., PBD-AGENT-ae001) is strictly required.` 
      };
    }

    if (inv && inv.status !== 'ACTIVE') {
      return { success: false, error: `Invitation Code "${cleanCode}" has been ${inv.status.toLowerCase()} by administration.` };
    }

    if (inv && inv.type === 'ONE_TIME' && inv.usedCount >= inv.maxUses) {
      return { success: false, error: `This one-time invitation code has already been redeemed.` };
    }

    if (inv && inv.expiresAt && new Date(inv.expiresAt).getTime() < Date.now()) {
      return { success: false, error: `This invitation code expired on ${new Date(inv.expiresAt).toLocaleDateString()}.` };
    }

    const assignedCode = inv ? inv.code : (agentUser?.invitationCode || 'PBD-AGENT-ae001');
    const assignedAgentName = inv ? inv.agentName : (agentUser?.name || 'Assigned Broker');

    const newUser: User = {
      id: 'cust-' + Date.now(),
      uid: 'CB' + Math.floor(100000 + Math.random() * 900000),
      username: data.username || data.email.split('@')[0],
      password: data.password || 'Password@123',
      name: data.name.trim(),
      email: cleanEmail,
      role: 'CUSTOMER',
      balance: 0,
      frozenFunds: 0,
      vipLevel: 1,
      linkedSubAgentId: assignedCode,
      phone: data.phone,
      country: data.country || 'United States',
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
      walletLocked: false,
      registeredAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    // Update code usage
    if (inv) {
      inv.usedCount += 1;
      inv.usedByUsers.push({
        userId: newUser.id,
        userName: newUser.name,
        email: newUser.email,
        registeredAt: newUser.registeredAt,
        totalDeposited: 0
      });
      if (inv.type === 'ONE_TIME') {
        inv.status = 'REVOKED';
      }
      this.saveInvitationCodes(this.getInvitationCodes().map(c => c.id === inv.id ? inv : c));
    }

    this.setCurrentUser(newUser);

    this.addNotification({
      userId: newUser.id,
      title: 'Welcome to Coinbase & Playbeat Digital Exchange',
      body: `Your account was successfully registered via Broker Code ${assignedCode} (${assignedAgentName}). Fund your wallet to begin sub-second binary trading.`,
      type: 'success',
    });

    this.addAuditLog({
      actorName: newUser.name,
      actorRole: 'CUSTOMER',
      action: 'CUSTOMER_REGISTERED',
      category: 'USER',
      details: `New trader registered using invitation code ${assignedCode}`,
      ipAddress: '127.0.0.1',
      severity: 'INFO'
    });

    return { success: true, user: newUser };
  }

  // ==========================================
  // CRM LEADS METHODS
  // ==========================================
  public getLeads(): Lead[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LEADS);
    return raw ? JSON.parse(raw) : [];
  }

  public saveLeads(leads: Lead[]) {
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
    this.notify();
  }

  public createLead(data: {
    name: string;
    email: string;
    phone: string;
    country: string;
    source: Lead['source'];
    assignedAgentId: string;
    status: LeadStatus;
    estimatedValue: number;
    followUpDate: string;
    initialNote?: string;
  }): Lead {
    const users = this.getUsers();
    const agent = users.find(u => u.id === data.assignedAgentId);
    const assignedAgentName = agent ? agent.name : 'Unassigned';

    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      country: data.country.trim(),
      source: data.source,
      assignedAgentId: data.assignedAgentId,
      assignedAgentName,
      status: data.status,
      estimatedValue: Number(data.estimatedValue) || 0,
      followUpDate: data.followUpDate,
      notes: data.initialNote ? [
        {
          id: 'note-1',
          author: this.getCurrentUser()?.name || 'Super Admin',
          content: data.initialNote,
          createdAt: new Date().toISOString()
        }
      ] : [],
      createdAt: new Date().toISOString()
    };

    const leads = this.getLeads();
    leads.unshift(newLead);
    this.saveLeads(leads);

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'LEAD_CREATED',
      category: 'LEAD',
      details: `Created new lead ${newLead.name} (${newLead.email}) assigned to ${assignedAgentName}`,
      ipAddress: '127.0.0.1',
      severity: 'INFO'
    });

    return newLead;
  }

  public updateLead(id: string, partial: Partial<Lead>): Lead | null {
    const leads = this.getLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx === -1) return null;

    leads[idx] = { ...leads[idx], ...partial };
    this.saveLeads(leads);
    return leads[idx];
  }

  public addLeadNote(leadId: string, content: string): boolean {
    const leads = this.getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return false;

    lead.notes.push({
      id: 'note-' + Date.now(),
      author: this.getCurrentUser()?.name || 'Desk Staff',
      content,
      createdAt: new Date().toISOString()
    });

    this.saveLeads(leads);
    return true;
  }

  public deleteLead(leadId: string): boolean {
    let leads = this.getLeads();
    const target = leads.find(l => l.id === leadId);
    if (!target) return false;

    leads = leads.filter(l => l.id !== leadId);
    this.saveLeads(leads);
    return true;
  }

  public convertLeadToTrader(leadId: string, tempPassword = 'Trader@2026'): { success: boolean; user?: User; error?: string } {
    const leads = this.getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return { success: false, error: 'Lead not found' };

    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === lead.email.toLowerCase())) {
      lead.status = 'CONVERTED';
      this.saveLeads(leads);
      return { success: false, error: 'An active user account already exists with this lead email.' };
    }

    const agent = users.find(u => u.id === lead.assignedAgentId);
    const invitationCode = agent?.invitationCode || 'PBD-AGENT-ae001';

    const newUser: User = {
      id: 'cust-' + Date.now(),
      uid: 'CB' + Math.floor(100000 + Math.random() * 900000),
      username: lead.email.split('@')[0],
      password: tempPassword,
      name: lead.name,
      email: lead.email,
      role: 'CUSTOMER',
      balance: 1000, // Courtesy onboarding credit
      frozenFunds: 0,
      vipLevel: 2,
      linkedSubAgentId: invitationCode,
      phone: lead.phone,
      country: lead.country,
      status: 'ACTIVE',
      kycStatus: 'VERIFIED',
      walletLocked: false,
      registeredAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.saveUsers(users);

    lead.status = 'CONVERTED';
    lead.convertedUserId = newUser.id;
    lead.notes.push({
      id: 'note-' + Date.now(),
      author: this.getCurrentUser()?.name || 'Super Admin',
      content: `Converted to live trading account (UID: ${newUser.uid}) with 1,000 USDT welcome balance.`,
      createdAt: new Date().toISOString()
    });
    this.saveLeads(leads);

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'LEAD_CONVERTED_TO_TRADER',
      category: 'LEAD',
      details: `Lead ${lead.name} converted to trader UID ${newUser.uid} under ${invitationCode}`,
      ipAddress: '127.0.0.1',
      severity: 'INFO'
    });

    return { success: true, user: newUser };
  }

  // ==========================================
  // AUDIT LOGS METHODS
  // ==========================================
  public getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  }

  public addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>) {
    const newLog: AuditLog = {
      ...log,
      id: 'aud-' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    const logs = this.getAuditLogs();
    logs.unshift(newLog);
    // Keep max 500 logs
    if (logs.length > 500) logs.pop();
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
    this.notify();
    return newLog;
  }

  public clearAuditLogs() {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([]));
    this.notify();
  }

  // ==========================================
  // LOGIN HISTORY & SECURITY METHODS
  // ==========================================
  public getLoginHistory(): LoginHistoryItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGIN_HISTORY);
    return raw ? JSON.parse(raw) : [];
  }

  public recordLoginAttempt(username: string, status: 'SUCCESS' | 'FAILED', details?: string, userId = 'unknown') {
    const newItem: LoginHistoryItem = {
      id: 'log-' + Date.now(),
      userId,
      username,
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
      device: navigator.userAgent.includes('Mac') ? 'Apple Mac Desktop' : 'Windows 11 PC',
      browser: 'Web Browser / Secure Client',
      location: 'Authorized Operator Ingress',
      status
    };

    const history = this.getLoginHistory();
    history.unshift(newItem);
    if (history.length > 200) history.pop();
    localStorage.setItem(STORAGE_KEYS.LOGIN_HISTORY, JSON.stringify(history));
    this.notify();
  }

  // ==========================================
  // ROLE PERMISSIONS METHODS
  // ==========================================
  public getRolePermissions(): RolePermissionConfig[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ROLE_PERMISSIONS);
    return raw ? JSON.parse(raw) : SEED_ROLE_PERMISSIONS;
  }

  public updateRolePermissions(role: string, partial: Partial<RolePermissionConfig>) {
    const list = this.getRolePermissions();
    const idx = list.findIndex(r => r.role === role);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...partial };
      localStorage.setItem(STORAGE_KEYS.ROLE_PERMISSIONS, JSON.stringify(list));
      this.notify();

      this.addAuditLog({
        actorName: this.getCurrentUser()?.name || 'Super Admin',
        actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
        action: 'PERMISSIONS_MODIFIED',
        category: 'PERMISSION',
        details: `Updated granular privileges for role ${role}`,
        ipAddress: '127.0.0.1',
        severity: 'WARNING'
      });
    }
  }

  public resetRolePermissions() {
    localStorage.setItem(STORAGE_KEYS.ROLE_PERMISSIONS, JSON.stringify(SEED_ROLE_PERMISSIONS));
    this.notify();
  }

  // ==========================================
  // API KEYS & WEBHOOKS METHODS
  // ==========================================
  public getApiKeys(): ApiKeyItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    return raw ? JSON.parse(raw) : [];
  }

  public generateApiKey(name: string, permissions: string[]): ApiKeyItem {
    const prefix = 'pbd_live_' + Math.floor(1000 + Math.random() * 9000);
    const newKey: ApiKeyItem = {
      id: 'key-' + Date.now(),
      name,
      keyPrefix: prefix,
      secretPreview: `${prefix}_sec_${Math.random().toString(36).substring(2, 12)}...`,
      permissions,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE'
    };

    const keys = this.getApiKeys();
    keys.unshift(newKey);
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
    this.notify();

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'API_KEY_GENERATED',
      category: 'SYSTEM',
      details: `Generated production API key "${name}" with prefix ${prefix}`,
      ipAddress: '127.0.0.1',
      severity: 'WARNING'
    });

    return newKey;
  }

  public revokeApiKey(keyId: string): boolean {
    const keys = this.getApiKeys();
    const k = keys.find(item => item.id === keyId);
    if (!k) return false;

    k.status = 'REVOKED';
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
    this.notify();
    return true;
  }

  public getWebhooks(): WebhookItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WEBHOOKS);
    return raw ? JSON.parse(raw) : [];
  }

  public addWebhook(url: string, events: string[]): WebhookItem {
    const newWh: WebhookItem = {
      id: 'wh-' + Date.now(),
      url,
      events,
      secret: 'whsec_' + Math.random().toString(36).substring(2, 14),
      status: 'ACTIVE'
    };
    const list = this.getWebhooks();
    list.unshift(newWh);
    localStorage.setItem(STORAGE_KEYS.WEBHOOKS, JSON.stringify(list));
    this.notify();
    return newWh;
  }

  public toggleWebhook(id: string): boolean {
    const list = this.getWebhooks();
    const item = list.find(w => w.id === id);
    if (!item) return false;
    item.status = item.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    localStorage.setItem(STORAGE_KEYS.WEBHOOKS, JSON.stringify(list));
    this.notify();
    return true;
  }

  public deleteWebhook(id: string): boolean {
    let list = this.getWebhooks();
    list = list.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEYS.WEBHOOKS, JSON.stringify(list));
    this.notify();
    return true;
  }

  // ==========================================
  // PAYMENT GATEWAYS & SETTINGS
  // ==========================================
  public getPaymentGateways(): PaymentGatewayConfig[] {
    const raw = localStorage.getItem(STORAGE_KEYS.GATEWAYS);
    return raw ? JSON.parse(raw) : SEED_GATEWAYS;
  }

  public updatePaymentGateway(id: string, partial: Partial<PaymentGatewayConfig>) {
    const list = this.getPaymentGateways();
    const idx = list.findIndex(g => g.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...partial };
      localStorage.setItem(STORAGE_KEYS.GATEWAYS, JSON.stringify(list));
      this.notify();
    }
  }

  public getSystemSettings(): SystemSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : SEED_SETTINGS;
  }

  public updateSystemSettings(partial: Partial<SystemSettings>) {
    const cur = this.getSystemSettings();
    const updated = { ...cur, ...partial };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.notify();

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'SYSTEM_SETTINGS_UPDATED',
      category: 'SYSTEM',
      details: `Updated platform configuration (Maintenance: ${updated.maintenanceMode}, Freeze: ${updated.freezeAllWithdrawals})`,
      ipAddress: '127.0.0.1',
      severity: 'CRITICAL'
    });
  }

  // ==========================================
  // TRADES & SETTLEMENT
  // ==========================================
  public getTrades(): Trade[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRADES);
    return raw ? JSON.parse(raw) : [];
  }

  public saveTrades(trades: Trade[]) {
    localStorage.setItem(STORAGE_KEYS.TRADES, JSON.stringify(trades));
    this.notify();
  }

  public executeTrade(params: {
    userId: string;
    symbol: string;
    direction: 'UP' | 'DOWN';
    duration: 30 | 60 | 120;
    amount: number;
    currentPrice: number;
  }): { success: boolean; trade?: Trade; error?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.id === params.userId);

    if (!user) return { success: false, error: 'User not found' };
    if (user.status !== 'ACTIVE') return { success: false, error: 'Your account is restricted or frozen.' };
    if (user.walletLocked) return { success: false, error: 'Your trading wallet is temporarily locked.' };
    if (user.balance < params.amount) return { success: false, error: 'Insufficient funds. Please deposit USDT.' };

    // Deduct stake from user balance
    user.balance = Number((user.balance - params.amount).toFixed(2));
    this.saveUsers(users);

    const cur = this.getCurrentUser();
    if (cur && cur.id === user.id) this.setCurrentUser(user);

    const payoutRates: Record<number, number> = { 30: 0.80, 60: 0.85, 120: 0.90 };
    const payoutRate = payoutRates[params.duration] || 0.85;

    const newTrade: Trade = {
      id: 'TR-' + Math.floor(1000 + Math.random() * 9000),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      symbol: params.symbol,
      direction: params.direction,
      duration: params.duration,
      amount: params.amount,
      entryPrice: params.currentPrice,
      payoutRate,
      result: 'PENDING',
      profit: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + params.duration * 1000,
    };

    const trades = this.getTrades();
    trades.unshift(newTrade);
    this.saveTrades(trades);

    return { success: true, trade: newTrade };
  }

  public forceTradeOutcome(tradeId: string, outcome: 'WIN' | 'LOSE'): boolean {
    const trades = this.getTrades();
    const t = trades.find(item => item.id === tradeId);
    if (!t || t.status !== 'ACTIVE') return false;

    t.forceOutcome = outcome;
    this.saveTrades(trades);

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: 'TRADE_OUTCOME_FORCED',
      category: 'TRADE',
      details: `Forced outcome of contract ${tradeId} (${t.symbol}) to ${outcome}`,
      ipAddress: '127.0.0.1',
      severity: 'WARNING'
    });

    return true;
  }

  public settleTrade(tradeId: string, exitPrice: number): Trade | null {
    const trades = this.getTrades();
    const idx = trades.findIndex(t => t.id === tradeId);
    if (idx === -1) return null;

    const trade = trades[idx];
    if (trade.status !== 'ACTIVE') return trade;

    let isWin: boolean;
    if (trade.forceOutcome === 'WIN') {
      isWin = true;
    } else if (trade.forceOutcome === 'LOSE') {
      isWin = false;
    } else {
      isWin = 
        (trade.direction === 'UP' && exitPrice > trade.entryPrice) ||
        (trade.direction === 'DOWN' && exitPrice < trade.entryPrice);
    }

    const result = isWin ? 'WIN' : 'LOSE';
    const profit = isWin ? Number((trade.amount * trade.payoutRate).toFixed(2)) : -trade.amount;

    trade.exitPrice = exitPrice;
    trade.result = result;
    trade.profit = profit;
    trade.status = 'SETTLED';
    trade.settledAt = new Date().toISOString();

    trades[idx] = trade;
    this.saveTrades(trades);

    // Credit funds if WIN
    const users = this.getUsers();
    const user = users.find(u => u.id === trade.userId);
    if (user) {
      if (isWin) {
        user.balance = Number((user.balance + trade.amount + profit).toFixed(2));
        this.saveUsers(users);

        const cur = this.getCurrentUser();
        if (cur && cur.id === user.id) this.setCurrentUser(user);

        this.addTransaction({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          type: 'TRADE_PROFIT',
          amount: profit,
          method: `${trade.symbol} (${trade.direction})`,
          status: 'APPROVED',
          notes: `Won ${trade.duration}s contract. Entry: ${trade.entryPrice}, Exit: ${exitPrice}`,
        });
      } else {
        this.addTransaction({
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          type: 'TRADE_LOSS',
          amount: trade.amount,
          method: `${trade.symbol} (${trade.direction})`,
          status: 'APPROVED',
          notes: `Settled ${trade.duration}s contract. Entry: ${trade.entryPrice}, Exit: ${exitPrice}`,
        });
      }
    }

    return trade;
  }

  // ==========================================
  // TRANSACTIONS & WALLETS
  // ==========================================
  public getTransactions(): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public saveTransactions(txs: Transaction[]) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    this.notify();
  }

  public addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const newTx: Transaction = {
      ...tx,
      id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
    };
    const txs = this.getTransactions();
    txs.unshift(newTx);
    this.saveTransactions(txs);
    return newTx;
  }

  public depositFunds(userId: string, amount: number, method: string, txHash?: string): Transaction {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    const userName = user ? user.name : 'Unknown User';
    const userEmail = user ? user.email : '';

    if (user) {
      user.balance = Number((user.balance + amount).toFixed(2));
      this.saveUsers(users);

      const cur = this.getCurrentUser();
      if (cur && cur.id === userId) this.setCurrentUser(user);
    }

    const tx = this.addTransaction({
      userId,
      userName,
      userEmail,
      type: 'DEPOSIT',
      amount,
      method,
      status: 'APPROVED',
      txHash: txHash || '0x' + Math.random().toString(16).substring(2, 14),
      notes: 'Automatic blockchain node confirmation',
    });

    this.addNotification({
      userId,
      title: 'Deposit Confirmed',
      body: `Your deposit of ${amount.toFixed(2)} USDT via ${method} has been credited to your trading wallet.`,
      type: 'success',
    });

    return tx;
  }

  public requestWithdrawal(userId: string, amount: number, method: string, address: string): { success: boolean; error?: string } {
    const settings = this.getSystemSettings();
    if (settings.freezeAllWithdrawals) {
      return { success: false, error: 'Platform withdrawals are currently frozen for routine liquidity maintenance.' };
    }

    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, error: 'User not found' };
    if (user.walletLocked) return { success: false, error: 'Withdrawals are currently locked for your account.' };
    if (user.balance < amount) return { success: false, error: 'Insufficient balance.' };

    user.balance = Number((user.balance - amount).toFixed(2));
    user.frozenFunds = Number((user.frozenFunds + amount).toFixed(2));
    this.saveUsers(users);

    const cur = this.getCurrentUser();
    if (cur && cur.id === userId) this.setCurrentUser(user);

    this.addTransaction({
      userId,
      userName: user.name,
      userEmail: user.email,
      type: 'WITHDRAW',
      amount,
      method,
      walletAddress: address,
      status: 'PENDING',
      notes: 'Submitted for network settlement and compliance review',
    });

    this.addNotification({
      userId,
      title: 'Withdrawal Request Submitted',
      body: `Your withdrawal request for ${amount.toFixed(2)} USDT to ${address.substring(0, 8)}... has been submitted.`,
      type: 'info',
    });

    return { success: true };
  }

  public processWithdrawalAction(txId: string, action: 'APPROVE' | 'REJECT' | 'HOLD'): boolean {
    const txs = this.getTransactions();
    const idx = txs.findIndex(t => t.id === txId);
    if (idx === -1) return false;

    const tx = txs[idx];
    const users = this.getUsers();
    const user = users.find(u => u.id === tx.userId);

    if (action === 'APPROVE') {
      tx.status = 'APPROVED';
      tx.txHash = '0x' + Math.random().toString(16).substring(2, 14);
      if (user) {
        user.frozenFunds = Math.max(0, Number((user.frozenFunds - tx.amount).toFixed(2)));
      }
    } else if (action === 'REJECT') {
      tx.status = 'REJECTED';
      if (user) {
        user.frozenFunds = Math.max(0, Number((user.frozenFunds - tx.amount).toFixed(2)));
        user.balance = Number((user.balance + tx.amount).toFixed(2));
      }
    } else if (action === 'HOLD') {
      tx.status = 'HOLD';
    }

    txs[idx] = tx;
    this.saveTransactions(txs);
    if (user) this.saveUsers(users);

    this.addAuditLog({
      actorName: this.getCurrentUser()?.name || 'Super Admin',
      actorRole: this.getCurrentUser()?.role || 'SUPER_ADMIN',
      action: `WITHDRAWAL_${action}`,
      category: 'WALLET',
      details: `Withdrawal ${tx.id} for ${tx.amount} USDT by ${tx.userName} marked as ${action}`,
      ipAddress: '127.0.0.1',
      severity: action === 'APPROVE' ? 'INFO' : 'WARNING'
    });

    return true;
  }

  // ==========================================
  // NOTIFICATIONS & MESSAGING
  // ==========================================
  public getNotifications(userId?: string): AppNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notes: AppNotification[] = raw ? JSON.parse(raw) : [];
    if (!userId) return notes;
    return notes.filter(n => n.userId === 'ALL' || n.userId === userId);
  }

  public addNotification(note: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) {
    const newNote: AppNotification = {
      ...note,
      id: 'NOTIF-' + Date.now(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    const notes = this.getNotifications();
    notes.unshift(newNote);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notes));
    this.notify();
    return newNote;
  }

  public markNotificationAsRead(id: string) {
    const notes = this.getNotifications();
    const item = notes.find(n => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notes));
      this.notify();
    }
  }

  public markAllNotificationsRead(userId: string) {
    const notes = this.getNotifications();
    notes.forEach(n => {
      if (n.userId === 'ALL' || n.userId === userId) {
        n.read = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notes));
    this.notify();
  }

  public getConversations(): Conversation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return raw ? JSON.parse(raw) : [];
  }

  public getMessages(conversationId: string): ChatMessage[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const msgs: ChatMessage[] = raw ? JSON.parse(raw) : [];
    return msgs.filter(m => m.conversationId === conversationId);
  }

  public getOrCreateConversation(customer: User): Conversation {
    const convs = this.getConversations();
    let conv = convs.find(c => c.customerId === customer.id);
    if (!conv) {
      conv = {
        id: 'conv-' + customer.id,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        lastMessage: 'Conversation opened with Coinbase Institutional Support Desk.',
        lastMessageAt: new Date().toISOString(),
        unreadAdminCount: 0,
        unreadCustomerCount: 0,
        status: 'OPEN',
      };
      convs.unshift(conv);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
      this.notify();
    }
    return conv;
  }

  public sendMessage(conversationId: string, sender: User, text: string): ChatMessage {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const msgs: ChatMessage[] = raw ? JSON.parse(raw) : [];

    const newMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      conversationId,
      senderId: sender.id,
      senderName: sender.role === 'SUPER_ADMIN' ? 'Coinbase Support Desk' : sender.name,
      senderRole: sender.role,
      text,
      createdAt: new Date().toISOString(),
    };

    msgs.push(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(msgs));

    const convs = this.getConversations();
    const conv = convs.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = text;
      conv.lastMessageAt = new Date().toISOString();
      if (sender.role === 'CUSTOMER') {
        conv.unreadAdminCount += 1;
      } else {
        conv.unreadCustomerCount += 1;
      }
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
    }

    this.notify();
    return newMsg;
  }

  // ==========================================
  // WATCHLIST
  // ==========================================
  public getWatchlist(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
    return raw ? JSON.parse(raw) : ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'];
  }

  public toggleWatchlist(symbol: string) {
    let list = this.getWatchlist();
    if (list.includes(symbol)) {
      list = list.filter(s => s !== symbol);
    } else {
      list.push(symbol);
    }
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
    this.notify();
    return list;
  }

  // ==========================================
  // THEME (DARK / LIGHT MODE)
  // ==========================================
  public getTheme(): 'dark' | 'light' {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_THEME);
    return raw === 'light' ? 'light' : 'dark';
  }

  public setTheme(theme: 'dark' | 'light') {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_THEME, theme);
    this.notify();
  }

  // ==========================================
  // ADMIN STATS
  // ==========================================
  public getAdminStats(): AdminStats {
    const users = this.getUsers();
    const trades = this.getTrades();
    const txs = this.getTransactions();
    const leads = this.getLeads();

    const customers = users.filter(u => u.role === 'CUSTOMER');
    const agents = users.filter(u => u.role === 'SUB_AGENT' && u.status === 'ACTIVE');
    const activeTrades = trades.filter(t => t.status === 'ACTIVE').length;
    
    const settledTrades = trades.filter(t => t.status === 'SETTLED');
    const platformRevenue = settledTrades.reduce((acc, t) => {
      if (t.result === 'LOSE') return acc + t.amount;
      if (t.result === 'WIN') return acc - t.profit;
      return acc;
    }, 45200);

    const approvedDeposits = txs.filter(t => t.type === 'DEPOSIT' && t.status === 'APPROVED');
    const totalDeposits = approvedDeposits.reduce((acc, t) => acc + t.amount, 0);

    const approvedWithdrawals = txs.filter(t => t.type === 'WITHDRAW' && t.status === 'APPROVED');
    const totalWithdrawals = approvedWithdrawals.reduce((acc, t) => acc + t.amount, 0);

    const pendingWithdrawalsCount = txs.filter(t => t.type === 'WITHDRAW' && t.status === 'PENDING').length;
    const convertedLeads = leads.filter(l => l.status === 'CONVERTED').length;
    const conversionRate = leads.length > 0 ? Number(((convertedLeads / leads.length) * 100).toFixed(1)) : 34.8;

    return {
      totalUsers: customers.length,
      activeUsers24h: Math.max(1, Math.floor(customers.length * 0.8)),
      activeAgents: Math.max(5, agents.length),
      totalTrades: trades.length,
      activeTrades,
      platformRevenue: Math.max(12400, platformRevenue),
      totalDeposits,
      totalWithdrawals,
      todayDeposits: 18500,
      todayWithdrawals: 4200,
      pendingWithdrawalsCount,
      newRegistrations24h: 3,
      totalLeads: leads.length,
      conversionRate,
    };
  }

  // Backup & Restore
  public exportFullBackupJSON(): string {
    const backupData = {
      exportedAt: new Date().toISOString(),
      platform: 'Coinbase & Playbeat Digital Exchange',
      version: '2.4.0',
      users: this.getUsers(),
      trades: this.getTrades(),
      transactions: this.getTransactions(),
      invitations: this.getInvitationCodes(),
      leads: this.getLeads(),
      auditLogs: this.getAuditLogs(),
      rolePermissions: this.getRolePermissions(),
      settings: this.getSystemSettings(),
      gateways: this.getPaymentGateways(),
    };
    return JSON.stringify(backupData, null, 2);
  }
}

export const storage = new StorageService();
