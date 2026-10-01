'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Send,
  User,
  Phone,
  RefreshCw,
  ExternalLink,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export default function AdminChatPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  const fetchThreads = async () => {
    try {
      const res = await fetch('/api/admin/chat');
      const data = await res.json();
      if (data.threads) {
        setThreads(data.threads);
        if (!selectedSessionId && data.threads.length > 0) {
          setSelectedSessionId(data.threads[0].sessionId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
    const interval = setInterval(fetchThreads, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedSessionId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/admin/chat?sessionId=${selectedSessionId}`);
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedSessionId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedSessionId || sending) return;

    try {
      setSending(true);
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSessionId,
          text: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setReplyText('');
        fetchThreads();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const filteredThreads = threads.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.userName?.toLowerCase().includes(q) ||
      t.ffUid?.toLowerCase().includes(q) ||
      t.phoneNumber?.toLowerCase().includes(q) ||
      t.lastMessage?.toLowerCase().includes(q)
    );
  });

  const selectedThread = threads.find((t) => t.sessionId === selectedSessionId);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl">
        <div>
          <h1 className="font-display font-black text-2xl text-white flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-sky-400" />
            <span>REAL-TIME LIVE CHAT HELPDESK</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            প্লেয়ারদের সাথে সরাসরি চ্যাট করুন। প্রতিটি প্লেয়ারের Free Fire UID এবং ফোন নম্বর যাচাই করে দ্রুত উত্তর দিন।
          </p>
        </div>
        <button
          onClick={fetchThreads}
          className="p-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-ff-orange" />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thread List */}
        <div className="lg:col-span-1 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
          <div className="p-4 border-b border-charcoal-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="নাম, UID বা ফোন নম্বর দিয়ে খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 font-bold px-1">
              <span>সক্রিয় চ্যাট সেশন ({filteredThreads.length})</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-charcoal-800">
            {filteredThreads.length === 0 ? (
              <div className="py-16 text-center text-xs text-gray-500">
                কোনো চ্যাট মেসেজ পাওয়া যায়নি।
              </div>
            ) : (
              filteredThreads.map((t) => {
                const isSelected = t.sessionId === selectedSessionId;
                return (
                  <button
                    key={t.sessionId}
                    onClick={() => setSelectedSessionId(t.sessionId)}
                    className={`w-full p-4 text-left transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-ff-orange/15 border-l-4 border-ff-orange'
                        : 'hover:bg-charcoal-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white truncate max-w-[150px]">
                        {t.userName || 'Player'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(t.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-300 font-mono">
                      {t.ffUid && (
                        <span className="px-1.5 py-0.5 rounded bg-charcoal-950 text-ff-amber border border-charcoal-700">
                          UID: {t.ffUid}
                        </span>
                      )}
                      {t.phoneNumber && (
                        <span className="text-gray-400">📞 {t.phoneNumber}</span>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-1 italic mt-0.5">
                      {t.lastMessage || 'Sent a message'}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Messaging Area */}
        <div className="lg:col-span-2 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
          {selectedThread ? (
            <>
              {/* Thread Header with Player Details */}
              <div className="p-4 sm:p-5 border-b border-charcoal-800 bg-charcoal-950/60 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-lg text-white">
                      {selectedThread.userName || 'Player'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Active
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 font-mono">
                    {selectedThread.ffUid && (
                      <span className="text-amber-400 font-bold">
                        🎮 Free Fire UID: {selectedThread.ffUid}
                      </span>
                    )}
                    {selectedThread.phoneNumber && (
                      <span className="text-sky-400 font-bold">
                        📱 Phone: {selectedThread.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                {selectedThread.phoneNumber && (
                  <a
                    href={`https://wa.me/88${selectedThread.phoneNumber.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>WhatsApp Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Chat Message History */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-charcoal-950/30">
                {messages.length === 0 ? (
                  <div className="py-20 text-center text-xs text-gray-500">
                    মেসেজ লোড হচ্ছে বা কোনো মেসেজ নেই...
                  </div>
                ) : (
                  messages.map((m) => {
                    const isAdmin = m.senderRole === 'ADMIN';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[10px] font-bold text-gray-400">
                            {isAdmin ? '🛡️ Admin Support' : m.senderName}
                          </span>
                          <span className="text-[9px] text-gray-500">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                            isAdmin
                              ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-black font-semibold rounded-tr-none'
                              : 'bg-charcoal-800 text-gray-100 border border-charcoal-700 rounded-tl-none'
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Admin Reply Box */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-charcoal-800 bg-charcoal-950/80 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="প্লেয়ারের জন্য উত্তর লিখুন..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white text-xs sm:text-sm focus:border-ff-orange focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{sending ? 'পাঠানো হচ্ছে...' : 'Send'}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-6 space-y-2">
              <MessageSquare className="w-12 h-12 text-charcoal-700" />
              <p className="text-sm font-semibold">বাম পাশের তালিকা থেকে যেকোনো প্লেয়ারের চ্যাট নির্বাচন করুন।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
