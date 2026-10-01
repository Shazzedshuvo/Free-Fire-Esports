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
        <h1 className="font-display font-black text-2xl text-white tracking-wide flex items-center gap-2">
          <Bell className="w-6 h-6 text-ff-orange" />
          <span>OFFICIAL NOTICE BOARD MANAGEMENT</span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Publish announcements, anti-cheat warnings, maintenance windows, and winner notices.
        </p>
      </div>

      {/* Notice creation form */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-4">
        <h2 className="font-display font-bold text-base text-white">Publish New Announcement</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-300 block mb-1">Notice Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ⚔️ Weekend Championship Registration Extended"
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Notice Category *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              >
                <option value="IMPORTANT">Important</option>
                <option value="TOURNAMENT">Tournament Alert</option>
                <option value="WINNER_ANNOUNCEMENT">Winner Announcement</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="UPDATE">Update</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Notice Content *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed notification message..."
              className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pinNotice"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 text-ff-orange rounded bg-charcoal-950 border-charcoal-700"
              />
              <label htmlFor="pinNotice" className="text-xs font-bold text-gray-300 cursor-pointer">
                Pin to top of public homepage
              </label>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="py-2 px-5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black uppercase text-xs"
            >
              {creating ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Notices List */}
      <div className="p-6 rounded-2xl bg-charcoal-900 border border-charcoal-800 shadow-xl space-y-3">
        <h2 className="font-display font-bold text-base text-white">Active Notices ({notices.length})</h2>
        <div className="divide-y divide-charcoal-800">
          {notices.map((n) => (
            <div key={n.id} className="py-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{n.title}</span>
                <span className="text-[10px] text-gray-500">
                  {new Date(n.publishDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{n.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
