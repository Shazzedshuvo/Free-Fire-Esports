'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Trophy, AlertTriangle, Sparkles, Shield, Calendar, Pin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NoticesPage() {
  const { t } = useLanguage();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notices')
      .then((res) => res.json())
      .then((data) => {
        if (data.notices) setNotices(data.notices);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'WINNER_ANNOUNCEMENT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Winner Announcement
          </span>
        );
      case 'TOURNAMENT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Tournament Alert
          </span>
        );
      case 'MAINTENANCE':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Maintenance
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Important Notice
          </span>
        );
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
          <Bell className="w-7 h-7 text-ff-orange" />
          <span>{t('notices_title')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-1 font-medium">
          Stay updated with platform announcements, match schedules, anti-cheat enforcement, and prize pool declarations.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-ff-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : notices.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 text-slate-600 dark:text-gray-400 text-sm shadow-md">
          No notices published at this moment.
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`p-6 rounded-2xl bg-white dark:bg-charcoal-900 border transition-all shadow-md space-y-3 ${
                n.isPinned ? 'border-orange-500/60 dark:border-ff-orange/60 shadow-glow-orange/10' : 'border-slate-200 dark:border-charcoal-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {n.isPinned && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-ff-amber bg-orange-50 dark:bg-charcoal-950 px-2 py-0.5 rounded border border-orange-200 dark:border-charcoal-800">
                      <Pin className="w-3 h-3 text-ff-orange" /> PINNED
                    </span>
                  )}
                  {getTypeBadge(n.type)}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-gray-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-ff-orange" />
                  <span>{new Date(n.publishDate || n.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                {n.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-gray-300 whitespace-pre-line leading-relaxed font-medium">
                {n.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
