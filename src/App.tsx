import React, { useState, useEffect } from 'react';
import { AppView, User } from './types';
import { storage } from './lib/storage';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/views/HomeView';
import { TradeView } from './components/views/TradeView';
import { AuthView } from './components/views/AuthView';
import { AdminLoginView } from './components/views/AdminLoginView';
import { SubAgentDashboard } from './components/views/SubAgentDashboard';
import { AdminDashboard } from './components/views/AdminDashboard';
import { CustomerViews } from './components/views/CustomerViews';
import { LiveSupportChat } from './components/chat/LiveSupportChat';
import { SwapView } from './components/views/SwapView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => storage.getCurrentUser());
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string>('BTC/USDT');
  const [unreadNoticeCount, setUnreadNoticeCount] = useState<number>(0);
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>(0);

  // Sync state with storage singleton
  useEffect(() => {
    const updateCounters = () => {
      const user = storage.getCurrentUser();
      setCurrentUser(user);
      if (user) {
        const notifs = storage.getNotifications(user.id).filter(n => !n.read);
        setUnreadNoticeCount(notifs.length);

        const convs = storage.getConversations();
        const myConv = convs.find(c => c.customerId === user.id);
        setUnreadMsgCount(myConv ? myConv.unreadCustomerCount : 0);
      } else {
        setUnreadNoticeCount(0);
        setUnreadMsgCount(0);
      }
    };

    updateCounters();
    return storage.subscribe(updateCounters);
  }, []);

  const handleNavigate = (view: AppView) => {
    // Role protection guards
    if (view === 'admin') {
      if (!currentUser || currentUser.role !== 'SUPER_ADMIN') {
        setCurrentView('admin-login');
        return;
      }
    }

    if (view === 'subagent') {
      if (!currentUser || (currentUser.role !== 'SUB_AGENT' && currentUser.role !== 'SUPER_ADMIN')) {
        setCurrentView('admin-login');
        return;
      }
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    storage.setCurrentUser(null);
    setCurrentUser(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050b18] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Persistent Global Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onLogout={handleLogout}
        unreadNotifications={unreadNoticeCount}
        unreadMessages={unreadMsgCount}
        onSelectCoinForTrade={(symbol) => {
          setSelectedCoinSymbol(symbol);
          handleNavigate('trade');
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onSelectCoinForTrade={(symbol) => {
              setSelectedCoinSymbol(symbol);
              handleNavigate('trade');
            }}
          />
        )}

        {currentView === 'trade' && (
          <TradeView
            currentUser={currentUser}
            onNavigate={handleNavigate}
            selectedSymbol={selectedCoinSymbol}
          />
        )}

        {currentView === 'swap' && (
          <SwapView
            currentUser={currentUser}
            onNavigate={handleNavigate}
            selectedSymbol={selectedCoinSymbol}
          />
        )}

        {(currentView === 'login' || currentView === 'register') && (
          <AuthView
            mode={currentView}
            onNavigate={handleNavigate}
            onSuccess={(user) => {
              setCurrentUser(user);
              if (user.role === 'SUPER_ADMIN') {
                handleNavigate('admin');
              } else if (user.role === 'SUB_AGENT') {
                handleNavigate('subagent');
              } else {
                handleNavigate('trade');
              }
            }}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLoginView
            onNavigate={handleNavigate}
            onSuccess={(user) => {
              setCurrentUser(user);
            }}
          />
        )}

        {currentView === 'subagent' && currentUser && (
          <SubAgentDashboard currentUser={currentUser} />
        )}

        {currentView === 'admin' && currentUser && (
          <AdminDashboard currentUser={currentUser} />
        )}

        {(currentView === 'markets' ||
          currentView === 'watchlist' ||
          currentView === 'assets' ||
          currentView === 'wallet' ||
          currentView === 'deposit' ||
          currentView === 'withdraw' ||
          currentView === 'history' ||
          currentView === 'profile' ||
          currentView === 'notifications' ||
          currentView === 'settings') && (
          currentUser ? (
            <CustomerViews
              view={currentView}
              currentUser={currentUser}
              onNavigate={handleNavigate}
              onSelectCoinForTrade={(symbol) => {
                setSelectedCoinSymbol(symbol);
                handleNavigate('trade');
              }}
            />
          ) : (
            <AuthView
              mode="login"
              onNavigate={handleNavigate}
              onSuccess={(user) => {
                setCurrentUser(user);
                handleNavigate(currentView);
              }}
            />
          )
        )}
      </main>

      {/* 24/7 VIP Customer and Admin Live Support Chat Drawer */}
      <LiveSupportChat currentUser={currentUser} />

      {/* Persistent Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
