'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Plus, Pin, Calendar, Trash2 } from 'lucide-react';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('IMPORTANT');
  const [isPinned, setIsPinned] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notices');
      const data = await res.json();
      if (data.notices) setNotices(data.notices);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, type, isPinned }),
      });

      if (res.ok) {
        setTitle('');
        setDescription('');
        setIsPinned(false);
        fetchNotices();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-3">
          <Bell className="w-7 h-7 text-ff-orange" />
          <span>OFFICIAL NOTICE BOARD MANAGEMENT (নোটিশ বোর্ড)</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-gray-300 font-semibold mt-1">
          অফিশিয়াল ঘোষণা, সতর্কবার্তা, নিয়মাবলী ও আপডেট পোস্ট করুন যা হোমপেজের নোটিশ বোর্ডে দেখতে পাওয়া যাবে।
        </p>
      </div>

      {/* Notice creation form */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-4">
        <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">নতুন নোটিশ প্রকাশ করুন (Publish Notice)</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">Notice Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ⚔️ Weekend Championship Registration Extended"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:border-ff-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">Category *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:border-ff-orange focus:outline-none"
              >
                <option value="IMPORTANT">Important (গুরুত্বপূর্ণ)</option>
                <option value="TOURNAMENT">Tournament Alert (টুর্নামেন্ট)</option>
                <option value="WINNER_ANNOUNCEMENT">Winner (বিজয়ী ঘোষণা)</option>
                <option value="MAINTENANCE">Maintenance (রক্ষণাবেক্ষণ)</option>
                <option value="UPDATE">Update (আপডেট)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">Notice Content *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="বিস্তারিত নোটিশ মেসেজ..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:border-ff-orange focus:outline-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinNotice"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 text-ff-orange rounded bg-slate-100 dark:bg-charcoal-950 border-slate-300 dark:border-charcoal-700"
              />
              <label htmlFor="pinNotice" className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 cursor-pointer">
                পিন করে নোটিশ বোর্ডের শীর্ষে রাখুন (Pin to top)
              </label>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black uppercase text-xs sm:text-sm shadow-md"
            >
              {creating ? 'প্রকাশ হচ্ছে...' : 'নোটিশ পোস্ট করুন'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Notices List */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl space-y-3">
        <h2 className="font-display font-black text-lg text-slate-900 dark:text-white">Active Notices ({notices.length})</h2>
        <div className="divide-y divide-slate-200 dark:divide-charcoal-800">
          {notices.map((n) => (
            <div key={n.id} className="py-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 dark:text-white text-base">{n.title}</span>
                <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                  {new Date(n.publishDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-gray-300 font-medium line-clamp-2">{n.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
