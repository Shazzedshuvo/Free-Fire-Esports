'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  Gamepad2,
  CreditCard,
  Wallet,
  MessageSquare,
  Trophy,
  Copy,
  Check,
  PlusCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  User,
  Phone,
  Mail,
  Flame,
  ArrowUpRight,
  Send,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import DepositModal, { OFFICIAL_DEPOSIT_NUMBER } from '@/components/DepositModal';
import { useSiteSettings } from '@/hooks/useSiteSettings';

type UserDashboardTab = 'overview' | 'matches' | 'deposits' | 'withdrawals' | 'chat';

export default function UserDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<UserDashboardTab>('overview');

  // Stats & Match list
  const [myMatches, setMyMatches] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);

  // Deposits State
  const [myDeposits, setMyDeposits] = useState<any[]>([]);
  const [depositsLoading, setDepositsLoading] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  // Withdrawals State
  const [myWithdrawals, setMyWithdrawals] = useState<any[]>([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bKash');
  const [withdrawNumber, setWithdrawNumber] = useState('');
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);
  const [withdrawMsg, setWithdrawMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // Support / Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Copy indicator
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Set chat session ID (tied directly to user identity)
  useEffect(() => {
    if (user?.id) {
      setSessionId(`user_${user.id}`);
    } else if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('ff_livechat_session');
      if (!sid) {
        sid = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        localStorage.setItem('ff_livechat_session', sid);
      }
      setSessionId(sid);
    }
  }, [user]);

  // Fetch User's Registered Matches
  const fetchMyMatches = async () => {
    try {
      setMatchesLoading(true);
      const res = await fetch('/api/tournaments?filter=my');
      const data = await res.json();
      if (data.tournaments) setMyMatches(data.tournaments);
    } catch (e) {
      console.error(e);
    } finally {
      setMatchesLoading(false);
    }
  };

  // Fetch User's Deposits
  const fetchMyDeposits = async () => {
    try {
      setDepositsLoading(true);
      const res = await fetch('/api/wallet/my-deposits');
      const data = await res.json();
      if (data.deposits) setMyDeposits(data.deposits);
    } catch (e) {
      console.error(e);
    } finally {
      setDepositsLoading(false);
    }
  };

  // Fetch User's Withdrawals
  const fetchMyWithdrawals = async () => {
    try {
      setWithdrawalsLoading(true);
      const res = await fetch('/api/wallet/transactions?type=WITHDRAWAL');
      const data = await res.json();
      if (data.transactions) setMyWithdrawals(data.transactions);
    } catch (e) {
      console.error(e);
    } finally {
      setWithdrawalsLoading(false);
    }
  };

  // Fetch User's Chat Messages
  const fetchChatMessages = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/chat?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.messages) setChatMessages(data.messages);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyMatches();
      fetchMyDeposits();
      fetchMyWithdrawals();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'matches') fetchMyMatches();
    if (activeTab === 'deposits') fetchMyDeposits();
    if (activeTab === 'withdrawals') fetchMyWithdrawals();
    if (activeTab === 'chat') fetchChatMessages();
  }, [activeTab, sessionId]);

  // Handle Withdraw Request
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawMsg(null);
    setWithdrawSubmitting(true);
    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(withdrawAmount),
          method: withdrawMethod,
          accountNumber: withdrawNumber,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setWithdrawMsg({ text: 'উইথড্র রিকোয়েস্ট সফল হয়েছে! এডমিন দ্রুত টাকা পাঠিয়ে দিবে।' });
        setWithdrawAmount('');
        setWithdrawNumber('');
        fetchMyWithdrawals();
      } else {
        setWithdrawMsg({ text: data.error || 'উইথড্র করতে সমস্যা হয়েছে।', error: true });
      }
    } catch (err: any) {
      setWithdrawMsg({ text: 'Error occurred', error: true });
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  // Handle User Chat Send
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !sessionId || chatSending) return;
    try {
      setChatSending(true);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          text: chatInput.trim(),
          senderName: user?.ffPlayerName || user?.fullName || 'Gamer',
          ffUid: user?.ffUid || '',
          phoneNumber: user?.mobileNumber || '',
        }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setChatMessages((prev) => [...prev, data.message]);
        if (data.autoReply) {
          setTimeout(() => {
            setChatMessages((prev) => [...prev, data.autoReply]);
          }, 400);
        }
        setChatInput('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChatSending(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-ff-orange border-t-transparent animate-spin"></div>
        <p className="text-gray-400 text-sm font-semibold">ড্যাশবোর্ড লোড হচ্ছে...</p>
      </div>
    );
  }

  const isSuperAdmin = user.role === 'SUPER_ADMIN';
  const totalWon = user.wallet?.totalWon || 0;
  const currentBalance = user.wallet?.balance || 0;
  const totalDeposited = user.wallet?.totalDeposited || 0;

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-6 px-2 sm:px-4">
      {/* 🛡️ Super Admin Notice Banner (Only shown if user is Super Admin) */}
      {isSuperAdmin && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600/20 via-orange-600/20 to-amber-600/20 border-2 border-red-500 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-md">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-white">
                আপনি সুপার এডমিন (Super Admin) হিসেবে লগইন আছেন
              </h3>
              <p className="text-xs text-gray-300">
                সকল প্লেয়ারের ডিপোজিট অনুমোদন, লাভ-লস, লাইভ স্ট্রিম ও সাইট সেটিংস কন্ট্রোল করতে এডমিন কনসোলে যান।
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 whitespace-nowrap"
          >
            <span>Open Super Admin Console (/admin)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ================= PLAYER PROFILE HERO CARD ================= */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: Avatar & Identity */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-ff-orange via-ff-amber to-ff-red flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-glow-orange ring-4 ring-orange-500/20">
                {user.ffPlayerName?.[0] || user.fullName?.[0] || 'G'}
              </div>
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-black uppercase tracking-wider shadow">
                {user.role}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>{user.ffPlayerName || user.fullName}</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-charcoal-800 text-slate-600 dark:text-gray-300">
                  @{user.username}
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium">
                <div className="flex items-center gap-1.5 font-mono bg-slate-100 dark:bg-charcoal-950 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-charcoal-800">
                  <span className="text-slate-500 dark:text-gray-400 font-sans">FF UID:</span>
                  <strong className="text-slate-900 dark:text-white">{user.ffUid}</strong>
                  <button
                    onClick={() => handleCopy(user.ffUid, 'uid')}
                    className="ml-1 text-slate-400 hover:text-ff-orange"
                    title="Copy UID"
                  >
                    {copiedKey === 'uid' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-ff-orange" />
                  <span>{user.mobileNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Wallet Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black text-sm uppercase tracking-wider shadow-glow-orange/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ডিপোজিট করুন</span>
            </button>
            <button
              onClick={() => setActiveTab('withdrawals')}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-900 dark:text-white font-bold text-sm transition-all border border-slate-200 dark:border-charcoal-700 flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span>টাকা তুলুন (Withdraw)</span>
            </button>
          </div>
        </div>

        {/* Financial KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-charcoal-800">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
              ওয়ালেট ব্যালেন্স
            </span>
            <span className="font-display font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400 mt-1 block">
              ৳{currentBalance.toFixed(0)}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
              মোট পুরস্কার জয়
            </span>
            <span className="font-display font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400 mt-1 block">
              ৳{totalWon.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
              ম্যাচ অংশগ্রহণ
            </span>
            <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1 block">
              {myMatches.length} টি
            </span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
              মোট ডিপোজিট
            </span>
            <span className="font-display font-black text-2xl sm:text-3xl text-sky-600 dark:text-sky-400 mt-1 block">
              ৳{totalDeposited.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ================= RESPONSIVE NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black shadow-md'
              : 'bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>ওভারভিউ (Overview)</span>
        </button>

        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'matches'
              ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black shadow-md'
              : 'bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>আমার ম্যাচসমূহ ({myMatches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deposits')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'deposits'
              ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black shadow-md'
              : 'bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800'
          }`}
        >
          <CreditCard className="w-4 h-4 text-pink-500" />
          <span>ডিপোজিট হিস্টোরি ({myDeposits.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'withdrawals'
              ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black shadow-md'
              : 'bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800'
          }`}
        >
          <Wallet className="w-4 h-4 text-emerald-500" />
          <span>উইথড্র ও ক্যাশআউট</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black shadow-md'
              : 'bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-sky-500" />
          <span>লাইভ চ্যাট ও সাপোর্ট উত্তর</span>
        </button>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Quick Guidance Box */}
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-slate-800 dark:text-amber-200 space-y-2">
            <h3 className="font-bold flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
              <span>গেমিং প্ল্যাটফর্মে আপনাকে স্বাগতম!</span>
            </h3>
            <p>
              • টুর্নামেন্ট শুরু হওয়ার ঠিক ১০ মিনিট আগে "আমার ম্যাচসমূহ" ট্যাবে আপনার কাস্টম রুম আইডি ও পাসওয়ার্ড দৃশ্যমান হবে।<br />
              • বিকাশ অথবা নগদের মাধ্যমে ওয়ালেটে টাকা যুক্ত করতে উপরের "ডিপোজিট করুন" বাটনে ক্লিক করুন।<br />
              • যেকোনো সমস্যায় নিচের "লাইভ চ্যাট" ট্যাবে মেসেজ দিলে এডমিন টিম সাথে সাথে উত্তর দিবে।
            </p>
          </div>

          {/* Registered Matches Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-ff-orange" />
                <span>আপনার সাম্প্রতিক টুর্নামেন্টসমূহ</span>
              </h2>
              <button
                onClick={() => setActiveTab('matches')}
                className="text-xs font-bold text-ff-orange hover:underline flex items-center gap-1"
              >
                <span>সব ম্যাচ দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myMatches.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <p className="text-sm text-slate-500 dark:text-gray-400">
                  আপনি এখনো কোনো টুর্নামেন্টে জয়েন করেননি।
                </p>
                <Link
                  href="/matches"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black text-xs uppercase tracking-wider"
                >
                  টুর্নামেন্ট ব্রাউজ করুন
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myMatches.slice(0, 2).map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="px-2 py-0.5 rounded bg-orange-500/15 text-orange-600 dark:text-amber-400">
                          {m.gameMode} • {m.mapName}
                        </span>
                        <span className="text-slate-500 dark:text-gray-400">
                          {m.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {m.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                        ম্যাচ সময়: <strong>{m.matchDate} at {m.matchTime}</strong>
                      </p>
                    </div>

                    <Link
                      href={`/matches/${m.id}`}
                      className="w-full py-2 rounded-xl bg-slate-200 dark:bg-charcoal-800 hover:bg-slate-300 dark:hover:bg-charcoal-700 text-center text-xs font-bold text-slate-800 dark:text-white transition-colors"
                    >
                      রুম ও ম্যাচ ডিটেইলস দেখুন
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MY MATCHES ================= */}
      {activeTab === 'matches' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              আমার জয়েন করা টুর্নামেন্টসমূহ ({myMatches.length})
            </h2>
            <Link
              href="/matches"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black text-xs uppercase tracking-wider"
            >
              + নতুন ম্যাচে জয়েন করুন
            </Link>
          </div>

          {matchesLoading ? (
            <div className="py-16 text-center text-sm text-gray-400">ম্যাচ লোড হচ্ছে...</div>
          ) : myMatches.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-center space-y-3">
              <p className="text-sm text-slate-600 dark:text-gray-400">
                আপনি এখনো কোনো টুর্নামেন্টে রেজিস্টার করেননি।
              </p>
              <Link
                href="/matches"
                className="inline-block px-5 py-2.5 rounded-xl bg-ff-orange text-black font-bold text-xs uppercase"
              >
                লাইভ টুর্নামেন্ট দেখুন
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myMatches.map((m) => {
                const liveUrl = m.liveStreamUrl || settings.youtube_live_url || 'https://www.youtube.com';
                return (
                  <div
                    key={m.id}
                    className="p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-orange-500/15 text-orange-600 dark:text-amber-400">
                          {m.gameMode} • {m.mapName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-black bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-gray-300">
                          {m.status}
                        </span>
                      </div>

                      <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                        {m.title}
                      </h3>

                      <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-600 dark:text-gray-300">
                        <span>🗓️ {m.matchDate}</span>
                        <span>⏰ {m.matchTime}</span>
                      </div>

                      {/* Room Credentials Box */}
                      <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 text-xs space-y-1.5 font-mono">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Room ID:</span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {m.roomId || 'টুর্নামেন্টের ১০ মিনিট আগে দেওয়া হবে'}
                          </span>
                        </div>
                        {m.roomPassword && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Password:</span>
                            <span className="font-bold text-amber-500">{m.roomPassword}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      {/* Watch on YouTube Live Button */}
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-center text-xs font-black flex items-center justify-center gap-2 transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span>Watch on YouTube Live (Full Match)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <Link
                        href={`/matches/${m.id}`}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-center text-xs font-bold text-slate-800 dark:text-white block transition-colors"
                      >
                        সম্পূর্ণ ম্যাচ ও স্লট ডিটেইলস
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: MY DEPOSITS ================= */}
      {activeTab === 'deposits' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800">
            <div>
              <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
                আমার ডিপোজিট হিস্টোরি (Deposit Requests)
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                বিকাশ অথবা নগদে টাকা পাঠানোর পর সাবমিট করা ডিপোজিট রিকোয়েস্টের স্ট্যাটাস।
              </p>
            </div>
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black text-xs uppercase tracking-wider self-start sm:self-auto shadow-sm"
            >
              + নতুন ডিপোজিট করুন
            </button>
          </div>

          {depositsLoading ? (
            <div className="py-16 text-center text-sm text-gray-400">ডিপোজিট লোড হচ্ছে...</div>
          ) : myDeposits.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-center space-y-3">
              <CreditCard className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-600 dark:text-gray-400">
                আপনার কোনো ডিপোজিট হিস্টোরি পাওয়া যায়নি।
              </p>
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-ff-orange text-black font-bold text-xs uppercase"
              >
                এখনই ডিপোজিট করুন
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myDeposits.map((d) => {
                const isApproved = d.status === 'APPROVED';
                const isPending = d.status === 'PENDING';
                const isRejected = d.status === 'REJECTED';

                return (
                  <div
                    key={d.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-black text-lg text-slate-900 dark:text-white">
                          ৳{d.amount}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-pink-500/15 text-pink-600 dark:text-pink-400">
                          {d.method}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-gray-400 font-mono">
                        <span>TrxID: <strong className="text-slate-900 dark:text-white">{d.transactionId}</strong></span>
                        <span>প্রেরক নম্বর: {d.senderNumber}</span>
                        <span>তারিখ: {new Date(d.createdAt).toLocaleDateString()}</span>
                      </div>
                      {d.rejectionReason && (
                        <p className="text-xs text-red-500 font-semibold">
                          বাতিলের কারণ: {d.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="self-start sm:self-auto">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>সফল (Approved)</span>
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          <span>ভেরিফিকেশন অপেক্ষমান (Pending)</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 border border-red-500/40 text-red-600 dark:text-red-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>বাতিল (Rejected)</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: MY WITHDRAWALS ================= */}
      {activeTab === 'withdrawals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Request Withdraw Form */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-500" />
              <span>টাকা তোলার রিকোয়েস্ট (Withdraw)</span>
            </h2>
            <p className="text-xs text-slate-600 dark:text-gray-400">
              আপনার ওয়ালেটের টাকা বিকাশ বা নগদে ক্যাশআউট করুন। সর্বনিম্ন উইথড্র ৳৫০।
            </p>

            {withdrawMsg && (
              <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                withdrawMsg.error
                  ? 'bg-red-500/15 border border-red-500/40 text-red-500'
                  : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300'
              }`}>
                {withdrawMsg.error ? <XCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                <span>{withdrawMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  পেমেন্ট মাধ্যম (Withdraw Method) *
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs font-bold focus:border-ff-orange focus:outline-none"
                >
                  <option value="bKash">bKash (বিকাশ পার্সোনাল)</option>
                  <option value="Nagad">Nagad (নগদ পার্সোনাল)</option>
                  <option value="Rocket">Rocket (রকেট)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  আপনার মোবাইল নম্বর (যে নম্বরে টাকা নিবেন) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="01XXXXXXXXX"
                  value={withdrawNumber}
                  onChange={(e) => setWithdrawNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-sm focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  উইথড্র পরিমাণ (টাকা) * (উপলব্ধ: ৳{currentBalance.toFixed(0)})
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  max={currentBalance}
                  placeholder="e.g. 200"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-sm focus:border-ff-orange focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={withdrawSubmitting || currentBalance < 50}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {withdrawSubmitting ? 'রিকোয়েস্ট প্রসেস হচ্ছে...' : 'উইথড্র কনফার্ম করুন'}
              </button>
            </form>
          </div>

          {/* User's Withdrawal History */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4">
            <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">
              আপনার উইথড্র হিস্টোরি (Withdrawal Status)
            </h2>

            {withdrawalsLoading ? (
              <div className="py-12 text-center text-xs text-gray-400">উইথড্র হিস্টোরি লোড হচ্ছে...</div>
            ) : myWithdrawals.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-gray-400">
                এখনো কোনো উইথড্র রিকোয়েস্ট করা হয়নি।
              </div>
            ) : (
              <div className="space-y-3">
                {myWithdrawals.map((w) => {
                  const isPending = w.status === 'PENDING';
                  const isApproved = w.status === 'APPROVED';
                  return (
                    <div
                      key={w.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-display font-black text-base text-slate-900 dark:text-white">
                          ৳{Math.abs(w.amount)}
                        </span>
                        <div className="text-slate-600 dark:text-gray-400 font-mono mt-0.5">
                          {w.paymentMethod} • {w.senderNumber || 'Account'} • {new Date(w.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div>
                        {isPending ? (
                          <span className="px-3 py-1 rounded-full font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            ⏳ পেন্ডিং (এডমিন রিভিউ চলছে)
                          </span>
                        ) : isApproved ? (
                          <span className="px-3 py-1 rounded-full font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            ✅ উইথড্র সফল হয়েছে
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                            ❌ বাতিল
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 5: MY SUPPORT & LIVE CHAT ================= */}
      {activeTab === 'chat' && (
        <div className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-charcoal-800 pb-4">
            <div>
              <h2 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-sky-500" />
                <span>লাইভ চ্যাট ও সাপোর্ট রিপ্লাই (Support Responses)</span>
              </h2>
              <p className="text-xs text-slate-600 dark:text-gray-400">
                এডমিন থেকে আপনার মেসেজের কি উত্তর এসেছে তা এখানে দেখতে পারবেন এবং সরাসরি যোগাযোগ করতে পারবেন।
              </p>
            </div>
            <button
              onClick={fetchChatMessages}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 text-xs font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5 text-ff-orange" />
              <span>রিফ্রেশ</span>
            </button>
          </div>

          {/* Messages Container */}
          <div className="h-[380px] overflow-y-auto p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-300 dark:text-charcoal-700" />
                <p className="text-xs font-semibold">আপনার কোনো পূর্বের চ্যাট মেসেজ নেই। নিচে মেসেজ লিখে পাঠান।</p>
              </div>
            ) : (
              chatMessages.map((m) => {
                const isAdmin = m.senderRole === 'ADMIN';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'}`}
                  >
                    <span className="text-[10px] font-bold text-slate-500 mb-1 px-1">
                      {isAdmin ? '🛡️ সাপোর্ট এডমিন উত্তর দিয়েছে:' : 'আপনি:'}
                    </span>
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAdmin
                          ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-950 dark:text-emerald-200 rounded-tl-none font-semibold'
                          : 'bg-ff-orange text-black font-semibold rounded-tr-none shadow-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="এডমিনের কাছে প্রশ্ন বা মেসেজ লিখুন..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-ff-orange focus:outline-none"
            />
            <button
              type="submit"
              disabled={chatSending || !chatInput.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>{chatSending ? 'পাঠানো হচ্ছে...' : 'Send'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Deposit Modal */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => {
          setIsDepositModalOpen(false);
          fetchMyDeposits();
        }}
      />
    </div>
  );
}
