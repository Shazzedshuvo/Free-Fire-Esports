'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Wallet,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

import DepositModal, { OFFICIAL_DEPOSIT_NUMBER } from '@/components/DepositModal';

export default function DepositPage() {
  const { user, refreshUser } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [senderNumber, setSenderNumber] = useState(user?.mobileNumber || '');
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [myDeposits, setMyDeposits] = useState<any[]>([]);

  // Official Deposit Number
  const [bkashNumber, setBkashNumber] = useState(OFFICIAL_DEPOSIT_NUMBER);
  const [bkashType, setBkashType] = useState('Personal (Send Money)');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.bkash_number) setBkashNumber(data.settings.bkash_number);
        if (data.settings?.bkash_type) setBkashType(data.settings.bkash_type);
      })
      .catch(() => {});

    if (user) {
      fetch('/api/wallet/deposit')
        .then((res) => res.json())
        .then((data) => {
          if (data.deposits) setMyDeposits(data.deposits);
        })
        .catch(() => {});
    }
  }, [user]);

  const handleCopy = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessData(null);

    try {
      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          senderNumber,
          transactionId,
          method: 'bKash',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit deposit request.');
      } else {
        setSuccessData(data);
        await refreshUser();
        // Clear fields
        setAmount('');
        setTransactionId('');
        // Refresh deposit list
        const depRes = await fetch('/api/wallet/deposit');
        const depData = await depRes.json();
        if (depData.deposits) setMyDeposits(depData.deposits);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-8">
      {/* Title & Multi-Provider Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
            <Wallet className="w-7 h-7 text-pink-500" />
            <span>{t('deposit_title')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
            {t('deposit_desc')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-ff-orange via-amber-500 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-glow-orange flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>ডিপোজিট উইন্ডো খুলুন (bKash / Nagad / Upay / Rocket)</span>
        </button>
      </div>

      {/* Instructions & Official bKash Number Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800">
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider block">
              {t('bkash_number_label')} ({bkashType})
            </span>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wider">
                {bkashNumber}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-xs font-bold text-pink-600 dark:text-pink-400 border border-slate-300 dark:border-charcoal-700 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t('copied') : t('copy')}</span>
              </button>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 dark:text-gray-400 block font-bold">{t('current_balance')}</span>
            <span className="font-display font-black text-2xl text-emerald-600 dark:text-emerald-400">
              ৳{user?.wallet?.balance?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-2 text-xs text-slate-700 dark:text-gray-300 font-medium">
          <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs mb-1">
            Deposit Instructions:
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-charcoal-950/60 border border-slate-200 dark:border-charcoal-800/80">
            {t('step_1')} <span className="text-pink-600 dark:text-pink-400 font-mono font-bold">{bkashNumber}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-charcoal-950/60 border border-slate-200 dark:border-charcoal-800/80">
            {t('step_2')}
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-charcoal-950/60 border border-slate-200 dark:border-charcoal-800/80">
            {t('step_3')}
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-charcoal-950/60 border border-slate-200 dark:border-charcoal-800/80">
            {t('step_4')}
          </div>
        </div>

        {/* Hint for Instant Demo Verification */}
        <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs text-pink-700 dark:text-pink-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-500 flex-shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Enter any TrxID starting with <code className="bg-slate-200 dark:bg-charcoal-950 px-1 py-0.5 rounded text-slate-900 dark:text-white font-mono font-bold">AUTO</code> or <code className="bg-slate-200 dark:bg-charcoal-950 px-1 py-0.5 rounded text-slate-900 dark:text-white font-mono font-bold">INSTANT</code> for immediate simulation of official automated API crediting! Standard IDs will undergo admin verification.
          </span>
        </div>
      </div>

      {/* Deposit Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
          Submit Deposit Request
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-500 text-xs flex items-center gap-2 font-bold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successData && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>{successData.isAutoVerified ? 'Deposit Approved & Added!' : 'Deposit Submitted for Review'}</span>
            </div>
            <p>{successData.message}</p>
            {successData.newBalance !== undefined && (
              <p className="font-bold text-slate-900 dark:text-white">
                New Wallet Balance: ৳{successData.newBalance}
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
              {t('amount')} *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                ৳
              </span>
              <input
                type="number"
                min="50"
                max="25000"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
              />
            </div>
            {/* Quick Amount Pills */}
            <div className="flex flex-wrap gap-2 mt-2">
              {[50, 100, 200, 500, 1000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(String(amt))}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-[11px] font-bold text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-charcoal-700 transition-colors"
                >
                  ৳{amt}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1 font-medium">
              {t('min_deposit_hint')}
            </p>
          </div>

          {/* Sender Mobile Number */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
              {t('sender_number')} *
            </label>
            <input
              type="text"
              required
              value={senderNumber}
              onChange={(e) => setSenderNumber(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm focus:border-ff-orange focus:outline-none"
            />
          </div>

          {/* Transaction ID */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-gray-300 block mb-1">
              {t('transaction_id')} (TrxID) *
            </label>
            <input
              type="text"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. 9B7X28KA91 or AUTO_DEMO_123"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-700 text-slate-900 dark:text-white text-sm font-mono uppercase focus:border-ff-orange focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 via-ff-orange to-ff-amber hover:from-pink-500 hover:to-orange-500 text-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-glow-orange disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>{loading ? t('loading') : t('submit_deposit')}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Deposits Status Table */}
      {myDeposits.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-charcoal-800 pb-3">
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              My Deposit Requests
            </h2>
            <Link
              href="/wallet"
              className="text-xs text-orange-600 dark:text-ff-amber hover:underline flex items-center gap-1 font-bold"
            >
              <span>View Full Wallet History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-charcoal-950 text-slate-600 dark:text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">TrxID</th>
                  <th className="py-2.5 px-3">Sender</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-charcoal-800">
                {myDeposits.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-charcoal-800/40">
                    <td className="py-2.5 px-3 text-slate-600 dark:text-gray-400">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-pink-600 dark:text-pink-400 font-bold">{d.method}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-gray-200">{d.transactionId}</td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-gray-300 font-medium">{d.senderNumber}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">৳{d.amount}</td>
                    <td className="py-2.5 px-3 text-right">
                      {d.status === 'APPROVED' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40">
                          APPROVED
                        </span>
                      ) : d.status === 'REJECTED' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40">
                          REJECTED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40">
                          PENDING REVIEW
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Multi-Provider Deposit Modal Window */}
      <DepositModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refreshUser();
          fetch('/api/wallet/deposit')
            .then((r) => r.json())
            .then((data) => {
              if (data.deposits) setMyDeposits(data.deposits);
            })
            .catch(() => {});
        }}
      />
    </div>
  );
}
