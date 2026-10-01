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
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-3">
          <Settings className="w-7 h-7 text-amber-500" />
          <span>SYSTEM & PAYMENT SETTINGS (সাইট ও পেমেন্ট সেটিংস)</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-gray-300 font-semibold mt-1">
          অফিশিয়াল বিকাশ ও নগদ নম্বর, লিমিট, সোশ্যাল মিডিয়া লিঙ্ক ও লাইভ স্ট্রিম লিঙ্ক পরিবর্তন করুন।
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        {saved && (
          <div className="mb-5 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-sm font-bold flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>সেটিংস সফলভাবে সেভ হয়েছে! সমস্ত পরিবর্তন সাইটে লাইভ কার্যকর হয়েছে।</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                অফিশিয়াল বিকাশ নম্বর (bKash Number) *
              </label>
              <input
                type="text"
                name="bkash_number"
                required
                value={settings.bkash_number}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-sm font-bold focus:border-ff-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                বিকাশ অ্যাকাউন্ট টাইপ *
              </label>
              <select
                name="bkash_type"
                value={settings.bkash_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:border-ff-orange focus:outline-none"
              >
                <option value="Personal (Send Money)">Personal (Send Money)</option>
                <option value="Merchant (Payment Counter)">Merchant (Payment Counter)</option>
                <option value="Agent (Cash Out)">Agent (Cash Out)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                সর্বনিম্ন ডিপোজিট টাকা (৳)
              </label>
              <input
                type="number"
                name="min_deposit"
                value={settings.min_deposit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:border-ff-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                সর্বোচ্চ ডিপোজিট টাকা (৳)
              </label>
              <input
                type="number"
                name="max_deposit"
                value={settings.max_deposit}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                WhatsApp সাপোর্ট লিঙ্ক
              </label>
              <input
                type="text"
                name="whatsapp_link"
                value={settings.whatsapp_link}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-mono focus:border-ff-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
                Telegram চ্যানেল লিঙ্ক
              </label>
              <input
                type="text"
                name="telegram_link"
                value={settings.telegram_link}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-mono focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          {/* Live Streaming URLs */}
          <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/20 border-2 border-red-500/30 space-y-4">
            <h3 className="font-display font-black text-base text-red-700 dark:text-red-400 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <span>🔴 Live Stream Broadcast Links (টুর্নামেন্ট লাইভ লিঙ্ক)</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-300 font-semibold">
              এখানে দেওয়া লিঙ্কটি সরাসরি প্রতিটি টুর্নামেন্ট কার্ডের <strong>"Watch on YouTube Live (Full Match)"</strong> বাটনে যুক্ত হবে।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  YouTube Live Stream URL *
                </label>
                <input
                  type="url"
                  name="youtube_live_url"
                  placeholder="https://youtube.com/@YourChannel/live"
                  value={settings.youtube_live_url || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-xs sm:text-sm focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1">
                  Facebook Gaming / Live URL
                </label>
                <input
                  type="url"
                  name="facebook_live_url"
                  placeholder="https://facebook.com/gaming/YourPage"
                  value={settings.facebook_live_url || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white font-mono text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-gray-300 block mb-1.5">
              উপরে প্রদর্শিত অ্যানাউন্সমেন্ট নোটিশ (Ticker)
            </label>
            <input
              type="text"
              name="announcement_bar"
              value={settings.announcement_bar}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-charcoal-950 border border-slate-300 dark:border-charcoal-700 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:border-ff-orange focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-md hover:scale-105 transition-all"
            >
              {loading ? 'সংরক্ষণ করা হচ্ছে...' : 'সেটিংস সেভ করুন (Save Settings)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
