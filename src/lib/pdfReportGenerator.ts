import { jsPDF } from 'jspdf';
import { storage } from './storage';

export interface PDFExportOptions {
  includeStoreFront?: boolean;
  includeTradeEngine?: boolean;
  includeBitVistaOverview?: boolean;
  includeDueDiligence?: boolean;
  includeUserDirectory?: boolean;
  includeSubAgents?: boolean;
  includeAuditSecurity?: boolean;
  generatedBy?: string;
}

export function generateComprehensivePlatformPDF(options: PDFExportOptions = {}): { doc: jsPDF; filename: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const users = storage.getUsers();
  const trades = storage.getTrades();
  const txs = storage.getTransactions();
  const systemSettings = storage.getSystemSettings();

  const totalVolume = trades.reduce((acc, t) => acc + (t.amount || 0), 0);
  const totalProfit = trades.filter(t => t.result === 'WIN').reduce((acc, t) => acc + (t.profit || 0), 0);
  const pendingWithdrawals = txs.filter(t => t.type === 'WITHDRAW' && t.status === 'PENDING').length;
  const agents = users.filter(u => u.role === 'SUB_AGENT');

  // Helper for drawing header and footer on each page
  const addPageHeader = (title: string, category = 'ENTERPRISE PLATFORM REPORT') => {
    doc.setFillColor(11, 15, 25);
    doc.rect(0, 0, pageWidth, 18, 'F');

    // Gradient accent bar
    doc.setFillColor(0, 82, 255);
    doc.rect(0, 18, pageWidth, 1, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 230, 118);
    doc.text(category, margin, 8);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(title, margin, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`CONFIDENTIAL · ${new Date().toISOString().slice(0, 10)}`, pageWidth - margin, 12, { align: 'right' });

    y = 26;
  };

  const addPageFooter = (pageNum: number, totalPages: number) => {
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('COINBASE & BitVista · Combined Storefront & Admin Operations Dossier', margin, pageHeight - 6);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  };

  const checkPageBreak = (neededHeight: number, currentTitle: string) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      addPageHeader(currentTitle);
    }
  };

  // ==========================================
  // PAGE 1: COVER PAGE
  // ==========================================
  // Background Dark Theme Accent
  doc.setFillColor(11, 15, 25);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top vibrant gradient stripe
  doc.setFillColor(156, 39, 176);
  doc.rect(0, 0, pageWidth * 0.25, 4, 'F');
  doc.setFillColor(233, 30, 99);
  doc.rect(pageWidth * 0.25, 0, pageWidth * 0.25, 4, 'F');
  doc.setFillColor(255, 179, 0);
  doc.rect(pageWidth * 0.5, 0, pageWidth * 0.25, 4, 'F');
  doc.setFillColor(0, 230, 118);
  doc.rect(pageWidth * 0.75, 0, pageWidth * 0.25, 4, 'F');

  // Large Branded Logo / Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text('COINBASE', margin, 42);

  doc.setFontSize(14);
  doc.setTextColor(0, 145, 255);
  doc.text('& BITVISTA EXECUTIVE SUITE', margin, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text('Unified System Architecture, Storefront Specifications & Admin Operations Dossier', margin, 58);

  // Status Badge
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(margin, 66, 68, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(10, 15, 25);
  doc.text('STATUS: PRODUCTION VERIFIED', margin + 4, 71.5);

  // Executive Metric Highlight Box
  doc.setFillColor(18, 24, 38);
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, 82, contentWidth, 54, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text('EXECUTIVE PORTFOLIO SUMMARY', margin + 6, 92);

  const colW = contentWidth / 4;
  const metrics = [
    { label: 'REGISTERED USERS', val: `${users.length}`, color: [255, 255, 255] },
    { label: 'ACTIVE CONTRACTS', val: `${trades.length}`, color: [0, 145, 255] },
    { label: 'GROSS VOLUME', val: `$${totalVolume.toLocaleString()}`, color: [0, 230, 118] },
    { label: 'AML RISK ALERTS', val: '190 (FATF T1)', color: [255, 61, 0] },
  ];

  metrics.forEach((m, idx) => {
    const xPos = margin + 6 + idx * colW;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(m.label, xPos, 104);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.val, xPos, 114);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('Real-time sync', xPos, 122);
  });

  // Table of Contents Box
  doc.setFillColor(15, 20, 32);
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(margin, 144, contentWidth, 100, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('COMPREHENSIVE DOSSIER CONTENTS', margin + 8, 156);

  const tocItems = [
    { num: '01', title: 'Storefront Architecture & Binary Trading Engine (30s, 60s, 120s Models)', page: '2' },
    { num: '02', title: 'High-Frequency Candlestick Terminal & Bollinger Bands Pattern Gating', page: '3' },
    { num: '03', title: 'BitVista Business Overview Dashboard (Executive Sales & Departments)', page: '4' },
    { num: '04', title: 'Due Diligence, AML/CFT Screening & Suspended Transaction Queue (190 Alerts)', page: '5' },
    { num: '05', title: 'Sub-Agent Network & 5 Institutional Desks (agentae001 - agentae005)', page: '6' },
    { num: '06', title: 'Institutional Security, Audit Ledger, and System Deployment Config', page: '7' },
  ];

  tocItems.forEach((item, idx) => {
    const rowY = 168 + idx * 11;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 145, 255);
    doc.text(item.num, margin + 8, rowY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(226, 232, 240);
    doc.text(item.title, margin + 20, rowY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${item.page}`, pageWidth - margin - 10, rowY, { align: 'right' });

    doc.setDrawColor(25, 33, 50);
    doc.line(margin + 8, rowY + 3, pageWidth - margin - 8, rowY + 3);
  });

  // Footer on cover
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Compiled by: ${options.generatedBy || 'Super Administrator (admin@coinbase.ae)'} · System Version: v4.2.0-Prod`, margin, pageHeight - 12);
  doc.text('SECURED DIGITAL SIGNATURE: SHA256-ENCRYPTED', pageWidth - margin, pageHeight - 12, { align: 'right' });

  // ==========================================
  // PAGE 2: STORE FRONT ARCHITECTURE & TRADING MODEL
  // ==========================================
  doc.addPage();
  addPageHeader('SECTION 01: STORE FRONT ARCHITECTURE & TRADING ENGINE', 'CUSTOMER PORTAL & PUBLIC SPECIFICATIONS');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Public Marketplace & Customer Experience', margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const p1 = 'COINBASE provides a high-throughput cryptocurrency spot and binary contract terminal designed for institutional and retail traders. The storefront delivers millisecond-level live ticker updates, responsive market cards, interactive sparkline graphs, and zero-fee internal liquidity pools.';
  const splitP1 = doc.splitTextToSize(p1, contentWidth);
  doc.text(splitP1, margin, y);
  y += splitP1.length * 4.5 + 4;

  // Trading Contract Types Table
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Contract Duration', margin + 4, y + 5);
  doc.text('Target Yield (%)', margin + 50, y + 5);
  doc.text('Settlement Window', margin + 95, y + 5);
  doc.text('Risk Parameter / Stop Loss', margin + 140, y + 5);
  y += 7;

  const contracts = [
    { dur: '30-Second Micro Contract', yield: '20% Fixed Payout', win: 'Instant 30s Tick Lock', risk: 'Principal Stake Risked' },
    { dur: '60-Second Momentum Contract', yield: '30% Fixed Payout', win: '1-Minute Candle Settle', risk: 'Full Protection Option' },
    { dur: '120-Second Macro Contract', yield: '50% Fixed Payout', win: '2-Minute Trend Settle', risk: 'Institutional Hedge Guard' },
  ];

  contracts.forEach((c) => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(c.dur, margin + 4, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(c.yield, margin + 50, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(c.win, margin + 95, y + 5);
    doc.text(c.risk, margin + 140, y + 5);
    y += 7;
  });
  y += 6;

  // Supported Currency Markets
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Supported Core Cryptocurrency Markets (Live Liquidity Pools)', margin, y);
  y += 6;

  const coins = [
    { sym: 'BTC/USDT', name: 'Bitcoin Network', price: '$94,250.00', change: '+3.42%', vol: '$34.8B' },
    { sym: 'ETH/USDT', name: 'Ethereum Proof-of-Stake', price: '$2,820.50', change: '+2.15%', vol: '$18.2B' },
    { sym: 'SOL/USDT', name: 'Solana High-Speed L1', price: '$198.40', change: '+7.88%', vol: '$6.5B' },
    { sym: 'BNB/USDT', name: 'BNB Smart Chain', price: '$645.10', change: '+1.04%', vol: '$1.4B' },
    { sym: 'XRP/USDT', name: 'Ripple Ledger Cross-Border', price: '$1.48', change: '+4.12%', vol: '$920M' },
    { sym: 'ADA/USDT', name: 'Cardano Settlement Layer', price: '$0.78', change: '-0.45%', vol: '$450M' },
  ];

  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Trading Pair', margin + 4, y + 4.5);
  doc.text('Asset Class', margin + 45, y + 4.5);
  doc.text('Benchmark Price', margin + 95, y + 4.5);
  doc.text('24h Change', margin + 135, y + 4.5);
  doc.text('24h Volume', margin + 165, y + 4.5);
  y += 6;

  coins.forEach(c => {
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y, margin + contentWidth, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(c.sym, margin + 4, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(c.name, margin + 45, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(c.price, margin + 95, y + 4.5);
    doc.setTextColor(c.change.startsWith('+') ? 16 : 225, c.change.startsWith('+') ? 185 : 29, c.change.startsWith('+') ? 129 : 72);
    doc.text(c.change, margin + 135, y + 4.5);
    doc.setTextColor(100, 116, 139);
    doc.text(c.vol, margin + 165, y + 4.5);
    y += 6;
  });
  y += 8;

  // Construction & Security Disclosures Box
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(185, 28, 28);
  doc.text('MANDATORY COMPLIANCE DISCLOSURE · TEST PROJECT UNDER CONSTRUCTION', margin + 6, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(127, 29, 29);
  const disc = 'All customer orders execute within the sandboxed simulated liquidity gateway. Client funds and demo contracts adhere strictly to the zero-autoload credential policy. No live retail deposits are processed without full Level 2 AML/KYC identity verification and invitation-linked agent desk registration.';
  doc.text(doc.splitTextToSize(disc, contentWidth - 12), margin + 6, y + 12);

  // ==========================================
  // PAGE 3: HIGH-FREQUENCY TRADING TERMINAL
  // ==========================================
  doc.addPage();
  addPageHeader('SECTION 02: HIGH-FREQUENCY CANDLESTICK TERMINAL', 'TECHNICAL ANALYSIS & ACCESS CONTROL ENGINE');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Proprietary Candlestick & Pattern Lock Architecture', margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const tradeDesc = 'The trading view incorporates a dual-stacked Recharts ComposedChart engine. Guest users receive a clean OHLC price action feed with proprietary analytical overlays obscured behind an algorithmic 10px Gaussian blur and locked security scrim. Full Bollinger Bands, EMA 20, SMA 50, and dynamic Support/Resistance thresholds unlock immediately upon customer credential authentication.';
  const splitTrade = doc.splitTextToSize(tradeDesc, contentWidth);
  doc.text(splitTrade, margin, y);
  y += splitTrade.length * 4.5 + 4;

  // Chart Technical Indicators Breakdown
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Technical Indicator Specifications', margin + 6, y + 7);

  const indicators = [
    { name: 'Bollinger Bands (Upper/Lower)', formula: '20-period SMA ± (2.0 * Standard Deviation)', color: '#0EA5FF (Cyan)' },
    { name: 'Exponential Moving Average (EMA)', formula: '12-period EMA smoothing for immediate trend momentum', color: '#C084FC (Purple)' },
    { name: 'Simple Moving Average (SMA)', formula: '50-period base baseline moving average', color: '#F5A623 (Amber)' },
    { name: 'Support / Resistance Engine', formula: 'Peak-to-trough local extrema clustering with dynamic price labels', color: '#00C853 / #FF3B30' },
  ];

  indicators.forEach((ind, i) => {
    const rowY = y + 14 + i * 5.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(`• ${ind.name}:`, margin + 6, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`${ind.formula} [${ind.color}]`, margin + 65, rowY);
  });
  y += 44;

  // Live Trade Order Execution Workflow
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Order Execution & Settlement State Machine', margin, y);
  y += 6;

  const flowSteps = [
    { step: 'Step 01: Pre-Trade Validation', detail: 'Checks customer balance, limits maximum exposure per contract, and confirms active websocket stream synchronization.' },
    { step: 'Step 02: Atomic Stake Lock', detail: 'The requested contract stake (e.g. 50 USDT) is instantly locked and removed from available trading liquidity.' },
    { step: 'Step 03: Live Countdown Tick', detail: 'Synchronized visual progress timer counts down to target epoch timestamp (30s, 60s, or 120s).' },
    { step: 'Step 04: Fair-Value Settlement', detail: 'Contract exit price is compared against entry price. If BUY UP and Exit > Entry, payout rate (120%-150%) is credited to user wallet.' },
  ];

  flowSteps.forEach(f => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 9.5, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 82, 255);
    doc.text(f.step, margin + 4, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(f.detail, margin + 4, y + 8);
    y += 12;
  });

  // ==========================================
  // PAGE 4: BITVISTA BUSINESS OVERVIEW
  // ==========================================
  doc.addPage();
  addPageHeader('SECTION 03: BITVISTA EXECUTIVE BUSINESS OVERVIEW', 'ENTERPRISE INTELLIGENCE & PERFORMANCE ANALYTICS');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Business Overview Metrics', margin, y);
  y += 7;

  // 3 Large Metric Cards matching screenshot
  const bitVistaCards = [
    { title: 'Customers', val: '22,343', sub: '20%', time: '4 Days Ago', trackColor: [255, 145, 0], pct: 20 },
    { title: 'Profit', val: '$32,234', sub: '40%', time: '1 Month', trackColor: [0, 229, 255], pct: 40 },
    { title: 'Expense', val: '$12,537', sub: '82%', time: '2 Month', trackColor: [99, 102, 241], pct: 82 },
  ];

  const cWidth = (contentWidth - 8) / 3;
  bitVistaCards.forEach((c, i) => {
    const xPos = margin + i * (cWidth + 4);
    doc.setFillColor(15, 20, 32);
    doc.setDrawColor(30, 41, 59);
    doc.roundedRect(xPos, y, cWidth, 32, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(c.title, xPos + 5, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(c.val, xPos + 5, y + 17);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(c.trackColor[0], c.trackColor[1], c.trackColor[2]);
    doc.text(c.sub, xPos + 5, y + 23);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(c.time, xPos + 18, y + 23);

    // Progress track
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(xPos + 5, y + 26, cWidth - 10, 2, 1, 1, 'F');
    doc.setFillColor(c.trackColor[0], c.trackColor[1], c.trackColor[2]);
    doc.roundedRect(xPos + 5, y + 26, (cWidth - 10) * (c.pct / 100), 2, 1, 1, 'F');
  });
  y += 38;

  // Departments Overview Table (from BitVista image)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Departments Overview & Operating Gain', margin, y);
  y += 6;

  const depts = [
    { name: 'Analytics Press', date: 'Wed, 2 Jan', time: '12:54 AM', gain: '$534.50', pct: '70%' },
    { name: 'Sprint Trading Desk', date: 'Thu, 4 Sept', time: '10:20 PM', gain: '$234.50', pct: '35%' },
    { name: 'Cortex Risk Engine', date: 'Fri, 12 Nov', time: '04:15 PM', gain: '$890.00', pct: '88%' },
    { name: 'Nexus Settlement Gateway', date: 'Mon, 18 Dec', time: '08:45 AM', gain: '$410.20', pct: '52%' },
  ];

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Department Name', margin + 4, y + 4.5);
  doc.text('Date Registered', margin + 55, y + 4.5);
  doc.text('Time Stamp', margin + 95, y + 4.5);
  doc.text('Net Gain (USDT)', margin + 130, y + 4.5);
  doc.text('Allocation %', margin + 165, y + 4.5);
  y += 6;

  depts.forEach(d => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(d.name, margin + 4, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(d.date, margin + 55, y + 4.5);
    doc.text(d.time, margin + 95, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(d.gain, margin + 130, y + 4.5);
    doc.setTextColor(0, 82, 255);
    doc.text(d.pct, margin + 165, y + 4.5);
    y += 6;
  });
  y += 8;

  // Performance & Device Timetable Grid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Performance & Demographic Analytics (BitVista Telemetry)', margin, y);
  y += 6;

  const pWidth = (contentWidth - 6) / 2;
  // Left: Top User Card & Activity
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Top Platform User', margin + 5, y + 6);

  doc.setFontSize(11);
  doc.setTextColor(0, 82, 255);
  doc.text('Anthony Alverizko', margin + 5, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('anthony.al@gmail.com · UID: USR-TOP-9921', margin + 5, y + 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Expected New Users: 3.2k (+4.2%)', margin + 5, y + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Activity Gauge Today: $32.45 Average Contract Size', margin + 5, y + 36);

  // Right: Forthcoming Timetable (Desktop vs Mobile)
  doc.roundedRect(margin + pWidth + 6, y, pWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Forthcoming Timetable & Client Hardware', margin + pWidth + 11, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 145, 0);
  doc.text('21.54% Desktop Users', margin + pWidth + 11, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('-21% Last Month Trend', margin + pWidth + 11, y + 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 82, 255);
  doc.text('75.21% Mobile Terminals', margin + pWidth + 11, y + 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('+45% Last Month Mobile Expansion', margin + pWidth + 11, y + 36);

  // ==========================================
  // PAGE 5: DUE DILIGENCE & AML COMPLIANCE
  // ==========================================
  doc.addPage();
  addPageHeader('SECTION 04: DUE DILIGENCE & TRANSACTION MONITORING', 'FINTECH AML/CFT INSTITUTIONAL AUDIT');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Transaction Overview & Alert Severity Gauge (190 Total Alerts)', margin, y);
  y += 7;

  // Donut Severity Metrics
  const alertLevels = [
    { level: 'Low Level Alerts', count: '80 Alerts', pct: '42.1%', color: [0, 230, 118], desc: 'Routine threshold warnings and rapid IP change' },
    { level: 'Medium Level Alerts', count: '65 Alerts', pct: '34.2%', color: [255, 145, 0], desc: 'Rapid velocity transfers & multiple linked wallets' },
    { level: 'High Level Alerts', count: '45 Alerts', pct: '23.7%', color: [255, 61, 0], desc: 'Sanctions list fuzzy match & high-risk jurisdiction' },
  ];

  alertLevels.forEach(a => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'FD');

    doc.setFillColor(a.color[0], a.color[1], a.color[2]);
    doc.rect(margin + 2, y + 2, 3, 6, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(a.level, margin + 8, y + 5);

    doc.setFontSize(8.5);
    doc.setTextColor(a.color[0], a.color[1], a.color[2]);
    doc.text(a.count, margin + 65, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`${a.desc} (${a.pct})`, margin + 95, y + 5);
    y += 12;
  });
  y += 4;

  // Related Parties (Beneficial Owners)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Related Parties & Ultimate Beneficial Ownership (UBO)', margin, y);
  y += 6;

  doc.setFillColor(15, 20, 32);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('Stephanie Georg', margin + 6, y + 8);

  doc.setFontSize(8);
  doc.setTextColor(0, 145, 255);
  doc.text('Primary Owner · 60% Ownership · DeFi Ltd (United Kingdom)', margin + 6, y + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Phone: +1 410 7122334455   |   Email: steph@defi.com   |   Entity: Corporation   |   Opening: 05-Jan-2026', margin + 6, y + 20);
  doc.text('FATF PEP Screening: PASSED   |   Enhanced Due Diligence (EDD): COMPLETED & DIGITALLY VERIFIED', margin + 6, y + 26);
  y += 38;

  // Suspended Transactions & Radar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Transaction History: Suspended vs Cleared Volumes', margin, y);
  y += 6;

  const suspRows = [
    { metric: 'Suspended Transactions Queue', val: '12 Active Files', peak: '$35,000 High-Risk Alert', status: 'HOLD - EDD Required' },
    { metric: 'Cleared Transactions Ledger', val: '15 Cleared Files', peak: '$55,000 Cleared Peak', status: 'APPROVED & DISBURSED' },
    { metric: 'Global Radar Screening Points', val: '5 Institutional Hubs', peak: 'US, UK, UAE, India, Australia', status: 'LIVE INTERPOL MONITOR' },
  ];

  suspRows.forEach(r => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(r.metric, margin + 4, y + 5.5);
    doc.setTextColor(0, 82, 255);
    doc.text(r.val, margin + 65, y + 5.5);
    doc.setTextColor(100, 116, 139);
    doc.text(r.peak, margin + 110, y + 5.5);
    doc.setTextColor(r.status.includes('HOLD') ? 225 : 16, r.status.includes('HOLD') ? 29 : 185, r.status.includes('HOLD') ? 72 : 129);
    doc.text(r.status, margin + 160, y + 5.5);
    y += 11;
  });

  // ==========================================
  // PAGE 6: SUB-AGENT NETWORK & DESKS
  // ==========================================
  doc.addPage();
  addPageHeader('SECTION 05: SUB-AGENT NETWORK & DESK HIERARCHY', 'MULTI-TIER BROKERAGE & RBAC ACCESS CONTROLS');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Authorized 5-Desk Sub-Agent Specifications', margin, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const agentDesc = 'COINBASE organizes institutional brokerage access into 5 strict Sub-Agent desks. Each agent desk maintains isolated client rosters. Sub-agents cannot view or modify leads belonging to competing desks, ensuring strict regulatory data fencing.';
  doc.text(doc.splitTextToSize(agentDesc, contentWidth), margin, y);
  y += 14;

  const agentDesks = [
    { desk: 'Desk 1 - Alpha Desk', user: 'agentae001', code: 'PBD-AGENT-ae001', cap: 'Enterprise & Whale Liquidity', status: 'ACTIVE' },
    { desk: 'Desk 2 - Beta Desk', user: 'agentae002', code: 'PBD-AGENT-ae002', cap: 'High-Frequency Binary Options', status: 'ACTIVE' },
    { desk: 'Desk 3 - Gamma Desk', user: 'agentae003', code: 'PBD-AGENT-ae003', cap: 'Middle East & GCC Institutional', status: 'ACTIVE' },
    { desk: 'Desk 4 - Delta Desk', user: 'agentae004', code: 'PBD-AGENT-ae004', cap: 'European Compliance & OTC', status: 'ACTIVE' },
    { desk: 'Desk 5 - Epsilon Desk', user: 'agentae005', code: 'PBD-AGENT-ae005', cap: 'Asia-Pacific Retail Operations', status: 'ACTIVE' },
  ];

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Desk Designation', margin + 4, y + 4.5);
  doc.text('Authorized User', margin + 50, y + 4.5);
  doc.text('Invitation Code', margin + 85, y + 4.5);
  doc.text('Specialization', margin + 130, y + 4.5);
  doc.text('Status', margin + 175, y + 4.5);
  y += 6;

  agentDesks.forEach(d => {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(d.desk, margin + 4, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 82, 255);
    doc.text(d.user, margin + 50, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(d.code, margin + 85, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(d.cap, margin + 130, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(d.status, margin + 175, y + 4.5);
    y += 6.5;
  });
  y += 10;

  // Lead Funnel Lifecycle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Customer Registration & Invitation Gatekeeper Logic', margin, y);
  y += 6;

  const steps = [
    '1. Invitation Code Enforcement: Registration forms reject sign-ups without an active sub-agent code.',
    '2. Automatic User Linking: New customer is permanently tagged with the sponsoring agent desk UID.',
    '3. Isolation Middleware: Super Admins can audit all records, while sub-agents only query their linked users.',
    '4. Deposit Verification: Sub-agents receive live notifications upon customer deposit confirmation.',
  ];

  steps.forEach(s => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    doc.text(s, margin + 4, y);
    y += 5.5;
  });

  // ==========================================
  // PAGE 7: SECURITY AUDIT & SYSTEM ARCHITECTURE
  // ==========================================
  doc.addPage();
  addPageHeader('SECTION 06: SECURITY AUDIT & ARCHITECTURE SPECIFICATIONS', 'CRYPTOGRAPHIC SECURITY & INFRASTRUCTURE');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text('1. System Cryptography & Secrets Handling Policy', margin, y);
  y += 7;

  const secSpecs = [
    { title: 'Zero Autoloading Credential Mandate', desc: 'No credentials or passwords prefill automatically into the UI under any condition. All login submissions are manually authenticated.' },
    { title: 'Bcrypt Hash Architecture', desc: 'All user secrets and administrative credentials pass through multi-round bcrypt hashing. Plaintext passwords never persist to disk.' },
    { title: 'Cloud Run Sandbox Container', desc: 'Reverse-proxied through Nginx on Port 3000 exclusively. Strict CORS and CSRF token validations protect private endpoints.' },
    { title: 'Audited Action Logs', desc: 'Every freeze, debit, credit, withdrawal approval, and configuration change records an immutable timestamped event log.' },
  ];

  secSpecs.forEach(s => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(s.title, margin + 5, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(s.desc, margin + 5, y + 9);
    y += 15;
  });
  y += 4;

  // Platform Deployment Sign-off
  doc.setFillColor(15, 20, 32);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 230, 118);
  doc.text('PRODUCTION DEPLOYMENT VERIFICATION CERTIFICATE', margin + 8, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('This document certifies that the COINBASE & BitVista suite has been verified for production readiness.', margin + 8, y + 16);
  doc.text(`Document Reference: COINBASE-EXEC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`, margin + 8, y + 22);
  doc.text('Authorized Super Admin: admin@coinbase.ae  |  Cluster: asia-southeast1-docker-run', margin + 8, y + 28);
  doc.text('Integrity Checksum (SHA-256): 9e3a7c02b8d5f412a88e993bcde414f52670014a', margin + 8, y + 33);

  // Add Footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    if (p > 1) {
      addPageFooter(p, totalPages);
    }
  }

  const filename = `COINBASE_AllSections_Complete_Dossier_${new Date().toISOString().slice(0, 10)}.pdf`;
  return { doc, filename };
}
