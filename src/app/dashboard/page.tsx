'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  MessageSquare,
  Gamepad2,
  Settings,
  Search,
  Check,
  X,
  Eye,
  Copy,
  PlusCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  DollarSign,
  Send,
  ExternalLink,
  Image as ImageIcon,
  Sparkles,
  Filter,
  Flame,
  Trophy,
  Users,
  Mail,
  Phone,
  RefreshCw,
  User,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Tv,
  Play,
} from 'lucide-react';
import { OFFICIAL_DEPOSIT_NUMBER } from '@/components/DepositModal';
import { updateCachedSettings } from '@/hooks/useSiteSettings';

type DashboardTab = 'overview' | 'deposits' | 'financials' | 'live_chat' | 'tournaments' | 'settings';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Stats
  const [stats, setStats] = useState({
    matchesJoined: 0,
    upcomingMatches: 0,
    completedMatches: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [upcomingList, setUpcomingList] = useState<any[]>([]);

  // Deposits Tab State
  const [deposits, setDeposits] = useState<any[]>([]);
  const [depositsLoading, setDepositsLoading] = useState(false);
  const [depositSearch, setDepositSearch] = useState('');
  const [filterTrxId, setFilterTrxId] = useState('');
  const [filterUid, setFilterUid] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterProvider, setFilterProvider] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);
  const [rejectDeposit, setRejectDeposit] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('TrxID not found in statement');

  // Financials State
  const [financials, setFinancials] = useState<any | null>(null);
  const [financialsLoading, setFinancialsLoading] = useState(false);

  // Live Chat Center State
  const [chatThreads, setChatThreads] = useState<any[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  // Tournaments State
  const [allTournaments, setAllTournaments] = useState<any[]>([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(false);
  const [editingRoomTournament, setEditingRoomTournament] = useState<any | null>(null);
  const [customRoomId, setCustomRoomId] = useState('');
  const [customRoomPass, setCustomRoomPass] = useState('');
  const [customLiveUrl, setCustomLiveUrl] = useState('');
  const [customStatus, setCustomStatus] = useState('REGISTRATION_OPEN');

  // Settings State (with Social Media & YouTube Live stream options)
  const [settingsForm, setSettingsForm] = useState({
    site_name: 'Free Fire Esports BD',
    bkash_number: OFFICIAL_DEPOSIT_NUMBER,
    support_whatsapp: OFFICIAL_DEPOSIT_NUMBER,
    support_telegram: 'https://t.me/ff_esports_bd',
    youtube_live_url: 'https://www.youtube.com/@FreeFireEsportsBD/live',
    facebook_live_url: 'https://www.facebook.com',
    notice_text: 'টুর্নামেন্ট শুরু হওয়ার ১০ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে।',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Copied indicator
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isAdmin = user && ['SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER', 'TOURNAMENT_MANAGER', 'MODERATOR'].includes(user.role);

  // 1. Initial Overview Data
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetch('/api/tournaments?filter=my')
        .then((res) => res.json())
        .then((data) => {
          if (data.tournaments) {
            const up = data.tournaments.filter((t: any) => t.status === 'REGISTRATION_OPEN' || t.status === 'UPCOMING' || t.status === 'LIVE');
            setUpcomingList(up);
            setStats({
              matchesJoined: data.tournaments.length,
              upcomingMatches: up.length,
              completedMatches: data.tournaments.filter((t: any) => t.status === 'COMPLETED').length,
            });
          }
        })
        .catch(() => {});

      fetch('/api/wallet/transactions')
        .then((res) => res.json())
        .then((data) => {
          if (data.transactions) setRecentTransactions(data.transactions.slice(0, 5));
        })
        .catch(() => {});
    }
  }, [user, isLoading, router]);

  // 2. Fetch Deposits
  const fetchDeposits = () => {
    setDepositsLoading(true);
    fetch('/api/admin/deposits?status=ALL')
      .then((res) => res.json())
      .then((data) => {
        if (data.deposits) setDeposits(data.deposits);
      })
      .catch(() => {})
      .finally(() => setDepositsLoading(false));
  };

  // 3. Fetch Financials
  const fetchFinancials = () => {
    setFinancialsLoading(true);
    fetch('/api/admin/financials')
      .then((res) => res.json())
      .then((data) => {
        if (data.financials) setFinancials(data.financials);
      })
      .catch(() => {})
      .finally(() => setFinancialsLoading(false));
  };

  // 4. Fetch Live Chat Threads
  const fetchChatThreads = () => {
    fetch('/api/admin/chat')
      .then((res) => res.json())
      .then((data) => {
        if (data.threads) {
          setChatThreads(data.threads);
          if (!selectedThreadId && data.threads.length > 0) {
            setSelectedThreadId(data.threads[0].sessionId);
          }
        }
      })
      .catch(() => {});
  };

  // 5. Fetch Messages for selected thread
  useEffect(() => {
    if (!selectedThreadId) return;
    const fetchMessages = () => {
      fetch(`/api/admin/chat?sessionId=${selectedThreadId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages) setThreadMessages(data.messages);
        })
        .catch(() => {});
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [selectedThreadId]);

  // 6. Fetch Tournaments
  const fetchAllTournaments = () => {
    setTournamentsLoading(true);
    fetch('/api/tournaments?status=ALL')
      .then((res) => res.json())
      .then((data) => {
        if (data.tournaments) setAllTournaments(data.tournaments);
      })
      .catch(() => {})
      .finally(() => setTournamentsLoading(false));
  };

  // 7. Fetch Settings
  const fetchSettings = () => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettingsForm((prev) => ({
            ...prev,
            site_name: data.settings.site_name || prev.site_name,
            bkash_number: data.settings.bkash_number || prev.bkash_number,
            support_whatsapp: data.settings.support_whatsapp || prev.support_whatsapp,
            support_telegram: data.settings.support_telegram || prev.support_telegram,
            youtube_live_url: data.settings.youtube_live_url || prev.youtube_live_url,
            facebook_live_url: data.settings.facebook_live_url || prev.facebook_live_url,
            notice_text: data.settings.notice_text || prev.notice_text,
          }));
        }
      })
      .catch(() => {});
  };

  // Tab switch actions
  useEffect(() => {
    if (activeTab === 'deposits') fetchDeposits();
    if (activeTab === 'financials') fetchFinancials();
    if (activeTab === 'live_chat') fetchChatThreads();
    if (activeTab === 'tournaments') fetchAllTournaments();
    if (activeTab === 'settings') fetchSettings();
  }, [activeTab]);

  // Handle Approve Deposit
  const handleApproveDeposit = async (dep: any) => {
    if (!confirm(`Approve deposit of ৳${dep.amount} for @${dep.user?.username}? This will immediately credit their wallet balance.`)) return;

    try {
      setActionLoading(dep.id);
      const res = await fetch('/api/admin/deposits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositId: dep.id, action: 'APPROVE' }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Deposit approved and wallet credited!');
        fetchDeposits();
      } else {
        alert(data.error || 'Failed to approve');
      }
    } catch (e: any) {
      alert(e.message || 'Error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Reject Deposit
  const handleConfirmReject = async () => {
    if (!rejectDeposit) return;
    try {
      setActionLoading(rejectDeposit.id);
      const res = await fetch('/api/admin/deposits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositId: rejectDeposit.id,
          action: 'REJECT',
          reason: rejectionReason,
        }),
      });
      if (res.ok) {
        alert('Deposit rejected.');
        setRejectDeposit(null);
        fetchDeposits();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Admin Chat Reply
  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThreadId || !adminReplyText.trim() || sendingReply) return;

    try {
      setSendingReply(true);
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedThreadId,
          text: adminReplyText.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setThreadMessages((prev) => [...prev, data.message]);
        setAdminReplyText('');
        fetchChatThreads();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingReply(false);
    }
  };

  // Handle Publish Room ID & Pass & Live Stream
  const handleSaveRoomCredentials = async () => {
    if (!editingRoomTournament) return;
    try {
      const res = await fetch(`/api/tournaments/${editingRoomTournament.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: customRoomId,
          roomPassword: customRoomPass,
          liveStreamUrl: customLiveUrl || null,
          status: customStatus,
          isRoomCredentialsPublished: true,
        }),
      });
      if (res.ok) {
        alert('Room credentials and live stream link updated successfully! Players notified.');
        setEditingRoomTournament(null);
        fetchAllTournaments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsForm }),
      });
      if (res.ok) {
        updateCachedSettings(settingsForm);
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  // Filtered deposits logic
  const filteredDeposits = deposits.filter((d) => {
    if (filterStatus !== 'ALL' && d.status !== filterStatus) return false;
    if (filterProvider !== 'ALL' && d.method?.toLowerCase() !== filterProvider.toLowerCase()) return false;
    if (filterTrxId && !d.transactionId?.toLowerCase().includes(filterTrxId.toLowerCase())) return false;
    if (filterUid && !d.user?.ffUid?.toLowerCase().includes(filterUid.toLowerCase())) return false;
    if (filterName && !(d.user?.fullName?.toLowerCase().includes(filterName.toLowerCase()) || d.user?.username?.toLowerCase().includes(filterName.toLowerCase()))) return false;
    if (filterEmail && !d.user?.email?.toLowerCase().includes(filterEmail.toLowerCase())) return false;
    if (depositSearch) {
      const s = depositSearch.toLowerCase();
      const match =
        d.transactionId?.toLowerCase().includes(s) ||
        d.senderNumber?.includes(s) ||
        d.user?.username?.toLowerCase().includes(s) ||
        d.user?.fullName?.toLowerCase().includes(s) ||
        d.user?.ffUid?.includes(s) ||
        d.user?.email?.toLowerCase().includes(s);
      if (!match) return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-6 max-w-[1536px] mx-auto">
      {/* 2-Column Layout: Left Sidebar (where user drew red box) + Right Main Work Area */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* ================= LEFT SIDEBAR TABS ================= */}
        <aside className="w-full lg:w-80 flex-shrink-0 bg-white/85 dark:bg-charcoal-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-charcoal-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6 transition-colors">
          
          {/* User Profile Mini Header */}
          <div className="flex items-center gap-3.5 pb-5 border-b border-slate-200 dark:border-charcoal-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ff-orange via-amber-500 to-ff-red flex items-center justify-center font-display font-black text-2xl text-slate-950 shadow-glow-orange flex-shrink-0">
              {user.ffPlayerName?.[0] || user.username[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white truncate">
                {user.ffPlayerName || user.username}
              </h2>
              <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:bg-ff-orange/20 dark:text-ff-amber border border-orange-500/30">
                {user.role}
              </span>
            </div>
          </div>

          {/* Navigation Tabs List (Larger font, bold labels) */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all text-left ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-slate-950 font-black shadow-glow-orange/30 scale-[1.02]'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-charcoal-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                <span>Overview & Profile</span>
              </div>
            </button>

            {/* Deposits Management Tab */}
            <button
              onClick={() => setActiveTab('deposits')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all text-left ${
                activeTab === 'deposits'
                  ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-slate-950 font-black shadow-glow-orange/30 scale-[1.02]'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-charcoal-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 flex-shrink-0 text-pink-500" />
                <span>ডিপোজিট হিস্টোরি ও লিস্ট</span>
              </div>
              {deposits.filter((d) => d.status === 'PENDING').length > 0 && (
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center animate-pulse">
                  {deposits.filter((d) => d.status === 'PENDING').length}
                </span>
              )}
            </button>

            {/* Profit & Loss Financials Tab */}
            <button
              onClick={() => setActiveTab('financials')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all text-left ${
                activeTab === 'financials'
                  ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-slate-950 font-black shadow-glow-orange/30 scale-[1.02]'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-charcoal-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                <span>লাভ / লস (Profit & Loss)</span>
              </div>
            </button>

            {/* Live Chat Center Tab */}
            <button
              onClick={() => setActiveTab('live_chat')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all text-left ${
                activeTab === 'live_chat'
                  ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-slate-950 font-black shadow-glow-orange/30 scale-[1.02]'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-charcoal-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 flex-shrink-0 text-sky-500" />
                <span>রিয়েল-টাইম লাইভ চ্যাট</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black">
                LIVE
              </span>
            </button>

            {/* Tournaments Management Tab */}
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all text-left ${
                activeTab === 'tournaments'
                  ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-slate-950 font-black shadow-glow-orange/30 scale-[1.02]'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-charcoal-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 flex-shrink-0 text-amber-500" />
                <span>টুর্নামেন্ট কার্ড ও রুম আইডি</span>
              </div>
            </button>

            {/* Platform Settings & Branding Tab */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all text-left ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-slate-950 font-black shadow-glow-orange/30 scale-[1.02]'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-charcoal-800 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 flex-shrink-0 text-purple-500" />
                <span>সাইট সেটিংস ও কন্ট্রোল</span>
              </div>
            </button>
          </nav>

          {/* Quick Notice Pill in Sidebar */}
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs sm:text-sm text-amber-950 dark:text-amber-300 font-bold space-y-1.5 shadow-sm">
            <span className="font-black flex items-center gap-1.5 text-sm sm:text-base text-amber-900 dark:text-ff-amber">
              <span>🔔</span> রুম আইডি নোটিশ:
            </span>
            <p className="leading-relaxed">টুর্নামেন্ট শুরু হওয়ার ১০ মিনিট আগে রুম আইডি ও পাসওয়ার্ড দেওয়া হবে।</p>
          </div>
        </aside>

        {/* ================= RIGHT MAIN WORK AREA ================= */}
        <main className="flex-1 w-full min-w-0 space-y-6">
          
          {/* ================= TAB 1: OVERVIEW & PROFILE ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Profile Header Hero Card (Frosted Glass Effect for Day Mode) */}
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-charcoal-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-charcoal-800 shadow-xl overflow-hidden transition-colors">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Avatar & Player Info */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-ff-orange via-amber-500 to-ff-red p-1 shadow-glow-orange flex items-center justify-center flex-shrink-0">
                      <div className="w-full h-full bg-slate-100 dark:bg-charcoal-950 rounded-[14px] flex items-center justify-center text-2xl font-black font-display text-slate-900 dark:text-white">
                        {user.ffPlayerName?.[0] || user.username[0]?.toUpperCase()}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-wide">
                          {user.ffPlayerName}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:bg-ff-orange/20 dark:text-ff-amber border border-orange-500/30">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium">
                        Real Name: <strong className="text-slate-900 dark:text-gray-200">{user.fullName}</strong> (@{user.username})
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 text-orange-600 dark:text-ff-amber font-bold">
                          Free Fire UID: {user.ffUid}
                        </span>
                        <span className="text-slate-600 dark:text-gray-400 font-sans font-medium">
                          📱 {user.mobileNumber}
                        </span>
                        <span className="text-slate-600 dark:text-gray-400 font-sans font-medium">
                          ✉️ {user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800/90 flex flex-col justify-between min-w-[220px] shadow-sm">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                        {t('wallet_balance')}
                      </span>
                      <span className="font-display font-black text-3xl text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                        ৳{user.wallet?.balance?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-200 dark:border-charcoal-800 flex gap-2">
                      <Link
                        href="/deposit"
                        className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black text-xs text-center uppercase tracking-wider shadow-sm hover:scale-105 transition-transform"
                      >
                        + Deposit
                      </Link>
                      <Link
                        href="/wallet"
                        className="py-1.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-xs font-bold text-slate-700 dark:text-gray-300 text-center transition-colors"
                      >
                        History
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Link
                  href="/deposit"
                  className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 hover:border-ff-orange text-center group transition-all shadow-md"
                >
                  <PlusCircle className="w-5 h-5 text-pink-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{t('deposit_money')}</span>
                </Link>
                <Link
                  href="/matches"
                  className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 hover:border-ff-orange text-center group transition-all shadow-md"
                >
                  <Gamepad2 className="w-5 h-5 text-ff-orange mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{t('hero_cta_join')}</span>
                </Link>
                <Link
                  href="/my-matches"
                  className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 hover:border-ff-orange text-center group transition-all shadow-md"
                >
                  <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">{t('my_matches')}</span>
                </Link>
                <Link
                  href="/wallet"
                  className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 hover:border-ff-orange text-center group transition-all shadow-md"
                >
                  <Wallet className="w-5 h-5 text-emerald-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Transactions</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveTab('live_chat')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 hover:border-ff-orange text-center group transition-all shadow-md"
                >
                  <MessageSquare className="w-5 h-5 text-sky-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Live Support</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('financials')}
                  className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 hover:border-ff-orange text-center group transition-all shadow-md"
                >
                  <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">Profit & Loss</span>
                </button>
              </div>

              {/* KPI Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
                  <span className="text-xs text-slate-600 dark:text-gray-400 uppercase font-bold block">Matches Joined</span>
                  <span className="font-display font-black text-2xl text-slate-900 dark:text-white mt-1 block">
                    {stats.matchesJoined}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
                  <span className="text-xs text-slate-600 dark:text-gray-400 uppercase font-bold block">Upcoming Matches</span>
                  <span className="font-display font-black text-2xl text-orange-600 dark:text-ff-amber mt-1 block">
                    {stats.upcomingMatches}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
                  <span className="text-xs text-slate-600 dark:text-gray-400 uppercase font-bold block">Total Won / Prize</span>
                  <span className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400 mt-1 block">
                    ৳{user.wallet?.totalWon?.toFixed(0) || '0'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
                  <span className="text-xs text-slate-600 dark:text-gray-400 uppercase font-bold block">Entry Fees Spent</span>
                  <span className="font-display font-black text-2xl text-slate-700 dark:text-gray-300 mt-1 block">
                    ৳{user.wallet?.totalEntryFees?.toFixed(0) || '0'}
                  </span>
                </div>
              </div>

              {/* Upcoming Matches Preview */}
              <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-charcoal-800 pb-3">
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-ff-orange" />
                    <span>My Upcoming Tournaments ({upcomingList.length})</span>
                  </h2>
                  <Link href="/my-matches" className="text-xs text-orange-600 dark:text-ff-amber hover:underline flex items-center gap-1 font-bold">
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {upcomingList.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 dark:text-gray-400 text-xs font-medium">
                    You haven't joined any upcoming tournaments yet.{' '}
                    <Link href="/matches" className="text-orange-600 dark:text-ff-amber font-bold hover:underline">
                      Join a tournament now!
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {upcomingList.map((t) => (
                      <div
                        key={t.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 flex flex-col justify-between space-y-3 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/15 text-orange-600 dark:bg-ff-orange/20 dark:text-ff-amber border border-orange-500/30">
                              {t.gameMode} • {t.mapName}
                            </span>
                            <span className="text-slate-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-ff-orange" />
                              {t.matchDate} - {t.matchTime}
                            </span>
                          </div>
                          <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">
                            {t.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-charcoal-800/80">
                          <span className="text-xs text-slate-600 dark:text-gray-400 font-bold">Prize: ৳{t.prizePool}</span>
                          <Link
                            href={`/matches/${t.id}`}
                            className="px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-xs font-bold text-slate-800 dark:text-white transition-colors"
                          >
                            Details & Room
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 2: DEPOSITS CONTROL & FILTERABLE LIST ================= */}
          {activeTab === 'deposits' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header & Quick Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2.5">
                    <CreditCard className="w-7 h-7 text-pink-500" />
                    <span>কারা ডিপোজিট করল (Deposit Verification & History)</span>
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 dark:text-gray-300 mt-1.5 font-semibold">
                    কারা ডিপোজিট করেছে তার সম্পূর্ণ তালিকা। TrxID, UID, নাম বা ইমেইল দিয়ে ফিল্টার করুন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchDeposits}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-sm font-bold text-slate-800 dark:text-gray-200 flex items-center gap-2 transition-colors self-start sm:self-auto shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${depositsLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh List</span>
                </button>
              </div>

              {/* Advanced Multi-Field Filter Bar (Larger Labels & Inputs) */}
              <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-lg space-y-5">
                <div className="flex items-center gap-2.5 text-sm sm:text-base font-black text-slate-800 dark:text-gray-200">
                  <Filter className="w-5 h-5 text-ff-orange" />
                  <span>ফিল্টার করুন (Filter Deposits):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* TrxID Filter */}
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                      Transaction ID (TrxID)
                    </label>
                    <input
                      type="text"
                      value={filterTrxId}
                      onChange={(e) => setFilterTrxId(e.target.value)}
                      placeholder="e.g. 9B7X28KA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm font-mono font-bold focus:border-ff-orange focus:outline-none shadow-sm"
                    />
                  </div>

                  {/* Free Fire UID Filter */}
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                      Free Fire UID
                    </label>
                    <input
                      type="text"
                      value={filterUid}
                      onChange={(e) => setFilterUid(e.target.value)}
                      placeholder="e.g. 1984729103"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm font-mono font-bold focus:border-ff-orange focus:outline-none shadow-sm"
                    />
                  </div>

                  {/* Player Name / Username Filter */}
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                      Player Name / Username
                    </label>
                    <input
                      type="text"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="e.g. Tanvir or @username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm font-bold focus:border-ff-orange focus:outline-none shadow-sm"
                    />
                  </div>

                  {/* Email Filter */}
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                      Player Email
                    </label>
                    <input
                      type="text"
                      value={filterEmail}
                      onChange={(e) => setFilterEmail(e.target.value)}
                      placeholder="e.g. player@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm font-medium focus:border-ff-orange focus:outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Status & Provider Dropdowns */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-charcoal-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300">Status:</span>
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setFilterStatus(st)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                          filterStatus === st
                            ? 'bg-ff-orange text-slate-950 shadow-sm'
                            : 'bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        {st === 'ALL' ? 'All' : st}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300">Provider:</span>
                    {['ALL', 'bKash', 'Nagad', 'Upay', 'Rocket'].map((prov) => (
                      <button
                        key={prov}
                        onClick={() => setFilterProvider(prov)}
                        className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                          filterProvider === prov
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-charcoal-800 text-slate-700 dark:text-gray-300 hover:text-slate-950 dark:hover:text-white'
                        }`}
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filtered Deposits Table (Bigger fonts and padding) */}
              <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl overflow-hidden">
                {depositsLoading ? (
                  <div className="py-16 text-center">
                    <div className="w-8 h-8 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : filteredDeposits.length === 0 ? (
                  <div className="py-12 text-center text-slate-600 dark:text-gray-400 text-sm font-bold">
                    কোনো ডিপোজিট রেকর্ড পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 dark:bg-charcoal-950 text-slate-700 dark:text-gray-300 uppercase text-xs sm:text-sm font-black tracking-wider border-b border-slate-200 dark:border-charcoal-800">
                        <tr>
                          <th className="py-4 px-4">Date</th>
                          <th className="py-4 px-4">Provider</th>
                          <th className="py-4 px-4">Player (Name, UID, Email)</th>
                          <th className="py-4 px-4">Amount</th>
                          <th className="py-4 px-4">Sender Mobile</th>
                          <th className="py-4 px-4">TrxID</th>
                          <th className="py-4 px-4 text-center">Screenshot</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-charcoal-800 text-sm">
                        {filteredDeposits.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-charcoal-800/40 transition-colors">
                            <td className="py-4 px-4 text-slate-700 dark:text-gray-300 font-semibold whitespace-nowrap">
                              <div>{new Date(d.createdAt).toLocaleDateString()}</div>
                              <div className="text-xs text-slate-500">{new Date(d.createdAt).toLocaleTimeString()}</div>
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="font-black text-sm text-pink-600 dark:text-pink-400 bg-pink-500/15 px-3 py-1 rounded-xl border border-pink-500/30">
                                {d.method || 'bKash'}
                              </span>
                            </td>

                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                <p className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                                  {d.user?.fullName || 'User'}{' '}
                                  <span className="text-xs sm:text-sm text-orange-600 dark:text-ff-amber font-bold">@{d.user?.username}</span>
                                </p>
                                <p className="font-mono text-xs sm:text-sm text-slate-800 dark:text-gray-200 font-bold">
                                  UID: {d.user?.ffUid || 'N/A'}
                                </p>
                                <p className="text-xs text-slate-600 dark:text-gray-400 font-medium">
                                  {d.user?.email || 'No email'}
                                </p>
                              </div>
                            </td>

                            <td className="py-4 px-4 font-display font-black text-lg sm:text-xl text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                              ৳{d.amount}
                            </td>

                            <td className="py-4 px-4 font-mono font-bold text-sm sm:text-base text-slate-800 dark:text-gray-200 whitespace-nowrap">
                              {d.senderNumber}
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-charcoal-950 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-charcoal-800">
                                <span className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white">{d.transactionId}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(d.transactionId, `trx-${d.id}`)}
                                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1"
                                  title="Copy TrxID"
                                >
                                  {copiedKey === `trx-${d.id}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                            </td>

                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              {d.screenshotUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewScreenshot(d.screenshotUrl)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 text-orange-600 dark:text-ff-amber border border-orange-500/30 text-xs sm:text-sm font-bold hover:bg-orange-500/25 transition-colors shadow-sm"
                                >
                                  <ImageIcon className="w-4 h-4 text-ff-orange" />
                                  <span>View SS</span>
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 italic">No SS</span>
                              )}
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              {d.status === 'APPROVED' ? (
                                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/40">
                                  APPROVED
                                </span>
                              ) : d.status === 'REJECTED' ? (
                                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/40">
                                  REJECTED
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-500/40 animate-pulse">
                                  PENDING REVIEW
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              {d.status === 'PENDING' ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleApproveDeposit(d)}
                                    disabled={actionLoading === d.id}
                                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                                  >
                                    <Check className="w-4 h-4" />
                                    <span>Approve</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRejectDeposit(d);
                                      setRejectionReason('Invalid or duplicated TrxID');
                                    }}
                                    disabled={actionLoading === d.id}
                                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                                  >
                                    <X className="w-4 h-4" />
                                    <span>Reject</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs font-bold text-slate-400">
                                  {d.status === 'APPROVED' ? 'Auto-Verified / Credited' : 'Dismissed'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: FINANCIALS & PROFIT / LOSS ================= */}
          {activeTab === 'financials' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
                <div>
                  <h2 className="font-display font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    <span>প্ল্যাটফর্ম লাভ ও লস হিসাব (Profit & Loss Analytics)</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium">
                    মোট রেজিস্ট্রেশন ফি আয়, বিজয়ীদের দেওয়া প্রাইজ মানি এবং প্ল্যাটফর্মের নিট লাভ বা লস।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchFinancials}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 text-xs font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${financialsLoading ? 'animate-spin' : ''}`} />
                  <span>Update Analytics</span>
                </button>
              </div>

              {financials && (
                <>
                  {/* 4 Main Financial KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Total Entry Fees Collected */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md space-y-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                        মোট সংগৃহীত এন্ট্রি ফি (Revenue)
                      </span>
                      <span className="font-display font-black text-3xl text-sky-600 dark:text-sky-400 block">
                        ৳{financials.totalEntryFees.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium block">
                        মোট অংশগ্রহণকারী: {financials.totalParticipants} জন
                      </span>
                    </div>

                    {/* 2. Total Prizes Paid Out */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md space-y-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                        মোট প্রাইজ মানি বিতরণ (Expense)
                      </span>
                      <span className="font-display font-black text-3xl text-orange-600 dark:text-ff-amber block">
                        ৳{financials.totalPrizesPaid.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium block">
                        সম্পন্ন টুর্নামেন্ট: {financials.completedTournaments} টি
                      </span>
                    </div>

                    {/* 3. Net Gross Profit / Loss */}
                    <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-white dark:from-charcoal-900 dark:to-charcoal-950 border-2 border-emerald-500/50 shadow-lg space-y-1">
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                        নিট প্ল্যাটফর্ম লাভ (Net Profit)
                      </span>
                      <span className={`font-display font-black text-3xl block ${financials.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        ৳{financials.netProfit.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold block">
                        প্রফিট মার্জিন: {financials.profitMargin}%
                      </span>
                    </div>

                    {/* 4. Total Approved Deposits */}
                    <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md space-y-1">
                      <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
                        মোট অনুমোদিত ডিপোজিট
                      </span>
                      <span className="font-display font-black text-3xl text-slate-900 dark:text-white block">
                        ৳{financials.totalDeposited.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block">
                        পেন্ডিং ডিপোজিট: {financials.pendingCount} টি (৳{financials.pendingAmount})
                      </span>
                    </div>
                  </div>

                  {/* Summary Breakdown Table */}
                  <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4">
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      লাভ-লস ও ক্যাশফ্লো সারাংশ (Financial Breakdown)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 space-y-2">
                        <div className="flex justify-between text-slate-600 dark:text-gray-400">
                          <span>মোট আয় (Tournament Registrations):</span>
                          <span className="font-bold text-slate-900 dark:text-white">৳{financials.totalEntryFees}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-gray-400">
                          <span>মোট ব্যয় (Winner Prize Distribution):</span>
                          <span className="font-bold text-red-500">- ৳{financials.totalPrizesPaid}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 dark:border-charcoal-800 pt-2 font-bold text-sm">
                          <span className="text-slate-900 dark:text-white">প্ল্যাটফর্ম গ্রস মার্জিন:</span>
                          <span className="text-emerald-600 dark:text-emerald-400">৳{financials.netProfit}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 space-y-2">
                        <div className="flex justify-between text-slate-600 dark:text-gray-400">
                          <span>মোট খেলোয়াড়দের ওয়ালেট ব্যালেন্স:</span>
                          <span className="font-bold text-slate-900 dark:text-white">৳{financials.totalCirculatingBalance.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-gray-400">
                          <span>মোট অনুমোদিত ডিপোজিট ভলিউম:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{financials.totalDeposited}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 dark:border-charcoal-800 pt-2 font-bold text-sm">
                          <span className="text-slate-900 dark:text-white">অপেক্ষমান ডিপোজিট:</span>
                          <span className="text-amber-500">৳{financials.pendingAmount} ({financials.pendingCount} টি)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================= TAB 4: REAL-TIME LIVE CHAT CENTER ================= */}
          {activeTab === 'live_chat' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-charcoal-800 pb-3">
                <div>
                  <h2 className="font-display font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-sky-500" />
                    <span>রিয়েল-টাইম লাইভ চ্যাট সাপোর্ট প্যানেল (Live Chat Inbox)</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5 font-medium">
                    ইউজাররা সাইটে মেসেজ পাঠালে এখানে আসবে। আপনি মেসেজ টাইপ করে সরাসরি রিপ্লাই দিন।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchChatThreads}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 text-xs font-bold text-slate-700 dark:text-gray-300 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Inbox</span>
                </button>
              </div>

              {/* 2-Pane Chat Center: Threads List on Left, Active Chat on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[550px]">
                
                {/* Left Threads Pane */}
                <div className="md:col-span-5 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 overflow-y-auto divide-y divide-slate-200 dark:divide-charcoal-800">
                  {chatThreads.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 dark:text-gray-400 text-sm font-bold">
                      এখনো কোনো চ্যাট মেসেজ আসেনি।
                    </div>
                  ) : (
                    chatThreads.map((thread) => (
                      <button
                        key={thread.sessionId}
                        onClick={() => setSelectedThreadId(thread.sessionId)}
                        className={`w-full p-4 text-left transition-colors flex items-start gap-3.5 ${
                          selectedThreadId === thread.sessionId
                            ? 'bg-orange-500/15 border-l-4 border-orange-500'
                            : 'hover:bg-slate-100 dark:hover:bg-charcoal-900'
                        }`}
                      >
                        <div className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center font-black text-orange-600 dark:text-ff-amber flex-shrink-0 text-base">
                          {thread.fullName?.[0] || thread.username?.[0] || 'P'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
                              {thread.fullName || thread.username || 'Player'}
                            </span>
                            <span className="text-xs text-slate-400 font-bold">{thread.lastMessageTime}</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-gray-300 truncate mt-1 font-medium">
                            {thread.lastMessage}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-mono font-bold">
                            {thread.ffUid && (
                              <span className="bg-orange-500/10 text-orange-600 dark:text-ff-amber px-2 py-0.5 rounded border border-orange-500/20">
                                UID: {thread.ffUid}
                              </span>
                            )}
                            {thread.phoneNumber && (
                              <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                                📞 {thread.phoneNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Right Chat Conversation & Admin Reply Box */}
                <div className="md:col-span-7 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 flex flex-col justify-between overflow-hidden">
                  
                  {/* Active Thread User Contact Bar */}
                  {selectedThreadId && (() => {
                    const activeThread = chatThreads.find((t) => t.sessionId === selectedThreadId);
                    return activeThread ? (
                      <div className="p-3.5 bg-white dark:bg-charcoal-900 border-b border-slate-200 dark:border-charcoal-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                        <div>
                          <h4 className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{activeThread.fullName || activeThread.username || 'Player'}</span>
                            {activeThread.ffUid && (
                              <span className="font-mono text-xs font-bold text-orange-600 dark:text-ff-amber bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                                UID: {activeThread.ffUid}
                              </span>
                            )}
                          </h4>
                          {activeThread.phoneNumber && (
                            <p className="text-xs font-bold text-slate-600 dark:text-gray-400 mt-0.5">
                              মোবাইল: <span className="font-mono text-slate-900 dark:text-white font-bold">{activeThread.phoneNumber}</span>
                            </p>
                          )}
                        </div>

                        {activeThread.phoneNumber && (
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/88${activeThread.phoneNumber.replace(/^(\+88|88)/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1 shadow-sm transition-colors"
                            >
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${activeThread.phoneNumber}`}
                              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-charcoal-800 text-slate-800 dark:text-white text-xs font-bold transition-colors"
                            >
                              <span>কল করুন</span>
                            </a>
                          </div>
                        )}
                      </div>
                    ) : null;
                  })()}

                  {/* Messages Stream */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                    {threadMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-sm font-semibold text-slate-400">
                        একটি চ্যাট থ্রেড সিলেক্ট করুন মেসেজ দেখতে ও উত্তর দিতে।
                      </div>
                    ) : (
                      threadMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1 text-xs text-slate-500 dark:text-gray-400 font-bold">
                            <span>{msg.senderName}</span>
                            <span>•</span>
                            <span>{msg.time}</span>
                          </div>
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm max-w-[85%] leading-relaxed ${
                              msg.sender === 'admin'
                                ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-slate-950 font-bold shadow-sm rounded-tr-none'
                                : 'bg-white dark:bg-charcoal-800 text-slate-900 dark:text-white border border-slate-200 dark:border-charcoal-700 shadow-sm rounded-tl-none font-semibold'
                            }`}
                          >
                            {msg.text}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Admin Reply Input */}
                  <form onSubmit={handleSendAdminReply} className="p-3 bg-white dark:bg-charcoal-900 border-t border-slate-200 dark:border-charcoal-800 flex gap-2">
                    <input
                      type="text"
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder="ইউজারকে মেসেজের উত্তর লিখুন (Type admin reply)..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={sendingReply || !adminReplyText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{sendingReply ? '...' : 'Reply'}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: TOURNAMENTS & ROOM MANAGEMENT ================= */}
          {activeTab === 'tournaments' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
                <div>
                  <h2 className="font-display font-black text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <Gamepad2 className="w-6 h-6 text-amber-500" />
                    <span>টুর্নামেন্ট কার্ড ও কাস্টম রুম কন্ট্রোল</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 font-medium">
                    রুম আইডি ও পাসওয়ার্ড প্রকাশ করুন (১০ মিনিট আগে)। নতুন টুর্নামেন্ট যুক্ত করুন।
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/admin/tournaments/create"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>নতুন টুর্নামেন্ট</span>
                  </Link>
                </div>
              </div>

              {/* Tournaments List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allTournaments.map((t) => (
                  <div
                    key={t.id}
                    className="p-5 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-orange-500/15 text-orange-600 dark:bg-ff-orange/20 dark:text-ff-amber border border-orange-500/30">
                        {t.gameMode} • {t.mapName}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-gray-300">
                        {t.status}
                      </span>
                    </div>

                    <h3 className="font-display font-black text-lg text-slate-900 dark:text-white">
                      {t.title}
                    </h3>

                    <div className="flex justify-between text-xs text-slate-600 dark:text-gray-400 font-medium">
                      <span>Entry: ৳{t.entryFee}</span>
                      <span>Prize: ৳{t.prizePool}</span>
                      <span>Slots: {t.remainingSlots}/{t.totalSlots} left</span>
                    </div>

                    {/* Room ID State */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 text-xs space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Room ID:</span>
                        <strong className="text-slate-900 dark:text-white">{t.roomId || 'Not set'}</strong>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-500">Password:</span>
                        <strong className="text-amber-500">{t.roomPassword || 'None'}</strong>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingRoomTournament(t);
                          setCustomRoomId(t.roomId || '');
                          setCustomRoomPass(t.roomPassword || '');
                          setCustomLiveUrl(t.liveStreamUrl || '');
                          setCustomStatus(t.status || 'REGISTRATION_OPEN');
                        }}
                        className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Tv className="w-3.5 h-3.5" />
                        <span>Set Room & Live Stream</span>
                      </button>
                      <Link
                        href={`/matches/${t.id}`}
                        className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 text-slate-800 dark:text-white font-bold text-xs"
                      >
                        View Page
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 6: PLATFORM SETTINGS & BRANDING ================= */}
          {activeTab === 'settings' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-7 animate-in fade-in">
              <div>
                <h2 className="font-display font-black text-xl sm:text-2xl text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-purple-500" />
                  <span>সাইট কন্ট্রোল, লাইভ স্ট্রিমিং ও সোশ্যাল মিডিয়া সেটিংস</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
                  টুর্নামেন্ট লাইভ স্ট্রিম লিঙ্ক, সোশ্যাল মিডিয়া, বিকাশ নম্বর ও প্ল্যাটফর্ম ব্র্যান্ডিং এক জায়গা থেকেই কন্ট্রোল করুন।
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>সেটিংস সফলভাবে সেভ করা হয়েছে এবং পুরো সাইটে সাথে সাথে আপডেট হয়েছে!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
                {/* 🔴 LIVE STREAMING & BROADCAST SECTION */}
                <div className="p-5 sm:p-6 rounded-2xl bg-red-500/5 dark:bg-red-950/20 border-2 border-red-500/30 space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-red-500/20">
                    <div className="p-2 rounded-xl bg-red-600 text-white shadow-md">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <span>🔴 Social Media & Live Stream Link (লাইভ ম্যাচ সম্প্রচার লিঙ্ক)</span>
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-gray-300 font-medium">
                        এখানে আপনি যে ইউটিউব/সোশ্যাল লাইভ লিঙ্ক দিবেন, সকল টুর্নামেন্ট কার্ডের <strong>"Watch on YouTube Live (Full Match)"</strong> বাটনে ক্লিক করে ইউজাররা সরাসরি ফুল ম্যাচ লাইভ দেখতে পারবে।
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-red-600 fill-current" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span>YouTube Live Stream Link (ইউটিউব লাইভ লিঙ্ক) *</span>
                      </span>
                      {settingsForm.youtube_live_url && (
                        <a
                          href={settingsForm.youtube_live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                        >
                          <span>লিঙ্ক টেস্ট করুন</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://www.youtube.com/@YourChannel/live or stream link"
                      value={settingsForm.youtube_live_url}
                      onChange={(e) => setSettingsForm({ ...settingsForm, youtube_live_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono shadow-sm"
                    />
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400 mt-1">
                      💡 উদাহরণ: <code className="bg-slate-100 dark:bg-charcoal-800 px-1.5 py-0.5 rounded">https://youtube.com/@EsportsBD/live</code> বা আপনার সরাসরি লাইভ ব্রডকাস্ট URL।
                    </p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-blue-600 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span>Facebook Live / Gaming Stream URL (ফেসবুক লাইভ লিঙ্ক)</span>
                      </span>
                      {settingsForm.facebook_live_url && (
                        <a
                          href={settingsForm.facebook_live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          <span>লিঙ্ক টেস্ট করুন</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.facebook.com/gaming/YourPage"
                      value={settingsForm.facebook_live_url}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebook_live_url: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono shadow-sm"
                    />
                  </div>
                </div>

                {/* GENERAL & FINANCIAL SETTINGS */}
                <div className="space-y-4">
                  <h3 className="font-display font-black text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-charcoal-800 pb-2">
                    প্ল্যাটফর্ম ব্র্যান্ডিং ও আর্থিক সেটিংস
                  </h3>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                      Site Name (ওয়েবসাইটের নাম)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.site_name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, site_name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                      Official Deposit Number (বিকাশ / নগদ / রকেট / উপায় নম্বর)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.bkash_number}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bkash_number: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm font-mono focus:border-ff-orange focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                        Support WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={settingsForm.support_whatsapp}
                        onChange={(e) => setSettingsForm({ ...settingsForm, support_whatsapp: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm font-mono focus:border-ff-orange focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                        Telegram Channel URL
                      </label>
                      <input
                        type="text"
                        value={settingsForm.support_telegram}
                        onChange={(e) => setSettingsForm({ ...settingsForm, support_telegram: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                      Promotional Notice Bar Text (জরুরি নোটিশ)
                    </label>
                    <textarea
                      rows={2}
                      value={settingsForm.notice_text}
                      onChange={(e) => setSettingsForm({ ...settingsForm, notice_text: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="py-3 px-8 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black text-sm uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all"
                >
                  {savingSettings ? 'Saving Settings...' : 'Save All Settings (সেভ করুন)'}
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ================= SCREENSHOT ZOOM MODAL ================= */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 w-full max-w-2xl rounded-2xl shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-charcoal-800 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-ff-orange" />
                <span>Player Deposit Payment Receipt (Screenshot)</span>
              </h3>
              <button
                type="button"
                onClick={() => setPreviewScreenshot(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center rounded-xl bg-slate-100 dark:bg-charcoal-950 p-2 border border-slate-200 dark:border-charcoal-800">
              <img
                src={previewScreenshot}
                alt="Deposit Screenshot"
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <a
                href={previewScreenshot}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in New Tab</span>
              </a>
              <button
                type="button"
                onClick={() => setPreviewScreenshot(null)}
                className="px-4 py-2 rounded-xl bg-ff-orange text-black font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REJECT DEPOSIT MODAL ================= */}
      {rejectDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Reject Deposit Request
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-300">
              Rejecting TrxID: <strong className="font-mono text-slate-900 dark:text-white">{rejectDeposit.transactionId}</strong> (৳{rejectDeposit.amount}) for player <strong>@{rejectDeposit.user?.username}</strong>.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-gray-300 block mb-1">
                Reason for Rejection *
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs focus:border-ff-orange focus:outline-none mb-2"
              >
                <option value="TrxID not found in statement">TrxID not found in statement</option>
                <option value="Amount does not match statement">Amount does not match statement</option>
                <option value="Sender mobile number mismatch">Sender mobile number mismatch</option>
                <option value="Fake or duplicate TrxID submission">Fake or duplicate TrxID submission</option>
                <option value="Payment was reversed by provider">Payment was reversed by provider</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectDeposit(null)}
                className="flex-1 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-charcoal-800 text-xs font-bold text-slate-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT ROOM ID MODAL ================= */}
      {editingRoomTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Set Custom Room Credentials
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-400">
              For: <strong className="text-slate-900 dark:text-white">{editingRoomTournament.title}</strong>
            </p>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-medium">
              🔔 টুর্নামেন্ট শুরু হওয়ার ঠিক ১০ মিনিট আগে রুম আইডি ও পাসওয়ার্ড রেজিস্টার্ড খেলোয়াড়দের কাছে দৃশ্যমান হবে।
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Custom Room ID *
                </label>
                <input
                  type="text"
                  required
                  value={customRoomId}
                  onChange={(e) => setCustomRoomId(e.target.value)}
                  placeholder="e.g. 84920481"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-sm focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Room Password
                </label>
                <input
                  type="text"
                  value={customRoomPass}
                  onChange={(e) => setCustomRoomPass(e.target.value)}
                  placeholder="e.g. 1234 or None"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-sm focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <Tv className="w-3.5 h-3.5" />
                    <span>Match Live Stream URL (ম্যাচ লাইভ স্ট্রিম লিঙ্ক - ঐচ্ছিক)</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={customLiveUrl}
                  onChange={(e) => setCustomLiveUrl(e.target.value)}
                  placeholder="e.g. https://youtube.com/live/... (খালি রাখলে সেটিংসের লিঙ্ক কার্যকর হবে)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Tournament Status (টুর্নামেন্ট স্ট্যাটাস)
                </label>
                <select
                  value={customStatus}
                  onChange={(e) => setCustomStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs font-bold focus:border-ff-orange focus:outline-none"
                >
                  <option value="REGISTRATION_OPEN">REGISTRATION_OPEN (রেজিস্ট্রেশন চলছে)</option>
                  <option value="LIVE">🔴 LIVE (লাইভ স্ট্রিম চলছে - Live Now)</option>
                  <option value="FULL">FULL (রুম ফুল)</option>
                  <option value="COMPLETED">COMPLETED (ম্যাচ সম্পন্ন)</option>
                </select>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">
                  💡 লাইভ স্ট্রিম চালু করলে স্ট্যাটাস <strong>LIVE</strong> করে দিন, এতে কার্ডে লাল লাইভ ব্যাজ জ্বলবে।
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingRoomTournament(null)}
                className="flex-1 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-charcoal-800 text-xs font-bold text-slate-700 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRoomCredentials}
                className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white shadow-sm"
              >
                Publish Credentials
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
