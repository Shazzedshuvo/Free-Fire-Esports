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
        <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentLogs = data?.recentAuditLogs || [];

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white tracking-wide">
            PLATFORM OPERATIONS OVERVIEW
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time financial, tournament, and player registration metrics.
          </p>
        </div>

        {/* Pending Deposit Alert Banner */}
        {stats.pendingDepositsCount > 0 && (
          <Link
            href="/admin/deposits?status=PENDING"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-300 font-bold text-xs animate-pulse hover:bg-amber-500/30 transition-all shadow-glow-amber/20"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{stats.pendingDepositsCount} Pending Deposit{stats.pendingDepositsCount > 1 ? 's' : ''} Need Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Financial KPIs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Deposits */}
        <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Total Deposits</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-emerald-400 block">
            ৳{stats.totalDeposits?.toLocaleString() || '0'}
          </span>
          <span className="text-[10px] text-gray-500 block">
            {stats.approvedDepositsCount || 0} approved bKash requests
          </span>
        </div>

        {/* Active Wallets Liability */}
        <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Wallets Balance</span>
            <Wallet className="w-4 h-4 text-sky-400" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-white block">
            ৳{stats.totalWalletBalance?.toLocaleString() || '0'}
          </span>
          <span className="text-[10px] text-gray-500 block">
            Across {stats.activeUsers || 0} active player accounts
          </span>
        </div>

        {/* Total Entry Fees Collected */}
        <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Entry Fees Gross</span>
            <TrendingUp className="w-4 h-4 text-ff-amber" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-ff-amber block">
            ৳{stats.totalEntryFees?.toLocaleString() || '0'}
          </span>
          <span className="text-[10px] text-gray-500 block">
            Tournament enrollment revenue
          </span>
        </div>

        {/* Total Prize Pool Paid */}
        <div className="p-5 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Prizes Paid Out</span>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-yellow-400 block">
            ৳{stats.totalPrizeDistributed?.toLocaleString() || '0'}
          </span>
          <span className="text-[10px] text-gray-500 block">
            Verified tournament champions
          </span>
        </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
          <span className="text-xs text-gray-400 block font-semibold">Total Players</span>
          <span className="font-display font-bold text-xl text-white mt-1 block">
            {stats.totalUsers || 0}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
          <span className="text-xs text-gray-400 block font-semibold">Total Tournaments</span>
          <span className="font-display font-bold text-xl text-white mt-1 block">
            {stats.totalTournaments || 0}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
          <span className="text-xs text-gray-400 block font-semibold">Active / Upcoming</span>
          <span className="font-display font-bold text-xl text-ff-amber mt-1 block">
            {stats.upcomingTournaments || 0}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-charcoal-900 border border-charcoal-800">
          <span className="text-xs text-gray-400 block font-semibold">Completed Matches</span>
          <span className="font-display font-bold text-xl text-emerald-400 mt-1 block">
            {stats.completedMatches || 0}
          </span>
        </div>
      </div>

      {/* Financial Health Visual Chart Card */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
          <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-ff-orange" />
            <span>Platform Financial Liquidity Distribution</span>
          </h2>
          <span className="text-xs text-emerald-400 font-bold">● System Healthy</span>
        </div>

        <div className="space-y-3 pt-2">
          {/* Deposited Funds */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Total Approved Deposits</span>
              <span className="font-bold text-emerald-400">৳{stats.totalDeposits || 0}</span>
            </div>
            <div className="w-full bg-charcoal-950 h-3 rounded-full overflow-hidden border border-charcoal-800">
              <div className="h-full bg-emerald-500 rounded-full w-full"></div>
            </div>
          </div>

          {/* Active Player Balances */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Current Player Wallet Balances</span>
              <span className="font-bold text-sky-400">৳{stats.totalWalletBalance || 0}</span>
            </div>
            <div className="w-full bg-charcoal-950 h-3 rounded-full overflow-hidden border border-charcoal-800">
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
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Prize Pool Distributed</span>
              <span className="font-bold text-yellow-400">৳{stats.totalPrizeDistributed || 0}</span>
            </div>
            <div className="w-full bg-charcoal-950 h-3 rounded-full overflow-hidden border border-charcoal-800">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round(((stats.totalPrizeDistributed || 1) / (stats.totalDeposits || 1)) * 100))}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admin Audit Activity */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
          <h2 className="font-display font-bold text-base text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Recent System & Admin Audit Logs</span>
          </h2>
          <Link href="/admin/audit-logs" className="text-xs text-ff-amber hover:underline">
            View All Audit Logs →
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-xs text-gray-500 py-3 text-center">No recent audit logs recorded.</p>
        ) : (
          <div className="divide-y divide-charcoal-800">
            {recentLogs.map((log: any) => (
              <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{log.details}</span>
                  <span className="text-[10px] text-gray-400">
                    By <strong>{log.adminName || 'System'}</strong> • Action: <code className="text-ff-amber">{log.action}</code>
                  </span>
                </div>
                <span className="text-[11px] text-gray-500">
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
