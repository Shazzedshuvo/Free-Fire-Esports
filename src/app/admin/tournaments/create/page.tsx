'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gamepad2, ArrowLeft, PlusCircle, Trophy, ShieldAlert, Sparkles } from 'lucide-react';

export default function CreateTournamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    description: '',
    gameMode: 'SOLO',
    mapName: 'Bermuda',
    entryFee: 50,
    prizePool: 2000,
    winnerPrize: 1200,
    runnerUpPrize: 500,
    thirdPlacePrize: 300,
    perKillPrize: 10,
    totalSlots: 48,
    matchDate: 'Tonight',
    matchTime: '09:00 PM',
    liveStreamUrl: '',
    rules: '1. Mobile only, no emulators or third-party modified APKs.\n2. Teaming is strictly bannable with balance forfeiture.\n3. Room ID & Password released 10 minutes before match start (টুর্নামেন্ট শুরু হওয়ার ১০ মিনিট আগে রুম আইডি এবং পাসওয়ার্ড দেওয়া হবে)।\n4. Take screenshot of kill feed and final match result rank.',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create tournament.');
      } else {
        alert('Tournament published successfully!');
        router.push('/admin/tournaments');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/admin/tournaments"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tournaments</span>
        </Link>
        <h1 className="font-display font-black text-2xl text-white tracking-wide">
          CREATE NEW ESPORTS TOURNAMENT
        </h1>
        <p className="text-xs text-gray-400">
          Configure tournament parameters, prize distributions, and match schedule.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-charcoal-900 border border-charcoal-800 shadow-xl">
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Tournament Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. FFBD Champions League - Solo Bermuda #105"
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
            />
          </div>

          {/* Mode, Map & Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Game Mode *
              </label>
              <select
                name="gameMode"
                value={form.gameMode}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              >
                <option value="SOLO">Solo (1 Player)</option>
                <option value="DUO">Duo (2 Players)</option>
                <option value="SQUAD">Squad (4 Players)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Map *
              </label>
              <select
                name="mapName"
                value={form.mapName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              >
                <option value="Bermuda">Bermuda</option>
                <option value="Purgatory">Purgatory</option>
                <option value="Kalahari">Kalahari</option>
                <option value="Alpine">Alpine</option>
                <option value="NexTerra">NexTerra</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Total Slots *
              </label>
              <input
                type="number"
                name="totalSlots"
                required
                value={form.totalSlots}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          {/* Entry Fee & Prize Pool */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-charcoal-950 border border-charcoal-800">
            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">
                Entry Fee (৳) *
              </label>
              <input
                type="number"
                name="entryFee"
                required
                value={form.entryFee}
                onChange={handleChange}
                className="w-full px-2.5 py-2 rounded-lg bg-charcoal-900 border border-charcoal-700 text-white text-xs font-display font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-amber-400 block mb-1">
                Total Prize (৳) *
              </label>
              <input
                type="number"
                name="prizePool"
                required
                value={form.prizePool}
                onChange={handleChange}
                className="w-full px-2.5 py-2 rounded-lg bg-charcoal-900 border border-charcoal-700 text-amber-400 text-xs font-display font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-emerald-400 block mb-1">
                Winner 1st (৳)
              </label>
              <input
                type="number"
                name="winnerPrize"
                value={form.winnerPrize}
                onChange={handleChange}
                className="w-full px-2.5 py-2 rounded-lg bg-charcoal-900 border border-charcoal-700 text-white text-xs font-display font-bold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-300 block mb-1">
                Runner-up 2nd (৳)
              </label>
              <input
                type="number"
                name="runnerUpPrize"
                value={form.runnerUpPrize}
                onChange={handleChange}
                className="w-full px-2.5 py-2 rounded-lg bg-charcoal-900 border border-charcoal-700 text-white text-xs font-display font-bold"
              />
            </div>
          </div>

          {/* Schedule Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Match Date Display *
              </label>
              <input
                type="text"
                name="matchDate"
                required
                value={form.matchDate}
                onChange={handleChange}
                placeholder="Tonight or 25 October 2026"
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Match Time Display *
              </label>
              <input
                type="text"
                name="matchTime"
                required
                value={form.matchTime}
                onChange={handleChange}
                placeholder="09:00 PM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>
          </div>

          {/* Banner URL & Live Stream URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">
                Banner Image URL
              </label>
              <input
                type="text"
                name="bannerImage"
                value={form.bannerImage}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-red-400">
                  <span>📺 YouTube Live Match Stream (ঐচ্ছিক)</span>
                </span>
              </label>
              <input
                type="url"
                name="liveStreamUrl"
                placeholder="https://youtube.com/live/... (খালি রাখলে মূল লিঙ্ক ব্যবহৃত হবে)"
                value={form.liveStreamUrl}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-red-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">
              Tournament Rules & Regulations
            </label>
            <textarea
              name="rules"
              rows={4}
              value={form.rules}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-950 border border-charcoal-700 text-white text-xs focus:border-ff-orange focus:outline-none"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black uppercase text-xs sm:text-sm tracking-wider shadow-glow-orange transition-all disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Tournament Live'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
