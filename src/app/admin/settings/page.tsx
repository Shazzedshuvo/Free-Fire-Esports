'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'FREE FIRE ESPORTS BD',
    bkash_number: '01892837461',
    bkash_type: 'Personal (Send Money)',
    min_deposit: '50',
    max_deposit: '25000',
    whatsapp_link: 'https://wa.me/8801892837461',
    telegram_link: 'https://t.me/ff_esports_bd',
    support_email: 'support@ff-esports.bd',
    announcement_bar: '🔥 bKash Instant Deposit Active 24/7! Join upcoming custom matches now!',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display font-black text-2xl text-white tracking-wide flex items-center gap-2">
          <Settings className="w-6 h-6 text-ff-amber" />
          <span>SYSTEM & PAYMENT SETTINGS</span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Configure official payment numbers, support contact handles, deposit limits, and site announcements.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl">
        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully. All changes are live on the platform!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Official bKash Payment Number *
              </label>
              <input
                type="text"
                name="bkash_number"
                required
                value={settings.bkash_number}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white font-mono text-sm focus:border-ff-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                bKash Account Type *
              </label>
              <select
                name="bkash_type"
                value={settings.bkash_type}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              >
                <option value="Personal (Send Money)">Personal (Send Money)</option>
                <option value="Merchant (Payment Counter)">Merchant (Payment Counter)</option>
                <option value="Agent (Cash Out)">Agent (Cash Out)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                Minimum Deposit Amount (৳)
              </label>
              <input
                type="number"
                name="min_deposit"
                value={settings.min_deposit}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                Maximum Deposit Amount (৳)
              </label>
              <input
                type="number"
                name="max_deposit"
                value={settings.max_deposit}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                WhatsApp Support Link
              </label>
              <input
                type="text"
                name="whatsapp_link"
                value={settings.whatsapp_link}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Telegram Channel Link
              </label>
              <input
                type="text"
                name="telegram_link"
                value={settings.telegram_link}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          {/* Live Streaming URLs */}
          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
            <h3 className="font-display font-black text-sm text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>🔴 Live Stream Broadcast Links (টুর্নামেন্ট লাইভ লিঙ্ক)</span>
            </h3>
            <p className="text-[11px] text-gray-400">
              এখানে দেওয়া লিঙ্কটি সরাসরি প্রতিটি টুর্নামেন্ট কার্ডের <strong>"Watch on YouTube Live (Full Match)"</strong> বাটনে যুক্ত হবে।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  YouTube Live Stream URL *
                </label>
                <input
                  type="url"
                  name="youtube_live_url"
                  placeholder="https://youtube.com/@YourChannel/live"
                  value={settings.youtube_live_url || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white font-mono text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">
                  Facebook Gaming / Live URL
                </label>
                <input
                  type="url"
                  name="facebook_live_url"
                  placeholder="https://facebook.com/gaming/YourPage"
                  value={settings.facebook_live_url || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white font-mono text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Top Announcement Ticker
            </label>
            <input
              type="text"
              name="announcement_bar"
              value={settings.announcement_bar}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black uppercase text-xs tracking-wider shadow-glow-orange hover:scale-105 transition-all"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
