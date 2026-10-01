'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Check,
  X,
  Filter,
  Copy,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  User,
  Mail,
  Gamepad2,
} from 'lucide-react';

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Rejection modal
  const [rejectModalDeposit, setRejectModalDeposit] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('TrxID not found in statement');

  // Screenshot Preview Modal
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);

  // Copied indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      let url = `/api/admin/deposits?status=${statusFilter}`;
      if (search) url += `&query=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.deposits) setDeposits(data.deposits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDeposits();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApprove = async (deposit: any) => {
    const confirmMsg = `Are you sure you want to approve deposit of ৳${deposit.amount} for @${deposit.user?.username} (${deposit.user?.fullName})?\n\nThis will IMMEDIATELY credit ৳${deposit.amount} to the player's wallet balance.`;
    if (!confirm(confirmMsg)) {
      return;
    }

    try {
      setActionLoading(deposit.id);
      const res = await fetch('/api/admin/deposits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositId: deposit.id,
          action: 'APPROVE',
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Deposit approved! Wallet credited successfully.');
        fetchDeposits();
      } else {
        alert(data.error || 'Failed to approve deposit.');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalDeposit) return;

    try {
      setActionLoading(rejectModalDeposit.id);
      const res = await fetch('/api/admin/deposits', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositId: rejectModalDeposit.id,
          action: 'REJECT',
          reason: rejectionReason,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Deposit rejected.');
        setRejectModalDeposit(null);
        fetchDeposits();
      } else {
        alert(data.error || 'Failed to reject deposit.');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const getProviderBadge = (method: string) => {
    const m = (method || '').toLowerCase();
    if (m.includes('bkash')) {
      return <span className="px-2 py-0.5 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/40 font-bold text-[11px]">bKash</span>;
    }
    if (m.includes('nagad')) {
      return <span className="px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold text-[11px]">Nagad</span>;
    }
    if (m.includes('upay')) {
      return <span className="px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 font-bold text-[11px]">Upay</span>;
    }
    if (m.includes('rocket')) {
      return <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold text-[11px]">Rocket</span>;
    }
    return <span className="px-2 py-0.5 rounded-lg bg-gray-700 text-gray-300 font-bold text-[11px]">{method || 'bKash'}</span>;
  };

  const pendingCount = deposits.filter((d) => d.status === 'PENDING').length;
  const totalApprovedAmount = deposits
    .filter((d) => d.status === 'APPROVED')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-ff-orange" />
            <span>PLAYER DEPOSIT VERIFICATION (ডিপোজিট ভেরিফিকেশন)</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-gray-300 font-semibold mt-1">
            প্লেয়ারদের বিকাশ, নগদ, উপায় ডিপোজিট রিকোয়েস্ট যাচাই করুন এবং সরাসরি ওয়ালেটে টাকা অনুমোদন (Approve) করুন।
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-right">
            <span className="text-xs text-amber-700 dark:text-amber-400 block font-black uppercase">Pending (অপেক্ষমান)</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{pendingCount}</span>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-right">
            <span className="text-xs text-emerald-700 dark:text-emerald-400 block font-black uppercase">Approved Total (মোট অনুমোদিত)</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">৳{totalApprovedAmount}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: 'ALL', label: 'All Deposits' },
            { key: 'PENDING', label: `Pending (${pendingCount})` },
            { key: 'APPROVED', label: 'Approved' },
            { key: 'REJECTED', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'bg-ff-orange text-black font-black shadow-md'
                  : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-charcoal-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search UID, TrxID, username..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-ff-orange focus:outline-none shadow-sm"
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

      {/* Deposits Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : deposits.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-gray-400 text-sm font-semibold">
            No deposit requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-100 dark:bg-charcoal-950 text-slate-700 dark:text-gray-300 uppercase text-xs font-black">
                <tr>
                  <th className="py-3.5 px-3">Date & Time</th>
                  <th className="py-3.5 px-3">Provider</th>
                  <th className="py-3.5 px-3">Player Details (Name, UID, Email)</th>
                  <th className="py-3.5 px-3">Amount</th>
                  <th className="py-3.5 px-3">Sender Mobile</th>
                  <th className="py-3.5 px-3">Transaction ID (TrxID)</th>
                  <th className="py-3.5 px-3 text-center">Receipt (SS)</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-charcoal-800">
                {deposits.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-charcoal-800/40 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-3 text-slate-600 dark:text-gray-300 whitespace-nowrap text-xs">
                      <div className="font-bold">{new Date(d.createdAt).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-500 dark:text-gray-400 font-mono">
                        {new Date(d.createdAt).toLocaleTimeString()}
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getProviderBadge(d.method)}
                    </td>

                    {/* Player Details: Name, @Username, FF UID, Email */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <p className="font-black text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-1.5">
                          <span>{d.user?.fullName || 'User'}</span>
                          <span className="text-xs font-black text-orange-600 dark:text-ff-amber">@{d.user?.username}</span>
                        </p>
                        
                        {/* Free Fire UID */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-gray-300 font-medium">
                          <Gamepad2 className="w-4 h-4 text-ff-orange flex-shrink-0" />
                          <span className="font-mono font-black text-slate-900 dark:text-white bg-slate-100 dark:bg-charcoal-950 px-2 py-0.5 rounded border border-slate-300 dark:border-charcoal-700">
                            FF UID: {d.user?.ffUid || 'Not set'}
                          </span>
                          {d.user?.ffUid && (
                            <button
                              type="button"
                              onClick={() => handleCopy(d.user.ffUid, `uid-${d.id}`)}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5"
                              title="Copy FF UID"
                            >
                              {copiedId === `uid-${d.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{d.user?.email || 'No email'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Deposit Amount */}
                    <td className="py-3.5 px-3 font-display font-black text-xl text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      ৳{d.amount}
                    </td>

                    {/* Sender Mobile */}
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800 dark:text-gray-200 whitespace-nowrap text-sm">
                      {d.senderNumber}
                    </td>

                    {/* TrxID */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-charcoal-950 px-2.5 py-1 rounded-xl border border-slate-300 dark:border-charcoal-800 shadow-sm">
                        <span className="font-mono font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                          {d.transactionId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(d.transactionId, `trx-${d.id}`)}
                          className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5"
                          title="Copy TrxID"
                        >
                          {copiedId === `trx-${d.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>

                    {/* Screenshot Preview */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {d.screenshotUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewScreenshot(d.screenshotUrl)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-800 dark:text-ff-amber border border-slate-300 dark:border-charcoal-700 text-xs font-bold transition-all shadow-sm group"
                        >
                          <ImageIcon className="w-4 h-4 text-ff-orange group-hover:scale-110 transition-transform" />
                          <span>View SS</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No SS</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {d.status === 'APPROVED' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          APPROVED
                        </span>
                      ) : d.status === 'REJECTED' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40" title={d.rejectionReason}>
                          REJECTED
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                          PENDING REVIEW
                        </span>
                      )}
                    </td>

                    {/* Actions: Approve / Reject */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {d.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(d)}
                            disabled={actionLoading === d.id}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 disabled:opacity-50"
                            title="Approve and credit wallet immediately"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectModalDeposit(d)}
                            disabled={actionLoading === d.id}
                            className="px-2.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-500 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                            title="Reject deposit request"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-500">
                          {d.verifiedBy || 'Processed'}
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

      {/* Screenshot Zoom Modal */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative bg-charcoal-900 border border-charcoal-700 w-full max-w-2xl rounded-2xl shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-charcoal-800 pb-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-ff-orange" />
                <span>Player Deposit Payment Receipt (Screenshot)</span>
              </h3>
              <button
                type="button"
                onClick={() => setPreviewScreenshot(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-charcoal-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-auto flex items-center justify-center rounded-xl bg-charcoal-950 p-2 border border-charcoal-800">
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
                className="px-4 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
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

      {/* Rejection Modal */}
      {rejectModalDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-charcoal-900 border border-charcoal-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">
              Reject Deposit Request
            </h3>
            <p className="text-xs text-gray-300">
              Rejecting TrxID: <strong className="font-mono text-white">{rejectModalDeposit.transactionId}</strong> (৳{rejectModalDeposit.amount}) for player <strong>@{rejectModalDeposit.user?.username}</strong>.
            </p>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Reason for Rejection *
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none mb-2"
              >
                <option value="TrxID not found in statement">TrxID not found in merchant/personal statement</option>
                <option value="Amount does not match statement">Amount does not match statement</option>
                <option value="Sender mobile number mismatch">Sender mobile number mismatch</option>
                <option value="Fake or duplicate TrxID submission">Fake or duplicate TrxID submission</option>
                <option value="Payment was reversed by provider">Payment was reversed by provider</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalDeposit(null)}
                className="flex-1 py-2 rounded-xl bg-charcoal-800 text-xs font-bold text-gray-300 hover:bg-charcoal-700"
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
    </div>
  );
}
