'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Flame, Crosshair, Award, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LeaderboardPage() {
  const { t } = useLanguage();
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/leaderboard?filter=${filter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.leaderboard) setLeaderboard(data.leaderboard);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center text-black font-black text-sm shadow-glow-amber">
            🥇
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-300 to-slate-400 flex items-center justify-center text-black font-black text-sm">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-orange-800 flex items-center justify-center text-white font-black text-sm">
            🥉
          </div>
        );
      default:
        return (
          <span className="font-display font-bold text-slate-500 dark:text-gray-400 text-sm pl-2">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-charcoal-800 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/20 dark:border-charcoal-700">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>HALL OF FAME</span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900 dark:text-white">
          {t('leaderboard_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-2 font-medium">
          {t('leaderboard_subtitle')}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1 bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 p-1.5 rounded-2xl shadow-sm">
          {[
            { key: 'all', label: t('filter_all_time') },
            { key: 'monthly', label: t('filter_monthly') },
            { key: 'weekly', label: t('filter_weekly') },
            { key: 'daily', label: t('filter_daily') },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === item.key
                  ? 'bg-gradient-to-r from-ff-orange to-ff-amber text-black font-black shadow-glow-orange/30'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* #2 Runner up */}
          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-slate-700/60 shadow-md text-center order-2 md:order-1 flex flex-col justify-between">
            <div>
              <span className="text-2xl">🥈</span>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-base mt-2">
                {leaderboard[1].ffPlayerName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">UID: {leaderboard[1].ffUid}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-charcoal-800 flex justify-around text-xs">
              <div>
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] font-bold">Kills</span>
                <span className="font-bold text-slate-900 dark:text-white">{leaderboard[1].kills}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] font-bold">Prize</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{leaderboard[1].earnings}</span>
              </div>
            </div>
          </div>

          {/* #1 Champion */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-50 to-white dark:from-charcoal-900 dark:to-charcoal-950 border-2 border-ff-amber text-center order-1 md:order-2 shadow-glow-amber/20 scale-105 flex flex-col justify-between">
            <div>
              <span className="text-3xl">🥇</span>
              <span className="block text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest mt-1">
                CHAMPION
              </span>
              <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mt-1">
                {leaderboard[0].ffPlayerName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">UID: {leaderboard[0].ffUid}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 dark:border-charcoal-800 flex justify-around text-xs">
              <div>
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] font-bold">Wins</span>
                <span className="font-bold text-slate-900 dark:text-white">{leaderboard[0].wins}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] font-bold">Total Kills</span>
                <span className="font-bold text-slate-900 dark:text-white">{leaderboard[0].kills}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] font-bold">Earnings</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-display text-base">
                  ৳{leaderboard[0].earnings}
                </span>
              </div>
            </div>
          </div>

          {/* #3 Third place */}
          <div className="p-5 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-orange-800/40 shadow-md text-center order-3 flex flex-col justify-between">
            <div>
              <span className="text-2xl">🥉</span>
              <h3 className="font-display font-bold text-slate-900 dark:text-white text-base mt-2">
                {leaderboard[2].ffPlayerName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-mono">UID: {leaderboard[2].ffUid}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-charcoal-800 flex justify-around text-xs">
              <div>
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] font-bold">Kills</span>
                <span className="font-bold text-slate-900 dark:text-white">{leaderboard[2].kills}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-gray-400 block text-[10px] font-bold">Prize</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{leaderboard[2].earnings}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-xl">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-charcoal-950 text-slate-600 dark:text-gray-400 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">{t('rank')}</th>
                  <th className="py-3 px-3">{t('player')}</th>
                  <th className="py-3 px-3 text-center">{t('matches')}</th>
                  <th className="py-3 px-3 text-center">{t('wins')}</th>
                  <th className="py-3 px-3 text-center">{t('kills')}</th>
                  <th className="py-3 px-3 text-center">{t('points')}</th>
                  <th className="py-3 px-3 text-right">{t('total_earnings')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-charcoal-800">
                {leaderboard.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-50 dark:hover:bg-charcoal-800/40 transition-colors">
                    <td className="py-3 px-3">{getRankBadge(player.rank)}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-charcoal-800 border border-slate-200 dark:border-charcoal-700 flex items-center justify-center font-bold text-orange-600 dark:text-ff-amber">
                          {player.ffPlayerName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{player.ffPlayerName}</p>
                          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">UID: {player.ffUid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-700 dark:text-gray-300">
                      {player.matches}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-600 dark:text-amber-400">
                      {player.wins}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-800 dark:text-gray-200">
                      {player.kills}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-sky-600 dark:text-sky-400">
                      {player.points}
                    </td>
                    <td className="py-3 px-3 text-right font-display font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      ৳{player.earnings.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
