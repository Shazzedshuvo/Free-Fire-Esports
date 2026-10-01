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
        <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const f = data || {};

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl">
        <div>
          <h1 className="font-display font-black text-2xl text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <span>PLATFORM FINANCIALS: PROFIT & LOSS (লাভ / লস হিসাব)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            মোট ডিপোজিট, মোট উইথড্র, টুর্নামেন্ট এন্ট্রি ফি সংগ্রহ ও প্রাইজ মানি বণ্টনের বিস্তারিত লাভ-লস রিপোর্ট।
          </p>
        </div>
        <button
          onClick={fetchFinancials}
          className="p-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-gray-300 text-xs font-bold flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-ff-orange" />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Profit */}
        <div className="p-6 rounded-3xl bg-charcoal-900 border border-emerald-500/40 shadow-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Net Platform Profit</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-black text-3xl text-emerald-400 block">
            ৳{(f.netRevenue || f.totalProfit || 0).toLocaleString()}
          </span>
          <span className="text-xs text-emerald-500/90 font-semibold block flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Tournament Margins & House Cut</span>
          </span>
        </div>

        {/* Total Deposits */}
        <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Total User Deposits</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-black text-3xl text-white block">
            ৳{(f.totalDeposits || 0).toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 block">
            Approved bKash & Nagad payments
          </span>
        </div>

        {/* Entry Fees Collected */}
        <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Match Entry Fees</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-black text-3xl text-amber-400 block">
            ৳{(f.totalEntryFeesCollected || 0).toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 block">
            Collected from tournament participants
          </span>
        </div>

        {/* Prize Money Paid */}
        <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase">Prizes Paid Out</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <span className="font-display font-black text-3xl text-purple-400 block">
            ৳{(f.totalPrizesDistributed || 0).toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 block">
            Awarded to 1st, 2nd & 3rd place winners
          </span>
        </div>
      </div>
    </div>
  );
}
