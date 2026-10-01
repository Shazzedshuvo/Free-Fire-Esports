'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CreditCard,
  Trophy,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  RefreshCw,
  Wallet,
} from 'lucide-react';

export default function AdminFinancialsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/financials');
      const json = await res.json();
      if (json.financials) setData(json.financials);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ff-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const f = data || {};

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white flex items-center gap-2.5">
            <TrendingUp className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>PLATFORM FINANCIALS: PROFIT & LOSS (লাভ / লস হিসাব)</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-gray-300 font-semibold mt-1">
            মোট ডিপোজিট, মোট উইথড্র, টুর্নামেন্ট এন্ট্রি ফি সংগ্রহ ও প্রাইজ মানি বণ্টনের বিস্তারিত লাভ-লস রিপোর্ট।
          </p>
        </div>
        <button
          onClick={fetchFinancials}
          className="p-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-800 dark:text-gray-200 text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4 text-ff-orange" />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Profit */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border-2 border-emerald-500 shadow-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
              Net Profit (মোট লাভ)
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <span className="font-display font-black text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400 block">
            ৳{(f.netRevenue || f.totalProfit || 0).toLocaleString()}
          </span>
          <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold block flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            <span>Tournament Margins & Net House Cut</span>
          </span>
        </div>

        {/* Total Deposits */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
              Total Deposits (মোট ডিপোজিট)
            </span>
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <span className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white block">
            ৳{(f.totalDeposits || 0).toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 block">
            Approved bKash & Nagad payments
          </span>
        </div>

        {/* Entry Fees Collected */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
              Match Entry Fees (এন্ট্রি ফি)
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <span className="font-display font-black text-3xl sm:text-4xl text-amber-600 dark:text-amber-400 block">
            ৳{(f.totalEntryFeesCollected || 0).toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 block">
            Collected from tournament participants
          </span>
        </div>

        {/* Prize Money Paid */}
        <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-black text-slate-600 dark:text-gray-300 uppercase tracking-wider">
              Prizes Paid (প্রাইজ প্রদান)
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <span className="font-display font-black text-3xl sm:text-4xl text-purple-600 dark:text-purple-400 block">
            ৳{(f.totalPrizesDistributed || 0).toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 block">
            Awarded to 1st, 2nd & 3rd place winners
          </span>
        </div>
      </div>
    </div>
  );
}
