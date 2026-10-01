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

    if (!adjustReason || adjustReason.trim().length < 3) {
      alert('A valid reason is required for administrative wallet adjustments.');
      return;
    }

    const finalAmount = adjustType === 'CREDIT' ? parsed : -parsed;

    try {
      setAdjustLoading(true);
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: adjustModalUser.id,
          action: 'ADJUST_WALLET',
          amount: finalAmount,
          reason: adjustReason,
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
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setAdjustLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl text-white tracking-wide flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" />
            <span>PLAYER & USER CONTROL</span>
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage player accounts, investigate Free Fire UIDs, adjust wallet balances with audit logs, and toggle account suspensions.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search UID, username, mobile..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-xs font-bold text-gray-200 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-xs">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-charcoal-950 text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Player Info</th>
                  <th className="py-3 px-3">Free Fire UID</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Wallet Balance</th>
                  <th className="py-3 px-3">Matches</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-charcoal-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <p className="font-bold text-white">{u.fullName}</p>
                      <p className="text-[11px] text-ff-amber">IGN: {u.ffPlayerName}</p>
                      <p className="text-[10px] text-gray-500">@{u.username}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-white bg-charcoal-950 px-2 py-1 rounded border border-charcoal-800">
                        {u.ffUid}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <p className="text-gray-300 font-mono">{u.mobileNumber}</p>
                      <p className="text-[10px] text-gray-500">{u.email}</p>
                    </td>
                    <td className="py-3 px-3 font-display font-black text-sm text-emerald-400">
                      ৳{u.wallet?.balance?.toFixed(2) || '0.00'}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {u._count?.tournamentParticipants || 0}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-charcoal-950 text-ff-amber border border-charcoal-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {u.isSuspended ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                          SUSPENDED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAdjustModalUser(u)}
                          className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-bold text-[11px] border border-emerald-500/40 transition-colors flex items-center gap-1"
                          title="Add or Deduct Balance"
                        >
                          <Wallet className="w-3 h-3" />
                          <span>Adjust Balance</span>
                        </button>

                        <button
                          onClick={() => handleToggleSuspend(u)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                            u.isSuspended
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/40'
                          }`}
                          title={u.isSuspended ? 'Activate User' : 'Suspend User'}
                        >
                          <Ban className="w-3.5 h-3.5" />
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

      {/* Manual Wallet Adjustment Modal */}
      {adjustModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-charcoal-900 border border-charcoal-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <span>Adjust Wallet: @{adjustModalUser.username}</span>
            </h3>

            <div className="p-3 rounded-xl bg-charcoal-950 border border-charcoal-800 text-xs flex justify-between">
              <span className="text-gray-400">Current Balance:</span>
              <span className="font-bold text-emerald-400 font-display text-sm">
                ৳{adjustModalUser.wallet?.balance?.toFixed(2) || '0.00'}
              </span>
            </div>

            <form onSubmit={handleAdjustWalletSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustType('CREDIT')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                      adjustType === 'CREDIT'
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-charcoal-950 text-gray-400 border-charcoal-800'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" /> Credit (+ Add Money)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustType('DEBIT')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1 ${
                      adjustType === 'DEBIT'
                        ? 'bg-red-600 text-white border-red-500'
                        : 'bg-charcoal-950 text-gray-400 border-charcoal-800'
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" /> Debit (- Deduct Money)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Amount (BDT) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="e.g. 200"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Reason for Adjustment (Mandatory Audit Log) *
                </label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Manual tournament reimbursement or rule penalty"
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalUser(null)}
                  className="flex-1 py-2 rounded-xl bg-charcoal-800 text-xs font-bold text-gray-300 hover:bg-charcoal-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustLoading}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black uppercase text-xs"
                >
                  {adjustLoading ? 'Updating...' : 'Confirm Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
