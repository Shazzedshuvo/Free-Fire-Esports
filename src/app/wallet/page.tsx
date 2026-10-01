'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Wallet,
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  CreditCard,
  Trophy,
  History,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export default function WalletPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetch(`/api/wallet/transactions?type=${filterType}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.transactions) setTransactions(data.transactions);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [user, isLoading, filterType, router]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-8">
      {/* Wallet Balance Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-charcoal-900 backdrop-blur-xl border border-white/80 dark:border-charcoal-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
              {t('wallet_balance')}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display font-black text-4xl sm:text-5xl text-emerald-600 dark:text-emerald-400">
                ৳{user.wallet?.balance?.toFixed(2) || '0.00'}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-gray-400">BDT</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-2 font-medium">
              Account: <strong className="text-slate-900 dark:text-white">@{user.username}</strong> • UID: <span className="font-bold text-slate-800 dark:text-gray-200">{user.ffUid}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/deposit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-ff-orange via-amber-500 to-ff-amber hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black uppercase text-xs sm:text-sm tracking-wider shadow-glow-orange transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('deposit_money')}</span>
            </Link>
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 dark:border-charcoal-700 dark:text-white font-bold text-xs sm:text-sm transition-colors shadow-sm"
            >
              <span>Join Matches</span>
            </Link>
          </div>
        </div>

        {/* Mini stats underneath */}
        <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-200 dark:border-charcoal-800/80">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-gray-400 uppercase block font-semibold">Total Deposited</span>
            <span className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              ৳{user.wallet?.totalDeposited?.toFixed(0) || '0'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-gray-400 uppercase block font-semibold">Prize Earnings Won</span>
            <span className="font-display font-bold text-base sm:text-lg text-amber-600 dark:text-amber-400">
              ৳{user.wallet?.totalWon?.toFixed(0) || '0'}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-gray-400 uppercase block font-semibold">Entry Fees Paid</span>
            <span className="font-display font-bold text-base sm:text-lg text-slate-700 dark:text-gray-300">
              ৳{user.wallet?.totalEntryFees?.toFixed(0) || '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="p-6 rounded-2xl bg-white/75 dark:bg-charcoal-900 backdrop-blur-xl border border-white/80 dark:border-charcoal-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-charcoal-800 pb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-ff-orange" />
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              {t('transaction_history')}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'ALL', label: 'All' },
              { key: 'DEPOSIT', label: 'Deposits' },
              { key: 'TOURNAMENT_ENTRY', label: 'Tournament Fees' },
              { key: 'PRIZE', label: 'Prizes' },
              { key: 'ADMIN_CREDIT', label: 'Adjustments' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  filterType === f.key
                    ? 'bg-ff-orange text-slate-950 font-black shadow-glow-orange/30'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-charcoal-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-gray-500 text-xs font-medium">
            No transaction records found for this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-charcoal-950 text-slate-600 dark:text-gray-400 uppercase text-[10px] border-b border-slate-200 dark:border-charcoal-800">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Reference / TxnID</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Balance After</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-charcoal-800">
                {transactions.map((txn) => {
                  const isCredit = txn.amount > 0;
                  return (
                    <tr key={txn.id} className="hover:bg-slate-50 dark:hover:bg-charcoal-800/40 transition-colors">
                      <td className="py-3 px-3 text-slate-600 dark:text-gray-400 font-medium">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {txn.notes || txn.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-gray-500">{txn.type}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-gray-300 font-medium">
                        {txn.paymentMethod || 'Internal'}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-gray-400 font-bold">
                        {txn.externalTxnId || '-'}
                      </td>
                      <td className="py-3 px-3 font-display font-bold text-sm">
                        <span className={isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {isCredit ? `+৳${txn.amount}` : `-৳${Math.abs(txn.amount)}`}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-gray-200">
                        ৳{txn.balanceAfter}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
