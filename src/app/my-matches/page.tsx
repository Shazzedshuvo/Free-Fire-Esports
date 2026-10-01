'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gamepad2, Clock, Calendar, Trophy, Copy, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function MyMatchesPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'LIVE' | 'COMPLETED'>('UPCOMING');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetch('/api/user/matches')
        .then((res) => res.json())
        .then((data) => {
          if (data.matches) setMatches(data.matches);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredMatches = matches.filter((m) => {
    if (activeTab === 'UPCOMING') return m.status === 'REGISTRATION_OPEN' || m.status === 'REGISTRATION_CLOSED';
    if (activeTab === 'LIVE') return m.status === 'LIVE';
    if (activeTab === 'COMPLETED') return m.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
            <Gamepad2 className="w-7 h-7 text-ff-orange" />
            <span>MY TOURNAMENT MATCHES</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
            Access your custom room IDs, passwords, and track tournament rankings.
          </p>
        </div>
        <Link
          href="/matches"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ff-orange to-ff-amber hover:from-amber-400 hover:to-orange-500 text-black font-black text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          Join More Matches
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-sm">
        {[
          { key: 'UPCOMING', label: 'Upcoming Matches' },
          { key: 'LIVE', label: 'Live Now' },
          { key: 'COMPLETED', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-ff-orange text-black font-black shadow-glow-orange/30'
                : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 space-y-3 shadow-md">
          <Gamepad2 className="w-12 h-12 text-slate-400 dark:text-gray-600 mx-auto" />
          <h3 className="text-slate-900 dark:text-white font-bold text-base">No matches found in this category</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">Browse upcoming tournaments to register your slot!</p>
          <Link
            href="/matches"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-orange-600 dark:text-ff-amber font-bold text-xs transition-colors shadow-sm"
          >
            Browse All Matches
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map((m) => (
            <div
              key={m.id}
              className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 hover:border-ff-orange/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
            >
              {/* Left Details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:bg-ff-orange/20 dark:text-ff-amber border border-orange-500/30">
                    {m.gameMode}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-charcoal-950 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-charcoal-800">
                    {m.mapName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    REGISTERED
                  </span>
                </div>

                <Link href={`/matches/${m.id}`}>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-ff-amber transition-colors">
                    {m.title}
                  </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-ff-orange" />
                    {m.matchDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    {m.matchTime}
                  </span>
                  <span>Entry: <strong className="text-slate-900 dark:text-white">৳{m.entryFee}</strong></span>
                  <span className="text-orange-600 dark:text-ff-amber font-bold">Prize Pool: ৳{m.prizePool}</span>
                </div>
              </div>

              {/* Right Credentials or Status */}
              <div className="flex flex-col items-start md:items-end gap-2 min-w-[240px]">
                {m.roomId ? (
                  <div className="w-full p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600 dark:text-gray-400 font-bold">Room ID:</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 dark:text-white text-sm font-black">{m.roomId}</strong>
                        <button
                          onClick={() => handleCopy(m.roomId, `id-${m.id}`)}
                          className="p-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-700 dark:text-gray-300"
                        >
                          {copiedKey === `id-${m.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-600 dark:text-gray-400 font-bold">Password:</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-amber-600 dark:text-amber-400 text-sm font-black">{m.roomPassword || 'None'}</strong>
                        {m.roomPassword && (
                          <button
                            onClick={() => handleCopy(m.roomPassword, `pass-${m.id}`)}
                            className="p-1 rounded bg-slate-200 hover:bg-slate-300 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-slate-700 dark:text-gray-300"
                          >
                            {copiedKey === `pass-${m.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ff-orange flex-shrink-0" />
                    <span>Credentials unlock 10m before match start. (১০ মিনিট আগে দেওয়া হবে)</span>
                  </div>
                )}

                <Link
                  href={`/matches/${m.id}`}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-xs font-bold text-slate-800 dark:text-gray-200 text-center transition-colors shadow-sm"
                >
                  View Tournament Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
