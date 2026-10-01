'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, AlertTriangle, Trophy, Sparkles, ArrowRight } from 'lucide-react';

interface NoticeItem {
  id: string;
  title: string;
  description: string;
  type: string;
  isPinned: boolean;
  publishDate: string;
}

export default function NoticeSection() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  useEffect(() => {
    fetch('/api/notices')
      .then((res) => res.json())
      .then((data) => {
        if (data.notices) setNotices(data.notices.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  if (notices.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'WINNER_ANNOUNCEMENT':
        return <Trophy className="w-4 h-4 text-yellow-400" />;
      case 'TOURNAMENT':
        return <Sparkles className="w-4 h-4 text-ff-amber" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-ff-orange" />;
    }
  };

  return (
    <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-charcoal-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-ff-orange/15 text-ff-orange">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-display font-black text-slate-900 dark:text-white text-lg sm:text-xl">
            Official Announcements & Alerts
          </h3>
        </div>
        <Link
          href="/notices"
          className="text-xs sm:text-sm font-bold text-ff-orange hover:text-amber-500 flex items-center gap-1.5 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <div
            key={n.id}
            className="p-4 rounded-xl bg-slate-50 dark:bg-charcoal-950/70 border border-slate-200 dark:border-charcoal-800 hover:border-ff-orange dark:hover:border-ff-orange/50 transition-colors flex items-start gap-3.5 shadow-sm"
          >
            <div className="p-2 rounded-lg bg-white dark:bg-charcoal-900 shadow-sm border border-slate-200 dark:border-charcoal-800 mt-0.5">{getIcon(n.type)}</div>
            <div className="flex-1">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                {n.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1.5 line-clamp-2 font-medium">
                {n.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
