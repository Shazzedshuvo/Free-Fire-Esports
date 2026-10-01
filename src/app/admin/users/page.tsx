'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Wallet,
  Ban,
  CheckCircle2,
  DollarSign,
  Plus,
  Minus,
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Wallet adjustment modal
  const [adjustModalUser, setAdjustModalUser] = useState<any | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'CREDIT' | 'DEBIT'>('CREDIT');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustLoading, setAdjustLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let url = '/api/admin/users';
      if (search) url += `?query=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleSuspend = async (user: any) => {
    const actionText = user.isSuspended ? 'ACTIVATE' : 'SUSPEND';
    if (!confirm(`Are you sure you want to ${actionText} user @${user.username}?`)) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'TOGGLE_SUSPEND',
          isSuspended: !user.isSuspended,
        }),
      });

      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdjustWalletSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalUser) return;

    const parsed = Number(adjustAmount);
    if (!parsed || parsed <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    try {
      setAdjustLoading(true);
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: adjustModalUser.id,
          action: 'ADJUST_WALLET',
          amount: parsed,
          type: adjustType,
          reason: adjustReason.trim() || 'Manual Admin Balance Adjustment',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Wallet adjusted successfully!');
        setAdjustModalUser(null);
        setAdjustAmount('');
        setAdjustReason('');
        fetchUsers();
      } else {
        alert(data.error || 'Failed to adjust wallet.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdjustLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-3">
            <Users className="w-7 h-7 text-sky-600 dark:text-sky-400" />
            <span>PLAYER & USER CONTROL (ইউজার কন্ট্রোল)</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-gray-300 font-semibold mt-1">
            প্লেয়ারদের অ্যাকাউন্ট ও Free Fire UID তালিকা, ব্যালেন্স সমন্বয় (Manual Credit/Debit) এবং সাসপেন্ড সুবিধা।
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="UID, নাম বা ফোন দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:border-ff-orange focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-200 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-gray-400 text-sm font-semibold">কোনো ইউজার পাওয়া যায়নি।</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-100 dark:bg-charcoal-950 text-slate-700 dark:text-gray-300 uppercase text-xs font-black">
                <tr>
                  <th className="py-3.5 px-3">Player Info (প্লেয়ার)</th>
                  <th className="py-3.5 px-3">Free Fire UID</th>
                  <th className="py-3.5 px-3">Contact (মোবাইল ও ইমেইল)</th>
                  <th className="py-3.5 px-3">Wallet Balance</th>
                  <th className="py-3.5 px-3">Matches</th>
                  <th className="py-3.5 px-3">Role</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-charcoal-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="py-3.5 px-3">
                      <p className="font-black text-slate-900 dark:text-white text-sm sm:text-base">{u.fullName}</p>
                      <p className="text-xs font-black text-orange-600 dark:text-ff-amber">IGN: {u.ffPlayerName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 font-mono">@{u.username}</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-charcoal-950 px-2.5 py-1 rounded-xl border border-slate-300 dark:border-charcoal-800 text-xs sm:text-sm">
                        {u.ffUid}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-slate-800 dark:text-gray-200 font-mono font-bold text-xs sm:text-sm">{u.mobileNumber}</p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-3 font-display font-black text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
                      ৳{u.wallet?.balance?.toFixed(0) || '0'}
                    </td>
                    <td className="py-3.5 px-3 font-black text-slate-900 dark:text-white">
                      {u._count?.tournamentParticipants || 0} টি
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-xs font-black bg-slate-100 dark:bg-charcoal-950 text-slate-700 dark:text-ff-amber border border-slate-300 dark:border-charcoal-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {u.isSuspended ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                          SUSPENDED
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAdjustModalUser(u)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-black transition-colors"
                          title="টাকা যোগ / বিয়োগ করুন"
                        >
                          ± Balance
                        </button>
                        <button
                          onClick={() => handleToggleSuspend(u)}
                          className={`p-2 rounded-xl transition-colors ${
                            u.isSuspended
                              ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                              : 'bg-red-500/15 text-red-600 dark:text-red-400'
                          }`}
                          title={u.isSuspended ? 'Activate User' : 'Suspend User'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Wallet Modal */}
      {adjustModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-charcoal-900 border border-slate-300 dark:border-charcoal-700 w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-black text-lg sm:text-xl text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-ff-orange" />
              <span>Manual Wallet Adjustment</span>
            </h3>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-charcoal-950 border border-slate-200 dark:border-charcoal-800 text-xs sm:text-sm">
              <p className="font-black text-slate-900 dark:text-white">{adjustModalUser.fullName} (@{adjustModalUser.username})</p>
              <p className="text-slate-500 dark:text-gray-400 font-mono mt-0.5">FF UID: {adjustModalUser.ffUid}</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-black mt-1">Current Balance: ৳{adjustModalUser.wallet?.balance?.toFixed(0)}</p>
            </div>

            <form onSubmit={handleAdjustWalletSubmit} className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Adjustment Type (অ্যাকশন)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('CREDIT')}
                    className={`py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                      adjustType === 'CREDIT'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-charcoal-950 text-slate-700 dark:text-gray-400 border border-slate-200 dark:border-charcoal-700'
                    }`}
                  >
                    + Add Funds (Credit)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('DEBIT')}
                    className={`py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                      adjustType === 'DEBIT'
                        ? 'bg-red-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-charcoal-950 text-slate-700 dark:text-gray-400 border border-slate-200 dark:border-charcoal-700'
                    }`}
                  >
                    - Deduct Funds (Debit)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Amount (টাকা) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-sm font-bold focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Reason for Audit Log (কারণ) *
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Compensation, tournament prize, correction"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black uppercase text-xs sm:text-sm"
                >
                  {adjustLoading ? 'Updating...' : 'Confirm Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
