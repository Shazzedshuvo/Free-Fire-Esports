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
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-3">
            <MessageSquare className="w-7 h-7 text-sky-600 dark:text-sky-400" />
            <span>REAL-TIME LIVE CHAT HELPDESK (লাইভ চ্যাট হেল্পডেস্ক)</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-gray-300 font-semibold mt-1">
            প্লেয়ারদের সাথে সরাসরি চ্যাট করুন। প্রতিটি প্লেয়ারের Free Fire UID এবং ফোন নম্বর যাচাই করে দ্রুত উত্তর দিন।
          </p>
        </div>
        <button
          onClick={fetchThreads}
          className="p-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-800 dark:text-gray-200 text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-ff-orange" />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Thread List */}
        <div className="lg:col-span-1 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
          <div className="p-4 border-b border-slate-200 dark:border-charcoal-800 space-y-3 bg-slate-50 dark:bg-charcoal-950/60">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="নাম, UID বা ফোন নম্বর দিয়ে খুঁজুন..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:border-ff-orange focus:outline-none shadow-sm"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-slate-700 dark:text-gray-300 font-black px-1">
              <span>সক্রিয় চ্যাট সেশন ({filteredThreads.length})</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-charcoal-800">
            {filteredThreads.length === 0 ? (
              <div className="py-16 text-center text-xs sm:text-sm text-slate-400">
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
                        ? 'bg-orange-500/10 dark:bg-ff-orange/15 border-l-4 border-orange-500'
                        : 'hover:bg-slate-50 dark:hover:bg-charcoal-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-[170px]">
                        {t.userName || 'Player'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                        {new Date(t.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-300 font-mono">
                      {t.ffUid && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-charcoal-950 text-amber-700 dark:text-ff-amber border border-slate-200 dark:border-charcoal-700 font-bold">
                          UID: {t.ffUid}
                        </span>
                      )}
                      {t.phoneNumber && (
                        <span className="text-slate-600 dark:text-gray-400 font-bold">📞 {t.phoneNumber}</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-1 italic mt-0.5">
                      {t.lastMessage || 'Sent a message'}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Messaging Area */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl overflow-hidden flex flex-col h-[650px]">
          {selectedThread ? (
            <>
              {/* Thread Header with Player Details */}
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-charcoal-800 bg-slate-50 dark:bg-charcoal-950/60 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                      {selectedThread.userName || 'Player'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
                      Active
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-mono">
                    {selectedThread.ffUid && (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        🎮 Free Fire UID: {selectedThread.ffUid}
                      </span>
                    )}
                    {selectedThread.phoneNumber && (
                      <span className="text-sky-600 dark:text-sky-400 font-bold">
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
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>WhatsApp Chat</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Chat Message History */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-charcoal-950/30">
                {messages.length === 0 ? (
                  <div className="py-20 text-center text-sm text-slate-400">
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
                          <span className="text-xs font-bold text-slate-600 dark:text-gray-300">
                            {isAdmin ? '🛡️ Admin Support' : m.senderName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div
                          className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed shadow-sm ${
                            isAdmin
                              ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-black rounded-tr-none'
                              : 'bg-white dark:bg-charcoal-800 text-slate-900 dark:text-gray-100 border border-slate-200 dark:border-charcoal-700 rounded-tl-none'
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
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-950/80 flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="প্লেয়ারের জন্য উত্তর লিখুন..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-charcoal-900 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-ff-orange focus:outline-none"
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
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 space-y-2">
              <MessageSquare className="w-14 h-14 text-slate-300 dark:text-charcoal-700" />
              <p className="text-base font-bold text-slate-700 dark:text-gray-300">বাম পাশের তালিকা থেকে যেকোনো প্লেয়ারের চ্যাট নির্বাচন করুন।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
