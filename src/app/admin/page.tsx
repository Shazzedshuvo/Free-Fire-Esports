'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Gamepad2,
  CreditCard,
  Wallet,
  Trophy,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-ff-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentLogs = data?.recentAuditLogs || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide">
            PLATFORM OPERATIONS OVERVIEW
          </h1>
          <p className="text-sm text-slate-600 dark:text-gray-300 font-semibold mt-1">
            রিয়েল-টাইম ডিপোজিট, টুর্নামেন্ট, লাভ-লস ও প্লেয়ার রেজিস্ট্রেশন ড্যাশবোর্ড।
          </p>
        </div>

        {/* Pending Deposit Alert Banner */}
        {stats.pendingDepositsCount > 0 && (
          <Link
            href="/admin/deposits?status=PENDING"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-amber-700 dark:text-amber-300 font-black text-xs sm:text-sm animate-pulse hover:bg-amber-500/25 transition-all shadow-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{stats.pendingDepositsCount} টি ডিপোজিট অনুমোদন অপেক্ষায়</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Financial KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deposits */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
              Total Deposits (মোট ডিপোজিট)
            </span>
            <CreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400 block">
            ৳{stats.totalDeposits?.toLocaleString() || '0'}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 block">
            {stats.approvedDepositsCount || 0} approved bKash requests
          </span>
        </div>

        {/* Active Wallets Liability */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
              Wallets Balance (ওয়ালেট মোট টাকা)
            </span>
            <Wallet className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white block">
            ৳{stats.totalWalletBalance?.toLocaleString() || '0'}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 block">
            Across {stats.activeUsers || 0} active player accounts
          </span>
        </div>

        {/* Total Entry Fees Collected */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
              Entry Fees (এন্ট্রি ফি সংগ্রহ)
            </span>
            <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400 block">
            ৳{stats.totalEntryFees?.toLocaleString() || '0'}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 block">
            Tournament enrollment revenue
          </span>
        </div>

        {/* Total Prize Pool Paid */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
              Prizes Paid (পুরস্কার প্রদান)
            </span>
            <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-purple-600 dark:text-purple-400 block">
            ৳{stats.totalPrizeDistributed?.toLocaleString() || '0'}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 block">
            Verified tournament champions
          </span>
        </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase block">Total Players (মোট প্লেয়ার)</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1 block">
            {stats.totalUsers || 0}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase block">Total Tournaments (টুর্নামেন্ট)</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1 block">
            {stats.totalTournaments || 0}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase block">Active / Upcoming (চলমান)</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-amber-600 dark:text-amber-400 mt-1 block">
            {stats.upcomingTournaments || 0}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase block">Completed Matches (সম্পন্ন)</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-emerald-600 dark:text-emerald-400 mt-1 block">
            {stats.completedMatches || 0}
          </span>
        </div>
      </div>

      {/* Financial Health Visual Chart Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-charcoal-800 pb-3">
          <h2 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-ff-orange" />
            <span>Platform Financial Liquidity Distribution</span>
          </h2>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            ● System Healthy
          </span>
        </div>

        <div className="space-y-4 pt-2">
          {/* Deposited Funds */}
          <div>
            <div className="flex justify-between text-xs sm:text-sm font-bold mb-1">
              <span className="text-slate-600 dark:text-gray-300">Total Approved Deposits</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">৳{stats.totalDeposits || 0}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-charcoal-950 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-charcoal-800">
              <div className="h-full bg-emerald-500 rounded-full w-full"></div>
            </div>
          </div>

          {/* Active Player Balances */}
          <div>
            <div className="flex justify-between text-xs sm:text-sm font-bold mb-1">
              <span className="text-slate-600 dark:text-gray-300">Current Player Wallet Balances</span>
              <span className="font-black text-sky-600 dark:text-sky-400">৳{stats.totalWalletBalance || 0}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-charcoal-950 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-charcoal-800">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round(((stats.totalWalletBalance || 1) / (stats.totalDeposits || 1)) * 100))}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Distributed Prizes */}
          <div>
            <div className="flex justify-between text-xs sm:text-sm font-bold mb-1">
              <span className="text-slate-600 dark:text-gray-300">Prize Pool Distributed</span>
              <span className="font-black text-amber-600 dark:text-amber-400">৳{stats.totalPrizeDistributed || 0}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-charcoal-950 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-charcoal-800">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round(((stats.totalPrizeDistributed || 1) / (stats.totalDeposits || 1)) * 100))}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admin Audit Activity */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-charcoal-800 pb-3">
          <h2 className="font-display font-black text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Recent System & Admin Audit Logs</span>
          </h2>
          <Link href="/admin/audit-logs" className="text-xs sm:text-sm font-bold text-ff-orange hover:underline">
            View All Audit Logs →
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-sm font-semibold text-slate-500 dark:text-gray-400 py-4 text-center">
            No recent audit logs recorded.
          </p>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-charcoal-800">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{log.details}</span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                    By <strong>{log.adminName || 'System'}</strong> • Action: <code className="text-amber-600 dark:text-ff-amber font-mono font-bold">{log.action}</code>
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-gray-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
