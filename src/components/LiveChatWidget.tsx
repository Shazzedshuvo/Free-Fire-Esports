'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  Bot,
  User as UserIcon,
  Clock,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCheck,
  Phone,
  Gamepad2,
  ShieldCheck,
  Edit2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { OFFICIAL_DEPOSIT_NUMBER } from './DepositModal';

interface Message {
  id: string;
  sender: 'user' | 'agent';
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
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessionId, setSessionId] = useState<string>('');
  
  // Mandatory User Identification (FF UID + Phone Number)
  const [userInfo, setUserInfo] = useState<ChatUserInfo | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formFfUid, setFormFfUid] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formError, setFormError] = useState('');

  // Initialize chat session & load messages + user info
  useEffect(() => {
    let sid = localStorage.getItem('ff_chat_session_id');
    if (!sid) {
      sid = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem('ff_chat_session_id', sid);
    }
    setSessionId(sid);

    // Check saved user info
    const savedInfo = localStorage.getItem('ff_chat_user_info');
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        if (parsed.ffUid && parsed.phone) {
          setUserInfo(parsed);
          setFormName(parsed.name || '');
          setFormFfUid(parsed.ffUid || '');
          setFormPhone(parsed.phone || '');
        }
      } catch (e) {}
    } else if (user && user.ffUid && user.mobileNumber) {
      const authUser: ChatUserInfo = {
        name: user.fullName || user.username,
        ffUid: user.ffUid,
        phone: user.mobileNumber,
      };
      setUserInfo(authUser);
      localStorage.setItem('ff_chat_user_info', JSON.stringify(authUser));
      setFormName(authUser.name);
      setFormFfUid(authUser.ffUid);
      setFormPhone(authUser.phone);
    }

    // Initial fetch from backend
    fetch(`/api/chat?sessionId=${sid}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          const formatted: Message[] = data.messages.map((m: any) => ({
            id: m.id,
            sender: m.sender === 'admin' ? 'agent' : 'user',
            text: m.text,
            time: m.time,
          }));
          setMessages(formatted);
          return;
        }

        // Fallback default message if no history
        const defaultMessages: Message[] = [
          {
            id: '1',
            sender: 'agent',
            text: 'আসসালামু আলাইকুম! ফ্রি ফায়ার টুর্নামেন্ট লাইভ সাপোর্টে আপনাকে স্বাগতম। আপনি মেসেজ পাঠালে আমাদের অ্যাডমিন সরাসরি রিপ্লাই দেবেন। টুর্নামেন্ট শুরু হওয়ার ১০ মিনিট আগে রুম আইডি ও পাসওয়ার্ড দেওয়া হবে।',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: 'WhatsApp এ কথা বলুন', url: `https://wa.me/88${OFFICIAL_DEPOSIT_NUMBER}` },
              { label: 'Telegram চ্যানেলে যোগ দিন', url: 'https://t.me/ff_esports_bd' },
            ],
          },
        ];
        setMessages(defaultMessages);
      })
      .catch(() => {});
  }, [user]);

  // Sync if logged-in user state updates
  useEffect(() => {
    if (user && user.ffUid && user.mobileNumber && (!userInfo || !userInfo.ffUid)) {
      const updated: ChatUserInfo = {
        name: user.fullName || user.username,
        ffUid: user.ffUid,
        phone: user.mobileNumber,
      };
      setUserInfo(updated);
      localStorage.setItem('ff_chat_user_info', JSON.stringify(updated));
    }
  }, [user, userInfo]);

  // Poll for admin replies every 3 seconds when chat is open or periodically
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      fetch(`/api/chat?sessionId=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages && data.messages.length > 0) {
            const formatted: Message[] = data.messages.map((m: any) => ({
              id: m.id,
              sender: m.sender === 'admin' ? 'agent' : 'user',
              text: m.text,
              time: m.time,
            }));

            // Only update if count changed
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
    }, 3000);

    return () => clearInterval(interval);
  }, [sessionId, isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, showInfoModal]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
    // If user info (FF UID & Phone) is missing, show the form
    if (!userInfo || !userInfo.ffUid || !userInfo.phone) {
      setShowInfoModal(true);
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formName.trim() || 'Player';
    const ffUid = formFfUid.trim();
    const phone = formPhone.trim();

    if (!ffUid) {
      setFormError('অনুগ্রহ করে আপনার Free Fire UID দিন');
      return;
    }
    if (!phone) {
      setFormError('অনুগ্রহ করে আপনার ফোন বা WhatsApp নম্বর দিন');
      return;
    }

    const info: ChatUserInfo = { name, ffUid, phone };
    setUserInfo(info);
    localStorage.setItem('ff_chat_user_info', JSON.stringify(info));
    setShowInfoModal(false);
    setFormError('');

    // Send introduction to admin
    handleSend(`হ্যালো অ্যাডমিন! আমি ${name} (FF UID: ${ffUid}, মোবাইল: ${phone})। আমার একটি জিজ্ঞাসা আছে।`);
  };

  const handleSend = async (textToSend?: string) => {
    // If user info is not set, force modal open
    if (!userInfo || !userInfo.ffUid || !userInfo.phone) {
      setShowInfoModal(true);
      return;
    }

    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Send to backend API with FF UID and Phone Number!
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId || localStorage.getItem('ff_chat_session_id'),
          text: query,
          senderName: userInfo.name,
          ffUid: userInfo.ffUid,
          phoneNumber: userInfo.phone,
        }),
      });
    } catch (e) {
      console.error(e);
    }

    // Auto-assistant quick hints
    const lower = query.toLowerCase();
    if (lower.includes('রুম') || lower.includes('room') || lower.includes('পাস') || lower.includes('pass') || lower.includes('আইডি')) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'agent',
            text: '✅ টুর্নামেন্ট শুরু হওয়ার ঠিক ১০ মিনিট আগে "My Matches" পেজে রুম আইডি ও পাসওয়ার্ড স্বয়ংক্রিয়ভাবে দৃশ্যমান হবে। দয়া করে ম্যাচ শুরুর ৫ মিনিট আগে কাস্টম রুমে প্রবেশ করুন। অ্যাডমিনও কিছুক্ষণের মধ্যে রিপ্লাই দেবেন।',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
      }, 700);
    } else if (lower.includes('ডিপোজিট') || lower.includes('deposit') || lower.includes('টাকা') || lower.includes('trx') || lower.includes('বিকাশ')) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'agent',
            text: `💰 ডিপোজিট নম্বর: ${OFFICIAL_DEPOSIT_NUMBER} (Send Money)। টাকা পাঠিয়ে TrxID সাবমিট করুন। অ্যাডমিন অবিলম্বে চেক করে ওয়ালেটে টাকা অ্যাড করবেন।`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            buttons: [
              { label: 'WhatsApp এ কথা বলুন', url: `https://wa.me/88${OFFICIAL_DEPOSIT_NUMBER}` },
            ],
          },
        ]);
        setIsTyping(false);
      }, 700);
    }
  };

  const quickQuestions = [
    'রুম আইডি ও পাসওয়ার্ড কখন পাবো?',
    'ডিপোজিট নম্বর কত?',
    'টাকা অ্যাড হতে কত সময় লাগে?',
    'অ্যাডমিনের সাথে সরাসরি কথা বলতে চাই',
  ];

  return (
    <>
      {/* Floating Static Trigger Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
          <button
            onClick={handleOpen}
            className="group relative flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-ff-orange via-amber-500 to-ff-red text-slate-950 font-black shadow-glow-orange hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm"
            aria-label="Open Live Chat"
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 fill-current" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></span>
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-wider font-display font-black">
              LIVE CHAT
            </span>

            {unreadCount > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black text-white text-[10px] sm:text-xs font-black flex items-center justify-center -ml-0.5 sm:-ml-1">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Floating Live Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-2 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 sm:w-[400px] max-w-[400px] h-[85vh] sm:h-[560px] max-h-[620px] bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-charcoal-900 to-slate-950 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-ff-orange to-ff-red flex items-center justify-center shadow-glow-orange">
                  <Headphones className="w-5 h-5 text-black" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-charcoal-900"></span>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                  <span>LIVE SUPPORT</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                    ONLINE
                  </span>
                </h3>
                <p className="text-[11px] text-gray-300">
                  {userInfo ? `${userInfo.name} (UID: ${userInfo.ffUid})` : 'ফ্রি ফায়ার অফিশিয়াল সাপোর্ট'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {userInfo && (
                <button
                  type="button"
                  onClick={() => setShowInfoModal(true)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                  title="তথ্য পরিবর্তন করুন"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ================= MANDATORY CONTACT INFO FORM MODAL ================= */}
          {showInfoModal ? (
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50 dark:bg-charcoal-950 flex flex-col justify-center space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-ff-orange flex items-center justify-center mx-auto shadow-sm">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h4 className="font-display font-black text-lg text-slate-900 dark:text-white">
                  লাইভ চ্যাট শুরু করার নিয়ম
                </h4>
                <p className="text-xs text-slate-600 dark:text-gray-300 font-semibold leading-relaxed">
                  সরাসরি অ্যাডমিনের সাথে যোগাযোগ ও পরবর্তী আপডেটের জন্য আপনার Free Fire UID এবং ফোন নম্বর দিন:
                </p>
              </div>

              {formError && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold text-center">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveInfo} className="space-y-3.5">
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

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-ff-orange via-amber-500 to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black uppercase text-xs tracking-wider shadow-glow-orange transition-all active:scale-95"
                >
                  🚀 তথ্য সংরক্ষণ ও চ্যাট শুরু করুন
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 dark:bg-charcoal-950/70 text-xs">
                {/* 10 Min Warning Banner in Chat */}
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-ff-amber text-[11px] font-bold flex items-center gap-2">
                  <span>🔔</span>
                  <span>টুর্নামেন্ট শুরু হওয়ার ঠিক ১০ মিনিট আগে রুম আইডি ও পাসওয়ার্ড দেওয়া হবে।</span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm text-xs sm:text-[13px] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-slate-950 rounded-br-none font-bold'
                          : 'bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-slate-900 dark:text-gray-100 rounded-bl-none font-semibold'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.buttons && (
                        <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-200/50 dark:border-charcoal-700/50">
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
                  <div className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 w-16 text-ff-orange">
                    <span className="w-1.5 h-1.5 bg-ff-orange rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-ff-orange rounded-full animate-bounce delay-150"></span>
                    <span className="w-1.5 h-1.5 bg-ff-orange rounded-full animate-bounce delay-300"></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions Pills */}
              <div className="px-3 py-2 bg-white dark:bg-charcoal-900 border-t border-slate-200 dark:border-charcoal-800 flex items-center gap-1.5 overflow-x-auto">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-charcoal-800 hover:bg-orange-500/15 hover:text-ff-orange border border-slate-200 dark:border-charcoal-700 text-xs font-bold text-slate-700 dark:text-gray-300 whitespace-nowrap transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Form */}
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
                  placeholder="বার্তা লিখুন / Type message..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs font-medium focus:border-ff-orange focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black disabled:opacity-40 transition-all shadow-sm"
                  title="Send"
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
