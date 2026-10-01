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
    <div className="mb-10 space-y-4">
      {/* Highlighted Crucial Rules Alert Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-red-500/15 border-2 border-amber-500/50 dark:border-ff-orange/50 shadow-lg shadow-amber-500/5 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-ff-amber">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-ff-amber block">
                IMPORTANT PLAYER ELIGIBILITY NOTICE
              </span>
              <h3 className="font-display font-black text-slate-900 dark:text-white text-base sm:text-lg">
                ⚠️ টুর্নামেন্ট খেলার আবশ্যিক নিয়ম ও আইডি যোগ্যতা
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40">
            বাধ্যতামূলক শর্ত
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-charcoal-900/80 border border-amber-500/20 shadow-xs">
            <span className="font-black text-slate-900 dark:text-white block mb-0.5">
              🎯 ১. নির্দিষ্ট FF UID আবশ্যক
            </span>
            <p className="text-slate-600 dark:text-gray-300 text-xs font-semibold leading-relaxed">
              রেজিস্ট্রেশনে দেওয়া Free Fire UID ছাড়া অন্য আইডি দিয়ে কাস্টম রুমে ঢুকলে সরাসরি বহিষ্কার করা হবে।
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-charcoal-900/80 border border-amber-500/20 shadow-xs">
            <span className="font-black text-slate-900 dark:text-white block mb-0.5">
              🔥 ২. লেভেল ৫০+ (Level 50+)
            </span>
            <p className="text-slate-600 dark:text-gray-300 text-xs font-semibold leading-relaxed">
              আপনার ফ্রি ফায়ার গেম আইডির লেভেল নূন্যতম ৫০ বা তার বেশি হতে হবে। অন্যথায় খেলা যাবে না।
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 dark:bg-charcoal-900/80 border border-amber-500/20 shadow-xs">
            <span className="font-black text-slate-900 dark:text-white block mb-0.5">
              🏆 ৩. মোড ভিত্তিক র‍্যাঙ্ক শর্ত
            </span>
            <p className="text-slate-600 dark:text-gray-300 text-xs font-semibold leading-relaxed">
              ফুল ম্যাপে (BR) র‍্যাঙ্ক অবশ্যই <strong className="text-amber-600 dark:text-ff-amber">Heroic</strong> এবং CS মোডে সর্বনিম্ন <strong className="text-sky-600 dark:text-sky-400">Diamond IV</strong> হতে হবে।
            </p>
          </div>
        </div>
      </div>

      {/* Main Notice Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-charcoal-900 border border-slate-200 dark:border-charcoal-800 shadow-md">
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
              className={`p-4 rounded-xl border transition-colors flex items-start gap-3.5 shadow-sm ${
                n.isPinned
                  ? 'bg-amber-500/5 dark:bg-charcoal-950 border-amber-500/40 dark:border-ff-orange/40'
                  : 'bg-slate-50 dark:bg-charcoal-950/70 border-slate-200 dark:border-charcoal-800'
              }`}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-charcoal-900 shadow-sm border border-slate-200 dark:border-charcoal-800 mt-0.5">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {n.title}
                  </h4>
                  {n.isPinned && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-ff-orange text-slate-950">
                      PINNED
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1.5 line-clamp-2 font-medium whitespace-pre-line">
                  {n.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
