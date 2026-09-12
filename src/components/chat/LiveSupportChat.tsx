import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, Conversation } from '../../types';
import { storage } from '../../lib/storage';
import { 
  MessageSquare, 
  X, 
  Send, 
  ShieldCheck, 
  Bot, 
  Headphones, 
  Clock, 
  Paperclip,
  CheckCheck
} from 'lucide-react';

interface LiveSupportChatProps {
  currentUser: User | null;
}

export const LiveSupportChat: React.FC<LiveSupportChatProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or find user conversation
  useEffect(() => {
    if (!currentUser) return;

    const convs = storage.getConversations();
    let conv = convs.find(c => c.customerId === currentUser.id);

    if (!conv) {
      conv = {
        id: `conv_${currentUser.id}`,
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        lastMessage: 'Welcome to Coinbase Institutional Live Support.',
        lastMessageAt: new Date().toISOString(),
        unreadCustomerCount: 0,
        unreadAdminCount: 0,
        status: 'OPEN',
      };
    }

    setConversation(conv);
    setMessages(storage.getMessages(conv.id));

    // Listen to reactive updates
    return storage.subscribe(() => {
      if (conv) {
        setMessages(storage.getMessages(conv.id));
      }
    });
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!currentUser) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conversation) return;

    const text = inputMessage.trim();
    storage.sendMessage(conversation.id, currentUser, text);
    setInputMessage('');

    // Simulate automated desk response after 1.5s if it's the customer's first inquiry
    setTimeout(() => {
      const superAdminUser = storage.getUsers().find(u => u.role === 'SUPER_ADMIN');
      if (superAdminUser && messages.length < 4) {
        storage.sendMessage(
          conversation.id,
          superAdminUser,
          "Thank you for contacting Coinbase Operations. An institutional desk officer has been assigned to your ticket."
        );
      }
    }, 1500);
  };

  const unreadCount = conversation?.unreadCustomerCount || 0;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_25px_rgba(0,82,255,0.6)] hover:scale-105 transition-all flex items-center gap-2.5 font-bold text-xs"
        >
          <Headphones className="w-5 h-5" />
          <span className="hidden sm:inline">24/7 VIP Support</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-rose-500 text-[10px] font-mono font-bold text-white border-2 border-slate-950 animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl cb-glass-card border border-blue-500/40 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Chat Header */}
          <div className="p-4 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-blue-400">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  Coinbase VIP Support Desk
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                </h3>
                <span className="text-[10px] text-emerald-400 font-mono">Operations Officers Online</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto cb-scroll space-y-3 bg-slate-950/60">
            <div className="text-center py-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-white/5 text-[10px] text-slate-400 font-mono">
                Encrypted Session • UID: {currentUser.uid}
              </span>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <p className="text-xs text-slate-400">
                  Welcome to Coinbase Support! How may our trading desk assist you today?
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                  {['Deposit Status', 'Withdrawal Limits', 'VIP Level Upgrade'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (conversation) {
                          storage.sendMessage(conversation.id, currentUser, `Inquiry regarding: ${tag}`);
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-blue-500/20 text-[11px] text-blue-300 hover:bg-slate-800 font-mono"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(m => {
                const isMe = m.senderId === currentUser.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-500 font-mono mb-0.5 px-1">
                      {isMe ? 'You' : m.senderName}
                    </div>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                          : 'bg-slate-800/90 text-slate-200 rounded-bl-none border border-white/5'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5 px-1">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Composer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900/90 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question or report an issue..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-blue-500/20 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors shadow-md shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
