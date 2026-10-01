'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  User as UserIcon,
  ExternalLink,
  Flame,
  Phone,
  Gamepad2,
  ShieldCheck,
  Edit2,
  HelpCircle,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { OFFICIAL_DEPOSIT_NUMBER } from './DepositModal';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  senderName?: string;
  text: string;
  time: string;
  buttons?: { label: string; url: string; icon?: string }[];
}

interface ChatUserInfo {
  name: string;
  ffUid: string;
  phone: string;
}

export default function LiveChatWidget() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine user-specific isolated session ID
  const [sessionId, setSessionId] = useState<string>('');
  const [userInfo, setUserInfo] = useState<ChatUserInfo | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formFfUid, setFormFfUid] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formError, setFormError] = useState('');

  // 1. Establish session isolation per user
  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;

    let activeSessionId = '';

    if (user && user.id) {
      // Dedicated session ID for authenticated user
      activeSessionId = `user_${user.id}`;
      const authInfo: ChatUserInfo = {
        name: user.fullName || user.username || user.ffPlayerName || 'Player',
        ffUid: user.ffUid || '',
        phone: user.mobileNumber || '',
      };
      setUserInfo(authInfo);
      setFormName(authInfo.name);
      setFormFfUid(authInfo.ffUid);
      setFormPhone(authInfo.phone);
    } else {
      // Guest session ID
      let guestId = localStorage.getItem('ff_guest_chat_session_id');
      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        localStorage.setItem('ff_guest_chat_session_id', guestId);
      }
      activeSessionId = guestId;

      // Check saved guest info
      const savedGuest = localStorage.getItem('ff_guest_chat_user_info');
      if (savedGuest) {
        try {
          const parsed = JSON.parse(savedGuest);
          if (parsed.name || parsed.ffUid) {
            setUserInfo(parsed);
            setFormName(parsed.name || '');
            setFormFfUid(parsed.ffUid || '');
            setFormPhone(parsed.phone || '');
          }
        } catch (e) {}
      }
    }

    setSessionId(activeSessionId);

    // Initial fetch of messages for this specific session
    fetch(`/api/chat?sessionId=${activeSessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          const formatted: Message[] = data.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender === 'admin' ? 'agent' : 'user',
            senderName: m.senderName,
            text: m.text,
            time: m.time,
          }));
          setMessages(formatted);
        } else {
          // Welcome greeting
          const defaultMessages: Message[] = [
            {
              id: 'welcome_1',
              sender: 'agent',
              senderName: 'সাপোর্ট টিম',
              text: 'আসসালামু আলাইকুম! ফ্রি ফায়ার টুর্নামেন্ট লাইভ সাপোর্টে আপনাকে স্বাগতম। আপনার যেকোনো প্রশ্ন বা সমস্যার জন্য মেসেজ পাঠান, তাৎক্ষণিক অটো-রিপ্লাই ও অ্যাডমিন সহায়তা পাবেন।',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              buttons: [
                { label: 'WhatsApp এ কথা বলুন', url: `https://wa.me/88${OFFICIAL_DEPOSIT_NUMBER}` },
              ],
            },
          ];
          setMessages(defaultMessages);
        }
      })
      .catch(() => {});
  }, [user, pathname]);

  // 2. Poll for updates on the active session every 3.5s
  useEffect(() => {
    if (pathname?.startsWith('/admin') || !sessionId) return;

    const interval = setInterval(() => {
      fetch(`/api/chat?sessionId=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages && data.messages.length > 0) {
            const formatted: Message[] = data.messages.map((m: any) => ({
              id: m.id,
              sender: m.sender === 'admin' ? 'agent' : 'user',
              senderName: m.senderName,
              text: m.text,
              time: m.time,
            }));

            setMessages((prev) => {
              if (formatted.length !== prev.length) {
                if (!isOpen) setUnreadCount((c) => c + 1);
                return formatted;
              }
              return prev;
            });
          }
        })
        .catch(() => {});
    }, 3500);

    return () => clearInterval(interval);
  }, [sessionId, isOpen, pathname]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showInfoModal]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    // If user info is completely blank, prompt them to enter details
    if (!userInfo || !userInfo.name || !userInfo.ffUid) {
      setShowInfoModal(true);
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formName.trim();
    const ffUid = formFfUid.trim();
    const phone = formPhone.trim();

    if (!name) {
      setFormError('অনুগ্রহ করে আপনার নাম দিন');
      return;
    }
    if (!ffUid) {
      setFormError('অনুগ্রহ করে আপনার Free Fire UID দিন');
      return;
    }
    if (!phone) {
      setFormError('অনুগ্রহ করে আপনার মোবাইল বা WhatsApp নম্বর দিন');
      return;
    }

    const info: ChatUserInfo = { name, ffUid, phone };
    setUserInfo(info);
    if (!user) {
      localStorage.setItem('ff_guest_chat_user_info', JSON.stringify(info));
    }
    setShowInfoModal(false);
    setFormError('');
  };

  const handleSend = async (textToSend?: string) => {
    // If user info is not set, force modal open
    if (!userInfo || !userInfo.name || !userInfo.ffUid) {
      setShowInfoModal(true);
      return;
    }

    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `client_${Date.now()}`,
      sender: 'user',
      senderName: userInfo.name,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          text: query,
          senderName: userInfo.name,
          ffUid: userInfo.ffUid,
          phoneNumber: userInfo.phone,
        }),
      });

      const data = await res.json();

      // If backend generated an auto-reply, display it with a short natural typing delay
      if (data.autoReply) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: data.autoReply.id,
              sender: 'agent',
              senderName: data.autoReply.senderName || 'সাপোর্ট অ্যাসিস্ট্যান্ট',
              text: data.autoReply.text,
              time: data.autoReply.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsTyping(false);
        }, 500);
      } else {
        setIsTyping(false);
      }
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    { label: '🔑 রুম আইডি ও পাসওয়ার্ড কখন পাবো?', query: 'রুম আইডি ও পাসওয়ার্ড কখন পাবো?' },
    { label: '💰 ডিপোজিট নম্বর কত?', query: 'ডিপোজিট নম্বর কত?' },
    { label: '⏱️ টাকা অ্যাড হতে কত সময় লাগে?', query: 'টাকা অ্যাড হতে কত সময় লাগে?' },
    { label: '⚠️ খেলার নিয়ম ও লেভেল যোগ্যতা?', query: 'খেলার নিয়ম ও লেভেল যোগ্যতা কি?' },
    { label: '💳 উইথড্র করার নিয়ম কি?', query: 'উইথড্র করার নিয়ম কি?' },
    { label: '👨‍💻 সরাসরি অ্যাডমিনের সাহায্য চাই', query: 'অ্যাডমিনের সাথে সরাসরি কথা বলতে চাই' },
  ];

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
          <button
            onClick={handleOpen}
            className="group relative flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-ff-orange via-amber-500 to-ff-red text-slate-950 font-black shadow-glow-orange hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm border border-amber-300"
            aria-label="Open Live Chat"
          >
            <div className="relative">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 fill-current" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></span>
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-wider font-display font-black">
              LIVE SUPPORT
            </span>

            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-black text-white text-[11px] font-black flex items-center justify-center -ml-1">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-2 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 sm:w-[410px] max-w-[420px] h-[85vh] sm:h-[580px] max-h-[630px] bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-charcoal-900 to-slate-950 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-ff-orange to-ff-amber flex items-center justify-center shadow-glow-orange text-slate-950">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-charcoal-900"></span>
              </div>
              <div className="max-w-[210px] sm:max-w-[240px]">
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <span>LIVE SUPPORT</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[11px] text-gray-300 truncate">
                  {userInfo?.name ? `${userInfo.name} (UID: ${userInfo.ffUid || 'N/A'})` : 'ফ্রি ফায়ার অফিশিয়াল সাপোর্ট'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowInfoModal(true)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="প্রোফাইল তথ্য আপডেট করুন"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mandatory Contact Info Modal */}
          {showInfoModal ? (
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50 dark:bg-charcoal-950 flex flex-col justify-center space-y-4">
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-ff-orange flex items-center justify-center mx-auto shadow-sm">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h4 className="font-display font-black text-lg text-slate-900 dark:text-white">
                  আপনার প্লেয়ার তথ্য দিন
                </h4>
                <p className="text-xs text-slate-600 dark:text-gray-300 font-semibold leading-relaxed">
                  সরাসরি সহায়তা ও দ্রুত উত্তরের জন্য আপনার নাম, Free Fire UID এবং মোবাইল নম্বর পূরণ করুন:
                </p>
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveInfo} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                    আপনার নাম (Player Name) *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Shuvo Ahmed"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs font-bold focus:border-ff-orange focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                    Free Fire UID (এফএফ আইডি) *
                  </label>
                  <div className="relative">
                    <Gamepad2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={formFfUid}
                      onChange={(e) => setFormFfUid(e.target.value)}
                      placeholder="e.g. 1984729103"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs font-mono font-bold focus:border-ff-orange focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                    মোবাইল নম্বর / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="e.g. 01719052334"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white dark:bg-charcoal-900 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs font-mono font-bold focus:border-ff-orange focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div className="pt-1 flex gap-2">
                  {userInfo && userInfo.name && (
                    <button
                      type="button"
                      onClick={() => setShowInfoModal(false)}
                      className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-charcoal-800 text-slate-700 dark:text-gray-300 font-bold text-xs"
                    >
                      বাতিল
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-ff-orange via-amber-500 to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black uppercase text-xs tracking-wider shadow-glow-orange transition-all"
                  >
                    🚀 সংরক্ষণ করুন ও চ্যাট শুরু করুন
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 dark:bg-charcoal-950/70 text-xs">
                {/* 10 Min Warning Banner in Chat */}
                <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-ff-amber text-[11px] font-bold flex items-start gap-2.5 shadow-sm">
                  <span className="text-base mt-[-2px]">📢</span>
                  <div className="leading-tight">
                    <span className="font-extrabold block">জরুরি টুর্নামেন্ট নোটিশ:</span>
                    <span>ম্যাচ শুরু হওয়ার ঠিক ১০ মিনিট আগে রুম আইডি ও পাসওয়ার্ড দেওয়া হবে। অবশ্যই রেজিষ্ট্রিকৃত FF UID দিয়ে খেলবেন।</span>
                  </div>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.sender === 'agent' && (
                      <span className="text-[10px] text-ff-orange font-bold px-1 mb-0.5">
                        🛡️ {msg.senderName || 'সাপোর্ট সহকারী'}
                      </span>
                    )}

                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm text-xs sm:text-[13px] leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-slate-950 rounded-br-none font-bold'
                          : 'bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-slate-900 dark:text-gray-100 rounded-bl-none font-semibold'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.buttons && (
                        <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-charcoal-700/60">
                          {msg.buttons.map((btn, idx) => (
                            <a
                              key={idx}
                              href={btn.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-900 dark:text-white font-bold text-xs transition-colors shadow-sm"
                            >
                              <span>{btn.label}</span>
                              <ExternalLink className="w-3 h-3 text-ff-orange" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400 mt-1 px-1 font-bold">
                      {msg.time}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 w-20 text-ff-orange shadow-sm">
                    <span className="w-2 h-2 bg-ff-orange rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-ff-orange rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-ff-orange rounded-full animate-bounce delay-300"></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Interactive Pills */}
              <div className="p-2 bg-white dark:bg-charcoal-900 border-t border-slate-200 dark:border-charcoal-800">
                <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400 mb-1 px-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-ff-orange" />
                  <span>কমন প্রশ্নের তাৎক্ষণিক উত্তর:</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q.query)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-charcoal-800 hover:bg-orange-500/15 hover:text-ff-orange hover:border-ff-orange/40 border border-slate-200 dark:border-charcoal-700 text-xs font-bold text-slate-700 dark:text-gray-200 whitespace-nowrap transition-colors shadow-xs"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 bg-white dark:bg-charcoal-900 border-t border-slate-200 dark:border-charcoal-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="বার্তা লিখুন / Type your message..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs font-semibold focus:border-ff-orange focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black disabled:opacity-40 transition-all shadow-sm flex-shrink-0"
                  title="পাঠান"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
